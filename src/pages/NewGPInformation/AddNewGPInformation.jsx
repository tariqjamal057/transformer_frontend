import React, { useState, useContext } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
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
import { MyContext } from "../../App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const sampleHeaders = [
  {
    "TRFSI No": "TRFSI-XXX",
    Rating: "100",
    "Polycarbonate Seal No": "POLY-XXX",
    "Received From ACOS": "ACOS-YYY",
  },
];

const AddNewGPInformation = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [challanReceiptedItemNo, setChallanReceiptedItemNo] = useState("");
  const [challanReceiptedDate, setChallanReceiptedDate] = useState(null);
  const [matchedData, setMatchedData] = useState([]);
  const [hasUnmatched, setHasUnmatched] = useState(false);

  const { data: deliveryChalans, isLoading: isLoadingChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
  });

  const { mutate: bulkProcess, isLoading: isProcessing } = useMutation({
    mutationFn: (data) => api.post("/new-gp-informations/bulk-process", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["newGpInformations"]);
      setAlertBox({
        open: true,
        msg: "Data processed and stored successfully!",
        error: false,
      });
      navigate("/NewGPInformation-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || isLoadingChallans) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const results = data.map((row) => {
        const trfsiNo = String(row["TRFSI No"] || row.trfsiNo || "").trim();
        const rating = String(row.Rating || row.rating || "").trim();
        const polyCarbonateSealNo = String(
          row["Polycarbonate Seal No"] || row.polyCarbonateSealNo || "",
        ).trim();
        const receivedFromACOS = String(
          row["Received From ACOS"] || row.receivedFromACOS || "",
        ).trim();

        const matchedChalan = deliveryChalans.find((ch) => {
          const challanRating = String(
            ch.finalInspection.deliverySchedule.rating,
          ).trim();
          const matchSealing = ch.finalInspection.sealingDetails?.some(
            (s) => String(s.trfSiNo).trim() === trfsiNo,
          );
          return matchSealing;
        });

        if (matchedChalan) {
          return {
            trfsiNo,
            rating,
            polyCarbonateSealNo,
            receivedFromACOS,
            inspectionDate: matchedChalan.finalInspection.inspectionDate,
            challanNo: matchedChalan.challanNo,
            challanDate: matchedChalan.createdAt,
            consigneeName: matchedChalan.consignee?.name,
            isMatched: true,
          };
        } else {
          return {
            trfsiNo,
            rating,
            polyCarbonateSealNo,
            receivedFromACOS,
            inspectionDate: null,
            challanNo: "Not Found",
            challanDate: null,
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

  const handleSubmit = () => {
    const missingFields = [];
    if (!challanReceiptedItemNo) missingFields.push("Challan Receipted Item No");
    if (!challanReceiptedDate) missingFields.push("Challan Receipted Date");
    if (matchedData.length === 0) missingFields.push("Records (Upload File)");

    if (missingFields.length > 0) {
      setAlertBox({
        open: true,
        msg: `Please fill required fields: ${missingFields.join(", ")}`,
        error: true,
      });
      return;
    }
    const payload = {
      challanReceiptedItemNo,
      challanReceiptedDate: challanReceiptedDate
        ? dayjs(challanReceiptedDate).toISOString()
        : null,
      records: matchedData,
    };
    bulkProcess(payload);
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleHeaders);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "sample_gp_information_upload.xlsx");
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
          <Grid container spacing={2} sx={{ mb: 3 }} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Challan Receipted Item No"
                variant="outlined"
                required
                value={challanReceiptedItemNo}
                onChange={(e) => setChallanReceiptedItemNo(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <DatePicker
                label="Challan Receipted Date"
                value={challanReceiptedDate}
                onChange={(date) => setChallanReceiptedDate(date)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                format="DD/MM/YYYY"
              />
            </Grid>
          </Grid>
          <Box textAlign="start" sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleDownloadSample}
              sx={{ mb: 2 }}
            >
              Download Sample File
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="form-control"
              disabled={isLoadingChallans}
            />
            {isLoadingChallans && (
              <Typography variant="caption">
                Loading delivery challan data...
              </Typography>
            )}
          </Box>
          {hasUnmatched && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Some rows could not be matched with delivery challans and are
              highlighted in red. Please review before submitting.
            </Alert>
          )}
          {matchedData.length > 0 && (
            <Box sx={{ mt: 3, overflowX: "auto" }}>
              <Typography variant="h6" gutterBottom>
                Uploaded & Matched Data Preview
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
                          : "rgba(255,0,0,0.1)",
                      }}
                    >
                      <TableCell>{row.trfsiNo}</TableCell>
                      <TableCell>{row.rating}</TableCell>
                      <TableCell>{row.polyCarbonateSealNo}</TableCell>
                      <TableCell>{row.receivedFromACOS}</TableCell>
                      <TableCell>
                        {row.inspectionDate
                          ? dayjs(row.inspectionDate).format("DD-MM-YYYY")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{row.challanNo}</TableCell>
                      <TableCell>
                        {row.challanDate
                          ? dayjs(row.challanDate).format("DD-MM-YYYY")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{row.consigneeName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
              disabled={isProcessing || matchedData.length === 0}
            >
              {isProcessing ? (
                <CircularProgress size={24} color="inherit" />
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
