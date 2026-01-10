import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";

const SelectCompany = () => {
  const { setAlertBox } = useContext(MyContext);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCompanies = localStorage.getItem("companies");
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    }
  }, []);

  const selectCompanyMutation = useMutation({
    mutationFn: (companyId) => api.post("/auth/select-company", { companyId }),
    onSuccess: (data) => {
      localStorage.setItem("supplyTenders", JSON.stringify(data.data.supplyTenders));
      setAlertBox({open: true, msg: "Company selected successfully!", error: false});
      navigate("/select-supply-tender");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.response?.data?.message || "An error occurred", error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    selectCompanyMutation.mutate(selectedCompany);
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="w-50">
        <h2 className="fw-bold mb-3">Select a Company</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Company</label>
            <select
              className="form-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a company
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={selectCompanyMutation.isLoading}
          >
            {selectCompanyMutation.isLoading ? "Loading..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SelectCompany;
