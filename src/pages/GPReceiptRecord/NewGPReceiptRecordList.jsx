import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx"; // ✅ for Excel export
import GPReceiptModal from "../../components/GPReceiptModal";

// Dummy Data
  const dummyGPReceiptRecords = [
    {
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
      // Parts missing details
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
            phase: "100 KVA",
            wound: "Aluminium",
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
    {
      id: "2",
      accountReceiptNoteNo: "ARN-2025-002",
      accountReceiptNoteDate: "2025-08-15",
      sinNo: "SIN-5502",
      consigneeName: "Western Power Supply Ltd.",
      discomReceiptNoteNo: "DRN-9988",
      discomReceiptNoteDate: "2025-08-17",
      remarks: "Minor scratches found on radiator, otherwise acceptable.",
      trfsiNo: 9003,
      rating: "150",
      selectedChalan: "CH-1005",
      sealNoTimeOfGPReceived: "IAJ 5339 To IAJ 5340",
      consigneeTFRSerialNo: "TFR-9003",
      // Parts missing details
      oilLevel: "Slightly Low",
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
      radiator: "Scratched",
      fuse: "Provided",
      channel: "OK",
      core: "Good Condition",
      polySealNo: "IAJ 5339 To IAJ 5340",
      deliveryChalanDetails: {
        id: "5",
        finalInspectionDetail: {
          id: "5",
          deliverySchedule: {
            tnNumber: "TN-005",
            poDetails: "PO-11122",
            poDate: "2025-07-01",
            rating: "150",
            phase: "150 KVA",
            wound: "Copper",
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


const NewGPReceiptRecordList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPReceiptRecord, setSelectedGPReceiptRecord] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGPReceiptRecords, setFilteredGPReceiptRecords] = useState(
    dummyGPReceiptRecords
  );

  useEffect(() => {
    const results = dummyGPReceiptRecords.filter((item) => {
      const query = searchQuery.toLowerCase();

      const accountReceiptNoteNoMatch = item.accountReceiptNoteNo
        ?.toLowerCase()
        .includes(query);

      const accountReceiptNoteDateMatch = item.accountReceiptNoteDate
        ?.toLowerCase()
        .includes(query);

      const sinNoMatch = item.sinNo?.toLowerCase().includes(query);
      const consigneeNameMatch = item.consigneeName
        ?.toLowerCase()
        .includes(query);
      const discomReceiptNoteNoMatch = item.discomReceiptNoteNo
        ?.toLowerCase()
        .includes(query);
      const discomReceiptNoteDateMatch = item.discomReceiptNoteDate
        ?.toLowerCase()
        .includes(query);
      const trfSiNoMatch = item.trfsiNo
        ?.toString()
        .toLowerCase()
        .includes(query);

      return (
        accountReceiptNoteNoMatch ||
        accountReceiptNoteDateMatch ||
        sinNoMatch ||
        consigneeNameMatch ||
        discomReceiptNoteNoMatch ||
        discomReceiptNoteDateMatch ||
        trfSiNoMatch
      );
    });

    setFilteredGPReceiptRecords(results);
  }, [searchQuery]);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(100);
  }, []);

  const handleEditClick = (item) => {
    setSelectedGPReceiptRecord(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedGPReceiptRecord(null);
  };

  // ✅ Excel Export Function
  const handleExportExcel = () => {
    if (!filteredGPReceiptRecords || filteredGPReceiptRecords.length === 0) {
      setAlertBox({
        open: true,
        msg: "No data to export!",
        error: true,
      });
      return;
    }

    // Prepare data for Excel
    const excelData = filteredGPReceiptRecords.map((item, index) => ({
      "Sr No": index + 1,
      "Account Receipt Note No": item.accountReceiptNoteNo,
      "Account Receipt Note Date": item.accountReceiptNoteDate,
      "SIN No": item.sinNo,
      "Consignee Name": item.consigneeName,
      "Discom Receipt Note No": item.discomReceiptNoteNo,
      "Discom Receipt Note Date": item.discomReceiptNoteDate,
      "TRF SI No": item.trfsiNo,
      Rating: item.rating,
      Wound:
        item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule
          ?.wound || "",
      Phase:
        item.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule
          ?.phase || "",
      "Poly Seal No": item.polySealNo,
      "Consignee TFR Serial No": item.consigneeTFRSerialNo,
      "Seal No Time Of G.P. Received": item.sealNoTimeOfGPReceived,
      "Date Of Supply": item.deliveryChalanDetails?.createdAt,
      "Oil Level": item.oilLevel,
      "HV Bushing": item.hvBushing,
      "LV Bushing": item.lvBushing,
      Radiator: item.radiator,
      Core: item.core,
      Remarks: item.remarks,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GP Receipt Records");

    XLSX.writeFile(workbook, "GP_Receipt_Records.xlsx");

    setAlertBox({
      open: true,
      msg: "Excel exported successfully!",
      error: false,
    });
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Receipt Record List</h5>

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
            <Link to={"/add-newGPReceiptRecord"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>

            {/* ✅ Excel Export Button */}
            <Button
              variant="contained"
              color="success"
              className="ms-3"
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Account Receipt Note No / Date</th>
                  <th>SIN No</th>
                  <th>Consignee Name</th>
                  <th>Discom Receipt Note No / Date</th>
                  <th>TRF SI No</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Poly Seal No</th>
                  <th>Consignee TFR Serial No</th>
                  <th>Seal No Time Of G.P. Received</th>
                  <th>Date Of Supply</th>
                  <th>Parts Condition</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {filteredGPReceiptRecords.length > 0 ? (
                  filteredGPReceiptRecords.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>
                        <div>{item.accountReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {item.accountReceiptNoteDate}
                        </div>
                      </td>
                      <td>{item.sinNo}</td>
                      <td>{item.consigneeName}</td>
                      <td>
                        <div>{item.discomReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {item.discomReceiptNoteDate}
                        </div>
                      </td>
                      <td>{item.trfsiNo}</td>
                      <td>{item.rating}</td>
                      <td>
                        {
                          item.deliveryChalanDetails?.finalInspectionDetail
                            ?.deliverySchedule?.wound
                        }
                      </td>
                      <td>
                        {
                          item.deliveryChalanDetails?.finalInspectionDetail
                            ?.deliverySchedule?.phase
                        }
                      </td>
                      <td>{item.polySealNo}</td>
                      <td>{item.consigneeTFRSerialNo}</td>
                      <td>{item.sealNoTimeOfGPReceived}</td>
                      <td>{item.deliveryChalanDetails.createdAt}</td>
                      <td className="text-start small">
                        <div>
                          <strong>Oil Level:</strong> {item.oilLevel}
                        </div>
                        <div>
                          <strong>HV Bushing:</strong> {item.hvBushing}
                        </div>
                        <div>
                          <strong>LV Bushing:</strong> {item.lvBushing}
                        </div>
                        <div>
                          <strong>Radiator:</strong> {item.radiator}
                        </div>
                        <div>
                          <strong>Core:</strong> {item.core}
                        </div>
                      </td>
                      <td className="text-start">{item.remarks}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleEditClick(item)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16} className="text-center">
                      No GP Receipt Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <GPReceiptModal
          open={openModal}
          handleClose={handleModalClose}
          gpReceiptData={selectedGPReceiptRecord}
        />
      }
    </>
  );
};

export default NewGPReceiptRecordList;
