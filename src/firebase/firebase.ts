// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging,getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCWnJT6EgP5Gw-5O0QA1hFyQw4ATFRiyeo",
  authDomain: "notifications-a7548.firebaseapp.com",
  projectId: "notifications-a7548",
  storageBucket: "notifications-a7548.appspot.com",
  messagingSenderId: "1032056771132",
  appId: "1:1032056771132:web:be79bfd38f3c48c2c7e939"
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
        vapidKey: "BLU9HuBDwlIs8n_2HjqeMucje__cDFMJDEVrXOwVPTD-9h5klNEhEPTJfkctiLhEARF9zY2cvhc2TQxIaamlouA",
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
