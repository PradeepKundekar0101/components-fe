importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCWnJT6EgP5Gw-5O0QA1hFyQw4ATFRiyeo",
  authDomain: "notifications-a7548.firebaseapp.com",
  projectId: "notifications-a7548",
  storageBucket: "notifications-a7548.appspot.com",
  messagingSenderId: "1032056771132",
  appId: "1:1032056771132:web:be79bfd38f3c48c2c7e939"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(" Background Message Received:", payload);
  if (payload.notification) {
    self.registration.showNotification("tittle", {
      body: "shshshsdad",
      icon: "./free.png",
    });
  } else {
    console.warn("No notification object in payload:", payload);
  }
});

self.addEventListener('push', function(event) {
  console.log(' Push event received:', event);
  
  if (event.data) {
    const data = event.data.json();
    console.log(" Push Data:", data);

    event.waitUntil(
      self.registration.showNotification(data.notification.title, {
        body: data.notification.body,
        icon: '/free.png',
      })
    );
  } else {
    console.warn(" No data in push event");
  }
});