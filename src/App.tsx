import SearchComponent from "./components/SearchComponent"
import { mockProducts } from "./data/productsData"

function App() {

  return (
    <>
      <SearchComponent products={mockProducts} />
    </>
  )
}

export default App
