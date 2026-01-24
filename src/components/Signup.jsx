import React, { useContext, useEffect, useState } from "react";
import transformer from "../assets/transformer1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";
import { defaultPermissions } from "../data/permission";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAlertBox, setIsHideSidebarAndHeader } = useContext(MyContext);
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
    return () => {
      setIsHideSidebarAndHeader(false);
    };
  }, [setIsHideSidebarAndHeader]);

  const roles = ["OWNER", "MANAGER", "DATA_FEEDER", "SUPERVISOR"];
  const permissionKeys = Object.keys(defaultPermissions);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const signupMutation = useMutation({
    mutationFn: (credentials) => api.post("/users/", credentials),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Signup successful! Please login.",
        error: false,
      });
      navigate("/subadmin-list");
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.response?.data?.message || "An error occurred",
        error: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation.mutate({ name, loginId, number, password, role, pages });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-md-7 d-flex align-items-center justify-content-center bg-light">
          <div className="w-75">
            <h2 className="fw-bold mb-3">Welcome</h2>
            <p className="text-muted mb-4">Create login ID for new user</p>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Mobile */}
              <div className="mb-3">
                <label className="form-label">Mobile No</label>
                <input
                  type="text"
                  className="form-control"
                  value={number}
                  onChange={(e) =>
                    setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  required
                />
              </div>

              {/* Login ID */}
              <div className="mb-3">
                <label className="form-label">Login ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="mb-3">
                <label className="form-label">Select Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pages Multi Select */}
              <div className="mb-3">
                <label className="form-label">Select Accessible Pages</label>
                <select
                  className="form-select"
                  multiple
                  value={pages}
                  onChange={(e) =>
                    setPages(
                      Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                      ),
                    )
                  }
                  required
                >
                  {permissionKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <small className="text-muted">
                  Hold Ctrl (Windows) or Command (Mac) to select multiple pages.
                </small>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={signupMutation.isLoading}
              >
                {signupMutation.isLoading ? "Submitting..." : "Submit"}
              </button>

              <div className="text-center mt-3">
                <p className="small">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-bold text-decoration-none text-primary"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="col-md-5 d-none d-md-block p-0">
          <div
            style={{
              backgroundImage: `url(${transformer})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
