'use client';

import React, { useState } from 'react';
import './login.css';
import 'boxicons/css/boxicons.min.css';
import { useForm } from 'react-hook-form';
// import { Calendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; // Import react-calendar styles
// import { Checkbox } from '@radix-ui/react-checkbox';
import { useUserService } from '_services';

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

  const { register: loginRegister, handleSubmit: loginHandleSubmit, formState: loginFormState } = loginForm;
  const { register: registerRegister, handleSubmit: registerHandleSubmit, formState: registerFormState } = registerForm;

  const { errors: loginErrors } = loginFormState;
  const { errors: registerErrors } = registerFormState;

  const userService = useUserService();

  async function onSubmit(data: LoginFormData) {
    console.log('Login Data:', data.username, data.password);
    await userService.login(data.username, data.password);
  }

  async function onSubmitRegister(data: RegisterFormData) {
    const user: IUser = {
      id: generateUniqueId(),
      subUsers: [],
      ...data,
    };

    console.log('Transformed Registration Data:', user);
    await userService.register(user);

    // Show the popup after successful registration
    setShowPopup(true);
  }

  function generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  function handlePopupSubmit() {
    if (!birthDate || !acceptedTerms) {
      alert('Please complete all fields before proceeding.');
      return;
    }

    console.log('Birthdate:', birthDate);
    console.log('Accepted Terms:', acceptedTerms);

    setShowPopup(false);
  }

  return (
    <div className={`container ${isActive ? 'active' : ''}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={loginHandleSubmit(onSubmit)}>
          <div className="input-box">
            <input
              {...loginRegister('username', { required: 'Username is required' })}
              placeholder="Username"
              type="text"
              className={`form-control ${loginErrors.username ? 'is-invalid' : ''}`}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              {...loginRegister('password', { required: 'Password is required' })}
              placeholder="Password"
              type="password"
              className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="forgot-link">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <p>or login with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={registerHandleSubmit(onSubmitRegister)}>
          <div className="input-box">
            <input
              {...registerRegister('firstName', { required: 'First Name is required' })}
              placeholder="First Name"
              type="text"
              className={`form-control ${registerErrors.firstName ? 'is-invalid' : ''}`}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              {...registerRegister('lastName', { required: 'Last Name is required' })}
              placeholder="Last Name"
              type="text"
              className={`form-control ${registerErrors.lastName ? 'is-invalid' : ''}`}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input
              {...registerRegister('username', { required: 'Username is required' })}
              placeholder="Username"
              type="text"
              className={`form-control ${registerErrors.username ? 'is-invalid' : ''}`}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="input-box">
            <input
              {...registerRegister('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="Password"
              type="password"
              className={`form-control ${registerErrors.password ? 'is-invalid' : ''}`}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn">Register</button>
          <p>or register with social platforms</p>
          <div className="social-icons">
            <a href="#"><i className="bx bxl-google"></i></a>
          </div>
        </form>
      </div>

      {/* Toggle Panel */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Family Engage</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={() => setIsActive(true)}>Register</button>
        </div>

        <div className="toggle-panel toggle-right">
          <h1>Family Engage</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={() => setIsActive(false)}>Login</button>
        </div>
      </div>

      {/* Popup for Birthdate and Terms */}
     
    </div>
  );
}
