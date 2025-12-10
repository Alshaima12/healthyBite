import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRequireAuth from '../hooks/useRequireAuth';

import saladBowl from "../images/salad-bowl.png";
import healthyMealsImg from "../images/healthy-meal.png";
import drinksImg from "../images/fresh-drinks.png";

function Menu() {
  useRequireAuth();
  const navigate = useNavigate();

  return (
    <main className="page">
      <section className="page-left">
        <h1 className="section-title center">MENU</h1>

        <div className="menu-grid">

          {/* Healthy Meals Card */}
          <div className="menu-card" onClick={() => navigate('/meals')}>
            <div className="menu-img-placeholder">
              <img src={healthyMealsImg} alt="Healthy meals" />
            </div>
            <p className="menu-card-title">Healthy Meals</p>
          </div>

          {/* Fresh Drinks Card */}
          <div className="menu-card" onClick={() => navigate('/drinks')}>
            <div className="menu-img-placeholder">
              <img src={drinksImg} alt="Fresh drinks" />
            </div>
            <p className="menu-card-title">Fresh Drinks</p>
          </div>

        </div>
      </section>

      <section className="page-right">
        <div className="circle-image">
          <img src={saladBowl} alt="Healthy bowl" />
        </div>
      </section>
    </main>
  );
}

export default Menu;
