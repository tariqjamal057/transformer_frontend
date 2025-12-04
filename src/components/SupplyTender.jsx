import React, { useContext, useEffect, useState } from "react";
import companyLogo from "../assets/kalpana.jpg";
import kgLogo from "../assets/kg.jpg";
import ygLogo from "../assets/yg.jpg";
import transformer3 from "../assets/transformer3.jpg";
import { MyContext } from "../App";

const SupplyTenders = () => {
  const { setIsHideSidebarAndHeader, setAlertBox } = useContext(MyContext);

  const [supplytenders, setSupplyTenders] = useState([
    {
      id: 1,
      name: "AJMER DISCOM",
      bgColor: "rgba(72, 33, 33, 0.33)",
    },
    {
      id: 2,
      name: "JAIPUR DISCOM",
      bgColor: "rgba(72, 33, 33, 0.33)",
    },
    {
      id: 3,
      name: "JADHPUR DISCOM",
      bgColor: "rgba(72, 33, 33, 0.33)",
    },
  ]);

  const [selectedSupplyTender, setSelectedSupplyTender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTenderName, setNewTenderName] = useState("");

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, [setIsHideSidebarAndHeader]);

  const handleNext = () => {
    if (selectedSupplyTender) {
      const selectedSupplyTenderData = supplytenders.find(
        (item) => item.id === selectedSupplyTender
      );
      localStorage.setItem(
        "selectedSupplyTender",
        JSON.stringify(selectedSupplyTenderData)
      );
      window.location.href = "/tnNumber-list";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTenderName) {
      const newTender = {
        id: supplytenders.length + 1,
        name: newTenderName,
        bgColor: "rgba(72, 33, 33, 0.33)",
      };
      setSupplyTenders((prev) => [...prev, newTender]);
      setNewTenderName("");
      setShowModal(false);
    }
  };

  {/*const handleDeleteTender = (id) => {
    if (window.confirm("Are you sure you want to delete this supply tender?")) {
      setSupplyTenders((prev) => prev.filter((item) => item.id !== id));

      // If the deleted tender was selected, deselect it
      if (selectedSupplyTender === id) {
        setSelectedSupplyTender(null);
      }

      // Optional: show alert
      setAlertBox &&
        setAlertBox({
          open: true,
          error: false,
          msg: "Supply tender deleted successfully!",
        });
    }
  };*/}

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
              overflowY: supplytenders.length > 3 ? "auto" : "unset",
              scrollBehavior: "smooth",
              padding: "10px",
            }}
          >
            {supplytenders.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center px-4 py-3 rounded w-100"
                style={{
                  backgroundColor:
                    selectedSupplyTender === item.id
                      ? "rgba(61, 176, 30, 0.51)"
                      : item.bgColor,
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
              >
                {/* Clickable area to select tender */}
                <div
                  className="flex-grow-1 d-flex justify-content-center fw-bold"
                  onClick={() => setSelectedSupplyTender(item.id)}
                >
                  {item.name}
                </div>
              </div>
            ))}
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
              disabled={!selectedSupplyTender}
              onClick={handleNext}
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

export default SupplyTenders;
