import { db } from '../app/configs/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export interface Point {
  lat:number;
  lng:number;
  risk:number;
}

// データを保存する関数
export const saveLocationData = async (lat: number, lng: number, risk: number): Promise<void> => {
  try {
    await addDoc(collection(db, "locations"), {
      lat: lat,
      lng: lng,
      risk: risk
    });
    console.log("Location saved successfully");
  } catch (error) {
    console.error("Error saving location: ", error);
  }
};

// データを取得する関数
export const fetchLocationData = async (): Promise<Point[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "locations"));
    const locations: { lat: number, lng: number, risk: number }[] = [];
    querySnapshot.forEach((doc) => {
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