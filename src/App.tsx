import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchComponent from "./components/SearchComponent";
import { WishlistProvider } from "./components/Wishlist";
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import InstallationGuide from "./components/InstallationGuide";
import AccouncementBanner from "./components/AccouncementBanner"
import ModalController from "./components/AuthModals/ModalController";
import { useEffect } from "react";
import { generateToken,messaging } from "./firebase/firebase";
import { onMessage } from "firebase/messaging";

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      if (payload.notification) {
        console.log("Notification",payload.notification);
      }else{
        console.log("No notification object in payload:", payload);
        
      }
    })
  },[]);
  return (
    <>
      <Provider store={store}>
        <ToastContainer />
        <InstallationGuide />
        <AccouncementBanner />
        <ModalController />
        <WishlistProvider>
          <Navbar />
          <SearchComponent />
          <Footer />
        </WishlistProvider>
      </Provider>
    </>
  );
}

export default App;
