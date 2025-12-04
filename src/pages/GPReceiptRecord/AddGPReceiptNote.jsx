import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MyContext } from "../../App";

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
  {
    id: "3",
    accountReceiptNoteNo: "ARN-2025-003",
    accountReceiptNoteDate: "2025-08-20",
    sinNo: "SIN-5503",
    consigneeName: "Southern Grid Corporation",
    discomReceiptNoteNo: "DRN-9989",
    discomReceiptNoteDate: "2025-08-22",
    remarks: "Received with missing fuse, replacement required.",
    trfsiNo: 7510,
    rating: "200",
    selectedChalan: "CH-1007",
    sealNoTimeOfGPReceived: "IAJ 5401 To IAJ 5402",
    consigneeTFRSerialNo: "TFR-7510",
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
    fuse: "Missing",
    channel: "OK",
    core: "Good Condition",
    polySealNo: "IAJ 5401 To IAJ 5402",
    deliveryChalanDetails: {
      id: "7",
      finalInspectionDetail: {
        id: "7",
        deliverySchedule: {
          tnNumber: "TN-007",
          poDetails: "PO-22233",
          poDate: "2025-07-15",
          rating: "200",
          guaranteePeriodMonths: 12,
          description:
            "Challan for supply of distribution transformers for grid upgrade project.",
        },
        offeredDate: "2025-08-18",
        offeredQuantity: 250,
        serialNumberFrom: 7509,
        serialNumberTo: 7512,
        snNumber: "7509 TO 7512",
        nominationLetterNo: "NL/2025/007",
        nominationDate: "2025-08-16",
        inspectionOfficers: ["Ajay Singh", "Meena Kapoor"],
        inspectionDate: "2025-08-19",
        inspectedQuantity: 200,
        total: 210,
        diNo: "DI/2025/1007",
        diDate: "2025-08-20",
        shealingDetails: [
          { trfsiNo: 7509, polySealNo: "IAJ 5401 To IAJ 5402" },
          { trfsiNo: 7510, polySealNo: "IAJ 5403 To IAJ 5404" },
          { trfsiNo: 7511, polySealNo: "IAJ 5405 To IAJ 5406" },
          { trfsiNo: 7512, polySealNo: "IAJ 5407 To IAJ 5408" },
        ],
      },
      subSerialNumberFrom: 7509,
      subSerialNumberTo: 7511,
      challanNo: "CH-1007",
      createdAt: "2025-08-19",
      consignorName: "Electra Transformers Ltd.",
      consignorPhone: "9812345678",
      consignorAddress: "Industrial Estate, Hyderabad",
      consignorGST: "36ELTP1234F1Z8",
      consignorEmail: "sales@electra.com",
      consigneeDetails: {
        id: "7",
        name: "Southern Grid Corporation",
        address: "Jubilee Hills, Hyderabad - 500033",
        gstNo: "36SGC9876Q1R3",
      },
      lorryNo: "TS09GH5678",
      truckDriverName: "Suresh Reddy",
      materialDescription: {
        materialName: "200 KVA Distribution Transformer",
        description:
          "200 KVA, 11/0.433 kV, Copper Wound, Oil Cooled Distribution Transformer with standard fittings.",
      },
    },
  },
  {
    id: "4",
    accountReceiptNoteNo: "ARN-2025-004",
    accountReceiptNoteDate: "2025-08-25",
    sinNo: "SIN-5504",
    consigneeName: "Western Power Supply Ltd.",
    discomReceiptNoteNo: "DRN-9990",
    discomReceiptNoteDate: "2025-08-27",
    remarks: "One radiator dented, acknowledged by driver.",
    trfsiNo: 8105,
    rating: "250",
    selectedChalan: "CH-1009",
    sealNoTimeOfGPReceived: "IAJ 5501 To IAJ 5502",
    consigneeTFRSerialNo: "TFR-8105",
    oilLevel: "OK",
    hvBushing: "Present",
    lvBushing: "Damaged",
    htMetalParts: "Complete",
    ltMetalParts: "Incomplete",
    mAndpBox: "Available",
    mAndpBoxCover: "Broken",
    mccb: "Installed",
    icb: "Installed",
    copperFlexibleCable: "Available",
    alWire: "Available",
    conservator: "OK",
    radiator: "Dented",
    fuse: "Provided",
    channel: "Bent",
    core: "Good Condition",
    polySealNo: "IAJ 5501 To IAJ 5502",
    deliveryChalanDetails: {
      id: "9",
      finalInspectionDetail: {
        id: "9",
        deliverySchedule: {
          tnNumber: "TN-009",
          poDetails: "PO-33344",
          poDate: "2025-07-20",
          rating: "250",
          guaranteePeriodMonths: 18,
          description:
            "Challan for supply of power transformers under urban electrification scheme.",
        },
        offeredDate: "2025-08-23",
        offeredQuantity: 180,
        serialNumberFrom: 8104,
        serialNumberTo: 8107,
        snNumber: "8104 TO 8107",
        nominationLetterNo: "NL/2025/009",
        nominationDate: "2025-08-21",
        inspectionOfficers: ["Rajesh Patel", "Anita Desai"],
        inspectionDate: "2025-08-24",
        inspectedQuantity: 170,
        total: 175,
        diNo: "DI/2025/1009",
        diDate: "2025-08-25",
        shealingDetails: [
          { trfsiNo: 8104, polySealNo: "IAJ 5501 To IAJ 5502" },
          { trfsiNo: 8105, polySealNo: "IAJ 5503 To IAJ 5504" },
          { trfsiNo: 8106, polySealNo: "IAJ 5505 To IAJ 5506" },
          { trfsiNo: 8107, polySealNo: "IAJ 5507 To IAJ 5508" },
        ],
      },
      subSerialNumberFrom: 8104,
      subSerialNumberTo: 8106,
      challanNo: "CH-1009",
      createdAt: "2025-08-24",
      consignorName: "TransPower India Ltd.",
      consignorPhone: "9823456789",
      consignorAddress: "Howrah Industrial Hub, West Bengal",
      consignorGST: "19TPIL1234F1Z2",
      consignorEmail: "info@transpower.com",
      consigneeDetails: {
        id: "6",
        name: "Western Power Supply Ltd.",
        address: "Shivaji Nagar, Pune - 411005",
        gstNo: "27WPSL5678Q1R2",
      },
      lorryNo: "WB20XY4321",
      truckDriverName: "Debasish Ghosh",
      materialDescription: {
        materialName: "250 KVA Power Transformer",
        description:
          "250 KVA, 33/11 kV, Outdoor Type Power Transformer with standard fittings and bushings.",
      },
    },
  },
];

const AddGPReceiptNote = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const [selectDateFrom, setSelectDateFrom] = useState(null);
  const [selectDateTo, setSelectDateTo] = useState(null);
  const [consigneeName, setConsigneeName] = useState("");
  const [accountReceiptNoteNo, setAccountReceiptNoteNo] = useState("");
  const [accountReceiptNoteDate, setAccountReceiptNoteDate] = useState(null);
  const [acos, setAcos] = useState("");

  const [discomReceiptNoteNo, setDiscomReceiptNoteNo] = useState("");
  const [discomReceiptNoteDate, setDiscomReceiptNoteDate] = useState(null);

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);

  // Whenever consigneeName changes, filter data and update ids
  useEffect(() => {
    if (consigneeName.trim() === "") {
      setFilteredRecords([]);
      setMatchedIds([]);
      return;
    }

    const matches = dummyGPReceiptRecords.filter((record) =>
      record.consigneeName.toLowerCase().includes(consigneeName.toLowerCase())
    );

    setFilteredRecords(matches);
    setMatchedIds(matches.map((rec) => rec.id));
  }, [consigneeName]);

  const handleSubmit = () => {
    if (matchedIds.length > 0) {
      console.log("Stored GP Receipt IDs:", matchedIds);
      alert(`Stored GP Receipt IDs: ${matchedIds.join(", ")}`);
    } else {
      alert("No matching record found for the entered Consignee Name.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Add New G.P. Receipt Note
          </Typography>

          {/* Input Section */}
          <Grid container spacing={2} columns={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
            <Grid item size={1}>
              <DatePicker
                label="Select Date From"
                value={selectDateFrom}
                onChange={(newValue) => setSelectDateFrom(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="Select Date To"
                value={selectDateTo}
                onChange={(newValue) => setSelectDateTo(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            {/* Consignee Name */}
            <Grid item size={2}>
              <TextField
                fullWidth
                label="Consignee Name"
                variant="outlined"
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
              />
            </Grid>

            {/* Account Receipt Note No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Account Receipt Note No"
                variant="outlined"
                value={accountReceiptNoteNo}
                onChange={(e) => setAccountReceiptNoteNo(e.target.value)}
              />
            </Grid>

            {/* Account Receipt Note Date */}
            <Grid item size={1}>
              <DatePicker
                label="Account Receipt Note Date"
                value={accountReceiptNoteDate}
                onChange={(newValue) => setAccountReceiptNoteDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={2}>
              <TextField
                fullWidth
                label="Name Of The Acos"
                variant="outlined"
                value={acos}
                onChange={(e) => setAcos(e.target.value)}
              />
            </Grid>

            {/* Discom Receipt Note No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Discom Receipt Note No"
                variant="outlined"
                value={discomReceiptNoteNo}
                onChange={(e) => setDiscomReceiptNoteNo(e.target.value)}
              />
            </Grid>

            {/* Discom Receipt Note Date */}
            <Grid item size={1}>
              <DatePicker
                label="Discom Receipt Note Date"
                value={discomReceiptNoteDate}
                onChange={(newValue) => setDiscomReceiptNoteDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          {/* Conditionally Show Table */}
          {filteredRecords.length > 0 && (
            <Box sx={{ mt: 3, overflowX: "auto" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Matching Records
              </Typography>
              <Table sx={{ minWidth: 1200, border: "1px solid #ddd" }}>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Sin No</TableCell>
                    <TableCell>TRFSI No</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Phase</TableCell>
                    <TableCell>TN No</TableCell>
                    <TableCell>Oil Level</TableCell>
                    <TableCell>HV Bushing</TableCell>
                    <TableCell>LV Bushing</TableCell>
                    <TableCell>HT Metal Parts</TableCell>
                    <TableCell>LT Metal Parts</TableCell>
                    <TableCell>M&P Box</TableCell>
                    <TableCell>M&P Box Cover</TableCell>
                    <TableCell>MCCB</TableCell>
                    <TableCell>ICB</TableCell>
                    <TableCell>Copper Flexible Cable</TableCell>
                    <TableCell>AL Wire</TableCell>
                    <TableCell>Conservator</TableCell>
                    <TableCell>Radiator</TableCell>
                    <TableCell>Fuse</TableCell>
                    <TableCell>Channel</TableCell>
                    <TableCell>Core</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>{rec.sinNo}</TableCell>
                      <TableCell>{rec.trfsiNo}</TableCell>
                      <TableCell>{rec.rating}</TableCell>
                      <TableCell>{rec.deliveryChalanDetails.materialDescription.materialName}</TableCell>
                      <TableCell>{rec.deliveryChalanDetails.materialDescription.phase}</TableCell>
                      <TableCell>{rec.deliveryChalanDetails.finalInspectionDetail.deliverySchedule.tnNumber}</TableCell>
                      <TableCell>{rec.oilLevel}</TableCell>
                      <TableCell>{rec.hvBushing}</TableCell>
                      <TableCell>{rec.lvBushing}</TableCell>
                      <TableCell>{rec.htMetalParts}</TableCell>
                      <TableCell>{rec.ltMetalParts}</TableCell>
                      <TableCell>{rec.mAndpBox}</TableCell>
                      <TableCell>{rec.mAndpBoxCover}</TableCell>
                      <TableCell>{rec.mccb}</TableCell>
                      <TableCell>{rec.icb}</TableCell>
                      <TableCell>{rec.copperFlexibleCable}</TableCell>
                      <TableCell>{rec.alWire}</TableCell>
                      <TableCell>{rec.conservator}</TableCell>
                      <TableCell>{rec.radiator}</TableCell>
                      <TableCell>{rec.fuse}</TableCell>
                      <TableCell>{rec.channel}</TableCell>
                      <TableCell>{rec.core}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Submit Button */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
            >
              Submit Failure Info
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddGPReceiptNote;
