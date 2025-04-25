import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import medicare from '../img/medicare.jpg'

export default function Register() {
  const navigate = useNavigate();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Required field"),
    number: Yup.string()
      .matches(/^\d{10}$/, "Number must be exactly 10 digits")
      .required("Required field"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Required field"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required field"),
  });

  // ✅ Formik Configuration
  const formik = useFormik({
    initialValues: { name: "", number: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log(data);
        alert(data.message);

        if (response.ok) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Registration Error:", error.message);
        alert("Something went wrong. Try again!");
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen"   style={{ backgroundImage: `url(${medicare})`,backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center' }}>
      {/* <h1 className="text-2xl font-medium text-cyan-700">Hello Doctor!!</h1> */}
      <div className="bg-pink-200 border-2 border-cyan-700 rounded-xl w-auto sm:w-[470px] p-8 shadow-2xl shadow-black/50">
        <div className="text-center text-3xl text-cyan-600 font-bold">
          <h1>Register</h1>
        </div>

        <form className="pt-5" onSubmit={formik.handleSubmit}>
          {/* 🔹 Name Field */}
          <div>
            <input
              type="text"
              className="border-2 border-cyan-600 w-full h-9 rounded-md px-2"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <div className="pt-2 text-lg text-cyan-700 font-medium text-start">
              <label>Your Name</label>
            </div>
            <div className="text-sky-700">{formik.errors.name}</div>
          </div>

          {/* 🔹 Number Field */}
          <div className="pt-5">
            <input
              type="text"
              className="border-2 border-cyan-600 w-full h-9 rounded-md px-2"
              name="number"
              onChange={formik.handleChange}
              value={formik.values.number}
            />
            <div className="pt-2 text-lg text-cyan-700 font-medium text-start">
              <label>Your Number</label>
            </div>
            <div className="text-sky-700">{formik.errors.number}</div>
          </div>

          {/* 🔹 Email Field */}
          <div className="pt-5">
            <input
              type="email"
              className="border-2 border-cyan-600 w-full h-9 rounded-md px-2"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <div className="pt-2 text-lg text-cyan-700 font-medium text-start">
              <label>Your Email</label>
            </div>
            <div className="text-sky-700">{formik.errors.email}</div>
          </div>

          {/* 🔹 Password Field */}
          <div className="pt-5">
            <input
              type="password"
              className="border-2 border-cyan-600 w-full h-9 rounded-md px-2"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <div className="pt-2 text-lg text-cyan-700 font-medium text-start">
              <label>Your Password</label>
            </div>
            <div className="text-sky-700">{formik.errors.password}</div>
          </div>

          {/* 🔹 Submit Button */}
          <div className="text-center pt-4 sm:mt-2">
            <button className="text-cyan-700 px-7 rounded-lg py-2 bg-sky-300" type="submit">
              Register
            </button>
          </div>

          {/* 🔹 Login Link */}
          <div className="pt-5 text-cyan-700">
            <span>
              Already have an account? <Link to="/login" className="text-cyan-700 font-medium">Login</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
