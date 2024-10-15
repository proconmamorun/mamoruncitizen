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
    const microQuerySnapshot = await getDocs(collection(db, "microRisks"));
    const locations: { lat: number, lng: number, risk: number }[] = [];
    querySnapshot.forEach((doc) => {
      locations.push(doc.data() as { lat: number, lng: number, risk: number });
    });
    microQuerySnapshot.forEach((doc) => {
      locations.push(doc.data() as { lat: number, lng: number, risk: number });
    });
    return locations.map((value: { lat: number; lng: number; risk: number; }) =>  {
      let point: Point = {lat:value.lat, lng:value.lng, risk: value.risk};
      return point;
    });
  } catch (error) {
    console.error("Error fetching locations: ", error);
    return [];
  }
};