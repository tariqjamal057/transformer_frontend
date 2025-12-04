import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  IconButton,
  Stack,
  MenuItem,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
} from "@mui/material";
import * as XLSX from "xlsx";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { addMonths, format, isAfter } from "date-fns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

// Dummy Data
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
      inspectionDate: "2025-08-09",
      inspectedQuantity: 150,
      total: 150,
      diNo: "DI/2025/1001",
      diDate: "2025-08-18",
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
        { trfsiNo: 4912, polySealNo: "IAJ 5301 To IAJ 5302", status: "active" },
        {
          trfsiNo: 4908,
          polySealNo: "IAJ 6605 To IAJ 6606",
          status: "repaired",
          dispatch: true,
        },
        { trfsiNo: 4913, polySealNo: "IAJ 5303 To IAJ 5304", status: "active" },
        { trfsiNo: 4914, polySealNo: "IAJ 5305 To IAJ 5306", status: "active" },
        { trfsiNo: 4915, polySealNo: "IAJ 5307 To IAJ 5308", status: "active" },
        { trfsiNo: 4916, polySealNo: "IAJ 5309 To IAJ 5310", status: "active" },
      ],
    },
    subSerialNumberFrom: 4912,
    subSerialNumberTo: 4914,
    challanNo: "CH-1001",
    createdAt: "2025-06-22",
    consignorName: "PowerTech Transformers Pvt. Ltd.",
    consignorPhone: "9876543210",
    consignorAddress: "Plot 12, Industrial Zone, Mumbai",
    consignorGST: "27AAACP1234F1Z5",
    consignorEmail: "powertech@gmail.com",
    consigneeDetails: {
      id: "3",
      name: "GreenVolt Energy Systems",
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
      serialNumberFrom: 4912,
      serialNumberTo: 5061,
      snNumber: "4912 TO 5061",
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
        { trfsiNo: 4912, polySealNo: "IAJ 5311 To IAJ 5312", status: "active" },
        { trfsiNo: 4913, polySealNo: "IAJ 5313 To IAJ 5314", status: "active" },
        {
          trfsiNo: 9003,
          polySealNo: "IAJ 7339 To IAJ 7340",
          status: "repaired",
          dispatch: true,
        },
        { trfsiNo: 4914, polySealNo: "IAJ 5315 To IAJ 5316", status: "active" },
        { trfsiNo: 4915, polySealNo: "IAJ 5317 To IAJ 5318", status: "active" },
        { trfsiNo: 4916, polySealNo: "IAJ 5319 To IAJ 5320", status: "active" },
      ],
    },
    subSerialNumberFrom: 5001,
    subSerialNumberTo: 5033,
    challanNo: "CH-1002",
    createdAt: "2025-07-28",
    consignorName: "Delta Power Equipments Ltd.",
    consignorPhone: "9811122233",
    consignorAddress: "Sector 24, Industrial Estate, Pune",
    consignorGST: "27DELT1234K9Z8",
    consignorEmail: "contact@deltapower.com",
    consigneeDetails: {
      id: "2",
      name: "XYZ Electricals Ltd.",
      address: "B-56, Industrial Phase 2, Noida, Uttar Pradesh - 201301",
      gstNo: "09XYZEL2345Q1W8",
    },
    lorryNo: "DL01CD5678",
    truckDriverName: "Amit Kumar",
    materialDescription: {
      materialName: "200 kVA Copper Wound Distribution Transformer",
      phase: "200 KVA",
      description:
        "200 kVA, 11/0.433 kV, 3-Phase, ONAN cooled, energy efficient distribution transformer as per IS standards.",
    },
  },
];

const NewGPInformationModal = ({ open, handleClose, newGPInformation }) => {
  const [challanReceiptedItemNo, setChallanReceiptedItemNo] = useState("");
  const [challanReceiptedDate, setChallanReceiptedDate] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [hasUnmatched, setHasUnmatched] = useState(false);

  // ✅ Handle Excel Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      
      setUploadedData(data);

      const results = data.map((row) => {
        // Normalize fields from Excel (case-insensitive and trimmed)
        const trfsino = Number(row.TRFSI || row.trfsino || row.TrfsiNo);
        const rating = String(row.Rating || row.rating || "").trim();
        const sealNoRaw =
          row.PolyCarbonateSealNo || row.ploycarbonatesealno || "";

        // Normalized version (only for matching)
        const sealNoNormalized = String(sealNoRaw)
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        const receivedfromacos =
          row.ReceivedFromACOS || row.receivedfromacos || "";

        // Try to find matching challan
        const matchedChalan = dummyDeliveryChalans.find((ch) => {
          const challanRating = String(
            ch.finalInspectionDetail.deliverySchedule.rating
          ).trim();

          const matchRating = challanRating === rating;

          const matchSealing = ch.finalInspectionDetail.shealingDetails?.some(
            (s) => {
              const challanSeal = String(s.polySealNo || "")
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();
              return (
                Number(s.trfsiNo) === trfsino &&
                challanSeal === sealNoNormalized
              );
            }
          );

          return matchRating && matchSealing;
        });

        if (matchedChalan) {
          return {
            trfsino,
            rating,
            polycarbonatesealno: sealNoRaw,
            receivedfromacos,
            inspectionDate: matchedChalan.finalInspectionDetail.inspectionDate,
            challanNo: matchedChalan.challanNo,
            createdAt: matchedChalan.createdAt,
            consigneeName: matchedChalan.consigneeDetails?.name,
            isMatched: true,
          };
        } else {
          return {
            trfsino,
            rating,
            polycarbonatesealno: sealNoRaw,
            receivedfromacos,
            inspectionDate: "Not Found",
            challanNo: "Not Found",
            createdAt: "Not Found",
            consigneeName: "Not Found",
            isMatched: false,
          };
        }
      });

      setMatchedData(results);
      setHasUnmatched(results.some((r) => !r.isMatched));
    };
    reader.readAsBinaryString(file);
  };

  // ✅ Handle Submit
  const handleSubmit = () => {
    if (matchedData.length > 0) {
      console.log("Submitted GP Information:", matchedData);
      alert("Excel data stored successfully!");
      handleClose()
    } else {
      alert("No data to submit.");
    }
  };

  // Load initial data if editing
  useEffect(() => {
    if (newGPInformation) {
      setChallanReceiptedItemNo(newGPInformation.challanReceiptedItemNo || "");
      setChallanReceiptedDate(
        newGPInformation.challanReceiptedDate
          ? dayjs(newGPInformation.challanReceiptedDate)
          : null || ""
      );

      setMatchedData(newGPInformation.sealingStatements || []);
    }
  }, [newGPInformation]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main", mb: 3 }}
            >
              Edit New GP Information
            </Typography>

            {/* Input Section */}
            <Grid
              container
              spacing={2}
              sx={{ mb: 3 }}
              columns={{ xs: 1, sm: 2 }}
            >
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Challan Receipted Item No"
                  variant="outlined"
                  value={challanReceiptedItemNo}
                  onChange={(e) => setChallanReceiptedItemNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Challan Receipted Date"
                  value={challanReceiptedDate}
                  onChange={(date) =>
                    setChallanReceiptedDate(date ? dayjs(date) : null)
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            {/* File Upload */}
            <Box textAlign="center" sx={{ mb: 3 }}>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="form-control"
              />
            </Box>

            {/* Validation Alert */}
            {hasUnmatched && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Some rows could not be matched with delivery challans. They are
                highlighted in red below.
              </Alert>
            )}

            {/* Preview Table */}
            {matchedData.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Uploaded & Matched Data
                </Typography>
                <Box sx={{ overflowX: "auto" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>TRFSI No</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Poly Seal No</TableCell>
                        <TableCell>Received From ACOS</TableCell>
                        <TableCell>Inspection Date</TableCell>
                        <TableCell>Challan No</TableCell>
                        <TableCell>Challan Date</TableCell>
                        <TableCell>Consignee Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matchedData.map((row, idx) => (
                        <TableRow
                          key={idx}
                          sx={{
                            backgroundColor: row.isMatched
                              ? "inherit"
                              : "rgba(255,0,0,0.1)", // light red highlight
                          }}
                        >
                          <TableCell>{row.trfsino}</TableCell>
                          <TableCell>{row.rating}</TableCell>
                          <TableCell>{row.polycarbonatesealno}</TableCell>
                          <TableCell>{row.receivedfromacos}</TableCell>
                          <TableCell>{row.inspectionDate}</TableCell>
                          <TableCell>{row.challanNo}</TableCell>
                          <TableCell>{row.createdAt}</TableCell>
                          <TableCell>{row.consigneeName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
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
                Submit
              </Button>
            </Box>
          </>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default NewGPInformationModal;
