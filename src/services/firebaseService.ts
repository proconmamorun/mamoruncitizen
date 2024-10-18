import { db } from '../app/configs/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export interface Point {
  lat:number;
  lng:number;
  risk:number;
}

// データを取得する関数
export const fetchLocationData = async (): Promise<Point[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "locations"));
    const locations: { lat: number, lng: number, risk: number }[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // フィールド名をマッピング
      const lat = data.latitude;
      const lng = data.longitude;
      const risk = data.dangerlevel;

      // lat, lng, risk を保持したまま Point オブジェクトを作成
      locations.push({ lat, lng, risk });
    });

    return locations.map((value) => {
      const point: Point = { lat: value.lat, lng: value.lng, risk: value.risk };
      return point;
    });

  } catch (error) {
    console.error("Error fetching locations: ", error);
    return [];
  }
};
