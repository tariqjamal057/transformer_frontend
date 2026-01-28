import React, { useContext, useEffect, useState } from "react";
import companyLogo from "../assets/kalpana.jpg";
import transformer3 from "../assets/transformer3.jpg";
import { MyContext } from "../App";
import AssessmentIcon from "@mui/icons-material/Assessment"; // MIS report icon
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

const Companies = () => {
  const { setAlertBox, setIsHideSidebarAndHeader } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
    return () => {
      setIsHideSidebarAndHeader(false);
    };
  }, [setIsHideSidebarAndHeader]);

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => api.get("/companies").then((res) => res.data.data),
  });

  const [selectedCompany, setSelectedCompany] = useState(null); // Now tracks selected company ID
  const [editingCompany, setEditingCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [newCompanyphoneNo, setNewCompanyPhoneNo] = useState("");
  const [newCompanyGST, setNewCompanyGST] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyLogo, setNewCompanyLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  const handleNext = async () => {
    if (!selectedCompany) {
      setAlertBox({
        open: true,
        msg: "Please select a company first!",
        error: true,
      });
      return;
    }
    localStorage.setItem("companyId", selectedCompany);
    try {
      const response = await api.post("/auth/select-company", {
        companyId: selectedCompany,
      });
      navigate("/discom", {
        state: { supplyTenders: response.data.supplyTenders },
      });
    } catch (error) {
      setAlertBox({
        open: true,
        msg: error.response?.data?.message || "An error occurred",
        error: true,
      });
    }
  };

  const addCompanyMutation = useMutation({
    mutationFn: (newCompany) => api.post("/companies", newCompany),
    onSuccess: () => {
      queryClient.invalidateQueries("companies");
      setShowModal(false);
      setAlertBox({
        open: true,
        msg: "Company added successfully!",
        error: false,
      });
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.response?.data?.message || "An error occurred",
        error: true,
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/companies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries("companies");
      setShowModal(false);
      setAlertBox({
        open: true,
        msg: "Company updated successfully!",
        error: false,
      });
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.response?.data?.message || "An error occurred",
        error: true,
      });
    },
  });

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCompanyName);
    formData.append("address", newCompanyAddress);
    formData.append("phone", newCompanyphoneNo);
    formData.append("gstNo", newCompanyGST);
    formData.append("email", newCompanyEmail);
    if (newCompanyLogo) {
      formData.append("logo", newCompanyLogo);
    }

    if (editingCompany) {
      updateCompanyMutation.mutate({ id: editingCompany.id, data: formData });
    } else {
      addCompanyMutation.mutate(formData);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setNewCompanyName(company.name);
    setNewCompanyAddress(company.address);
    setNewCompanyPhoneNo(company.phone);
    setNewCompanyGST(company.gstNo);
    setNewCompanyEmail(company.email);
    setNewCompanyLogo(
      company.logo
        ? `${import.meta.env.VITE_IMAGE_BASE_URL}${company.logo.replace(/\\/g, "/")}`
        : null,
    );
    setPreviewLogo(
      company.logo
        ? `${import.meta.env.VITE_IMAGE_BASE_URL}${company.logo.replace(/\\/g, "/")}`
        : null,
    );
    setShowModal(true);
  };

  const { mutate: deleteCompany } = useMutation({
    mutationFn: (id) => api.delete(`/companies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries("companies");
      setAlertBox({
        open: true,
        msg: "Company deleted successfully!",
        error: false,
      });
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.response?.data?.message || "An error occurred",
        error: true,
      });
    },
  });

  const openAddModal = () => {
    setEditingCompany(null);
    setNewCompanyName("");
    setNewCompanyAddress("");
    setNewCompanyPhoneNo("");
    setNewCompanyGST("");
    setNewCompanyEmail("");
    setNewCompanyLogo(null);
    setPreviewLogo(null);
    setShowModal(true);
  };

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
              overflowY: companies?.length > 3 ? "auto" : "unset",
              scrollBehavior: "smooth",
              padding: "10px",
            }}
          >
            {isLoading ? (
              <p>Loading companies...</p>
            ) : (
              companies?.map((company) => (
                <div
                  key={company.id}
                  className="d-flex justify-content-between align-items-center px-4 py-3 rounded w-100"
                  style={{
                    backgroundColor:
                      selectedCompany === company.id
                        ? "rgba(61, 176, 30, 0.51)"
                        : "rgba(72, 33, 33, 0.33)",
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
                  onClick={() => setSelectedCompany(company.id)} // Select but don't navigate
                >
                  {/* Select company on click */}
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-grow-1">
                    <span className="fw-bold">{company.name}</span>
                    <img
                      src={
                        company.logo
                          ? `${import.meta.env.VITE_IMAGE_BASE_URL}${company.logo.replace(/\\/g, "/")}`
                          : companyLogo
                      }
                      alt="logo"
                      style={{ width: 130, height: 80 }}
                    />
                  </div>
                  <div style={{ marginLeft: 12 }}>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(company);
                      }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this company?"
                          )
                        ) {
                          deleteCompany(company.id);
                        }
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="d-flex flex-column gap-3 mt-5 w-100 align-items-center">
            {/* Add / Next */}
            <div className="d-flex gap-3">
              <button
                className="btn btn-secondary px-5 py-2 rounded-pill"
                onClick={openAddModal}
              >
                ADD
              </button>
              <button
                className="btn btn-primary px-5 py-2 rounded-pill"
                onClick={handleNext}
                disabled={!selectedCompany} // Disable if no company is selected
              >
                NEXT
              </button>
            </div>

            {/* 🌟 MIS Reports Button */}
            {/* <button
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
            </button> */}
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
                <h5 className="modal-title">
                  {editingCompany ? "Edit Company" : "Add New Company"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCompanySubmit}>
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
                      className="form-control"
                      required
                      value={newCompanyphoneNo}
                      onChange={(e) => {
                        const numericValue = e.target.value; // Remove non-numeric characters
                        setNewCompanyPhoneNo(numericValue); // Limit to 10 digits
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
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      addCompanyMutation.isLoading ||
                      updateCompanyMutation.isLoading
                    }
                  >
                    {addCompanyMutation.isLoading ||
                    updateCompanyMutation.isLoading
                      ? "Saving..."
                      : "Save Company"}
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
