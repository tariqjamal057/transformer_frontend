import React, { useContext, useEffect, useState } from "react";
import companyLogo from "../assets/kalpana.jpg";
import transformer3 from "../assets/transformer3.jpg";
import { MyContext } from "../App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const SupplyTenders = () => {
  const { setAlertBox, setIsHideSidebarAndHeader } = useContext(MyContext);
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [supplytenders, setSupplyTenders] = useState([]);
  const [selectedSupplyTender, setSelectedSupplyTender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTenderName, setNewTenderName] = useState("");
  const [newTenderNo, setNewTenderNo] = useState("");
  const companyId = localStorage.getItem("companyId");

    useEffect(() => {
      setIsHideSidebarAndHeader(true);
      window.scrollTo(0, 0);
      return () => {
        setIsHideSidebarAndHeader(false);
      };
    }, [setIsHideSidebarAndHeader]);

  const { data: fetchedSupplyTenders, isLoading } = useQuery({
    queryKey: ["supplyTenders", companyId],
    queryFn: () =>
      api
        .get(`/supply-tenders?companyId=${companyId}`)
        .then((res) => res.data.data),
    enabled: !!companyId,
  });

  useEffect(() => {
    if (fetchedSupplyTenders) {
      setSupplyTenders(fetchedSupplyTenders);
    }
  }, [fetchedSupplyTenders]);


  const addTenderMutation = useMutation({
    mutationFn: (newTender) => api.post("/supply-tenders", newTender),
    onSuccess: () => {
      queryClient.invalidateQueries(["supplyTenders", companyId]);
      setShowModal(false);
      setNewTenderName("");
      setNewTenderNo("");
      setAlertBox({open: true, msg: "Supply Tender added successfully!", error: false});
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.response?.data?.message || "An error occurred", error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTenderMutation.mutate({ name: newTenderName, tenderNo: newTenderNo, companyId, tenderDate: new Date() });
  };

  const { mutate: deleteTender } = useMutation({
    mutationFn: (id) => api.delete(`/supply-tenders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["supplyTenders", companyId]);
      setAlertBox({open: true, msg: "Supply Tender deleted successfully!", error: false});
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.response?.data?.message || "An error occurred", error: true});
    },
  });

  const handleNext = async () => {
    if (!selectedSupplyTender) {
      setAlertBox({open: true, msg: "Please select a Supply Tender first!", error: true});
      return;
    }
    try {
      const response = await api.post("/auth/select-supply-tender", { supplyTenderId: selectedSupplyTender });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("selectedSupplyTenderId", selectedSupplyTender);
      navigate("/");
    } catch (error) {
      setAlertBox({open: true, msg: error.response?.data?.message || "An error occurred", error: true});
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left Side */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-4">
          <h4 className="fw-bold mb-4 text-center">
            INFORMATION OF SUPPLY TENDERS
          </h4>

          <div
            className="w-100 d-flex flex-column gap-3"
            style={{
              maxHeight: "360px",
              overflowY: supplytenders?.length > 3 ? "auto" : "unset",
              scrollBehavior: "smooth",
              padding: "10px",
            }}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              supplytenders?.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center px-4 py-3 rounded w-100"
                  style={{
                    backgroundColor:
                      selectedSupplyTender === item.id
                        ? "rgba(61, 176, 30, 0.51)"
                        : "rgba(72, 33, 33, 0.33)",
                    boxShadow:
                      selectedSupplyTender === item.id
                        ? "0 4px 15px rgba(0, 0, 0, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.1)",
                    outline:
                      selectedSupplyTender === item.id
                        ? "3px solid #0d6efd"
                        : "none",
                    color: "black",
                    cursor: "pointer",
                    height: "120px",
                  }}
                  onClick={() => setSelectedSupplyTender(item.id)}
                >
                  {/* Clickable area to select tender */}
                  <div
                    className="flex-grow-1 d-flex justify-content-center fw-bold"
                  >
                    {item.name}
                  </div>
                  {/* <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTender(item.id);
                    }}
                  >
                    <MdDelete />
                  </button> */}
                </div>
              ))
            )}
          </div>

          <div className="d-flex gap-3 mt-5">
            <button
              className="btn btn-secondary px-5 py-2 rounded-pill"
              onClick={() => setShowModal(true)}
            >
              ADD
            </button>
            <button
                className="btn btn-primary px-5 py-2 rounded-pill"
                onClick={handleNext}
                disabled={!selectedSupplyTender} // Disable if no tender is selected
              >
                NEXT
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
                <h5 className="modal-title">Add New Supply Tender</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Supply Tender Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newTenderName}
                      onChange={(e) => setNewTenderName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Supply Tender Number</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newTenderNo}
                      onChange={(e) => setNewTenderNo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={addTenderMutation.isLoading}>
                    {addTenderMutation.isLoading ? 'Adding...' : 'Add Tender'}
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

export default SupplyTenders;
