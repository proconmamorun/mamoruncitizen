import { storage } from './FirebaseConfig'; // Firebase Storage のインスタンスをインポート
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

// Google Geolocation APIを使用して位置情報を取得
async function getGeolocation() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""; 
  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve geolocation');
  }

  const data = await response.json();
  return {
    latitude: data.location.lat,
    longitude: data.location.lng,
  };
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: true }
    );
  });
}

export async function uploadImageWithLocationInFilename(imageUrl) {
  try {
    // 1. 画像の取得
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    let position = { latitude: 0, longitude: 0 };

    // 2. 現在位置の取得をPromiseを使って待機
    try {
      const geoPosition = await getCurrentPosition();
      const { latitude, longitude } = geoPosition.coords;
      position = { latitude, longitude };
    } catch (error) {
      console.error("位置情報の取得に失敗しました:", error);
      position = await getGeolocation();  // 失敗した場合、Google APIを使用
    }

    const { latitude, longitude } = position;

    // 3. ファイル名に緯度・経度を含める
    const sanitizeCoordinate = (value) => String(value).replace(/\./g, '_');
    const sanitizedLatitude = sanitizeCoordinate(latitude);
    const sanitizedLongitude = sanitizeCoordinate(longitude);
    const fileName = `image,${sanitizedLatitude},${sanitizedLongitude},${Date.now()}.jpg`;

    // 4. Firebase Storageにアップロード
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, blob);

    // 5. ダウンロードURLを取得
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Image uploaded successfully:', downloadUrl);

    return downloadUrl;

  } catch (error) {
    console.error("Error uploading image:", error);
  }
}