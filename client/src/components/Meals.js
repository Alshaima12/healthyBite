import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import useRequireAuth from '../hooks/useRequireAuth';

import meal1 from "../images/meal1.png";
import meal2 from "../images/meal2.png";
import meal3 from "../images/meal3.png";

const MEALS = [
  {
    id: 'power-salad',
    name: 'Power Salad Bowl',
    description: 'A mix of fresh greens, cherry tomatoes, quinoa, and avocado with lemon vinaigrette.',
    price: 1.9,
    image: meal1,
    category: 'Salad',
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    description: 'Multigrain toast topped with avocado, cherry tomatoes, and chia seeds.',
    price: 1.5,
    image: meal2,
    category: 'Toast',
  },
  {
    id: 'protein-pasta',
    name: 'Protein Pasta',
    description: 'Whole wheat pasta with sautéed veggies and olive oil basil sauce.',
    price: 2.0,
    image: meal3,
    category: 'Pasta',
  },
];

function Meals() {
  useRequireAuth();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [qty, setQty] = useState({
    'power-salad': 1,
    'avocado-toast': 1,
    'protein-pasta': 1,
  });

  // Update the quantity of the meal
  const changeQty = (id, value) => {
    setQty(prev => {
      const newVal = prev[id] + value;
      if (newVal < 0 || newVal > 10) return prev;
      return { ...prev, [id]: newVal };
    });
  };

  const filteredMeals = MEALS.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculatePrice = (id) => {
    const meal = MEALS.find(m => m.id === id);
    return meal.price;
  };

  const handleAddToCart = (meal) => {
    dispatch(
      addToCart({
        id: meal.id,
        name: meal.name,
        price: calculatePrice(meal.id),
        quantity: qty[meal.id],
        image: meal.image,
        extraCheese: false, // No extra cheese for meals
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
              <option value="Salad">Salads</option>
              <option value="Toast">Toasts</option>
              <option value="Pasta">Pastas</option>
            </select>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search meals"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <h1 className="section-title center">Healthy Meals</h1>

        <div className="products-grid">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="product-card">
              <div className="product-img">
                <img src={meal.image} alt={meal.name} />
              </div>

              <h3 className="product-title">{meal.name}</h3>
              <p className="product-desc">{meal.description}</p>

              <p className="product-price">
                {calculatePrice(meal.id).toFixed(3)} <span>OR</span>
              </p>

              {/* Quantity Buttons */}
              <div className="qty-row">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => changeQty(meal.id, -1)}
                >
                  –
                </button>

                <span className="qty-value">{qty[meal.id]}</span>

                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => changeQty(meal.id, +1)}
                >
                  +
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                type="button"
                className="primary-btn small-btn"
                onClick={() => handleAddToCart(meal)}
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

export default Meals;
