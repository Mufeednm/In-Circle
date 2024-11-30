import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Userpage from "../pages/user/userpage";
import Loginpage from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import {Toaster} from 'react-hot-toast'
// import Reviewer from "../components/reviewer/Reviewer";

const Approuter:React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* auth */}
          <Route path="/" element={<Loginpage/>} />
          <Route path="/signup" element={<Signup/>} />
        {/* USER  */}
          <Route path="/user" element={<Userpage/>} />
        </Routes>
      </Router>
      <Toaster/>
    </>
  );
};

export default Approuter;
