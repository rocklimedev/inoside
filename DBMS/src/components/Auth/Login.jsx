import React, { useState } from "react";
import { useLoginUserMutation } from "../../api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../api/authSlice";
import { useNavigate, Link } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      }).unwrap();
      navigate("/", { replace: true });
      dispatch(setCredentials({ user: res.user, token: res.token }));
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
          <div className="col-lg-4 mx-auto">
            <form
              onSubmit={handleSubmit}
              className="d-flex justify-content-center align-items-center"
            >
              <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
                <div className="card border-0 p-lg-3 shadow-lg">
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <h5 className="mb-2">Sign In</h5>
                      <p className="mb-0">
                        Please enter below details to access the dashboard
                      </p>
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
                          className="pass-inputs form-control border-start-0 ps-0"
                          placeholder="****************"
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="form-check form-check-md mb-0">
                          <input
                            className="form-check-input"
                            id="remember_me"
                            name="remember"
                            type="checkbox"
                            checked={form.remember}
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="remember_me"
                            className="form-check-label mt-0"
                          >
                            Remember Me
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-1">
                      <button
                        type="submit"
                        className="btn bg-primary-gradient text-white w-100"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </button>
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

export default Login;
