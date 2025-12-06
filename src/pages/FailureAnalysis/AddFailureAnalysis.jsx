import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";


export const gpReceiptNotes = [
  {
    id: "1",
    consigneeName: "ABC Power Supply Ltd.",
    acosName: "Mahir Rana",
    gpReceiptRecords: [
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
      {
        id: "2",
        accountReceiptNoteNo: "ARN-2025-002",
        accountReceiptNoteDate: "2025-08-15",
        sinNo: "SIN-5502",
        consigneeName: "ABC Power Supply Ltd.",
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
              wound: "Aluminium", 
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
            id: "2",
            name: "ABC Power Solutions Pvt. Ltd.",
            address:
              "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
            gstNo: "06ABCDE1234F1Z5",
          },
          lorryNo: "MH20JK7890",
          truckDriverName: "Naresh Pawar",
          materialDescription: {
            materialName: "150 Amp Resin Cast Current Transformer",
            phase: "150 KVA",
            description:
              "150 Amp, 11 kV resin cast CT, Class 1 accuracy, 5P10 protection class, used in medium voltage panels.",
          },
        },
      },
    ],
  },
  {
    id: "2",
    consigneeName: "XYZ Energy Pvt. Ltd.",
    acosName: "Suresh Patel",
    gpReceiptRecords: [
      {
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
    ],
  },
];

export const gpFailureData = [
  {
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
  {
    id: "2",
    trfSiNo: 9003,
    rating: "150",
    subDivison: "Transmission Colony",
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
      id: "5",
      finalInspectionDetail: {
        id: "5",
        deliverySchedule: {
          tnNumber: "TN-005",
          poDetails: "PO-11122",
          poDate: "2025-07-01",
          rating: "150",
          wound: "Aluminium", 
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
        id: "2",
        name: "ABC Power Solutions Pvt. Ltd.",
        address:
          "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
        gstNo: "06ABCDE1234F1Z5",
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
];

const AddFailureAnalysis = () => {
  const [sinNo, setSinNo] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const [formData, setFormData] = useState({
    trfSiNo: "",
    rating: "",
    wound: "",
    phase: "",
    tnNumber: "",
    acosName: "",
    subDivision: "",
    locationOfFailure: "",
    dateOfSupply: "",
    dateOfExpiry: "",
  });

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedFailure, setSelectedFailure] = useState(null);

  // When user types SIN No → search in gpReceiptNotes
  // Reset fields when SIN No is cleared
  useEffect(() => {
    if (sinNo === "") {
      setFormData({
        trfSiNo: "",
        rating: "",
        wound: "",
        phase: "",
        tnNumber: "",
        acosName: "",
        subDivision: "",
        locationOfFailure: "",
        dateOfSupply: "",
        dateOfExpiry: "",
      });
      setSelectedReceipt(null);
      setSelectedFailure(null);
      return;
    }

    let foundRecord = null;
    let foundNote = null;

    gpReceiptNotes.forEach((note) => {
      note.gpReceiptRecords.forEach((record) => {
        if (record.sinNo.toLowerCase() === sinNo.toLowerCase()) {
          foundRecord = record;
          foundNote = note;
        }
      });
    });

    if (foundRecord) {
      const { trfsiNo, rating, deliveryChalanDetails } = foundRecord;

      const wound = deliveryChalanDetails.finalInspectionDetail.deliverySchedule.wound;
      const tnNumber = deliveryChalanDetails.finalInspectionDetail.deliverySchedule.tnNumber;
      const phase = deliveryChalanDetails.materialDescription.phase;

      setSelectedReceipt(foundRecord);

      setFormData((prev) => ({
        ...prev,
        trfSiNo: trfsiNo,
        rating,
        tnNumber,
        wound,
        phase,
        acosName: foundNote?.acosName || "", // ✅ FIX: pull from gpReceiptNotes.acosName
      }));

      // Match in gpFailureData
      const matchedFailure = gpFailureData.find(
        (f) =>
          f.trfSiNo === trfsiNo &&
          f.rating === rating &&
          f.deliveryChalanDetails.finalInspectionDetail.deliverySchedule.wound === wound &&
          f.deliveryChalanDetails.finalInspectionDetail.deliverySchedule.tnNumber === tnNumber
      );

      if (matchedFailure) {
        setSelectedFailure(matchedFailure);

        setFormData((prev) => ({
          ...prev,
          subDivision: matchedFailure.subDivison,
          locationOfFailure: matchedFailure.trfFailureList[0]?.place || "",
          dateOfSupply: matchedFailure.trfFailureList[0]?.informationDate || "",
          dateOfExpiry: matchedFailure.trfFailureList[0]?.failureDate || "",
        }));
      }
    }
  }, [sinNo]);

  // Handle Submit
  const handleSubmit = () => {
    const finalReason = reason === "Other Reason" ? otherReason : reason;
    const payload = {
      sinNo,
      acosName: formData.acosName,
      receiptData: selectedReceipt.id,
      failureData: selectedFailure.id,
      reasonOfFailure: finalReason,
    };

    console.log("Submitting Failure Info:", payload);
    // 🔥 Here you can push to API or state management
  };

  return (
    <div className="right-content w-100">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Add Failure Analysis
        </Typography>

        {/* Input Section */}
        <Grid container spacing={2} columns={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
          {/* SIN No */}
          <Grid item size={1}>
            <TextField
              fullWidth
              label="SIN No"
              variant="outlined"
              value={sinNo}
              onChange={(e) => setSinNo(e.target.value)}
            />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="TRFSI No" variant="outlined" value={formData.trfSiNo} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="Rating" variant="outlined" value={formData.rating} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="Wound" variant="outlined" value={formData.wound} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="Phase" variant="outlined" value={formData.phase} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="TN No." variant="outlined" value={formData.tnNumber} />
          </Grid>

          <Grid item size={1}>
            <TextField
              fullWidth
              label="Received From Acos"
              variant="outlined"
              value={formData.acosName}
            />
          </Grid>

          <Grid item size={1}>
            <TextField
              fullWidth
              label="Sub-Division"
              variant="outlined"
              value={formData.subDivision}
            />
          </Grid>

          <Grid item size={1}>
            <TextField
              fullWidth
              label="Location Of Failure"
              variant="outlined"
              value={formData.locationOfFailure}
            />
          </Grid>

          <Grid item size={1}>
            <TextField
              fullWidth
              label="Date Of Supply"
              variant="outlined"
              value={formData.dateOfSupply}
            />
          </Grid>

          <Grid item size={1}>
            <TextField
              fullWidth
              label="Date Of Expiry Of GP"
              variant="outlined"
              value={formData.dateOfExpiry}
            />
          </Grid>
        </Grid>

        {/* Reason of Failure Section */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="reason-label">Reason of Failure</InputLabel>
            <Select
              label="Reason Of Failure"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <MenuItem value="Oil theft">Oil theft</MenuItem>
              <MenuItem value="Oil leakage">Oil leakage</MenuItem>
              <MenuItem value="Over Load">Over Load</MenuItem>
              <MenuItem value="Insulation Failure">Insulation Failure</MenuItem>
              <MenuItem value="Water Presence">Water Presence</MenuItem>
              <MenuItem value="Protection By Pass">Protection By Pass</MenuItem>
              <MenuItem value="Other Reason">Other Reason</MenuItem>
            </Select>
          </FormControl>

          {reason === "Other Reason" && (
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Specify Other Reason"
              variant="outlined"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          )}
        </Box>

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
  );
};

export default AddFailureAnalysis;