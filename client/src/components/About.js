import salad from "../images/salad-illustration.png";

export default function About() {
  return (
    <main className="page">
      <section className="page-left about-left">
        <h1 className="about-title">Welcome To HealthyBite Shop...</h1>
        <p className="about-text">
          Where our love for wholesome food inspires us to create a fresh and
          nourishing experience for everyone. At HealthyBite, we believe that
          eating well should be simple, joyful, and full of flavor. From
          farm-fresh ingredients to carefully crafted recipes, every dish is
          made with your health and happiness in mind. Our welcoming space and
          friendly team make it easy to enjoy balanced meals that fit your
          lifestyle. We're passionate about promoting wellness, supporting local
          farmers, and serving food that's good for you. Join us at HealthyBite
          to discover delicious, nutritious meals that make you feel your best —
          one bite at a time. Welcome to your healthy eating haven!
        </p>
      </section>

      <section className="page-right about-image">
        <div className="circle-image">
          <img src={salad} alt="Healthy food" />
        </div>
      </section>
    </main>
  );
}
