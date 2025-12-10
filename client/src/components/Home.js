import salad from "../images/salad-illustration.png";

export default function Home() {
  return (
    <main className="page">
      <section className="page-left">
        <div className="hero-content">
          <h1>
            Start your day with a smile
            <br />
            and a plate full of
            <br />
            goodness......
          </h1>
          <p>
            Choose and enjoy fresh, natural meals made for
            <br />
            your wellbeing.
          </p>
        </div>
      </section>

      <section className="page-right">
        <div className="circle-image">
          <img src={salad} alt="Healthy food" />
        </div>
      </section>
    </main>
  );
}
