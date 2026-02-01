//=====================================
// File: Footer.jsx
// componente per la gestione del Footer
// @author: "nicolas.brazzo@allievi.itsdigitalacademy.com"
// @author: "catalin.groppo@allievi.itsdigitalacademy.com"
// @author: "simone.pernigottocego@allievi.itsdigitalacademy.com"
// @author: "andrea.villari@allievi.itsdigitalacademy.com"
// @version: "1.0.0 2025-10-17"
//=====================================

import "./Footer.css";

export const Footer = ({ copyright, children, onPrivacyClick }) => {
  return (
    <div className="footer" >
      <span className="footer-text">{copyright}</span>
      <span >
        <button
         type="button"
         className="footer-link"
         onClick={onPrivacyClick}
         >{children}
        </button>
      </span>
    </div>
  );
};
