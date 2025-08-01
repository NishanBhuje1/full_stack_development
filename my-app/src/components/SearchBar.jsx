export default function SearchBar({ searchProduct, handleStockedToggle }) {
  return (
    <form className="flex flex-col gap-2 mb-4">
      <input
        onChange={searchProduct}
        className="bg-blue-50 p-4 rounded-3xl"
        type="text"
        placeholder="Search..."
      />
      <label>
        <input onClick={handleStockedToggle} type="checkbox" />
        Olny show products in stock
      </label>
    </form>
  );
}
