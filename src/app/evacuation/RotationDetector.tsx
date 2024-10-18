import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../configs/FirebaseConfig";

interface Location {
  latitude: number;
  longitude: number;
}

interface Distance {
  distanceLatitude: number;
  distanceLongitude: number;
}

const GOOGLE_GEOLOCATION_API_URL = "https://www.googleapis.com/geolocation/v1/geolocate?key=";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

async function getGoogleLocation(): Promise<Location | null> {
  console.log(GOOGLE_GEOLOCATION_API_URL + GOOGLE_API_KEY);
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
    return {
      latitude: data.location.lat,
      longitude: data.location.lng,
    };
  } catch (error) {
    console.error("Google Geolocation API エラー:", error);
    return null;
  }
}

async function getLocation(): Promise<Location | null> {
  if ("geolocation" in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        async (error) => {
          console.warn("Navigator Geolocation 使用不可:", error);
          const fallbackLocation = await getGoogleLocation();
          resolve(fallbackLocation);
        }
      );
    });
  } else {
    console.warn("Navigator Geolocation がサポートされていません");
    return getGoogleLocation();
  }
}

async function updateLocationInFirestore(location: Location | null, isTurnBack: boolean) {
  if (location) {
    try {
      const docId = `${location.latitude}_${location.longitude}`;
      const docRef = doc(db, "microRisks", docId);
      const docSnap = await getDoc(docRef);

      let liskNumber;
      const existingData = docSnap.data();
      if (existingData && typeof existingData.lisk === "number") {
        liskNumber = isTurnBack ? existingData.lisk + 3 : existingData.lisk - 1;
      } else {
        liskNumber = -1;
      }

      liskNumber = Math.max(-1, Math.min(3, liskNumber));
      await setDoc(docRef, { latitude: location.latitude, longitude: location.longitude, lisk: liskNumber });

      console.log("Firestoreに位置情報が保存されました:", location, liskNumber);
    } catch (error) {
      console.error("Firestore更新エラー:", error);
    }
  }
}

const detectRotationAndUpload = () => {
  let currentLocation: Location | null = null;
  let oldLocation: Location | null = null;
  let distance: Distance | null = null;
  let oldDistance: Distance | null = null;
  let rotate: boolean | null = null;

  const updateLocation = async () => {
    const location = await getLocation();
    if (!location) return;

    oldLocation = currentLocation;
    currentLocation = location;

    const isTurningBack = rotate === true;
    updateLocationInFirestore(currentLocation, isTurningBack);

    if (currentLocation && oldLocation) {
      const newDistance: Distance = {
        distanceLatitude: (currentLocation.latitude - oldLocation.latitude) * 111.32,
        distanceLongitude:
          (currentLocation.longitude - oldLocation.longitude) *
          Math.cos((currentLocation.latitude * Math.PI) / 180) *
          111.32,
      };

      oldDistance = distance;
      distance = newDistance;

      if (distance && oldDistance) {
        const deltaLatitude = newDistance.distanceLatitude - oldDistance.distanceLatitude;
        const deltaLongitude = newDistance.distanceLongitude - oldDistance.distanceLongitude;
        const angle = Math.atan2(deltaLatitude, deltaLongitude);

        rotate = Math.abs(angle) > 3;
      }
    }
  };

  const intervalId = setInterval(updateLocation, 4000);
  return () => clearInterval(intervalId);
};

export default detectRotationAndUpload;
