import React, { useState, useContext } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import {
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddNewGPInformation = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [challanReceiptedItemNo, setChallanReceiptedItemNo] = useState("");
  const [challanReceiptedDate, setChallanReceiptedDate] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [hasUnmatched, setHasUnmatched] = useState(false);

  const { data: offerLetterAndSealingStatements } = useQuery({
    queryKey: ["offerLetterAndSealingStatements"],
    queryFn: () =>
      api.get("/offer-letter-and-sealing-statements").then((res) => res.data),
  });

  const addNewGPInformationMutation = useMutation({
    mutationFn: (newInfo) => api.post("/new-gp-informations", newInfo),
    onSuccess: () => {
      setAlertBox({open: true, msg: "New GP Information added successfully!", error: false});
      queryClient.invalidateQueries(["newGpInformations"]);
      navigate("/newGPInformation-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
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
        const trfsino = Number(row.TRFSI || row.trfsino || row.TrfsiNo);
        const rating = String(row.Rating || row.rating || "").trim();
        const sealNoRaw =
          row.PolyCarbonateSealNo || row.ploycarbonatesealno || "";

        const sealNoNormalized = String(sealNoRaw)
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        const receivedfromacos =
          row.ReceivedFromACOS || row.receivedfromacos || "";

        const matchedStatement = offerLetterAndSealingStatements.find((st) => {
          const statementRating = String(st.rating).trim();
          const statementSeal = String(st.polycarbonatesealno || "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
          return (
            Number(st.trfsino) === trfsino &&
            statementRating === rating &&
            statementSeal === sealNoNormalized
          );
        });

        if (matchedStatement) {
          return {
            trfsino,
            rating,
            polycarbonatesealno: sealNoRaw,
            receivedfromacos,
            inspectionDate: matchedStatement.inspectionDate,
            challanNo: matchedStatement.challanNo,
            createdAt: matchedStatement.createdAt,
            consigneeName: matchedStatement.consigneeName,
            isMatched: true,
            offerLetterAndSealingStatementId: matchedStatement.id,
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
      const data = {
        challanReceiptedItemNo,
        challanReceiptedDate: dayjs(challanReceiptedDate).format("YYYY-MM-DD"),
        sealingStatements: matchedData,
      };
      addNewGPInformationMutation.mutate(data);
    } else {
      setAlertBox({open: true, msg: "No data to submit.", error: true});
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Add New GP Information
          </Typography>

          {/* Input Section */}
          <Grid container spacing={2} sx={{ mb: 3 }} columns={{ xs: 1, sm: 2 }}>
            <Grid item xs={1}>
              <TextField
                fullWidth
                label="Challan Receipted Item No"
                variant="outlined"
                value={challanReceiptedItemNo}
                onChange={(e) => setChallanReceiptedItemNo(e.target.value)}
              />
            </Grid>

            <Grid item xs={1}>
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
              <Table>
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
          )}

          {/* Submit Button */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
              disabled={addNewGPInformationMutation.isLoading}
            >
              {addNewGPInformationMutation.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddNewGPInformation;

