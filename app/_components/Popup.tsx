import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import Calendar CSS
import { Checkbox } from '@radix-ui/react-checkbox';
import './Popup.css';

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
    console.log("[+] Am I in Popup?")
  const handlePopupSubmit = () => {
    if (!birthDate || !acceptedTerms) {
      alert('Please complete all fields before proceeding.');
      return;
    }

    console.log('Birthdate:', birthDate);
    console.log('Accepted Terms:', acceptedTerms);

    // Close the popup
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Complete Your Profile</h2>
        <div className="popup-field">
          <label>Birthdate:</label>
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
          <label>
            <Checkbox
              checked={acceptedTerms}
              onCheckedChange={(checked: boolean) => setAcceptedTerms(checked)}
            />
            Accept Terms and Conditions
          </label>
        </div>
        <button className="btn" onClick={handlePopupSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Popup;
