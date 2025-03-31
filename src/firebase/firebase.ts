// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification Permission:", permission);

    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register("/components-radar/firebase-messaging-sw.js");
      const token = await getToken(messaging, {
        vapidKey:import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log("FCM Token:", token);
      } else {
        console.log("No token received. Check Firebase setup.");
      }
    } else {
      console.warn("Notifications are blocked.");
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
};
