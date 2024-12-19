import React from "react";
import styles from "./FlatButton.module.css";

export const FlatButton = ({
  buttonText = "Click Me",
  buttonName = "Button",
  buttonType = "button",
  buttonColor = "#0CA4BD",
  buttonActivated = "pointer",
  clickEvent = () => {},
}) => {
  return (
    <>
      <button
        style={{
          backgroundColor: buttonColor,
          cursor: buttonActivated,
          color: "#FFFFFF", // Text color set to white
        }}
        name={buttonName}
        onClick={clickEvent}
        className={styles.button}
        type={buttonType}
      >
        {buttonText}
      </button>
    </>
  );
};
