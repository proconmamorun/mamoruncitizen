import { fetchLocationData, Point } from "./firebaseService";
import axios from 'axios';
import {decode} from './polylineService'
import { collection, getDocs } from "firebase/firestore";
import { db } from "./FirebaseConfig";


// HERE Routing API endpoint
const HERE_API_URL = 'https://router.hereapi.com/v8/routes';

// Get API Key from environment variables
const hereApiKey = process.env.NEXT_PUBLIC_HERE_API_KEY || '';

// Instruction definition for route guidance
interface Instruction {
    text: string;
    distance: number;
    time: number;
    interval: [number, number];
}

// Notice definition for sections
interface Notice {
    title: string;
    code: string;
    severity: string;
}

// Updated HERE API response type to include notices
export interface HereServiceResponse {
    routes: {
        sections: {
            polyline: string;  // Route polyline in string format
            summary: {
                duration: number;  // Total route time (seconds)
                length: number;    // Total route distance (meters)
            };
            instructions: Instruction[];  // Step-by-step instructions
            notices?: Notice[];  // Optional notices array
        }[];
    }[];
}

// Function to search for pedestrian route avoiding a corridor
const searchRouteForPedestrians = async (
    startPoint: [number, number],
    endPoint: [number, number],
    pointsToAvoid: Point[]
): Promise<HereServiceResponse> => {
    try {
        // Filter out invalid risk points
        const validRisks = pointsToAvoid.filter(risk => risk.lat !== undefined && risk.lng !== undefined);

        // Encode the polyline from risk points (for the corridor)
        const m = 0.00009;
        const boxPolyline = validRisks.map(risk => `bbox:${risk.lng-m},${risk.lat-m},${risk.lng+m},${risk.lat+m}`).join('|');

        // HERE Routing API request
        const response = await axios.get(HERE_API_URL, {
            params: {
                apiKey: hereApiKey,
                transportMode: 'pedestrian', // Set mode to pedestrian
                origin: `${startPoint[1]},${startPoint[0]}`, // Origin (lat, lng)
                destination: `${endPoint[1]},${endPoint[0]}`, // Destination (lat, lng)
                "avoid[areas]":boxPolyline == "" ? null : boxPolyline,
                return: 'polyline,summary'  // Return route as polyline
            }
        });
        console.log(response);

        return response.data as HereServiceResponse;
    } catch (error) {
        console.error('Error fetching pedestrian route:', error);
        throw new Error('Failed to fetch pedestrian route');
    }
};

export async function GetSafePedestrianRouteWithCurrentLocation(
    endPoint: [number, number]
): Promise<[{
    lat: number;
    lng: number;
}[], Point[], { duration: number, length: number }]> {
    // 現在地を取得するPromiseを作成
    const getCurrentLocation = (): Promise<[number, number]> => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // デバッグ用ログ
                        console.log("Current location:", position.coords.latitude, position.coords.longitude); 
                        resolve([position.coords.latitude, position.coords.longitude]);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        reject("Failed to get current location");
                    }
                );
            } else {
                reject("Geolocation is not supported by this browser");
            }
        });
    };

    try {
        // 現在地を取得
        const startPoint = await getCurrentLocation();

        // 安全な歩行者ルートを取得
        return await GetSafePedestrianRoute(startPoint, endPoint);
    } catch (error) {
        console.error("Error getting safe pedestrian route with current location:", error);
        throw new Error("Failed to get safe pedestrian route with current location");
    }
}


// Convert HERE API polyline to Google Maps API polyline format
const convertToGooglePolyline = (encodedPolyline: string): { lat: number; lng: number }[] => {
    const decodedPath = decode(encodedPolyline).polyline;
    return decodedPath.map(([lat, lng]) => ({ lat, lng }));  // Convert to { lat, lng } format
};

const isViolated = (response: HereServiceResponse): boolean => {
    // 全てのルートのセクションをフラットにして、すべてのnoticesを検索
    const notice = response.routes
        .flatMap(route => route.sections)  // すべてのsectionsをフラットにする
        .flatMap(section => section.notices || [])  // noticesをフラットにし、存在しない場合は空配列
        .find(notice => notice.code === "violatedBlockedRoad");

    return notice != undefined;
};

// Function to get safe pedestrian route and convert to Google Maps polyline format
// Function to get safe pedestrian route and convert to Google Maps polyline format
export async function GetSafePedestrianRoute(
    startPoint: [number, number],
    endPoint: [number, number]
): Promise<[{
    lat: number;
    lng: number;
}[], Point[], { duration: number, length: number }]> {
    // Fetch risk points from Firebase
    const risks: Point[] = await fetchLocationData();
    const returnRisks: Point[] = [...risks];
    const querySnapshot = await getDocs(collection(db, "microRisks"));
    querySnapshot.forEach((doc) => {
        if((doc.data() as { lat: number, lng: number, risk: number }).risk > 0){
            risks.push(doc.data() as { lat: number, lng: number, risk: number });
        }
    });

    // Get route from HERE API
    let response: HereServiceResponse = await searchRouteForPedestrians(startPoint, endPoint, risks);
    console.log(response);
    const minTime: number = (await searchRouteForPedestrians(startPoint, endPoint, []) as HereServiceResponse).routes[0].sections[0].summary.duration;
    
    for(let i:number = 1; i < 5 && (isViolated(response) || minTime * 1.6 < response.routes[0].sections[0].summary.duration); i++){
        response = await searchRouteForPedestrians(startPoint, endPoint, risks.filter((value: Point, index: number, array: Point[])=>value.risk > i))
        console.log(`riskLevel ${i} is violated`);
    }

    // Convert the first route section polyline to Google Maps format
    let polylineArray = convertToGooglePolyline(response.routes[0].sections[0].polyline);

    // Retrieve duration and length from the response
    const duration = response.routes[0].sections[0].summary.duration;
    const length = response.routes[0].sections[0].summary.length;

    // Return polyline, risk points, and route summary (duration and length)
    return [polylineArray, returnRisks, { duration, length }];
}