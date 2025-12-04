import React, { useContext, useEffect, useState } from "react";
import transformer from "../assets/transformer2.jpg"; // Adjust your path
import { MyContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { setIsHideSidebarAndHeader, setAlertBox } = useContext(MyContext);
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);

    // If already logged in, prevent access to login page
    const role = localStorage.getItem("role");
    if (role === "superadmin") {
      navigate("/");
    }
  }, [navigate, setIsHideSidebarAndHeader]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dummy = {
      name: "Kalpana Industries",
      loginId: "kalpana@gmail.com",
      password: "1234",
      role: "superadmin",
    };

    if ( name === dummy.name && loginId === dummy.loginId && password === dummy.password) {
      localStorage.setItem("Transformer user", JSON.stringify(dummy));
      localStorage.setItem("role", dummy.role);
      setAlertBox({
        msg: "Login successfull!",
        open:true,
        error:false,
      })
      navigate("/companies");
    } else {
      setAlertBox({
        msg: "Invalid email or password",
        open:true,
        error:true,
      })
    }
  };

  {/*const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, loginId, password };
    console.log("Login data", data);
    navigate("/companies")
  };*/}

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
              >
                Submit
              </button>

              {/*<div className="text-center mt-3">
                <p className="small">
                  Don't have an account?{" "}
                  <Link to="/signup" className="fw-bold text-decoration-none text-primary">
                    Signup here
                  </Link>
                </p>
              </div>*/}
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

export default Login

