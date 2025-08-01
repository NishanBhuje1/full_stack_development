import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";
import products from "../Data/products";
import { useState } from "react";

export default function FilterableProductTable() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  function handleStockedToggle(event) {
    const element = event.target;
    const isChecked = element.checked;
    if (isChecked) {
      const stockedProducts = products.filter((product) => product.stocked);
      setFilteredProducts(stockedProducts);
    } else {
      setFilteredProducts(products);
    }
  }

  function searchProduct(event) {
    const query = event.target.value;
    if (query) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }
  return (
    <div>
      <SearchBar handleStockedToggle={handleStockedToggle} 
                searchProduct={searchProduct}/>
      <ProductTable products={filteredProducts} />
    </div>
  );
}
