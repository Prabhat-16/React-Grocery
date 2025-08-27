import './App.css';
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', ...new Set(products.map(product => product.category))];

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === product.name);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productName) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === productName);
      if (existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.name === productName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.name !== productName);
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (parseInt(item.price.replace('₹', '')) * item.quantity), 0);

  return (
    <div className="container">
      <div className="header">
        <h1>FreshMart 🛒</h1>
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          🛒 Cart {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </button>
      </div>

      {showCart && (
        <div className="cart-sidebar">
          <h3>Your Cart ({totalItems} items)</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              <ul className="cart-items">
                {cart.map((item, index) => (
                  <li key={index} className="cart-item">
                    <span>{item.name} (₹{item.price.replace('₹', '')})</span>
                    <div className="quantity-controls">
                      <button onClick={() => removeFromCart(item.name)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <strong>Total: ₹{totalPrice}</strong>
                <button className="checkout-button">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      )}

      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        selectedCategory={selectedCategory}
        categories={categories}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
        onCategoryChange={setSelectedCategory}
      />

      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
        selectedCategory={selectedCategory}
        onAddToCart={addToCart}
        cart={cart}
      />
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

function ProductRow({ product, onAddToCart, inCart }) {
  const name = product.stocked ? product.name :
    <span className="out-of-stock">
      {product.name} (Out of Stock)
    </span>;

  return (
    <tr className={`product-row ${!product.stocked ? 'disabled' : ''}`}>
      <td>{name}</td>
      <td>{product.price}</td>
      <td>
        <button
          className="add-to-cart"
          onClick={() => onAddToCart(product)}
          disabled={!product.stocked}
        >
          {inCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly, selectedCategory, onAddToCart, cart }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    // Filter by search text
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }

    // Filter by stock status
    if (inStockOnly && !product.stocked) {
      return;
    }

    // Filter by category
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return;
    }

    // Add category header if needed
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }

    // Add product row
    const inCart = cart.some(item => item.name === product.name);
    rows.push(
      <ProductRow
        product={product}
        key={product.name}
        onAddToCart={onAddToCart}
        inCart={inCart}
      />
    );
    lastCategory = product.category;
  });

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  selectedCategory,
  categories,
  onFilterTextChange,
  onInStockOnlyChange,
  onCategoryChange
}) {
  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          value={filterText}
          placeholder="Search for items..."
          onChange={(e) => onFilterTextChange(e.target.value)}
        />

        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <label className="stock-label">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        Only show products in stock
      </label>
    </div>
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