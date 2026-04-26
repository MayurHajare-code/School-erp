import { FaEnvelope, FaGithub, FaTwitter } from "react-icons/fa";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <h2 className="footer-title">
            Ataraxia School ERP<span>.</span>
          </h2>
          <p className="footer-description">
            Smart Inventory & Management System
          </p>
        </div>

        <div className="footer-icons">
          <a href="mailto:mayurhajare333@gmail.com" aria-label="Gmail">
            <FaEnvelope /> Gmail
          </a>

          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub /> GitHub
          </a>

          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter /> Twitter
          </a>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>
          Copyright &copy; {new Date().getFullYear()} Ataraxia Development
          Group. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
