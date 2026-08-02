export function Home() {
  return (
    <div className="home">
      <header>
        <img src="img.png" alt="logo" />
        <nav>
          <a href="../">Features</a>
          <a href="../">How it works</a>
          <a href="../">Who We Serve</a>
          <a href="../">About</a>
        </nav>
        <div className="button-group">
          <button>Login</button>
          <button>Get Started</button>
        </div>
      </header>
    </div>
  );
}
