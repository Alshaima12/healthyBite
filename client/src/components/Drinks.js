import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import useRequireAuth from '../hooks/useRequireAuth';

import drink1 from "../images/drink1.png";
import drink2 from "../images/drink2.png";
import drink3 from "../images/drink3.png";

const DRINKS = [
  {
    id: 'green-smoothie',
    name: 'Green Glow Smoothie',
    description: 'Spinach, banana, apple, and coconut water.',
    price: 1.8,  // Base price
    image: drink1,
    category: 'Smoothie',
  },
  {
    id: 'detox-juice',
    name: 'Detox Juice',
    description: 'Carrot, cucumber, lemon, and mint.',
    price: 1.6,
    image: drink2,
    category: 'Juice',
  },
  {
    id: 'lemon-mint',
    name: 'Classic Lemon Mint Water',
    description: 'Refreshing blend of lemon, mint, and cucumber slices.',
    price: 1.2,
    image: drink3,
    category: 'Water',
  },
];

function Drinks() {
  useRequireAuth();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [size, setSize] = useState({
    'green-smoothie': 'medium',  // Default to 'medium'
    'detox-juice': 'medium',
    'lemon-mint': 'medium',
  });
  const [qty, setQty] = useState({
    'green-smoothie': 1,
    'detox-juice': 1,
    'lemon-mint': 1,
  });

  // Change quantity
  const changeQty = (id, value) => {
    setQty(prev => {
      const newVal = prev[id] + value;
      if (newVal < 0 || newVal > 10) return prev;
      return { ...prev, [id]: newVal };
    });
  };

  // Handle size change
  const handleSizeChange = (id, sizeType) => {
    setSize(prev => ({
      ...prev,
      [id]: sizeType,
    }));
  };

  // Filter drinks based on search and category
  const filteredDrinks = DRINKS.filter((drink) => {
    const matchesSearch = drink.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || drink.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate price based on size
  const calculatePrice = (id) => {
    const drink = DRINKS.find(d => d.id === id);
    let price = drink.price;

    if (size[id] === 'large') {
      price *= 1.5; // Increase price by 50% for large size
    } else if (size[id] === 'small') {
      price *= 0.75; // Decrease price by 25% for small size
    }

    return price;
  };

  // Handle add to cart
  const handleAddToCart = (drink) => {

    const uniqueId = `${drink.id}-${size[drink.id]}`;

    dispatch(
      addToCart({
        id: uniqueId,
        name: drink.name,
        price: calculatePrice(drink.id),
        quantity: qty[drink.id],
        size: size[drink.id],  // Pass the selected size for drinks
        image: drink.image,
      })
    );
  };


  return (
    <main className="page">
      <section className="page-left">
        {/* Search Box */}
        <div className="meals-header-actions">
          <div className="dropdown">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px' }}
            >
              <option value="All">All Categories</option>
              <option value="Smoothie">Smoothies</option>
              <option value="Juice">Juices</option>
              <option value="Water">Waters</option>
            </select>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search drinks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <h1 className="section-title center">Fresh Drinks</h1>

        <div className="products-grid">
          {filteredDrinks.map((drink) => (
            <div key={drink.id} className="product-card">
              <div className="product-img">
                <img src={drink.image} alt={drink.name} />
              </div>
              <h3 className="product-title">{drink.name}</h3>
              <p className="product-desc">{drink.description}</p>

              {/* Size Selection Radio Buttons */}
              <div className="size-selector">
                <label>
                  <input
                    type="radio"
                    name={`size-${drink.id}`}
                    checked={size[drink.id] === 'small'}
                    onChange={() => handleSizeChange(drink.id, 'small')}
                  />
                  Small
                </label>
                <label>
                  <input
                    type="radio"
                    name={`size-${drink.id}`}
                    checked={size[drink.id] === 'medium'}
                    onChange={() => handleSizeChange(drink.id, 'medium')}
                  />
                  Medium
                </label>
                <label>
                  <input
                    type="radio"
                    name={`size-${drink.id}`}
                    checked={size[drink.id] === 'large'}
                    onChange={() => handleSizeChange(drink.id, 'large')}
                  />
                  Large
                </label>
              </div>

              <p className="product-price">
                {calculatePrice(drink.id).toFixed(3)} <span>OR</span>
              </p>

              {/* Quantity Section */}
              <div className="qty-row">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => changeQty(drink.id, -1)}
                >
                  –
                </button>

                <span className="qty-value">{qty[drink.id]}</span>

                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => changeQty(drink.id, +1)}
                >
                  +
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                type="button"
                className="primary-btn small-btn"
                onClick={() => handleAddToCart(drink)}
              >
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="page-right">
        {/* Consistent green panel */}
      </section>
    </main>
  );
}

export default Drinks;
