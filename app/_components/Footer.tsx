import React from "react";
import styles from "./Footer.module.css";
import { FlatButton } from "./FlatButton/FlatButton";
import { TermsPopup } from "./TermsPopup"; // Import the TermsPopup component

export const Footer = () => {
  return (
    <div className={styles.main}>
      <div className={styles["footer-container"]}>
        <div className={styles["main-container"]}>
          <p className={styles.subtitle}>
            Family<span> Engage</span>
          </p>
        </div>

        <div className={styles["social-container"]}>
        
        </div>

        <div className={styles["newsletter-container"]}>
        <TermsPopup />
        </div>

        <div style={{marginTop: "20px"}} className={styles["contact-container"]}>
          <p>support@familyengage.software</p>
          <p className={styles.text}>
            +961 76 708 140 <br />
            Lebanon
          </p>
           {/* Use the TermsPopup component */}
        </div>
      </div>
      
      <div className={styles.copyright}>
        Copyright @ 2024 Family Engage
      </div>
    </div>
  );
};
