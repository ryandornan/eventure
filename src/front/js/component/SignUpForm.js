import React, { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpForm = () => {
  {/* this is the integration with the back end */}
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '' ,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try{
    const response = await fetch(" ",{
    method: 'POST',
    
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    
  });
const data = await response.json();

console.log(data);
} catch (error){
  console.log("There is an error: ", error );
}
};

  return (
    <div className="container-full py-5 h-100 black-background">
      <div className="signup row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card custom-card shadow-2-strong" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-5">

              {/* Header */}
              <h2 className="mb-5">Sign Up Now.</h2>

              {/* Names Input */}
              <div className="row">
                {/* First Name Input */}
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="typeFirstName"
                      className="form-control form-control-lg"
                      placeholder="First Name"
                    />
                  </div>
                </div>

                {/* Last Name Input */}
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="typeLastName"
                      className="form-control form-control-lg"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="typeEmailX-2"
                  className="form-control form-control-lg"
                  placeholder="Email"
                />
              </div>

              {/* Password Input */}
              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="typePasswordX-2"
                  className="form-control form-control-lg"
                  placeholder="Password"
                />
              </div>

              {/* Remember Password and Login Button */}
              <div className="d-flex flex-column align-items-center mb-4">
                {/* Sign Up Button*/}
                <button
                  className="btn btn-primary custom-btn"
                  type="submit"
                >
                  Sign Up
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
