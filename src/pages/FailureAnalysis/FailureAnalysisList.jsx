import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import GPReceiptModal from "../../components/GPReceiptModal";
import FailureAnalysisModal from "../../components/FailureAnalysisModal";

const FailureAnalysisList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const today = new Date();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFailureAnalysis, setSelectedFailureAnalysis] = useState(null);

  // Dummy Data
  const dummyFailureAnalysis = [
    {
      id: "1",
      sinNo: "SIN-5501",
      acosName: "Mahir Rana",
      reasonOfFailure: "Transformer caught fire due to lightning",
      receiptData: {
        id: "1",
        accountReceiptNoteNo: "ARN-2025-001",
        accountReceiptNoteDate: "2025-08-10",
        sinNo: "SIN-5501",
        consigneeName: "ABC Power Supply Ltd.",
        discomReceiptNoteNo: "DRN-9987",
        discomReceiptNoteDate: "2025-08-12",
        remarks: "All items received in good condition.",
        trfsiNo: 4908,
        rating: "100",
        selectedChalan: "CH-1005",
        sealNoTimeOfGPReceived: "IAJ 5335 To IAJ 5336",
        consigneeTFRSerialNo: "TFR-9001",
        oilLevel: "OK",
        hvBushing: "Present",
        lvBushing: "Present",
        htMetalParts: "Complete",
        ltMetalParts: "Complete",
        mAndpBox: "Available",
        mAndpBoxCover: "Available",
        mccb: "Installed",
        icb: "Installed",
        copperFlexibleCable: "Available",
        alWire: "Available",
        conservator: "OK",
        radiator: "OK",
        fuse: "Provided",
        channel: "OK",
        core: "Good Condition",
        polySealNo: "IAJ 5301 To IAJ 5302",
        deliveryChalanDetails: {
          id: "1",
          finalInspectionDetail: {
            id: "1",
            deliverySchedule: {
              tnNumber: "TN-001",
              poDetails: "PO-12345",
              poDate: "2025-05-10",
              rating: "100",
              wound: "Copper",
              guaranteePeriodMonths: 1,
              description:
                "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
            },
            offeredDate: "2025-07-12",
            offeredQuantity: 200,
            serialNumberFrom: 4907,
            serialNumberTo: 4911,
            snNumber: "4907 TO 4911",
            nominationLetterNo: "NL/2025/001",
            nominationDate: "2025-07-10",
            inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
            inspectionDate: "2025-07-13",
            inspectedQuantity: 100,
            total: 120,
            diNo: "DI/2025/1001",
            diDate: "2025-07-16",
            shealingDetails: [
              { trfsiNo: 4907, polySealNo: "IAJ 5301 To IAJ 5302" },
              { trfsiNo: 4908, polySealNo: "IAJ 5303 To IAJ 5304" },
              { trfsiNo: 4909, polySealNo: "IAJ 5305 To IAJ 5306" },
              { trfsiNo: 4910, polySealNo: "IAJ 5307 To IAJ 5308" },
              { trfsiNo: 4911, polySealNo: "IAJ 5309 To IAJ 5310" },
            ],
          },
          subSerialNumberFrom: 4907,
          subSerialNumberTo: 4909,
          challanNo: "CH-1001",
          createdAt: "2025-06-22",
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
            phase: "100 KVA",
            description:
              "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
          },
        },
      },
      failureData: {
        id: "1",
        trfSiNo: 4908,
        rating: "100",
        subDivison: "Industrial Area",
        trfFailureList: [
          {
            place: "Kolkata",
            failureDate: "2025-08-18",
            informationDate: "2025-08-04",
          },
          {
            place: "Delhi",
            failureDate: "2025-08-20",
            informationDate: "2025-08-10",
          },
        ],
        deliveryChalanDetails: {
          id: "1",
          finalInspectionDetail: {
            id: "1",
            deliverySchedule: {
              tnNumber: "TN-001",
              poDetails: "PO-12345",
              poDate: "2025-05-10",
              rating: "100",
              wound: "Copper",
              guaranteePeriodMonths: 1,
              description:
                "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
            },
            offeredDate: "2025-07-12",
            offeredQuantity: 200,
            serialNumberFrom: 4907,
            serialNumberTo: 4911,
            snNumber: "4907 TO 4911",
            nominationLetterNo: "NL/2025/001",
            nominationDate: "2025-07-10",
            inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
            inspectionDate: "2025-07-13",
            inspectedQuantity: 100,
            total: 120,
            diNo: "DI/2025/1001",
            diDate: "2025-07-16",
            shealingDetails: [
              { trfsiNo: 4907, polySealNo: "IAJ 5301 To IAJ 5302" },
              { trfsiNo: 4908, polySealNo: "IAJ 5303 To IAJ 5304" },
              { trfsiNo: 4909, polySealNo: "IAJ 5305 To IAJ 5306" },
              { trfsiNo: 4910, polySealNo: "IAJ 5307 To IAJ 5308" },
              { trfsiNo: 4911, polySealNo: "IAJ 5309 To IAJ 5310" },
            ],
          },
          subSerialNumberFrom: 4907,
          subSerialNumberTo: 4909,
          challanNo: "CH-1001",
          createdAt: "2025-06-22",
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
            description:
              "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
          },
        },
      },
    },
    {
      id: "2",
      sinNo: "SIN-6601",
      acosName: "Suresh Patel",
      reasonOfFailure: "Oil leakage",
      receiptData: {
        id: "1",
        accountReceiptNoteNo: "ARN-2025-003",
        accountReceiptNoteDate: "2025-08-20",
        sinNo: "SIN-6601",
        consigneeName: "XYZ Energy Pvt. Ltd.",
        discomReceiptNoteNo: "DRN-9991",
        discomReceiptNoteDate: "2025-08-22",
        remarks: "Received with slight delay, all parts intact.",
        trfsiNo: 9101,
        rating: "200",
        selectedChalan: "CH-1010",
        sealNoTimeOfGPReceived: "IAJ 5345 To IAJ 5346",
        consigneeTFRSerialNo: "TFR-9101",
        oilLevel: "OK",
        hvBushing: "Present",
        lvBushing: "Present",
        htMetalParts: "Complete",
        ltMetalParts: "Complete",
        radiator: "Good",
        core: "Excellent",
        polySealNo: "IAJ 5345 To IAJ 5346",
        deliveryChalanDetails: {
          id: "10",
          finalInspectionDetail: {
            id: "10",
            deliverySchedule: {
              tnNumber: "TN-010",
              poDetails: "PO-22233",
              poDate: "2025-07-15",
              rating: "200",
              wound: "Copper",
              guaranteePeriodMonths: 18,
              description:
                "Challan for supply of 200 Amp PT suitable for high voltage applications.",
            },
            offeredDate: "2025-08-18",
            offeredQuantity: 100,
            serialNumberFrom: 9101,
            serialNumberTo: 9103,
            snNumber: "9101 TO 9103",
            nominationLetterNo: "NL/2025/010",
            nominationDate: "2025-08-16",
            inspectionOfficers: ["Alok Singh", "Preeti Sharma"],
            inspectionDate: "2025-08-19",
            inspectedQuantity: 80,
            total: 85,
            diNo: "DI/2025/1010",
            diDate: "2025-08-20",
            shealingDetails: [
              { trfsiNo: 9101, polySealNo: "IAJ 5345 To IAJ 5346" },
              { trfsiNo: 9102, polySealNo: "IAJ 5347 To IAJ 5348" },
              { trfsiNo: 9103, polySealNo: "IAJ 5349 To IAJ 5350" },
            ],
          },
          subSerialNumberFrom: 9101,
          subSerialNumberTo: 9103,
          challanNo: "CH-1010",
          createdAt: "2025-08-19",
          consignorName: "ElectroTech Ltd.",
          consignorPhone: "9123456789",
          consignorAddress: "Unit 5, TechPark, Pune",
          consignorGST: "27ELEC1234K9L7",
          consignorEmail: "contact@electrotech.com",
          consigneeDetails: {
            id: "3",
            name: "XYZ Energy Pvt. Ltd.",
            address: "Phase 2, Industrial Zone, Ahmedabad, Gujarat",
            gstNo: "24XYZE1234H7K8",
          },
          lorryNo: "GJ01MN4567",
          truckDriverName: "Amit Kumar",
          materialDescription: {
            materialName: "200 Amp Potential Transformer (PT)",
            phase: "11 KV",
            description:
              "200 Amp, 11 kV PT, epoxy cast, accuracy class 0.5, designed for high voltage substations.",
          },
        },
      },
      failureData: {
        id: "3",
        trfSiNo: 9101,
        rating: "200",
        subDivison: "Central Grid",
        trfFailureList: [
          {
            place: "Kerala",
            failureDate: "2025-06-18",
            informationDate: "2025-06-04",
          },
          {
            place: "Delhi",
            failureDate: "2025-06-20",
            informationDate: "2025-06-10",
          },
        ],
        deliveryChalanDetails: {
          id: "10",
          finalInspectionDetail: {
            id: "10",
            deliverySchedule: {
              tnNumber: "TN-010",
              poDetails: "PO-22233",
              poDate: "2025-07-15",
              rating: "200",
              wound: "Copper",
              guaranteePeriodMonths: 18,
              description:
                "Challan for supply of 200 Amp PT suitable for high voltage applications.",
            },
            offeredDate: "2025-08-18",
            offeredQuantity: 100,
            serialNumberFrom: 9101,
            serialNumberTo: 9103,
            snNumber: "9101 TO 9103",
            nominationLetterNo: "NL/2025/010",
            nominationDate: "2025-08-16",
            inspectionOfficers: ["Alok Singh", "Preeti Sharma"],
            inspectionDate: "2025-08-19",
            inspectedQuantity: 80,
            total: 85,
            diNo: "DI/2025/1010",
            diDate: "2025-08-20",
            shealingDetails: [
              { trfsiNo: 9101, polySealNo: "IAJ 5345 To IAJ 5346" },
              { trfsiNo: 9102, polySealNo: "IAJ 5347 To IAJ 5348" },
              { trfsiNo: 9103, polySealNo: "IAJ 5349 To IAJ 5350" },
            ],
          },
          subSerialNumberFrom: 9101,
          subSerialNumberTo: 9103,
          challanNo: "CH-1010",
          createdAt: "2025-08-19",
          consignorName: "ElectroTech Ltd.",
          consignorPhone: "9123456789",
          consignorAddress: "Unit 5, TechPark, Pune",
          consignorGST: "27ELEC1234K9L7",
          consignorEmail: "contact@electrotech.com",
          consigneeDetails: {
            id: "3",
            name: "XYZ Energy Pvt. Ltd.",
            address: "Phase 2, Industrial Zone, Ahmedabad, Gujarat",
            gstNo: "24XYZE1234H7K8",
          },
          lorryNo: "GJ01MN4567",
          truckDriverName: "Amit Kumar",
          materialDescription: {
            materialName: "200 Amp Potential Transformer (PT)",
            phase: "11 KV",
            description:
              "200 Amp, 11 kV PT, epoxy cast, accuracy class 0.5, designed for high voltage substations.",
          },
        },
      },
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFailureAnalysis, setFilteredFailureAnalysis] =
    useState(dummyFailureAnalysis);

  useEffect(() => {
    const results = dummyFailureAnalysis.filter((item) => {
      const query = searchQuery.toLowerCase();

      const sinNoMatch = item.sinNo?.toLowerCase().includes(query);

      const acosNameMatch = item.acosName?.toLowerCase().includes(query);

      const discomReceiptNoteNoMatch = item.receiptData?.discomReceiptNoteNo
        ?.toLowerCase()
        .includes(query);

      const discomReceiptNoteDateMatch = item.receiptData?.discomReceiptNoteDate
        ?.toLowerCase()
        .includes(query);

      const trfSiNoMatch = item.failureData?.trfSiNo
        ?.toString()
        .toLowerCase()
        .includes(query);

      const tnNumberMatch =
        item.receiptData?.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.tnNumber
          ?.toLowerCase()
          .includes(query);

      return (
        sinNoMatch ||
        acosNameMatch ||
        discomReceiptNoteNoMatch ||
        discomReceiptNoteDateMatch ||
        trfSiNoMatch ||
        tnNumberMatch
      );
    });

    setFilteredFailureAnalysis(results);
  }, [searchQuery]);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(100);
  }, []);

  const handleEditClick = (item) => {
    setSelectedFailureAnalysis(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedFailureAnalysis(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Failure Analysis List</h5>

          {/* Search Bar */}
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
            <Link to={"/add-FailureAnalysis"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sin No</th>
                  <th>Tfr. Sr. No</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Tn No.</th>
                  <th>Acos Name</th>
                  <th>Sub Division</th>
                  <th>Location Of Failure</th>
                  <th>Date Of Supply</th>
                  <th>Date Of Expiry</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {filteredFailureAnalysis.length > 0 ? (
                  filteredFailureAnalysis.map((item, index) => {
                    // extract required fields safely
                    const receipt = item.receiptData || {};
                    const failure = item.failureData || {};
                    const delivery =
                      receipt.deliveryChalanDetails?.finalInspectionDetail
                        ?.deliverySchedule || {};
                    const material =
                      receipt.deliveryChalanDetails?.materialDescription || {};

                    return (
                      <tr key={index}>
                        {/* Sin No */}
                        <td>{item.sinNo}</td>

                        {/* Tfr. Sr. No */}
                        <td>{receipt.trfsiNo || failure.trfSiNo}</td>

                        {/* Rating */}
                        <td>{receipt.rating || failure.rating}</td>

                        {/* Wound */}
                        <td>{delivery.wound}</td>

                        {/* Phase */}
                        <td>{material.phase || "N/A"}</td>

                        {/* Tn No */}
                        <td>{delivery.tnNumber}</td>

                        {/* Acos Name */}
                        <td>{item.acosName}</td>

                        {/* Sub Division */}
                        <td>{failure.subDivison}</td>

                        {/* Location of Failure → take first entry of array */}
                        <td>{failure.trfFailureList?.[0]?.place || "N/A"}</td>

                        {/* Date of Supply (informationDate from failureData[0]) */}
                        <td>
                          {format(
                            new Date(
                              failure.trfFailureList?.[0]?.informationDate
                            ),
                            "dd MMM yyyy"
                          ) || "N/A"}
                        </td>

                        {/* Date of Expiry (failureDate from failureData[0]) */}
                        <td>
                          {format(
                            new Date(failure.trfFailureList?.[0]?.failureDate),
                            "dd MMM yyyy"
                          ) || "N/A"}
                        </td>

                        {/* Action */}
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center">
                      No Failure Analysis Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <FailureAnalysisModal
          open={openModal}
          handleClose={handleModalClose}
          failureAnalysisData={selectedFailureAnalysis}
        />
      }
    </>
  );
};

export default FailureAnalysisList;
