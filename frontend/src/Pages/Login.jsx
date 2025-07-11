import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../style/z_style.css";
import * as Yup from "yup";
import axios from 'axios';

const PasswordField = ({ name, placeholder, className }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <Field
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className={className}
        />
        <span
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 text-base md:text-lg"
          onClick={() => setShow((s) => !s)}
        >
          {show ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="s_input_error mt-1 text-xs md:text-sm"
      />
    </div>
  );
};

const Login = () => {

  const BaseUrl = process.env.REACT_APP_BASEURL;
console.log("BaseUrl????????",BaseUrl);

  const [formType, setFormType] = useState("login"); // 'login', 'register', 'forgot', 'otp', 'reset'
  // Remove showRegisterModal state

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = (values) => {
    console.log(values);
  };

  // Register form state
  const registerInitialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const registerValidationSchema = Yup.object({
    username: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });
  const handleRegister = async (values) => {
    // console.log("values>>>>>>>",values);
    
    try {
      const response = await axios.post(`${BaseUrl}/api/auth/register`, values);
      console.log("response?>>>>>>>>",response.data);
      if(response.data.success === true) {
        setFormType("login");
      }
    } catch (error) {
        console.error('User register Error:',error); 
    }
  };

  // Forgot password form state
  const forgotInitialValues = { email: "" };
  const forgotValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const handleForgot = (values) => {
    setFormType("otp");
  };

  // OTP form state
  const otpInitialValues = { otp: "" };
  const otpValidationSchema = Yup.object({
    otp: Yup.string().required("OTP is required"),
  });
  const handleOtp = (values) => {
    setFormType("reset");
  };

  // Reset password form state
  const resetInitialValues = { password: "", confirmPassword: "" };
  const resetValidationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });
  const handleReset = (values) => {
    setFormType("login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#EEF9FF] to-[#dbeafe] login-xs-padding">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Logo can go here */}
        <div className="bg-white rounded-2xl shadow-2xl px-2 py-6 w-full md:px-8 md:py-10">
          {formType === "login" && (
            <>
              <h1 className="text-lg md:text-2xl font-extrabold text-center text-[#254d70] mb-2 tracking-wide">
                Welcome Back
              </h1>
              <p className="text-center text-gray-500 mb-4 md:mb-6 text-xs md:text-sm">
                Login to your account
              </p>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="mb-3 md:mb-5">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="s_input_error mt-1 text-xs md:text-sm"
                    />
                  </div>
                  <div className="mb-2 md:mb-4">
                    <PasswordField
                      name="password"
                      placeholder="Password"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                  </div>
                  <button
                    type="button"
                    className="text-xs md:text-sm text-[#254d70] mb-2 md:mb-3 font-medium hover:underline bg-transparent border-none p-0"
                    onClick={() => setFormType("forgot")}
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="submit"
                    className="z_cart_btn w-full py-2 md:py-3 font-bold text-base md:text-lg tracking-wide mb-3 md:mb-4"
                  >
                    Login
                  </button>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="text-xs md:text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0"
                      onClick={() => setFormType("register")}
                    >
                      Looking to Create an Account?
                    </button>
                  </div>
                </Form>
              </Formik>
            </>
          )}
          {formType === "register" && (
            <>
              <h1 className="text-lg md:text-2xl font-extrabold text-center text-[#254d70] mb-2 tracking-wide">
                Register
              </h1>
              <p className="text-center text-gray-500 mb-2 md:mb-4 text-xs md:text-sm">
                Create your account to enjoy exclusive features and offers!
              </p>
              <Formik
                initialValues={registerInitialValues}
                validationSchema={registerValidationSchema}
                onSubmit={handleRegister}
              >
                <Form>
                  <div className="mb-3 md:mb-5">
                    <Field
                      type="text"
                      name="username"
                      placeholder="Full Name"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="s_input_error mt-1 text-xs md:text-sm"
                    />
                  </div>
                  <div className="mb-3 md:mb-5">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="s_input_error mt-1 text-xs md:text-sm"
                    />
                  </div>
                  <div className="mb-3 md:mb-5">
                    <PasswordField
                      name="password"
                      placeholder="Password"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                  </div>
                  <div className="mb-3 md:mb-5">
                    <PasswordField
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    className="z_cart_btn w-full py-2 md:py-3 font-bold text-base md:text-lg tracking-wide"
                  >
                    Register
                  </button>
                  <div className="flex justify-center mt-3 md:mt-4">
                    <button
                      type="button"
                      className="text-xs md:text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0"
                      onClick={() => setFormType("login")}
                    >
                      Already have an account? Login
                    </button>
                  </div>
                </Form>
              </Formik>
            </>
          )}
          {formType === "forgot" && (
            <>
              <h1 className="text-lg md:text-2xl font-extrabold text-center text-[#254d70] mb-2 tracking-wide">
                Forgot Password
              </h1>
              <p className="text-center text-gray-500 mb-2 md:mb-4 text-xs md:text-sm">
                Enter your email address and we'll send you a one-time password
                (OTP) to reset your password.
              </p>
              <Formik
                initialValues={forgotInitialValues}
                validationSchema={forgotValidationSchema}
                onSubmit={handleForgot}
              >
                <Form>
                  <div className="mb-3 md:mb-5">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="s_input_error mt-1 text-xs md:text-sm"
                    />
                  </div>
                  <div className="flex justify-between mb-3 md:mb-5">
                    <button
                      type="button"
                      className="text-xs md:text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0"
                      onClick={() => setFormType("login")}
                    >
                      Back to Login
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="z_cart_btn w-full py-2 md:py-3 font-bold text-base md:text-lg tracking-wide"
                  >
                    Send OTP
                  </button>
                </Form>
              </Formik>
            </>
          )}
          {formType === "otp" && (
            <>
              <h1 className="text-lg md:text-2xl font-extrabold text-center text-[#254d70] mb-2 tracking-wide">
                Enter OTP
              </h1>
              <p className="text-center text-gray-500 mb-2 md:mb-4 text-xs md:text-sm">
                Please enter the OTP sent to your email to verify your identity.
              </p>
              <Formik
                initialValues={otpInitialValues}
                validationSchema={otpValidationSchema}
                onSubmit={handleOtp}
              >
                <Form>
                  <div className="mb-3 md:mb-5">
                    <Field
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="s_input_error mt-1 text-xs md:text-sm"
                    />
                  </div>
                  <div className="flex justify-between mb-3 md:mb-5">
                    <button
                      type="button"
                      className="text-xs md:text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0"
                      onClick={() => setFormType("forgot")}
                    >
                      Back
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="z_cart_btn w-full py-2 md:py-3 font-bold text-base md:text-lg tracking-wide mb-2"
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    className="block mx-auto text-xs md:text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0 mt-2"
                    onClick={() => alert("OTP resent!")}
                  >
                    Resend OTP
                  </button>
                </Form>
              </Formik>
            </>
          )}
          {formType === "reset" && (
            <>
              <h1 className="text-lg md:text-2xl font-extrabold text-center text-[#254d70] mb-2 tracking-wide">
                Reset Password
              </h1>
              <p className="text-center text-gray-500 mb-2 md:mb-4 text-xs md:text-sm">
                Set a new password for your account. Make sure it's strong and
                secure.
              </p>
              <Formik
                initialValues={resetInitialValues}
                validationSchema={resetValidationSchema}
                onSubmit={handleReset}
              >
                <Form>
                  <div className="mb-3 md:mb-5">
                    <PasswordField
                      name="password"
                      placeholder="New Password"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                  </div>
                  <div className="mb-3 md:mb-5">
                    <PasswordField
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      className="s_form_imput w-full px-2 py-2 md:px-4 md:py-3 rounded-lg border border-gray-200 focus:border-[#254d70] focus:ring-2 focus:ring-[#254d70]/20 transition text-sm md:text-base"
                    />
                  </div>
                  <div className="flex justify-between mb-3 md:mb-5">
                    <button
                      type="button"
                      className="text-xs md:text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0"
                      onClick={() => setFormType("login")}
                    >
                      Back to Login
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="z_cart_btn w-full py-2 md:py-3 font-bold text-base md:text-lg tracking-wide"
                  >
                    Reset Password
                  </button>
                </Form>
              </Formik>
            </>
          )}
        </div>
        {/* Register Modal Popup */}
        {/* Remove all modal code, and add register form inline: */}
        {/* In login form, update the register button: */}
        {/* <button
          type="button"
          className="text-sm text-[#254d70] font-medium hover:underline bg-transparent border-none p-0"
          onClick={() => setFormType('register')}
        >
          Looking to Create an Account?
        </button> */}
      </div>
    </div>
  );
};

export default Login;
