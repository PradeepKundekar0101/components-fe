import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchComponent from "./components/SearchComponent";
import { WishlistProvider } from "./components/Wishlist";

function App() {
  return (
    <WishlistProvider>
      <Navbar />
      <SearchComponent />
      <Footer />
    </WishlistProvider>
  );
}

export default App;
