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

export async function uploadImageWithLocationInFilename(imageUrl) {
  try {
    // 1. 画像の取得
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    let position;

    // 2. Google Geolocation APIを使用して現在位置を取得
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const position = { lat: latitude, lng: longitude };
        },
        (error) => {
          console.error("位置情報の取得に失敗しました", error);
          setError('位置情報の取得中にエラーが発生しました。');
        },
        { enableHighAccuracy: true }
      );
    }else{
      position = await getGeolocation();
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
