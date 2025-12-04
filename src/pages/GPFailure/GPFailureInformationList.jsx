import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { addMonths, format, isAfter } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import GPFailureInformationModal from "../../components/GPFailureInformationModal";

const GPFailureInformationList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPFailure, setSelectedGPFailure] = useState(null);

  // Dummy Data
  const dummyGPFailureData = [
    {
      id: "1",
      trfSiNo: 4907,
      rating: "100",
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
            rating: "100 KVA",
            wound: "Aluminium",
            phase: "100 KVA",
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
    {
      id: "2",
      trfSiNo: 4909,
      rating: "150",
      trfFailureList: [
        {
          place: "Hyderabad",
          failureDate: "2025-07-18",
          informationDate: "2025-07-04",
        },
        {
          place: "pune",
          failureDate: "2025-07-20",
          informationDate: "2025-07-10",
        },
      ],
      deliveryChalanDetails: {
        id: "4",
        finalInspectionDetail: {
          id: "4",
          deliverySchedule: {
            tnNumber: "TN-004",
            poDetails: "PO-99887",
            poDate: "2025-06-20",
            rating: "150 KVA",
            wound: "Aluminium",
            phase: "150 KVA",
            guaranteePeriodMonths: 30,
            description:
              "Challan for supply of oil immersed potential transformers designed for metering and protection.",
          },
          offeredDate: "2025-08-03",
          offeredQuantity: 120,
          serialNumberFrom: 4907,
          serialNumberTo: 4911,
          snNumber: "4907 TO 4911",
          nominationLetterNo: "NL/2025/004",
          nominationDate: "2025-08-01",
          inspectionOfficers: ["Anita Das", "Rahul Mehta"],
          inspectionDate: "2025-08-06",
          inspectedQuantity: 60,
          total: 65,
          diNo: "DI/2025/1004",
          diDate: "2025-08-08",
          shealingDetails: [
            { trfsiNo: 4907, polySealNo: "IAJ 5401 To IAJ 5402" },
            { trfsiNo: 4908, polySealNo: "IAJ 5403 To IAJ 5404" },
            { trfsiNo: 4909, polySealNo: "IAJ 5405 To IAJ 5406" },
            { trfsiNo: 4910, polySealNo: "IAJ 5407 To IAJ 5408" },
            { trfsiNo: 4911, polySealNo: "IAJ 5409 To IAJ 5410" },
          ],
        },
        subSerialNumberFrom: 4907,
        subSerialNumberTo: 4910,
        challanNo: "CH-1004",
        createdAt: "2025-08-09",
        consignorName: "PrimeVolt Pvt. Ltd.",
        consignorPhone: "9988776655",
        consignorAddress: "Plot 88, Electronic City, Bengaluru",
        consignorGST: "29PRIM1234H7Z0",
        consignorEmail: "info@primevolt.com",
        consigneeDetails: {
          id: "5",
          name: "Southern Discom Ltd.",
          address: "Electric House, Mount Road, Chennai - 600002",
          gstNo: "33SDIS2345N8B7",
        },
        lorryNo: "KA05GH4567",
        truckDriverName: "Suresh Reddy",
        materialDescription: {
          materialName: "11 kV Potential Transformer (PT)",
          description:
            "11 kV oil immersed outdoor PT, Class 0.5 accuracy, designed for protection and metering applications.",
        },
      },
    },
    {
      id: "3",
      trfSiNo: 9003,
      rating: "250",
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
        id: "5",
        finalInspectionDetail: {
          id: "5",
          deliverySchedule: {
            tnNumber: "TN-005",
            poDetails: "PO-11122",
            poDate: "2025-07-01",
            rating: "150 Amp",
            wound: "Copper",
            phase: "150 Amp",
            guaranteePeriodMonths: 24,
            description:
              "Challan for supply of resin cast current transformers suitable for medium voltage switchgear.",
          },
          offeredDate: "2025-08-12",
          offeredQuantity: 300,
          serialNumberFrom: 9001,
          serialNumberTo: 9004,
          snNumber: "9001 TO 9004",
          nominationLetterNo: "NL/2025/005",
          nominationDate: "2025-08-10",
          inspectionOfficers: ["Vikram Joshi", "Pooja Thakur"],
          inspectionDate: "2025-08-14",
          inspectedQuantity: 150,
          total: 155,
          diNo: "DI/2025/1005",
          diDate: "2025-08-16",
          shealingDetails: [
            { trfsiNo: 9001, polySealNo: "IAJ 5335 To IAJ 5336" },
            { trfsiNo: 9002, polySealNo: "IAJ 5337 To IAJ 5338" },
            { trfsiNo: 9003, polySealNo: "IAJ 5339 To IAJ 5340" },
            { trfsiNo: 9004, polySealNo: "IAJ 5341 To IAJ 5342" },
          ],
        },
        subSerialNumberFrom: 9001,
        subSerialNumberTo: 9003,
        challanNo: "CH-1005",
        createdAt: "2025-08-18",
        consignorName: "VoltSafe Industries",
        consignorPhone: "9090909090",
        consignorAddress: "MIDC Industrial Estate, Nagpur",
        consignorGST: "27VSIN1234P9K8",
        consignorEmail: "support@voltsafe.com",
        consigneeDetails: {
          id: "6",
          name: "Western Power Supply Ltd.",
          address: "Shivaji Nagar, Pune - 411005",
          gstNo: "27WPSL5678Q1R2",
        },
        lorryNo: "MH20JK7890",
        truckDriverName: "Naresh Pawar",
        materialDescription: {
          materialName: "150 Amp Resin Cast Current Transformer",
          description:
            "150 Amp, 11 kV resin cast CT, Class 1 accuracy, 5P10 protection class, used in medium voltage panels.",
        },
      },
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGPFailures, setFilteredGPFailures] =
    useState(dummyGPFailureData);

  useEffect(() => {
    const results = dummyGPFailureData.filter((item) => {
      const query = searchQuery.toLowerCase();

      // 🔹 Match trfSiNo (numeric → string)
      const trfSiNoMatch = item.trfSiNo
        ? item.trfSiNo.toString().toLowerCase().includes(query)
        : false;

      const tnMatch =
        item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.tnNumber
          ?.toLowerCase()
          .includes(query);

      const ratingMatch = item.rating?.toLowerCase().includes(query);

      const poMatch =
        item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.poDetails
          ?.toLowerCase()
          .includes(query);

      const poDateMatch =
        item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.poDate
          ?.toLowerCase()
          .includes(query);

      const challanNoMatch = item.deliveryChalanDetails?.challanNo
        ?.toLowerCase()
        .includes(query);

      const challanDateMatch = item.deliveryChalanDetails?.createdAt
        ?.toLowerCase()
        .includes(query);

      const consigneeMatch = item.deliveryChalanDetails?.consigneeDetails?.name
        ?.toLowerCase()
        .includes(query);

      const materialMatch =
        item.deliveryChalanDetails?.materialDescription?.materialName
          ?.toLowerCase()
          .includes(query);

      return (
        trfSiNoMatch ||
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

    setFilteredGPFailures(results);
  }, [searchQuery]);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(100);
  }, []);

  const handleEditClick = (item) => {
    setSelectedGPFailure(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedGPFailure(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">G.P. Failure Information List</h5>

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
            <Link to={"/add-GPFailureInformation"}>
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
                  <th>Sr No</th>
                  <th>TRF SI No</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Material Name</th>
                  <th>TN No</th>
                  <th>DI No / Date</th>
                  <th>Challan No / Date</th>
                  <th>Consignee Details</th>
                  <th>TRF Failure List</th>
                  <th>Guarantee Period</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {filteredGPFailures.length > 0 ? (
                  filteredGPFailures.map((item, index) => {
                    const challanDate = new Date(
                      item.deliveryChalanDetails.createdAt
                    );
                    const guaranteeMonths =
                      item.deliveryChalanDetails.finalInspectionDetail
                        .deliverySchedule.guaranteePeriodMonths;

                    // Calculate expiry date
                    const expiryDate = addMonths(challanDate, guaranteeMonths);

                    // Guarantee status
                    const today = new Date();
                    const isUnderGuarantee = isAfter(expiryDate, today);

                    return (
                      <tr key={item.id}>
                        {/* Sr No */}
                        <td># {index + 1}</td>

                        {/* TRF SI No */}
                        <td>{item.trfSiNo}</td>

                        {/* Rating */}
                        <td>{item.rating}</td>

                        <td>{item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.wound}</td>

                        <td>{item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.phase}</td>

                        {/* Material Name */}
                        <td>
                          {
                            item.deliveryChalanDetails.materialDescription
                              .materialName
                          }
                        </td>

                        {/* TN No */}
                        <td>
                          {
                            item.deliveryChalanDetails.finalInspectionDetail
                              .deliverySchedule.tnNumber
                          }
                        </td>

                        {/* DI No / Date */}
                        <td>
                          <div>
                            {
                              item.deliveryChalanDetails.finalInspectionDetail
                                .diNo
                            }
                          </div>
                          <div className="text-muted small">
                            {
                              item.deliveryChalanDetails.finalInspectionDetail
                                .diDate
                            }
                          </div>
                        </td>

                        {/* Challan No / Date */}
                        <td>
                          <div>{item.deliveryChalanDetails.challanNo}</div>
                          <div className="text-muted small">
                            {item.deliveryChalanDetails.createdAt}
                          </div>
                        </td>

                        {/* Consignee Details */}
                        <td className="text-start">
                          <div>
                            <strong>Name:</strong>{" "}
                            {item.deliveryChalanDetails.consigneeDetails.name}
                          </div>
                          <div>
                            <strong>Address:</strong>{" "}
                            {
                              item.deliveryChalanDetails.consigneeDetails
                                .address
                            }
                          </div>
                          <div>
                            <strong>GST:</strong>{" "}
                            {item.deliveryChalanDetails.consigneeDetails.gstNo}
                          </div>
                        </td>

                        {/* TRF Failure List */}
                        <td className="text-start">
                          {item.trfFailureList.map((failure, idx) => (
                            <div key={idx} className="mb-1">
                              <strong>Place:</strong> {failure.place} <br />
                              <strong>Failure Date:</strong>{" "}
                              {failure.failureDate} <br />
                              <strong>Info Date:</strong>{" "}
                              {failure.informationDate}
                              <hr className="my-1" />
                            </div>
                          ))}
                        </td>

                        {/* Guarantee Period */}
                        <td>{guaranteeMonths} Months</td>

                        {/* Expiry Date */}
                        <td>{format(expiryDate, "yyyy-MM-dd")}</td>

                        {/* Guarantee Status */}
                        <td
                          style={{
                            color: isUnderGuarantee ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {isUnderGuarantee ? "Under Guarantee" : "Expired"}
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
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
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
        <GPFailureInformationModal
          open={openModal}
          handleClose={handleModalClose}
          gpFailureData={selectedGPFailure}
        />
      }
    </>
  );
};

export default GPFailureInformationList;
