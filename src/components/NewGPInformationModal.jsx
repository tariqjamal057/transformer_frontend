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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

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

const NewGPInformationModal = ({ open, handleClose, newGPInformation }) => {
  const queryClient = useQueryClient();
  const [challanReceiptedItemNo, setChallanReceiptedItemNo] = useState("");
  const [challanReceiptedDate, setChallanReceiptedDate] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [hasUnmatched, setHasUnmatched] = useState(false);

  const { data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () => api.get("/delivery-challans").then((res) => res.data),
  });

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
        const matchedChalan = deliveryChallans.find((ch) => {
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

  const { mutate: updateNewGPInformation, isLoading } = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/new-gp-informations/${newGPInformation.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["newGPInformations"]);
      handleClose();
    },
  });

  // ✅ Handle Submit
  const handleSubmit = () => {
    if (matchedData.length > 0) {
      const data = {
        challanReceiptedItemNo,
        challanReceiptedDate: dayjs(challanReceiptedDate).format("YYYY-MM-DD"),
        sealingStatements: matchedData,
      };
      updateNewGPInformation(data);
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
                  format="DD/MM/YYYY"
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
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default NewGPInformationModal;
