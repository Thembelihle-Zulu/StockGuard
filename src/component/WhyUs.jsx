export function WhyUs() {
  return (
    <>
      <section className="why-us">
        <div className="text">
          <p className="eyebrow">Coverage that works</p>
          <h2>Why Choose StockGuard</h2>
          <p>
            Three essential layers of protection — designed around the real
            risks South African farmers face every season.
          </p>
        </div>
        <div className="cards-container">
          <div className="cover-card">
            <span className="icon-badge">⚡</span>
            <h3>Illness Cover</h3>
            <p>
              Comprehensive protection against veterinary-certified illness and
              disease outbreaks, covering diagnosis, treatment, and losses
              resulting from sickness.
            </p>
          </div>
          <div className="cover-card">
            <span className="icon-badge">⚡</span>
            <h3>Injury Cover</h3>
            <p>
              Comprehensive protection against veterinary-certified illness and
              disease outbreaks, covering diagnosis, treatment, and losses
              resulting from sickness.
            </p>
          </div>
          <div className="cover-card">
            <span className="icon-badge">⚡</span>
            <h3>Mortality Cover</h3>
            <p>
              Comprehensive protection against veterinary-certified illness and
              disease outbreaks, covering diagnosis, treatment, and losses
              resulting from sickness.
            </p>
          </div>
        </div>
      </section>

      <section className="how">
        <div className="text">
          <p className="eyebrow">Simple Process</p>
          <h2>How It Works</h2>
          <p>
            From registration to claim payout — a transparent, four-step process
            built around your needs.
          </p>
        </div>

        <div className="timeline">
          <div className="timeline-step">
            <div className="timeline-icon">
              <span className="icon">👤</span>
              <span className="step-number">01</span>
            </div>
            <h3>Register Farm</h3>
            <p>
              Create your StockGuard account and register your farm details in
              under 5 minutes.
            </p>
          </div>

          <div className="timeline-step">
            <div className="timeline-icon">
              <span className="icon">🚜</span>
              <span className="step-number">02</span>
            </div>
            <h3>Register Livestock</h3>
            <p>
              Add your animals with species, breed, age, and current market
              value — individually or in bulk.
            </p>
          </div>

          <div className="timeline-step">
            <div className="timeline-icon">
              <span className="icon">🗒️</span>
              <span className="step-number">03</span>
            </div>
            <h3>Choose Coverage</h3>
            <p>
              Select illness, injury, or mortality cover. Mix and match plans to
              fit your budget and risk profile.
            </p>
          </div>

          <div className="timeline-step">
            <div className="timeline-icon">
              <span className="icon">📋</span>
              <span className="step-number">04</span>
            </div>
            <h3>Submit &amp; Track Claims</h3>
            <p>
              File claims from your phone. Track status in real time and receive
              payouts directly to your account.
            </p>
          </div>
        </div>

        <button className="cta-button">
          Start Your Registration <span>➡️</span>
        </button>
      </section>
    </>
  );
}
