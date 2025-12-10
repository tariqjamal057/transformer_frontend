import { useContext, useEffect, useRef, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { FaFileDownload, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfTemplate from "../../components/PdfTemplate";
import { createRoot } from "react-dom/client"; // Add this at the top
import DeliveryChalanModal from "../../components/DeliveryChalanModal";

const DeliveryDetailsList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedDeliveryChalan, setSelectedDeliveryChalan] = useState(null);

  // Dummy Data
  const dummyData = [
    {
      id: "1",
      deliveryChalanData: {
        id: "101",
        trData: {
          id: "2",
          tnId: { id: "1", name: "TN-001" },
          serialNumber: "1001 TO 2000",
          diNo: "DI-001",
          diDate: "2025-07-15",
          inspectionOfficers: [
            { name: "A. Kumar", designation: "Sr. Engineer" },
            { name: "P. Verma", designation: "Inspector" },
          ],
          inspectionDate: "2025-07-18",
          totalQuantity: 100,
          suppliedQuantity: 85,
          gpExpiryDate: "2026-07-24",
        },
        poNumber: "PO-5454",
        poDate: "2025-08-21",
        challanNo: "CH-1001",
        challanDate: "2025-07-22",
        consignorName: "PowerTech Transformers Pvt. Ltd.",
        consignorPhone: "9876543210",
        consignorAddress: "Plot 12, Industrial Zone, Mumbai",
        consignorGST: "27AAACP1234F1Z5",
        consigneeName: "State Electricity Board",
        consigneeAddress: "Substation Road, Pune",
        consigneeGST: "27SEB0001F2Z3",
        lorryNo: "MH12AB1234",
        truckDriverName: "Ramesh Yadav",
        deliveryChallanDescription:
          "Delivery of 3-phase oil-cooled transformer",
        materialDescription:
          "500 KVA 11/0.433 kV Distribution Transformer, Copper Wound, BIS Certified",
      },
      receiptedChallanNo: "CH-10032",
      receiptedChallanDate: "2025-07-26",
    },
    {
      id: "2",
      deliveryChalanData: {
        id: "102",
        trData: {
          id: "3",
          tnId: { id: "1", name: "TN-001" },
          serialNumber: "2001 TO 3000",
          diNo: "DI-002",
          diDate: "2025-07-16",
          inspectionOfficers: [
            { name: "R. Singh", designation: "Chief Inspector" },
            { name: "S. Mehra", designation: "Engineer" },
          ],
          inspectionDate: "2025-07-22",
          totalQuantity: 200,
          suppliedQuantity: 170,
          gpExpiryDate: "2026-08-12",
        },
        poNumber: "PO-5499",
        poDate: "2025-08-24",
        challanNo: "CH-1002",
        challanDate: "2025-07-28",
        consignorName: "MegaVolt Transformers Ltd.",
        consignorPhone: "9123456780",
        consignorAddress: "Sector 45, Electronic City, Bengaluru",
        consignorGST: "29MEGA1234G1Z9",
        consigneeName: "Northern Grid Corporation",
        consigneeAddress: "Grid Office, Delhi",
        consigneeGST: "07NGC0001F5Z6",
        lorryNo: "KA01CD5678",
        truckDriverName: "Sandeep Kumar",
        deliveryChallanDescription:
          "Delivery of transformer with testing certificates",
        materialDescription:
          "250 KVA 33/0.433 kV Distribution Transformer, Aluminum Wound, Outdoor Type",
      },
      receiptedChallanNo: "CH-20012",
      receiptedChallanDate: "2025-06-17",
    },
  ];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(100);
  }, []);

  const handleEditClick = (item) => {
    setSelectedDeliveryChalan(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedDeliveryChalan(null);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this delivery details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      Swal.fire(
        "Deleted!",
        "Delivery Details has been deleted successfully.",
        "success"
      );
    }
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Delivery Details Of Transformers List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-deliveryDetails"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add New Delivery Detail
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>TN Number</th>
                  <th>Serial No</th>
                  <th>PO Number / Date</th>
                  <th>Challan No</th>
                  <th>Challan Date</th>
                  <th>Receipted Challan No</th>
                  <th>Receipted Challan Date</th>
                  <th>Total Qty.</th>
                  <th>G.P. Expiry Date</th>
                  <th>Transformer Info</th>
                  <th>Inspection Officers</th>
                  <th>Inspection Date</th>
                  <th>Consignor Details</th>
                  <th>Consignee Details</th>
                  <th>Material Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => {
                    const dc = item.deliveryChalanData;
                    return (
                      <tr key={item.id}>
                        <td># {index + 1}</td>

                        <td>{dc.trData.tnId.name}</td>

                        <td>{dc.trData.serialNumber}</td>

                        {/* PO Number / Date */}
                        <td>
                          <div className="fw-semibold">{dc.poNumber}</div>
                          <div className="text-muted small">{dc.poDate}</div>
                        </td>

                        {/* Challan No */}
                        <td>{dc.challanNo}</td>

                        {/* Challan Date */}
                        <td>{dc.challanDate}</td>

                        {/* Receipted Challan No */}
                        <td>{item.receiptedChallanNo}</td>

                        {/* Receipted Challan Date */}
                        <td>{item.receiptedChallanDate}</td>

                        {/* Total Qty. */}
                        <td>{dc.trData.totalQuantity}</td>

                        {/* G.P. Expiry Date */}
                        <td>{dc.trData.gpExpiryDate}</td>

                        {/* Transformer Info */}
                        <td className="text-start">
                          <div>
                            <strong>TN:</strong> {dc.trData?.tnId?.name}
                          </div>
                          <div>
                            <strong>Serial No:</strong>{" "}
                            {dc.trData?.serialNumber}
                          </div>
                          <div>
                            <strong>DI No:</strong> {dc.trData?.diNo}
                          </div>
                          <div>
                            <strong>DI Date:</strong> {dc.trData?.diDate}
                          </div>
                        </td>

                        {/* Inspection Officers */}
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {dc.trData.inspectionOfficers.map(
                              (officer, idx) => (
                                <span
                                  key={`${item.id}-${idx}`}
                                  className="badge bg-info text-white px-2 py-1"
                                  style={{
                                    fontSize: "0.75rem",
                                    borderRadius: "10px",
                                  }}
                                >
                                  {officer.name} ({officer.designation})
                                </span>
                              )
                            )}
                          </div>
                        </td>

                        {/* Inspection Date */}
                        <td>{dc.trData.inspectionDate}</td>

                        {/* Consignor Details */}
                        <td className="text-start">
                          <div>
                            <strong>Name:</strong> {dc.consignorName}
                          </div>
                          <div>
                            <strong>Phone:</strong> {dc.consignorPhone}
                          </div>
                          <div>
                            <strong>Address:</strong> {dc.consignorAddress}
                          </div>
                          <div>
                            <strong>GST:</strong> {dc.consignorGST}
                          </div>
                        </td>

                        {/* Consignee Details */}
                        <td className="text-start">
                          <div>
                            <strong>Name:</strong> {dc.consigneeName}
                          </div>
                          <div>
                            <strong>Address:</strong> {dc.consigneeAddress}
                          </div>
                          <div>
                            <strong>GST:</strong> {dc.consigneeGST}
                          </div>
                        </td>

                        {/* Material Description */}
                        <td className="text-start">
                          <div>{dc.materialDescription}</div>
                          <div className="text-muted small">
                            {dc.deliveryChallanDescription}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            {/*<button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>*/}
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item.id);
                              }}
                            >
                              <MdDelete />
                            </button>
                            
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="17" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDetailsList;
