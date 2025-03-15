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

function App() {
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
