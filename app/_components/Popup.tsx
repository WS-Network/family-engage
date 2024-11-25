import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Popup.css";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handlePopupSubmit = () => {
    if (!birthDate || !acceptedTerms) {
      alert("Please complete all fields before proceeding.");
      return;
    }

    console.log("Birthdate:", birthDate);
    console.log("Accepted Terms:", acceptedTerms);

    // Close the popup
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
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
            Accept Terms and Conditions
          </label>
        </div>
        <button className="btn submit-btn" onClick={handlePopupSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Popup;
