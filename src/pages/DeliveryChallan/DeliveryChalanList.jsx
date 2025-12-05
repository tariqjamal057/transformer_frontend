import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { FaFileDownload, FaPencilAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfTemplate from "../../components/PdfTemplate";
import { createRoot } from "react-dom/client"; // Add this at the top
import SearchIcon from "@mui/icons-material/Search";
import DeliveryChalanModal from "../../components/DeliveryChalanModal";

const DeliveryChalanList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedDeliveryChalan, setSelectedDeliveryChalan] = useState(null);

  // Dummy Data
  const dummyDeliveryChalans = [
    {
      id: "1",
      finalInspectionDetail: {
        id: "1",
        deliverySchedule: {
          tnNumber: "TN-001",
          poDetails: "PO-12345",
          poDate: "2025-05-10",
          rating: "100",
          guaranteePeriodMonths: 24,
          description:
            "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
        },
        offeredDate: "2025-07-12",
        offeredQuantity: 200,
        serialNumberFrom: 120,
        serialNumberTo: 240,
        snNumber: "120 TO 240",
        nominationLetterNo: "NL/2025/001",
        nominationDate: "2025-07-10",
        inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
        inspectionDate: "2025-07-13",
        inspectedQuantity: 100,
        total: 120,
        diNo: "DI/2025/1001",
        diDate: "2025-07-16",
        shellingDetails: "Model X, Batch 3, 50 units per batch",
      },
      challanNo: "CH-1001",
      createdAt: "2025-07-22",
      subSerialNumberFrom: 120,
      subSerialNumberTo: 140,
      consignorName: "PowerTech Transformers Pvt. Ltd.",
      consignorPhone: "9876543210",
      consignorAddress: "Plot 12, Industrial Zone, Mumbai",
      consignorGST: "27AAACP1234F1Z5",
      consignorEmail: "powertech@gmail.com",
      consigneeDetails: {
        id: "2",
        name: "ABC Power Solutions Pvt. Ltd.",
        address:
          "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
        gstNo: "06ABCDE1234F1Z5",
      },
      lorryNo: "MH12AB1234",
      truckDriverName: "Ramesh Yadav",
      materialDescription: {
        materialName: "150 Amp Current Transformer (CT)",
        phase: "11 KV",
        description:
          "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
      },
    },
    {
      id: "2",
      finalInspectionDetail: {
        id: "2",
        deliverySchedule: {
          tnNumber: "TN-002",
          poDetails: "PO-22345",
          poDate: "2025-06-01",
          rating: "50",
          guaranteePeriodMonths: 18,
          description:
            "Delivery challan for 1000 kVA transformers including transport charges, handling, and on-site installation as per the approved purchase order and delivery schedule.",
        },
        offeredDate: "2025-08-05",
        offeredQuantity: 150,
        serialNumberFrom: 241,
        serialNumberTo: 390,
        snNumber: "241 TO 390",
        nominationLetterNo: "NL/2025/002",
        nominationDate: "2025-08-03",
        inspectionOfficers: ["Amit Verma", "Priya Singh"],
        inspectionDate: "2025-08-06",
        inspectedQuantity: 140,
        total: 150,
        diNo: "DI/2025/1002",
        diDate: "2025-08-08",
        shellingDetails: "Model Y, Batch 2, 30 units per batch",
      },
      challanNo: "CH-1002",
      createdAt: "2025-08-10",
      subSerialNumberFrom: 241,
      subSerialNumberTo: 260,
      consignorName: "MegaVolt Electricals Ltd.",
      consignorPhone: "9123456780",
      consignorAddress: "Industrial Plot 88, Pune MIDC, Maharashtra",
      consignorGST: "27MEGAE5678G1Z2",
      consignorEmail: "megavolt@gmail.com",
      consigneeDetails: {
        id: "3",
        name: "XYZ Transformers Ltd.",
        address: "B-12, MIDC Industrial Estate, Pune, Maharashtra - 411019",
        gstNo: "27XYZAB6789C1Z3",
      },
      lorryNo: "MH14XY5678",
      truckDriverName: "Suresh Patil",
      materialDescription: {
        materialName: "500 kVA Power Transformer",
        phase: "500 KVA",
        description:
          "500 kVA, 33/11 kV, 3-Phase transformer with OLTC, ONAN cooling, conservator and marshalling box for grid substation use.",
      },
    },
    {
      id: "3",
      finalInspectionDetail: {
        id: "3",
        deliverySchedule: {
          tnNumber: "TN-003",
          poDetails: "PO-32345",
          poDate: "2025-07-15",
          rating: "150",
          guaranteePeriodMonths: 12,
          description:
            "Material dispatch challan for 11kV outdoor vacuum circuit breakers, inclusive of installation accessories and detailed engineering drawings for commissioning.",
        },
        offeredDate: "2025-09-15",
        offeredQuantity: 180,
        serialNumberFrom: 391,
        serialNumberTo: 570,
        snNumber: "391 TO 570",
        nominationLetterNo: "NL/2025/003",
        nominationDate: "2025-09-12",
        inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
        inspectionDate: "2025-09-16",
        inspectedQuantity: 160,
        total: 180,
        diNo: "DI/2025/1003",
        diDate: "2025-09-18",
        shellingDetails: "Model Z, Batch 1, 60 units per batch",
      },
      challanNo: "CH-1003",
      createdAt: "2025-09-20",
      subSerialNumberFrom: 391,
      subSerialNumberTo: 410,
      consignorName: "ElectroTech Industries",
      consignorPhone: "9988776655",
      consignorAddress: "Shed No. 21, GIDC Estate, Ahmedabad",
      consignorGST: "24ETI7654H1Z5",
      consignorEmail: "electrotech@gmail.com",
      consigneeDetails: {
        id: "4",
        name: "GreenVolt Energy Systems",
        address:
          "123/4, Electronic City Phase 2, Bengaluru, Karnataka - 560100",
        gstNo: "29GVEPL2345D1Z7",
      },
      lorryNo: "GJ01ZX4321",
      truckDriverName: "Mahesh Kumar",
      materialDescription: {
        materialName: "200 kVA Copper Wound Distribution Transformer",
        phase: "200 KVA",
        description:
          "200 kVA, 11/0.433 kV, 3-Phase, ONAN cooled, energy efficient distribution transformer as per IS standards.",
      },
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

  // Instant PDF Generator
  const generatePDF = async (item) => {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.top = "-9999px";
    element.style.left = "-9999px";
    document.body.appendChild(element);

    // Create root and render the component
    const root = createRoot(element);
    root.render(
      <div style={{ width: "800px" }}>
        <PdfTemplate item={item} />
      </div>
    );

    // Wait for rendering to finish
    setTimeout(async () => {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Challan-${item.challanNo}.pdf`);

      root.unmount();
      document.body.removeChild(element);
    }, 300);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChallans, setFilteredChallans] =
    useState(dummyDeliveryChalans);

  useEffect(() => {
    const results = dummyDeliveryChalans.filter((item) => {
      const query = searchQuery.toLowerCase();

      const tnMatch = item.finalInspectionDetail?.deliverySchedule?.tnNumber
        ?.toLowerCase()
        .includes(query);

      const ratingMatch = item.finalInspectionDetail?.deliverySchedule?.rating
        ?.toString()
        .toLowerCase()
        .includes(query);

      const poMatch = item.finalInspectionDetail?.deliverySchedule?.poDetails
        ?.toLowerCase()
        .includes(query);

      const poDateMatch = item.finalInspectionDetail?.deliverySchedule?.poDate
        ?.toLowerCase()
        .includes(query);

      const challanNoMatch = item.challanNo?.toLowerCase().includes(query);

      const challanDateMatch = item.createdAt?.toLowerCase().includes(query);

      const consigneeMatch = item.consigneeDetails?.name
        ?.toLowerCase()
        .includes(query);

      const materialMatch = item.materialDescription?.materialName
        ?.toLowerCase()
        .includes(query);

      return (
        tnMatch ||
        ratingMatch ||
        poMatch ||
        poDateMatch ||
        challanNoMatch ||
        challanDateMatch ||
        consigneeMatch ||
        materialMatch
      );
    });

    setFilteredChallans(results);
  }, [searchQuery]);

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Delivery Challan List</h5>

          <TextField
            variant="outlined"
            placeholder="Search...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginLeft: "auto",
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#f0883d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f0883d",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#f0883d" }} />
                </InputAdornment>
              ),
            }}
          />

          <div className="d-flex align-items-center">
            <Link to={"/add-deliveryChalan"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Create New Delivery Challan
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
                  <th>PO Number / Date</th>
                  <th>Challan No</th>
                  <th>Transformer Info</th>
                  <th>Sub Serial No</th>
                  <th>Inspection Officers</th>
                  <th>Inspection Date</th>
                  <th>Consignor Details</th>
                  <th>Consignee Details</th>
                  <th>Material & Chalan Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {filteredChallans.length > 0 ? (
                  filteredChallans.map((item, index) => (
                    <tr key={item.id}>
                      {/* Sr No */}
                      <td># {index + 1}</td>

                      {/* PO Number / Date */}
                      <td>
                        <div className="fw-semibold">
                          {
                            item.finalInspectionDetail.deliverySchedule
                              .poDetails
                          }
                        </div>
                        <div className="text-muted small">
                          {item.finalInspectionDetail.deliverySchedule.poDate}
                        </div>
                      </td>

                      {/* Challan No */}
                      <td>{item.challanNo}</td>

                      {/* Transformer Info */}
                      <td className="text-start">
                        <div>
                          <strong>TN:</strong>{" "}
                          {item.finalInspectionDetail.deliverySchedule.tnNumber}
                        </div>
                        <div>
                          <strong>Serial No:</strong>{" "}
                          {item.finalInspectionDetail.snNumber}
                        </div>
                        <div>
                          <strong>DI No:</strong>{" "}
                          {item.finalInspectionDetail.diNo}
                        </div>
                        <div>
                          <strong>DI Date:</strong>{" "}
                          {item.finalInspectionDetail.diDate}
                        </div>
                      </td>

                      {/* Sub Serial No */}
                      <td>
                        {item.subSerialNumberFrom} TO {item.subSerialNumberTo}
                      </td>

                      {/* Inspection Officers */}
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {item.finalInspectionDetail.inspectionOfficers.map(
                            (officer, idx) => (
                              <span
                                key={`${item.id}-${idx}`}
                                className="badge bg-info text-white px-2 py-1"
                                style={{
                                  fontSize: "0.75rem",
                                  borderRadius: "10px",
                                }}
                              >
                                {officer}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      {/* Inspection Date */}
                      <td>{item.finalInspectionDetail.inspectionDate}</td>

                      {/* Consignor Details */}
                      <td className="text-start">
                        <div>
                          <strong>Name:</strong> {item.consignorName}
                        </div>
                        <div>
                          <strong>Phone:</strong> {item.consignorPhone}
                        </div>
                        <div>
                          <strong>Address:</strong> {item.consignorAddress}
                        </div>
                        <div>
                          <strong>GST:</strong> {item.consignorGST}
                        </div>
                      </td>

                      {/* Consignee Details */}
                      <td className="text-start">
                        <div>
                          <strong>Name:</strong> {item.consigneeDetails.name}
                        </div>
                        <div>
                          <strong>Address:</strong>{" "}
                          {item.consigneeDetails.address}
                        </div>
                        <div>
                          <strong>GST:</strong> {item.consigneeDetails.gstNo}
                        </div>
                      </td>

                      {/* Material & Challan Description */}
                      <td className="text-start">
                        <div>
                          {item.materialDescription.description
                            .split(" ")
                            .slice(0, 12)
                            .join(" ")}
                        </div>
                        <div className="text-muted small mt-1">
                          {item.finalInspectionDetail.deliverySchedule.description
                            .split(" ")
                            .slice(0, 10)
                            .join(" ")}
                          ...
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaPencilAlt />
                          </button>
                          <Tooltip title="Download pdf" placement="top">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => generatePDF(item)}
                            >
                              <FaFileDownload />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <DeliveryChalanModal
          open={openModal}
          handleClose={handleModalClose}
          deliveryChalanData={selectedDeliveryChalan}
        />
      }
    </>
  );
};

export default DeliveryChalanList;
