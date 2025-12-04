import React, { useContext, useEffect, useState } from "react";
import companyLogo from "../assets/kalpana.jpg";
import kgLogo from "../assets/kg.jpg";
import ygLogo from "../assets/yg.jpg";
import transformer3 from "../assets/transformer3.jpg";
import { MyContext } from "../App";
import AssessmentIcon from "@mui/icons-material/Assessment"; // MIS report icon
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Companies = () => {
  const { setIsHideSidebarAndHeader } = useContext(MyContext);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "KALPANA INDUSTRIES",
      phone: "9876543210",
      address: "Plot 12, Industrial Zone, Mumbai",
      gst: "27AAACP1234F1Z5",
      email: "kalpana@gmail.com",
      logo: companyLogo,
      bgColor: "rgba(72, 33, 33, 0.33)",
    },
    {
      id: 2,
      name: "YASH GRANITES",
      phone: "9123456780",
      address: "Survey No 45, Industrial Area, Jaipur",
      gst: "08AABCY4567J1Z2",
      email: "yashgranites@gmail.com",
      logo: ygLogo,
      bgColor: "rgba(72, 33, 33, 0.33)",
    },
    {
      id: 3,
      name: "KALPANA GRANITES",
      phone: "9988776655",
      address: "Plot 221, Granite Park, Hyderabad",
      gst: "36AAACK7890L1Z3",
      email: "kalpanagranites@gmail.com",
      logo: kgLogo,
      bgColor: "rgba(72, 33, 33, 0.33)",
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [newCompanyphoneNo, setNewCompanyPhoneNo] = useState("");
  const [newCompanyGST, setNewCompanyGST] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyLogo, setNewCompanyLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, [setIsHideSidebarAndHeader]);

  const handleNext = () => {
    if (selectedCompany) {
      const selectedCompanyData = companies.find(
        (company) => company.id === selectedCompany
      );
      localStorage.setItem(
        "selectedCompany",
        JSON.stringify(selectedCompanyData)
      );
      window.location.href = "/supply-tenders";
    }
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (newCompanyName && newCompanyLogo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCompany = {
          id: companies.length + 1,
          name: newCompanyName,
          phone: newCompanyphoneNo,
          address: newCompanyAddress,
          gst: newCompanyGST,
          email: newCompanyEmail,
          logo: reader.result,
          bgColor: "rgba(72, 33, 33, 0.33)",
        };
        setCompanies((prev) => [...prev, newCompany]);
        setNewCompanyName("");
        setNewCompanyPhoneNo("");
        setNewCompanyAddress("");
        setNewCompanyGST("");
        setNewCompanyEmail("");
        setNewCompanyLogo(null);
        setPreviewLogo(null);
        setShowModal(false);
      };
      reader.readAsDataURL(newCompanyLogo);
    }
  };

  {
    /*// Add this function inside your component
  const handleDeleteCompany = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setCompanies((prev) => prev.filter((company) => company.id !== id));

      // If the deleted company was selected, reset selection
      if (selectedCompany === id) {
        setSelectedCompany(null);
      }
    }
  };*/
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Side */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-4">
          <h4 className="fw-bold mb-4 text-center">
            INFORMATION OF COMPANY TENDERS
          </h4>

          <div
            className="w-100 d-flex flex-column gap-3"
            style={{
              maxHeight: "360px",
              overflowY: companies.length > 3 ? "auto" : "unset",
              scrollBehavior: "smooth",
              padding: "10px",
            }}
          >
            {companies.map((company) => (
              <div
                key={company.id}
                className="d-flex justify-content-between align-items-center px-4 py-3 rounded w-100"
                style={{
                  backgroundColor:
                    selectedCompany === company.id
                      ? "rgba(61, 176, 30, 0.51)"
                      : company.bgColor,
                  boxShadow:
                    selectedCompany === company.id
                      ? "0 4px 15px rgba(0, 0, 0, 0.3)"
                      : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  outline:
                    selectedCompany === company.id
                      ? "3px solid #0d6efd"
                      : "none",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                {/* Select company on click */}
                <div
                  className="d-flex align-items-center justify-content-between gap-3 flex-grow-1"
                  onClick={() => setSelectedCompany(company.id)}
                >
                  <span className="fw-bold">{company.name}</span>
                  <img
                    src={company.logo}
                    alt="logo"
                    style={{ width: 130, height: 80 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex flex-column gap-3 mt-5 w-100 align-items-center">
            {/* Add / Next */}
            <div className="d-flex gap-3">
              <button
                className="btn btn-secondary px-5 py-2 rounded-pill"
                onClick={() => setShowModal(true)}
              >
                ADD
              </button>
              <button
                className="btn btn-primary px-5 py-2 rounded-pill"
                disabled={!selectedCompany}
                onClick={handleNext}
              >
                NEXT
              </button>
            </div>

            {/* 🌟 MIS Reports Button */}
            <button
              className="btn px-4 py-3 mt-4"
              style={{
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "30px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onClick={() => navigate("/mis-reports")}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <AssessmentIcon />
              Go to MIS Reports
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div
          className="col-md-6 d-none d-md-block p-0 position-relative"
          style={{
            backgroundImage: `url(${transformer3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <img
            src={companyLogo}
            alt="App Logo"
            className="position-absolute top-0 end-0 m-3"
            style={{ width: "200px", height: "auto" }}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Company</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddCompany}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company Phone No</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="10"
                      className="form-control"
                      required
                      value={newCompanyphoneNo}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        setNewCompanyPhoneNo(numericValue.slice(0, 10)); // Limit to 10 digits
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company Address</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newCompanyAddress}
                      onChange={(e) => setNewCompanyAddress(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company GST</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newCompanyGST}
                      onChange={(e) => setNewCompanyGST(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company Email</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={newCompanyEmail}
                      onChange={(e) => setNewCompanyEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company Logo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        setNewCompanyLogo(e.target.files[0]);
                        setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </div>
                  {previewLogo && (
                    <div className="text-center">
                      <img
                        src={previewLogo}
                        alt="Preview"
                        style={{ width: 150, height: 100 }}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Add Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
