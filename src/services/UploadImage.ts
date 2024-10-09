import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from './FirebaseConfig';
import EXIF from 'exif-js';
import { Loader } from '@googlemaps/js-api-loader';

interface Coordinates {
  lat: number;
  lng: number;
}

interface UploadResult {
  imageUrl: string;
  coordinates: Coordinates | null;
  address: string;
}

/**
 * EXIF データを取得し、画像を Firebase Storage にアップロードする関数
 * @param file アップロードする画像ファイル
 * @returns 画像のダウンロード URL、座標情報、住所を含むオブジェクト
 */
export const uploadImageWithExif = async (file: File): Promise<UploadResult> => {
  const getExif = (exifData: any, key: string): any => {
    try {
      return exifData[key];
    } catch (e) {
      console.error(`Error getting EXIF data for key ${key}:`, e);
      return '';
    }
  };

  const getGps = (exifData: any, key: string): number | string => {
    try {
      const gps = getExif(exifData, 'GPS' + key);
      const ref = getExif(exifData, 'GPS' + key + 'Ref');

      if (gps instanceof Array) {
        const degrees = gps[0];
        const minutes = gps[1];
        const seconds = gps[2];
        let dd = degrees + minutes / 60 + seconds / (60 * 60);

        if (['S', 'W'].includes(ref)) {
          dd *= -1;
        }

        return dd;
      }
    } catch (e) {
      console.error(`Error getting GPS data for key ${key}:`, e);
    }

    return '';
  };

  // 画像の EXIF データを取得
  const coordinates: Coordinates | null = await new Promise((resolve, reject) => {
    EXIF.getData(file, function (this: any) {  // 修正: file そのものを渡す
      try {
        const exifData = EXIF.getAllTags(this);
        const latitude = getGps(exifData, 'Latitude') as number;
        const longitude = getGps(exifData, 'Longitude') as number;
        if (latitude && longitude) {
          resolve({ lat: latitude, lng: longitude });
        } else {
          resolve(null); // 座標情報がない場合
        }
      } catch (e) {
        console.error('Error processing EXIF data:', e);
        reject(e);
      }
    });
  });

  // Firebase Storage にアップロード
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  // Firestore に画像情報を保存
  await addDoc(collection(db, 'images'), {
    name: file.name,
    url: imageUrl,
  });

  // Google Maps API を使用して住所を取得
  let address = '';
  if (coordinates) {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
      version: "weekly",
    });

    try {
      const google = await loader.load(); // 非推奨ではない方法で Google Maps API をロード
      const geocoder = new google.maps.Geocoder();
      const results = await geocodeLocation(geocoder, coordinates);

      if (results && results[0]) {
        address = results[0].formatted_address;
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error loading Google Maps or geocoding:', error);
    }
  }

  return { imageUrl, coordinates, address };
};

// Geocoding 処理を Promise でラップ
const geocodeLocation = (geocoder: google.maps.Geocoder, coordinates: Coordinates): Promise<google.maps.GeocoderResult[] | null> => {
  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: coordinates }, (results, status) => {
      if (status === 'OK' && results) {
        resolve(results);
      } else {
        console.error('Geocoder failed due to: ' + status);
        reject(null);
      }
    });
  });
};
