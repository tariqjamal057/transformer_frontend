import React, { useState } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";

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

export default function DamagedTransformerPage() {
  const finalInspectionList = getDummyFinalInspectionDetails();
  const [selectedSN, setSelectedSN] = useState("");
  const [selectedTRFSI, setSelectedTRFSI] = useState([]);
  const [damagedTransformerList, setDamagedTransformerList] = useState([]);

  const selectedInspection =
    finalInspectionList.find((item) => item.snNumber === selectedSN) || null;

  const handleTRFSIChange = (trfsiNo) => {
    setSelectedTRFSI((prev) =>
      prev.includes(trfsiNo)
        ? prev.filter((no) => no !== trfsiNo)
        : [...prev, trfsiNo]
    );
  };

  const handleSubmit = () => {
    setDamagedTransformerList(selectedTRFSI);
    setSelectedTRFSI([]);
    alert(`Damaged Transformers Added: ${JSON.stringify(selectedTRFSI)}`);
  };

  return (
    <div className="right-content w-100">
      <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Damaged Transformer Selection
          </Typography>

          {/* SN Number Dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select SN Number</InputLabel>
            <Select
              value={selectedSN}
              onChange={(e) => setSelectedSN(e.target.value)}
              label="Select SN Number"
            >
              {finalInspectionList.map((item) => (
                <MenuItem key={item.id} value={item.snNumber}>
                  {item.snNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* TRFSI Number List */}
          {selectedInspection && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Damaged TRFSI Numbers:
              </Typography>
              <Grid container spacing={2}>
                {selectedInspection.shealingDetails.map((detail) => (
                  <Grid item xs={12} sm={6} md={3} key={detail.trfsiNo}>
                    <Card
                      sx={{
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: selectedTRFSI.includes(detail.trfsiNo)
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                        borderRadius: 2,
                        backgroundColor: selectedTRFSI.includes(detail.trfsiNo)
                          ? "#e3f2fd"
                          : "white",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                      onClick={() => handleTRFSIChange(detail.trfsiNo)}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          TRFSI No: {detail.trfsiNo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {detail.polySealNo}
                        </Typography>
                      </CardContent>
                      <Checkbox
                        checked={selectedTRFSI.includes(detail.trfsiNo)}
                        onChange={() => handleTRFSIChange(detail.trfsiNo)}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Submit Button */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={selectedTRFSI.length === 0}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Submit Damaged List
                </Button>
              </Box>
            </>
          )}

          {/* Damaged Transformer List */}
          {damagedTransformerList.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Damaged Transformers:
              </Typography>
              <Typography>{damagedTransformerList.join(", ")}</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
}
