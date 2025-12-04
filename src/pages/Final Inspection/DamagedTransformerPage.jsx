import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// Dummy Final Inspection Data with shealingDetails
const getDummyFinalInspectionDetails = () => {
  return [
    {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "100",
        wound: "Aluminium",
        phase: "100 KVA",
        guaranteePeriodMonths: 24,
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 5061,
      snNumber: "4912 TO 5061",
      nominationLetterNo: "NL/2025/001",
      nominationDate: "2025-07-10",
      inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
      inspectionDate: "2025-07-13",
      inspectedQuantity: 150,
      total: 150,
      diNo: "DI/2025/1001",
      diDate: "2025-07-16",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "4912 TO 4961",
        },
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "4962 TO 5011",
        },
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "5012 TO 5061",
        },
      ],
      shealingDetails: [
        { trfsiNo: 4912, polySealNo: "IAJ 5301 To IAJ 5302" },
        { trfsiNo: 4913, polySealNo: "IAJ 5303 To IAJ 5304" },
        { trfsiNo: 4914, polySealNo: "IAJ 5305 To IAJ 5306" },
        { trfsiNo: 4915, polySealNo: "IAJ 5307 To IAJ 5308" },
        { trfsiNo: 4916, polySealNo: "IAJ 5309 To IAJ 5310" },
      ],
    },
    {
      id: "2",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "50",
        wound: "Aluminium",
        phase: "50 KVA",
        guaranteePeriodMonths: 18,
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 5912,
      serialNumberTo: 6061,
      snNumber: "5912 TO 6061",
      nominationLetterNo: "NL/2025/002",
      nominationDate: "2025-08-03",
      inspectionOfficers: ["Amit Verma", "Priya Singh"],
      inspectionDate: "2025-08-06",
      inspectedQuantity: 150,
      total: 150,
      diNo: "DI/2025/1002",
      diDate: "2025-08-08",
      consignees: [
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 70,
          dispatch: 0,
          pending: 70,
          subSnNumber: "4912 TO 4981",
        },
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 80,
          dispatch: 0,
          pending: 80,
          subSnNumber: "4982 TO 5061",
        },
      ],
      shealingDetails: [
        { trfsiNo: 5912, polySealNo: "IAJ 5311 To IAJ 5312" },
        { trfsiNo: 5913, polySealNo: "IAJ 5313 To IAJ 5314" },
        { trfsiNo: 5914, polySealNo: "IAJ 5315 To IAJ 5316" },
        { trfsiNo: 5915, polySealNo: "IAJ 5317 To IAJ 5318" },
        { trfsiNo: 5916, polySealNo: "IAJ 5319 To IAJ 5320" },
      ],
    },
    {
      id: "3",
      deliverySchedule: {
        tnNumber: "TN-003",
        rating: "150",
        wound: "Copper",
        phase: "150 KVA",
        guaranteePeriodMonths: 12,
      },
      offeredDate: "2025-09-15",
      offeredQuantity: 180,
      serialNumberFrom: 4917,
      serialNumberTo: 5096,
      snNumber: "4917 TO 5096",
      nominationLetterNo: "NL/2025/003",
      nominationDate: "2025-09-12",
      inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
      inspectionDate: "2025-09-16",
      inspectedQuantity: 180,
      total: 180,
      diNo: "DI/2025/1003",
      diDate: "2025-09-18",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "4917 TO 5016",
        },
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 80,
          dispatch: 0,
          pending: 80,
          subSnNumber: "5017 TO 5096",
        },
      ],
      shealingDetails: [
        { trfsiNo: 4917, polySealNo: "IAJ 5321 To IAJ 5322" },
        { trfsiNo: 4918, polySealNo: "IAJ 5323 To IAJ 5324" },
        { trfsiNo: 4919, polySealNo: "IAJ 5325 To IAJ 5326" },
        { trfsiNo: 4920, polySealNo: "IAJ 5327 To IAJ 5328" },
        { trfsiNo: 4921, polySealNo: "IAJ 5329 To IAJ 5330" },
      ],
    },
    {
      id: "4",
      deliverySchedule: {
        tnNumber: "TN-004",
        rating: "200",
        wound: "Copper",
        phase: "200 KVA",
        guaranteePeriodMonths: 36,
      },
      offeredDate: "2025-10-20",
      offeredQuantity: 220,
      serialNumberFrom: 4922,
      serialNumberTo: 5141,
      snNumber: "4922 TO 5141",
      nominationLetterNo: "NL/2025/004",
      nominationDate: "2025-10-18",
      inspectionOfficers: ["Vikas Sharma", "Neha Yadav"],
      inspectionDate: "2025-10-21",
      inspectedQuantity: 220,
      total: 220,
      diNo: "DI/2025/1004",
      diDate: "2025-10-23",
      consignees: [
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 120,
          dispatch: 0,
          pending: 120,
          subSnNumber: "4922 TO 5041",
        },
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5042 TO 5141",
        },
      ],
      shealingDetails: [
        { trfsiNo: 4922, polySealNo: "IAJ 5331 To IAJ 5332" },
        { trfsiNo: 4923, polySealNo: "IAJ 5333 To IAJ 5334" },
        { trfsiNo: 4924, polySealNo: "IAJ 5335 To IAJ 5336" },
        { trfsiNo: 4925, polySealNo: "IAJ 5337 To IAJ 5338" },
        { trfsiNo: 4926, polySealNo: "IAJ 5339 To IAJ 5340" },
      ],
    },
  ];
};

const dummyDeliveryChalans = [
  {
    id: "1",
    finalInspectionDetail: {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "100",
        wound: "Aluminium",
        phase: "100 KVA",
        guaranteePeriodMonths: 24,
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 5061,
      snNumber: "4912 TO 5061",
      nominationLetterNo: "NL/2025/001",
      nominationDate: "2025-07-10",
      inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
      inspectionDate: "2025-07-13",
      inspectedQuantity: 150,
      total: 150,
      diNo: "DI/2025/1001",
      diDate: "2025-07-16",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "4912 TO 4961",
        },
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "4962 TO 5011",
        },
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "5012 TO 5061",
        },
      ],
      shealingDetails: [
        { trfsiNo: 4912, polySealNo: "IAJ 5301 To IAJ 5302" },
        { trfsiNo: 4913, polySealNo: "IAJ 5303 To IAJ 5304" },
        { trfsiNo: 4914, polySealNo: "IAJ 5305 To IAJ 5306" },
        { trfsiNo: 4915, polySealNo: "IAJ 5307 To IAJ 5308" },
        { trfsiNo: 4916, polySealNo: "IAJ 5309 To IAJ 5310" },
      ],
    },
    challanNo: "CH-1001",
    createdAt: "2025-07-22",
    consignorName: "PowerTech Transformers Pvt. Ltd.",
    consignorPhone: "9876543210",
    consignorAddress: "Plot 12, Industrial Zone, Mumbai",
    consignorGST: "27AAACP1234F1Z5",
    consignorEmail: "powertech@gmail.com",
    consigneeDetails: {
      id: "2",
      name: "XYZ Transformers Ltd.",
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
        rating: "50",
        wound: "Aluminium",
        phase: "50 KVA",
        guaranteePeriodMonths: 18,
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 5912,
      serialNumberTo: 6061,
      snNumber: "5912 TO 6061",
      nominationLetterNo: "NL/2025/002",
      nominationDate: "2025-08-03",
      inspectionOfficers: ["Amit Verma", "Priya Singh"],
      inspectionDate: "2025-08-06",
      inspectedQuantity: 150,
      total: 150,
      diNo: "DI/2025/1002",
      diDate: "2025-08-08",
      consignees: [
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 70,
          dispatch: 0,
          pending: 70,
          subSnNumber: "4912 TO 4981",
        },
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 80,
          dispatch: 0,
          pending: 80,
          subSnNumber: "4982 TO 5061",
        },
      ],
      shealingDetails: [
        { trfsiNo: 5912, polySealNo: "IAJ 5311 To IAJ 5312" },
        { trfsiNo: 5913, polySealNo: "IAJ 5313 To IAJ 5314" },
        { trfsiNo: 5914, polySealNo: "IAJ 5315 To IAJ 5316" },
        { trfsiNo: 5915, polySealNo: "IAJ 5317 To IAJ 5318" },
        { trfsiNo: 5916, polySealNo: "IAJ 5319 To IAJ 5320" },
      ],
    },
    challanNo: "CH-1002",
    createdAt: "2025-08-10",
    consignorName: "MegaVolt Electricals Ltd.",
    consignorPhone: "9123456780",
    consignorAddress: "Industrial Plot 88, Pune MIDC, Maharashtra",
    consignorGST: "27MEGAE5678G1Z2",
    consignorEmail: "megavolt@gmail.com",
    consigneeDetails: {
      id: "3",
      name: "GreenVolt Energy Systems",
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
        rating: "150",
        wound: "Copper",
        phase: "150 KVA",
        guaranteePeriodMonths: 12,
      },
      offeredDate: "2025-09-15",
      offeredQuantity: 180,
      serialNumberFrom: 4917,
      serialNumberTo: 5096,
      snNumber: "4917 TO 5096",
      nominationLetterNo: "NL/2025/003",
      nominationDate: "2025-09-12",
      inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
      inspectionDate: "2025-09-16",
      inspectedQuantity: 180,
      total: 180,
      diNo: "DI/2025/1003",
      diDate: "2025-09-18",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "4917 TO 5016",
        },
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 80,
          dispatch: 0,
          pending: 80,
          subSnNumber: "5017 TO 5096",
        },
      ],
      shealingDetails: [
        { trfsiNo: 4917, polySealNo: "IAJ 5321 To IAJ 5322" },
        { trfsiNo: 4918, polySealNo: "IAJ 5323 To IAJ 5324" },
        { trfsiNo: 4919, polySealNo: "IAJ 5325 To IAJ 5326" },
        { trfsiNo: 4920, polySealNo: "IAJ 5327 To IAJ 5328" },
        { trfsiNo: 4921, polySealNo: "IAJ 5329 To IAJ 5330" },
      ],
    },
    challanNo: "CH-1003",
    createdAt: "2025-09-20",
    consignorName: "ElectroTech Industries",
    consignorPhone: "9988776655",
    consignorAddress: "Shed No. 21, GIDC Estate, Ahmedabad",
    consignorGST: "24ETI7654H1Z5",
    consignorEmail: "electrotech@gmail.com",
    consigneeDetails: {
      id: "2",
      name: "XYZ Transformers Ltd.",
      address: "123/4, Electronic City Phase 2, Bengaluru, Karnataka - 560100",
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

export default function DamagedTransformerPage() {
  const finalInspectionList = getDummyFinalInspectionDetails();
  const deliveryChallanList = dummyDeliveryChalans;

  // 👉 States
  const [selectedSN, setSelectedSN] = useState(null);
  const [selectedTRFSI, setSelectedTRFSI] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedChallan, setSelectedChallan] = useState(null);

  const [reasonOfDamaged, setReasonOfDamaged] = useState("");
  const [ctlReportNo, setCtlReportNo] = useState("");
  const [ctlReportDate, setCtlReportDate] = useState(null);
  const [liftingLetterNo, setLiftingLetterNo] = useState("");
  const [liftingLetterDate, setLiftingLetterDate] = useState(null);
  const [liftingFromAcos, setLiftingFromAcos] = useState("");

  // 👉 Find the matching challan for selected inspection
  useEffect(() => {
    if (selectedInspection && selectedTRFSI) {
      const challan = deliveryChallanList.find((c) =>
        c.finalInspectionDetail.shealingDetails?.some(
          (s) => s.trfsiNo === selectedTRFSI.trfsiNo
        )
      );
      setSelectedChallan(challan || null);
    } else {
      setSelectedChallan(null);
    }
  }, [selectedInspection, selectedTRFSI, deliveryChallanList]);

  // 👉 Handle SN Selection
  const handleSNChange = (_, sn) => {
    if (!sn) {
      // when cleared
      setSelectedSN(null);
      setSelectedInspection(null);
      setSelectedTRFSI(null);
      setSelectedChallan(null);
      return;
    }

    setSelectedSN(sn);
    setSelectedInspection(
      finalInspectionList.find((f) => f.snNumber === sn) || null
    );
    setSelectedTRFSI(null); // reset TRFSI
  };

  // 👉 Handle TRFSI Selection
  const handleTRFSIChange = (_, trfsi) => {
    setSelectedTRFSI(trfsi);
  };

  // 👉 On Submit
  const handleSubmit = () => {
    if (!selectedSN || !selectedTRFSI || !selectedInspection) {
      alert("Please select SN Number and TRFSI Number");
      return;
    }

    const payload = {
      snNumber: selectedSN,
      trfsiNo: selectedTRFSI.trfsiNo,
      finalInspection: selectedInspection,
      inspectionDate: selectedInspection.inspectionDate,
      reasonOfDamaged,
      ctlReportNo,
      ctlReportDate: dayjs(ctlReportDate).format("YYYY-MM-DD"),
      liftingLetterNo,
      liftingLetterDate: dayjs(liftingLetterDate).format("YYYY-MM-DD"),
      liftingFromAcos,
    };

    console.log("Saved Damaged Transformer:", payload);
    alert("Saved! Check console for payload.");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="right-content w-100">
        <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Damaged Transformer Detail
            </Typography>

            <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
              {/* SN Number Dropdown */}
              <Grid item size={1}>
                <Autocomplete
                  options={finalInspectionList.map((f) => f.snNumber)}
                  value={selectedSN}
                  onChange={handleSNChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select SN Number" />
                  )}
                />
              </Grid>

              {/* TRFSI Number Dropdown */}
              <Grid item size={1}>
                <Autocomplete
                  options={selectedInspection?.shealingDetails || []}
                  getOptionLabel={(opt) => opt.trfsiNo.toString()}
                  value={selectedTRFSI}
                  onChange={handleTRFSIChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select TRFSI Number" />
                  )}
                />
              </Grid>

              {/* Auto-filled fields */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="TN No"
                  value={selectedInspection?.deliverySchedule?.tnNumber || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Rating In KVA"
                  value={selectedInspection?.deliverySchedule?.rating || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Wound"
                  value={selectedInspection?.deliverySchedule?.wound || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Phase"
                  value={selectedInspection?.deliverySchedule?.phase || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Inspection Officers"
                  value={
                    selectedInspection?.inspectionOfficers?.join(", ") || ""
                  }
                  InputProps={{ readOnly: true }}
                  multiline
                />
              </Grid>

              <Grid item size={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Reason Of Failure / Damaged"
                  value={reasonOfDamaged}
                  onChange={(e) => setReasonOfDamaged(e.target.value)}
                  margin="normal"
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="CTL Report No."
                  value={ctlReportNo}
                  onChange={(e) => setCtlReportNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="CTL Report Date"
                  value={ctlReportDate}
                  onChange={setCtlReportDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Lifting Letter No."
                  value={liftingLetterNo}
                  onChange={(e) => setLiftingLetterNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Lifting Letter Date"
                  value={liftingLetterDate}
                  onChange={setLiftingLetterDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Lifting From Acos"
                  value={liftingFromAcos}
                  onChange={(e) => setLiftingFromAcos(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Date Of Inspection After Repair"
                  value={
                    selectedInspection?.inspectionDate
                      ? dayjs(selectedInspection.inspectionDate).format(
                          "YYYY-MM-DD"
                        )
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* Delivery Challan Fields */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Challan No"
                  value={selectedChallan?.challanNo || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Challan Date"
                  value={
                    selectedChallan?.createdAt
                      ? dayjs(selectedChallan.createdAt).format("YYYY-MM-DD")
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Delivered To ACOS"
                  value={selectedChallan?.consigneeDetails?.name || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Save Damaged Transformer
              </Button>
            </Box>
          </Paper>
        </Box>
      </div>
    </LocalizationProvider>
  );
}
