import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Popup.css";
import TermsContent from "./TermsContent";
import TermsOfUseContent from "./TermsOfUseContent";
import { toast } from "sonner";

interface PopupProps {
  onClose: () => void;
  initialView?: "main" | "terms" | "termsOfUse"; // Added "termsOfUse"
}

const Popup: React.FC<PopupProps> = ({ onClose, initialView = "main" }) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentView, setCurrentView] = useState(initialView);

  const handlePopupSubmit = () => {
    if (!birthDate || !acceptedTerms) {
      toast.error("Please complete all fields before proceeding.");
      return;
    }

    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const isUnder16 =
      age < 16 ||
      (age === 16 && currentDate < new Date(birthDate.setFullYear(currentDate.getFullYear())));

    if (isUnder16) {
      toast.error("You must be at least 16 years old to proceed.");
      return;
    }

    toast.success("Registration successful, go back to login");

    console.log("Birthdate:", birthDate);
    console.log("Accepted Terms:", acceptedTerms);

    // Close the popup
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        {currentView === "terms" ? (
          <div className="terms-content">
            <h1>Terms and Conditions</h1>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                maxHeight: "300px",
              }}
            >
              {TermsContent}
            </pre>
            <button className="btn back-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : currentView === "termsOfUse" ? (
          <div className="terms-of-use-content">
            <h1>Terms of Use</h1>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                overflowY: "auto",
                maxHeight: "300px",
              }}
            >
              {TermsOfUseContent}
            </pre>
            <button className="btn back-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="popup-title">Complete your profile</h2>
            <div className="popup-field">
              <label className="popup-subtitle">Select your birthday</label>
              <Calendar
                value={birthDate}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    setBirthDate(value[0]);
                  } else {
                    setBirthDate(value);
                  }
                }}
              />
            </div>
            <div className="popup-field">
              <label className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                Accept{" "}
                <span
                  className="terms-link"
                  onClick={() => setCurrentView("terms")}
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Terms and Conditions
                </span>
              </label>
            </div>
            <button className="btn submit-btn" onClick={handlePopupSubmit}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;
