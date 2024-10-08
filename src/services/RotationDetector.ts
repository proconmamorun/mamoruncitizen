import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./FirebaseConfig";

// Locationインターフェース：緯度と経度のデータ構造を定義
interface Location {
  latitude: number;
  longitude: number;
}

// Distanceインターフェース：緯度と経度の距離差を格納するデータ構造を定義
interface Distance {
  distanceLatitude: number;
  distanceLongitude: number;
}

// Google Geolocation APIのURLとAPIキー
const GOOGLE_GEOLOCATION_API_URL = "https://www.googleapis.com/geolocation/v1/geolocate?key=";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;  // 環境変数を利用

async function getGoogleLocation() {
  try {
    const response = await fetch(GOOGLE_GEOLOCATION_API_URL + GOOGLE_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location from Google Geolocation API");
    }

    const data = await response.json();
    const location = {
      latitude: data.location.lat,
      longitude: data.location.lng,
    };
    return location;
  } catch (error) {
    console.error("Google Geolocation API エラー:", error);
    return null;
  }
}

async function updateLocationInFirestore(location: Location | null, isTurnBack: boolean) {
  if (location) {
    try {
      const docId = `${location.latitude}_${location.longitude}`; // 緯度_経度をドキュメントIDに使用
      const docRef = doc(db, "locations", docId);
      const docSnap = await getDoc(docRef);

      let liskNumber;

      const existingData = docSnap.data();
      if (existingData && typeof existingData.lisk === 'number') {
        if (isTurnBack) {
          liskNumber = existingData.lisk + 3;
        } else { // 通った時の危険度
          liskNumber = existingData.lisk - 1;
        }
      } else {
        liskNumber = 0; // 任意の値を入力してね（初期値となるよ）
      }

      if (liskNumber >= 5) {
        liskNumber = 5;
      }
      if (liskNumber <= -5) {
        liskNumber = -5;
      }
      await setDoc(docRef, { latitude: location.latitude, longitude: location.longitude, lisk: liskNumber });
      console.log("Firestoreに位置情報が保存されました:", location, liskNumber);
    } catch (error) {
      console.error("Firestore更新エラー:", error);
    }
  }
}

const detectRotationAndUpload = () => {
  let currentLocation: Location | null = null; // 現在の位置情報を格納する変数
  let oldLocation: Location | null = null; // 前回取得した位置情報を格納する変数
  let distance: Distance | null = null; // 現在の位置と前回の位置の距離を格納する変数
  let oldDistance: Distance | null = null; // 前回計算した距離を格納する変数
  let rotate: boolean | null = null; // 回転しているかを示すフラグ

  const getLocation = async () => {
    // Google Geolocation APIを使用して位置情報を取得
    const location = await getGoogleLocation();
    if (!location) return;

    oldLocation = currentLocation;
    currentLocation = location;

    if (currentLocation) {
      if (rotate) {
        updateLocationInFirestore(currentLocation, true);
      } else {
        updateLocationInFirestore(currentLocation, false);
      }
    } else {
      updateLocationInFirestore(null, false);
    }

    if (currentLocation && oldLocation) {
      const newDistance = {
        distanceLatitude: (currentLocation.latitude - oldLocation.latitude) * 111.32, // 緯度方向の距離
        distanceLongitude:
          (currentLocation.longitude - oldLocation.longitude) *
          Math.cos(currentLocation.latitude * Math.PI / 180) * 111.32, // 経度方向の距離
      };

      oldDistance = distance;
      distance = newDistance;

      if (distance && oldDistance) {
        const deltaLatitude = newDistance.distanceLatitude - oldDistance.distanceLatitude;
        const deltaLongitude = newDistance.distanceLongitude - oldDistance.distanceLongitude;

        const angle = Math.atan2(deltaLatitude, deltaLongitude);

        if (angle > 3) {
          rotate = true;
        } else {
          rotate = false;
        }
      }
    }
  };

  const intervalId = setInterval(getLocation, 2000);

  return () => clearInterval(intervalId);
};

export default detectRotationAndUpload;