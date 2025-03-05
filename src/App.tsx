import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchComponent from "./components/SearchComponent";
import { WishlistProvider } from "./components/Wishlist";
import { Provider } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import InstallationGuide from "./components/InstallationGuide";
import AccouncementBanner from "./components/AccouncementBanner"

function App() {
  return (
    <>
      <ToastContainer />
      <InstallationGuide />
      <AccouncementBanner />

      <Provider store={store}>
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
