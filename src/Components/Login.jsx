import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import medicare from '../img/medicare.jpg'


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Store login error message


  // ✅ Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Required field"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required field"),
  });

  useEffect(() => {
    if (email) {
        localStorage.setItem("userEmail", email);
    }
}, [email]);
  // ✅ Formik Configuration
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      console.log("Login Request Data:", values);  // ✅ Debugging step

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log("Server Response:", data);  // ✅ Debugging step

      
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("LoggedIn", JSON.stringify(true)); // ✅ Store boolean for authentication
          localStorage.setItem("userEmail", values.email); // ✅ Store user email separately
          setEmail(values.email); // ✅ Update userEmail in context

          alert("Login Successful!");
          navigate("/");
        } else {
          setErrorMessage(data.message); // ✅ Set error message instead of alert
        }
      } catch (error) {
        console.error("Login Error:", error);
        setErrorMessage(data.message); // ✅ Set error message instead of alert
      }
    },
  });


  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundImage: `url(${medicare})`,backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center' }}>
      <div className="bg-pink-200 border border-slate-400 rounded-xl w-auto sm:w-[470px] p-8 shadow-2xl shadow-black/50">
        <div className="text-center text-4xl text-cyan-600 font-bold">
          <h1>Login</h1>
        </div>

        <form className="pt-5" onSubmit={formik.handleSubmit}>
          {/* 🔹 Email Field */}
          <div>
            <input
              type="email"
              className="border-2 border-cyan-700 w-full h-9 rounded-md px-2"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <div className="pt-2 text-lg text-cyan-700 font-medium text-start">
              <label>Your Email</label>
            </div>
            <div className="text-blue-500">{formik.errors.email}</div>
          </div>

          {/* 🔹 Password Field */}
          <div className="pt-5">
            <input
              type="password"
              className="border-2 border-cyan-700 w-full h-9 rounded-md px-2"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <div className="pt-2 text-lg text-cyan-700 font-medium text-start">
              <label>Your Password</label>
            </div>
            <div className="text-blue-500">{formik.errors.password}</div>
          </div>

          {/* 🔹 Submit Button */}
          <div className="text-center pt-4 sm:mt-2">
            <button className="border-cyan-700 px-7 rounded-lg py-2 bg-sky-300" type="submit">
              Login
            </button>
          </div>

          {errorMessage && (
            <div className="pt-3 text-center text-red-600 font-semibold">
              {errorMessage}
            </div>
          )}

          {/* 🔹 Register Link */}
          <div className="pt-5 text-cyan-700 font-medium">
            <span>
              Don't have an account? <Link to="/register" className="text-cyan-700 font-medium">Register</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
