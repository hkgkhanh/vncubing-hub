// import Image from "next/image";
// import styles from "./page.module.css";
import "../_styles/page.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Lorem ipsum</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </section>

      <section className="other-content">
        <p>More content below the hero section...</p>
      </section>
    </div>
  );
}