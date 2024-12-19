import React, { useState } from "react";
import Popup from "./Popup";
import { FlatButton } from "./FlatButton/FlatButton";

export const TermsPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialView, setInitialView] = useState<"terms" | "termsOfUse">("terms");

  const openTermsPopup = (view: "terms" | "termsOfUse") => {
    setInitialView(view);
    setIsOpen(true);
  };

  const closeTermsPopup = () => setIsOpen(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%", // Ensure full width for alignment
        maxWidth: "300px", // Optional: Limit width if needed
        margin: "0 auto", // Center horizontally
        gap: "16px", // Space between the buttons
        padding: "1rem", // Optional padding around the container
      }}
    >
      <FlatButton
        buttonName="Terms and Conditions Button"
        buttonText="Terms and Conditions"
        clickEvent={() => openTermsPopup("terms")}
      />
      <FlatButton
        buttonName="Terms of Use Button"
        buttonText="Terms of Use"
        clickEvent={() => openTermsPopup("termsOfUse")}
      />
      {isOpen && <Popup onClose={closeTermsPopup} initialView={initialView} />}
    </div>
  );
};
