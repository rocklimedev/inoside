import React, { useState } from "react";
import { useRegisterUserMutation } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [register, { isLoading, error }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await register({
        name: form.name,
        email: form.email,
        username: form.username,
        password: form.password,
      }).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
          <div className="col-lg-4 mx-auto">
            <form
              onSubmit={handleSubmit}
              className="d-flex justify-content-center align-items-center"
            >
              <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pt-lg-4 pb-0 flex-fill">
                <div className="card border-0 p-lg-3 shadow-lg rounded-2">
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <h5 className="mb-2">Sign Up</h5>
                      <p className="mb-0">
                        Please enter your details to create account
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text border-end-0">
                          <i className="isax isax-profile"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="form-control border-start-0 ps-0"
                          placeholder="Name"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <div className="input-group">
                        <span className="input-group-text border-end-0">
                          <i className="isax isax-user"></i>
                        </span>
                        <input
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          className="form-control border-start-0 ps-0"
                          placeholder="Enter Username"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text border-end-0">
                          <i className="isax isax-sms-notification"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-control border-start-0 ps-0"
                          placeholder="Enter Email Address"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="pass-group input-group">
                        <span className="input-group-text border-end-0">
                          <i className="isax isax-lock"></i>
                        </span>
                        <input
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          className="form-control border-start-0 ps-0"
                          placeholder="****************"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <div className="pass-group input-group">
                        <span className="input-group-text border-end-0">
                          <i className="isax isax-lock"></i>
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          className="form-control border-start-0 ps-0"
                          placeholder="****************"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-danger text-center mb-2">
                        {error?.data?.message || "Registration failed"}
                      </div>
                    )}

                    <div className="mb-1">
                      <button
                        type="submit"
                        className="btn bg-primary-gradient text-white w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                      </button>
                    </div>

                    <div className="text-center mt-3">
                      <h6 className="fw-normal fs-14 text-dark mb-0">
                        Already have an account?{" "}
                        <a href="/login" className="hover-a">
                          Sign In
                        </a>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
