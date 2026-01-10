import React, { useContext, useEffect, useState } from "react";
import transformer from "../assets/transformer2.jpg"; // Adjust your path
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAlertBox } = useContext(MyContext);
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, prevent access to login page
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials),
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("role", data.data.user.role);
      localStorage.setItem("Transformer user", JSON.stringify(data.data.user));
      localStorage.setItem("companies", JSON.stringify(data.data.companies));
      setAlertBox({open: true, msg: "Login successful!", error: false});
      navigate("/companies");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.response?.data?.message || "An error occurred", error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ loginId, password });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Form Side */}
        <div className="col-md-7 d-flex align-items-center justify-content-center bg-light">
          <div className="w-75">
            <h2 className="fw-bold mb-3">Welcome</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Login ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter login ID"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="marketingConsent"
                  defaultChecked
                />
                <label
                  className="form-check-label small"
                  htmlFor="marketingConsent"
                >
                  I want to receive emails about the product, feature updates,
                  events, and marketing promotions.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Logging in..." : "Submit"}
              </button>

              <div className="text-center mt-3">
                <p className="small">
                  Don't have an account?{" "}
                  <Link to="/signup" className="fw-bold text-decoration-none text-primary">
                    Signup here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="col-md-5 d-none d-md-block p-0">
          <div
            style={{
              backgroundImage: `url(${transformer})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
