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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MyContext } from "../../App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const AddGPReceiptNote = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectDateFrom, setSelectDateFrom] = useState(null);
  const [selectDateTo, setSelectDateTo] = useState(null);
  const [consigneeName, setConsigneeName] = useState("");
  const [accountReceiptNoteNo, setAccountReceiptNoteNo] = useState("");
  const [accountReceiptNoteDate, setAccountReceiptNoteDate] = useState(null);
  const [acos, setAcos] = useState("");
  const [discomReceiptNoteNo, setDiscomReceiptNoteNo] = useState("");
  const [discomReceiptNoteDate, setDiscomReceiptNoteDate] = useState(null);

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecordIds, setSelectedRecordIds] = useState([]);

  const { data: newGpReceiptRecords, isLoading } = useQuery({
    queryKey: ["newGpReceiptRecords"],
    queryFn: () =>
      api.get("/new-gp-receipt-records?all=true").then((res) => res.data.items),
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
      navigate("GPReceiptNote-list");
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.message,
        error: true,
      });
    },
  });

  useEffect(() => {
    if (consigneeName.trim() === "") {
      setFilteredRecords([]);
      return;
    }

    if (newGpReceiptRecords) {
      const matches = newGpReceiptRecords.filter(
        (record) =>
          record.consigneeName
            .toLowerCase()
            .includes(consigneeName.toLowerCase()) && !record.gpReceiptNoteId
      );
      setFilteredRecords(matches);
    }
  }, [consigneeName, newGpReceiptRecords]);

  const handleSelectRecord = (id) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id)
        ? prev.filter((recordId) => recordId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const gpReceiptNoteData = {
      selectDateFrom: selectDateFrom
        ? dayjs(selectDateFrom).toISOString()
        : null,
      selectDateTo: selectDateTo ? dayjs(selectDateTo).toISOString() : null,
      consigneeName,
      accountReceiptNoteNo,
      accountReceiptNoteDate: accountReceiptNoteDate
        ? dayjs(accountReceiptNoteDate).toISOString()
        : null,
      acos,
      discomReceiptNoteNo,
      discomReceiptNoteDate: discomReceiptNoteDate
        ? dayjs(discomReceiptNoteDate).toISOString()
        : null,
    };
    addGPReceiptNote({
      gpReceiptNoteData,
      recordIds: selectedRecordIds,
    });
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

            <Grid item size={2}>
              <TextField
                fullWidth
                label="Consignee Name"
                variant="outlined"
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                fullWidth
                label="Account Receipt Note No"
                variant="outlined"
                value={accountReceiptNoteNo}
                onChange={(e) => setAccountReceiptNoteNo(e.target.value)}
              />
            </Grid>

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

            <Grid item size={1}>
              <TextField
                fullWidth
                label="Discom Receipt Note No"
                variant="outlined"
                value={discomReceiptNoteNo}
                onChange={(e) => setDiscomReceiptNoteNo(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="Discom Receipt Note Date"
                value={discomReceiptNoteDate}
                onChange={(newValue) => setDiscomReceiptNoteDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            filteredRecords.length > 0 && (
              <Box sx={{ mt: 3, overflowX: "auto" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Matching Records
                </Typography>
                <Table sx={{ minWidth: 1200, border: "1px solid #ddd" }}>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecordIds(
                                filteredRecords.map((rec) => rec.id)
                              );
                            } else {
                              setSelectedRecordIds([]);
                            }
                          }}
                          checked={
                            selectedRecordIds.length ===
                              filteredRecords.length &&
                            filteredRecords.length > 0
                          }
                        />
                      </TableCell>
                      <TableCell>Sin No</TableCell>
                      <TableCell>TRFSI No</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Material</TableCell>
                      <TableCell>Phase</TableCell>
                      <TableCell>TN No</TableCell>
                      <TableCell>Oil Level</TableCell>
                      <TableCell>HV Bushing</TableCell>
                      <TableCell>LV Bushing</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRecords.map((rec) => (
                      <TableRow key={rec.id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRecordIds.includes(rec.id)}
                            onChange={() => handleSelectRecord(rec.id)}
                          />
                        </TableCell>
                        <TableCell>{rec.sinNo}</TableCell>
                        <TableCell>{rec.trfsiNo}</TableCell>
                        <TableCell>{rec.rating}</TableCell>
                        <TableCell>
                          {rec.deliveryChallan.materialDescription.name}
                        </TableCell>
                        <TableCell>
                          {rec.deliveryChallan.materialDescription.phase}
                        </TableCell>
                        <TableCell>
                          {
                            rec.deliveryChallan.finalInspection.deliverySchedule
                              .tnNumber
                          }
                        </TableCell>
                        <TableCell>{rec.oilLevel}</TableCell>
                        <TableCell>{rec.hvBushing}</TableCell>
                        <TableCell>{rec.lvBushing}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )
          )}

          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
              disabled={isAdding || selectedRecordIds.length === 0}
            >
              {isAdding ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddGPReceiptNote;
