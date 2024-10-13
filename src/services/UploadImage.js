import { storage } from './FirebaseConfig'; // Firebase Storage のインスタンスをインポート
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // ref をfirebase/storageからインポート
import piexif from "piexifjs";

// Google Geolocation APIを使用して位置情報を取得
async function getGeolocation() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""; // ここにAPIキーを入力
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

export async function uploadImageWithExif(imageUrl) {

  try {
    // 1. 画像の取得
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // 2. BlobデータをJPEGに変換
    const canvas = document.createElement("canvas");
    const img = document.createElement("img");

    const imgLoadPromise = new Promise((resolve) => {
      img.onload = () => resolve();
      img.src = URL.createObjectURL(blob);
    });

    await imgLoadPromise;
    
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }

    const jpegBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Blob creation failed"));
        }
      }, "image/jpeg");
    });

    // 3. Google Geolocation APIを使用して現在位置を取得
    const position = await getGeolocation();
    const { latitude, longitude } = position;
    
    // 4. EXIF 情報の追加
    const reader = new FileReader();
    reader.readAsDataURL(jpegBlob);

    const base64Data = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
    });

    if (typeof base64Data !== 'string') throw new Error("Base64 data conversion failed");

    const exifObj = {
      "GPS": {
        [piexif.GPSIFD.GPSLatitude]: piexif.GPSHelper.degToDmsRational(latitude),
        [piexif.GPSIFD.GPSLongitude]: piexif.GPSHelper.degToDmsRational(longitude),
        [piexif.GPSIFD.GPSLatitudeRef]: latitude >= 0 ? "N" : "S",
        [piexif.GPSIFD.GPSLongitudeRef]: longitude >= 0 ? "E" : "W",
      },
    };

    const exifStr = piexif.dump(exifObj);
    const newData = piexif.insert(exifStr, base64Data);

    const jpegWithExifBlob = await fetch(newData).then((res) => res.blob());

    // 5. Firebase Storageにアップロード
    const fileName = `image_with_exif_${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName); // Firebase Storage にファイルをアップロードするための参照
    await uploadBytes(storageRef, jpegWithExifBlob); // Firebase Storage にファイルをアップロード

    const downloadUrl = await getDownloadURL(storageRef); // ダウンロードURLを取得
    console.log('Image uploaded successfully:', downloadUrl);
    
    return downloadUrl;

  } catch (error) {
    console.error("Error uploading image:", error);
  }
}
