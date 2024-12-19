"use client";
//REGISTER*
import React, { useState } from "react";
import "./login.css";
import "boxicons/css/boxicons.min.css";
import { useForm } from "react-hook-form";
// import { Calendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; // Import react-calendar styles
// import { Checkbox } from '@radix-ui/react-checkbox';
import { useUserService } from "_services";
import Popup from "_components/Popup";
import Image from "next/image";
import logo from "../../../(public)/assets/Logo.png";
import { doc, setDoc } from "firebase/firestore";
import { db, auth, provider, signInWithPopup } from "../../../config/firebaseConfig";

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

interface IUser {
  id: string;
  subUsers: any[];
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export default function Login() {
  const [isActive, setIsActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>();

  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: loginFormState,
  } = loginForm;
  const {
    register: registerRegister,
    handleSubmit: registerHandleSubmit,
    formState: registerFormState,
  } = registerForm;

  const { errors: loginErrors } = loginFormState;
  const { errors: registerErrors } = registerFormState;

  const userService = useUserService();

  async function onSubmit(data: LoginFormData) {
    console.log("Login Data:", data.username, data.password);
    await userService.login(data.username, data.password);
  }

  async function onSubmitRegister(data: RegisterFormData) {
    const user: IUser = {
      id: generateUniqueId(),
      subUsers: [],
      ...data,
    };

    console.log("Transformed Registration Data:", user);

    try {
      await userService.register(user);

      // Automatically log the user in only if registration is successful
      await userService.login(user.username, user.password);

      // Show the popup after successful registration
      setShowPopup(true);
    } catch (error) {
      console.error("Registration Error:", error);
    }
  }

  function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  function handlePopupSubmit() {
    if (!birthDate || !acceptedTerms) {
      alert("Please complete all fields before proceeding.");
      return;
    }

    console.log("Birthdate:", birthDate);
    console.log("Accepted Terms:", acceptedTerms);

    setShowPopup(false);
  }

  function generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const passwordLength = 12;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }

  async function handleGoogleLogin() {
    try {
      // Perform Google Sign-In
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });

      // Use the Google displayName as username and generate a random password
      const newUser: IUser = {
        id: generateUniqueId(),
        subUsers: [],
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        username: user.displayName || "User",
        password: generateRandomPassword(),
      };

      console.log("Transformed Registration Data:", newUser);

      try {
        await userService.register(newUser);

        // Automatically log the user in only if registration is successful
        await userService.login(newUser.username, newUser.password);
        
        console.log("Google Sign-In Successful:", user);
      } catch (error) {
        console.error("Google Registration Error:", error);
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
    }
  }

  return (
    <div className={`containerr ${isActive ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={loginHandleSubmit(onSubmit)}>
          <div className="input-box">
            <input
              {...loginRegister("username", {
                required: "Username is required",
              })}
              placeholder="Username"
              type="text"
              className={`form-control ${
                loginErrors.username ? "is-invalid" : ""
              }`}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              {...loginRegister("password", {
                required: "Password is required",
              })}
              placeholder="Password"
              type="password"
              className={`form-control ${
                loginErrors.password ? "is-invalid" : ""
              }`}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btnn">
            Login
          </button>
          <p>or login with social platforms</p>
          <div className="social-icons">
          <a onClick={handleGoogleLogin}>
              <i className="bx bxl-google"></i>
            </a>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={registerHandleSubmit(onSubmitRegister)}>
          <div className="input-box">
            <input
              {...registerRegister("firstName", {
                required: "First Name is required",
              })}
              placeholder="First Name"
              type="text"
              className={`form-control ${
                registerErrors.firstName ? "is-invalid" : ""
              }`}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              {...registerRegister("lastName", {
                required: "Last Name is required",
              })}
              placeholder="Last Name"
              type="text"
              className={`form-control ${
                registerErrors.lastName ? "is-invalid" : ""
              }`}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input
              {...registerRegister("username", {
                required: "Username is required",
              })}
              placeholder="Username"
              type="text"
              className={`form-control ${
                registerErrors.username ? "is-invalid" : ""
              }`}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input
              {...registerRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
              type="password"
              className={`form-control ${
                registerErrors.password ? "is-invalid" : ""
              }`}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button style={{ backgroundColor: "#0CA4BD", width: "30%", color: '#FFF'}} type="submit" className="btn">
            Register
          </button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a onClick={handleGoogleLogin}>
              <i className="bx bxl-google"></i>
            </a>
          </div>
        </form>
      </div>

      {/* Toggle Panel */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          {/* <h1>Family Engage</h1> */}
          <Image src={logo} alt="Logo" width={120} height={90} />
          <p style={{marginTop: "10px", color: '#000'}}>Don't have an account?</p>
          <button
            style={{ backgroundColor: "#FFF", width: "30%"}}
            className="btn register-btn"
            onClick={() => setIsActive(true)}
          >
            Register
          </button>
        </div>

        <div className="toggle-panel toggle-right">
        <Image src={logo} alt="Logo" width={120} height={90} />

          <p style={{marginTop: "10px", color: '#000'}}>Already have an account?</p>
          <button style={{ backgroundColor: "#FFF", width: "30%"}} className="btn login-btn" onClick={() => setIsActive(false)}>
            Login
          </button>
        </div>
      </div>

      {showPopup && (
        <Popup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
}
