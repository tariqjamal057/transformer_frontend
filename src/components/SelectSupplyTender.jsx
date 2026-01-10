import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";

const SelectSupplyTender = () => {
  const { setAlertBox } = useContext(MyContext);
  const [supplyTenders, setSupplyTenders] = useState([]);
  const [selectedSupplyTender, setSelectedSupplyTender] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedSupplyTenders = localStorage.getItem("supplyTenders");
    if (storedSupplyTenders) {
      setSupplyTenders(JSON.parse(storedSupplyTenders));
    }
  }, []);

  const selectSupplyTenderMutation = useMutation({
    mutationFn: (supplyTenderId) => api.post("/auth/select-supply-tender", { supplyTenderId }),
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      setAlertBox({open: true, msg: "Supply Tender selected successfully!", error: false});
      navigate("/");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.response?.data?.message || "An error occurred", error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    selectSupplyTenderMutation.mutate(selectedSupplyTender);
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="w-50">
        <h2 className="fw-bold mb-3">Select a Supply Tender</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Supply Tender</label>
            <select
              className="form-select"
              value={selectedSupplyTender}
              onChange={(e) => setSelectedSupplyTender(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a supply tender
              </option>
              {supplyTenders.map((tender) => (
                <option key={tender.id} value={tender.id}>
                  {tender.tenderNo}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={selectSupplyTenderMutation.isLoading}
          >
            {selectSupplyTenderMutation.isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SelectSupplyTender;
