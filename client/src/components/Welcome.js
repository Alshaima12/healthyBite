import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRequireAuth from '../hooks/useRequireAuth';
import salad from "../images/salad-illustration.png";

function Welcome() {
  useRequireAuth(); // Ensures the user is logged in before accessing this page
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate('/menu');
  };

  return (
    <main className="page">
      <section className="page-left">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome To HealthyBite Shop...</h1>

          <p className="welcome-subtitle green-text">Get Started..</p>
          <p className="welcome-subsubtitle">Find The Best Food For You!</p>

          <button className="primary-btn big-btn" onClick={handleOrderNow}>
            Order Now
          </button>
        </div>
      </section>

      <section className="page-right">
        <div className="circle-image">
          <img src={salad} alt="Healthy bowl" />
        </div>
      </section>
    </main>
  );
}

export default Welcome;
