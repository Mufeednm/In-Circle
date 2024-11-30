import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { googleauth, login } from "../../api s/authapi";
import { GoogleLogin } from '@react-oauth/google';
import toast from "react-hot-toast";

const Loginpage: React.FC = () => {
  const nav = useNavigate()
  // Validation schema for Formik using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit =async (values: { email: string; password: string }) => {
    console.log("Form data submitted:", values);
    try {
      
      const response = await login(values.email,values.password)
      const token = response.data.token;
      console.log(response.data);
      
      localStorage.setItem("token", token);
      
      if (response.status==200) {
        toast.success("successfull")
        console.log("Registration successful");
nav('/user')
      } else {
        console.log("User is not  Registered");
      }
    } catch (error:any) {
      console.error( error.response?.data?.message || 'An unexpected error occurred');
 toast.error( error.response?.data?.message||"'An unexpected error occurred")
    }
  };
  const handleGoogleLoginFailure = () => {
    console.log("google auth erro");
    
  };

  const handlegoogleloginSuccess = async (credentialResponse:any) => {
    const { credential } = credentialResponse;
    console.log(credential,"credintasda ");
    
    try {
      
      const response = await googleauth(credential)
      console.log(response , "gooogle backend api");
      
      const token = response.data.token;
        
      if (response.status==200) {
        localStorage.setItem("token", token);    
nav('/user')
      } else {
        console.log("User is not  Registered");
      }
    }
    catch{}
  
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <img className="ml-5 align-middle" src="/incircle.png" alt="company logo" />
        <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">
          Stay Connected, Stay In Circle
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Log in
              </button>
            </Form>
          )}
        </Formik>

       <GoogleLogin 
       onSuccess={handlegoogleloginSuccess}
       onError={handleGoogleLoginFailure}
       />

        <p className="mt-4 text-sm text-center text-gray-600">
          Haven’t joined yet? The Circle awaits!{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
