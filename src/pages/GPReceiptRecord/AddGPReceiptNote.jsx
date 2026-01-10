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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import dayjs from "dayjs";

const AddGPReceiptNote = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;
  const queryClient = useQueryClient();

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
  
  const { data: gpReceiptRecords, isLoading } = useQuery({
    queryKey: ["gpReceiptRecords"],
    queryFn: () => api.get("/gp-receipt-notes").then((res) => res.data.data),
  });

  const { mutate: addGPReceiptNote, isLoading: isAdding } = useMutation({
    mutationFn: (newNote) => api.post("/gp-receipt-notes", newNote),
    onSuccess: () => {
      queryClient.invalidateQueries(["gpReceiptNotes"]);
      setAlertBox({
        open: true,
        msg: "GP Receipt Note added successfully!",
        error: false,
      });
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.message,
        error: true,
      });
    }
  });


  // Whenever consigneeName changes, filter data and update ids
  useEffect(() => {
    if (consigneeName.trim() === "") {
      setFilteredRecords([]);
      setMatchedIds([]);
      return;
    }

    if(gpReceiptRecords){
      const matches = gpReceiptRecords.filter((record) =>
        record.consigneeName.toLowerCase().includes(consigneeName.toLowerCase())
      );
  
      setFilteredRecords(matches);
      setMatchedIds(matches.map((rec) => rec.id));
    }
  }, [consigneeName, gpReceiptRecords]);

  const handleSubmit = () => {
    const dataToSubmit = {
      selectDateFrom: selectDateFrom? dayjs(selectDateFrom).format("YYYY-MM-DD"): null,
      selectDateTo: selectDateTo? dayjs(selectDateTo).format("YYYY-MM-DD"): null,
      consigneeName,
      accountReceiptNoteNo,
      accountReceiptNoteDate: accountReceiptNoteDate? dayjs(accountReceiptNoteDate).format("YYYY-MM-DD"): null,
      acos,
      discomReceiptNoteNo,
      discomReceiptNoteDate: discomReceiptNoteDate? dayjs(discomReceiptNoteDate).format("YYYY-MM-DD"): null,
      gpReceiptRecordIds: matchedIds,
    }
    addGPReceiptNote(dataToSubmit)
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
          {isLoading? <p>Loading...</p> : filteredRecords.length > 0 && (
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
              disabled={isAdding}
            >
              {isAdding? 'Submitting...' : 'Submit Failure Info'}
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddGPReceiptNote;
