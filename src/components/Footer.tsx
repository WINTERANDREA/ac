"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Andrea Casero</h4>
          <p className="footer-tagline">
            {t("tagline")}
          </p>
        </div>
        
        <div className="footer-section">
          <h5>{t("contact")}</h5>
          <div className="footer-links">
            <a 
              href="mailto:andrecasero@gmail.com"
              className="footer-link"
            >
              andrecasero@gmail.com
            </a>
            <span className="footer-location">
              {t("location")}
            </span>
          </div>
        </div>
        
        <div className="footer-section">
          <h5>{t("connect")}</h5>
          <div className="footer-links">
            <a 
              href="https://www.linkedin.com/in/andreacasero/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/WINTERANDREA"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <span className="footer-copyright">
          © {currentYear} Andrea Casero. {t("rights")}
        </span>
      </div>
    </footer>
  );
}