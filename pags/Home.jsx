import { WhyUs } from "../src/component/WhyUs";

export function Home() {
  return (
    <div className="home">
      <main className="landing-page-content">
        <section className="Features">
          <div className="text-content">
            <div className="pill">
              <span className="pill-dot"></span>
              South Africa's Livestock Insurance Platform
            </div>
            <h1 className="headline">
              Protect Your <span className="accent">Livestock.</span>
              <br />
              Protect Your <span className="accent">Income.</span>
            </h1>
            <p className="subtext">
              Affordable livestock insurance for South African farmers —
              covering illness, injury, and mortality with transparent pricing
              and fast claim payouts.
            </p>
            <div className="button-group">
              <button className="btn-primary">
                Get Started <span>→</span>
              </button>
              <button className="btn-secondary">Login</button>
            </div>
          </div>
          <div className="image-content">
            <div className="claims ">
              <ul>
                <li>Claims /#2847 Approved</li>
              </ul>
              Payout: R 8,500 · 2 min ago
            </div>
            <div className="claims-text-bottom">
              <span className="icon">🛡️</span>
              <span>
                <strong>1,200+</strong> Animals protected
              </span>
            </div>
          </div>
        </section>
        <section>
          <WhyUs />
        </section>
      </main>
    </div>
  );
}
