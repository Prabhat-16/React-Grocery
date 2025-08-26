import './App.css';
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div className="container">
      <h1>Grocery List 🛒</h1>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th className="category-row" colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span className="out-of-stock">
      {product.name}
    </span>;

  return (
    <tr className="product-row">
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form className="search-bar">
      <input 
        className="search-input"
        type="text" 
        value={filterText} 
        placeholder="Search for items..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label className="stock-label">
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "₹80", stocked: true, name: "Apple" },
  { category: "Fruits", price: "₹90", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "₹120", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "₹60", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "₹160", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "₹40", stocked: true, name: "Peas" },
  
  { category: "Fruits", price: "₹150", stocked: true, name: "Mango" },
  { category: "Fruits", price: "₹250", stocked: false, name: "Grapes" },
  { category: "Fruits", price: "₹55", stocked: true, name: "Banana" },
  { category: "Fruits", price: "₹300", stocked: true, name: "Pineapple" },
  { category: "Fruits", price: "₹180", stocked: true, name: "Orange" },
  
  { category: "Dairy", price: "₹60", stocked: true, name: "Milk" },
  { category: "Dairy", price: "₹100", stocked: true, name: "Cheese" },
  { category: "Dairy", price: "₹80", stocked: true, name: "Yogurt" },

  { category: "Snacks", price: "₹30", stocked: true, name: "Chips" },
  { category: "Snacks", price: "₹20", stocked: true, name: "Biscuits" },
  { category: "Snacks", price: "₹50", stocked: false, name: "Peanuts" },

  { category: "Beverages", price: "₹25", stocked: true, name: "Tea" },
  { category: "Beverages", price: "₹100", stocked: false, name: "Coffee" },
  { category: "Beverages", price: "₹15", stocked: true, name: "Lemonade" },

  { category: "Sweets", price: "₹120", stocked: true, name: "Gulab Jamun" },
  { category: "Sweets", price: "₹80", stocked: false, name: "Jalebi" },
  { category: "Sweets", price: "₹200", stocked: true, name: "Rasgulla" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}