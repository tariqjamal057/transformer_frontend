import React, { useState, useMemo, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

export default function DamagedTransformerPage() {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: finalInspectionList = [] } = useQuery({
    queryKey: ["allFinalInspections"],
    queryFn: () =>
      api.get("/final-inspections?all=true").then((res) => res.data),
    placeholderData: [],
  });

  // State for selected objects from dropdowns
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedTrfsiNo, setSelectedTrfsiNo] = useState(null);

  // State for manual input fields
  const [reasonOfDamaged, setReasonOfDamaged] = useState("");
  const [ctlReportNo, setCtlReportNo] = useState("");
  const [ctlReportDate, setCtlReportDate] = useState(null);
  const [liftingLetterNo, setLiftingLetterNo] = useState("");
  const [liftingLetterDate, setLiftingLetterDate] = useState(null);
  const [liftingFromAcos, setLiftingFromAcos] = useState("");
  const [dateOfInspectionAfterRepair, setDateOfInspectionAfterRepair] =
    useState(null);
  const [challanNo, setChallanNo] = useState("");
  const [challanDate, setChallanDate] = useState(null);
  const [deliveredToAcos, setDeliveredToAcos] = useState("");

  const { mutate: addDamagedTransformer, isPending } = useMutation({
    mutationFn: (payload) => api.post("/damaged-transformers", payload),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Damaged Transformer Saved Successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["damagedTransformers"]);
      navigate("/damageTransformer-list");
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.response?.data?.error || error.message,
        error: true,
      });
    },
  });

  const snNumberOptions = useMemo(() => {
    return finalInspectionList.map((f) => ({
      label: `${f.serialNumberFrom} TO ${f.serialNumberTo}`,
      ...f,
    }));
  }, [finalInspectionList]);

  const handleSnNumberChange = (_, value) => {
    setSelectedInspection(value);
    setSelectedTrfsiNo(null);
  };

  const handleSubmit = () => {
    if (!selectedInspection || !selectedTrfsiNo) {
      setAlertBox({
        open: true,
        msg: "Please select an SN Number range and a TRFSI Number.",
        error: true,
      });
      return;
    }

    const payload = {
      serialNo: selectedTrfsiNo,

      snNumberRange: selectedInspection.label,

      finalInspectionId: selectedInspection.id,

      reasonOfDamaged,

      ctlReportNo,

      ctlReportDate: ctlReportDate ? dayjs(ctlReportDate).toISOString() : null,

      liftingLetterNo,

      liftingLetterDate: liftingLetterDate
        ? dayjs(liftingLetterDate).toISOString()
        : null,

      liftingFromAcos,

      dateOfInspectionAfterRepair: dateOfInspectionAfterRepair
        ? dayjs(dateOfInspectionAfterRepair).toISOString()
        : null,

      challanNo,

      challanDate: challanDate ? dayjs(challanDate).toISOString() : null,

      deliveredToAcos,
    };

    addDamagedTransformer(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="right-content w-100">
        <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
          <Paper
            elevation={4}
            sx={{ p: 3, borderRadius: 3, maxWidth: "900px", margin: "auto" }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Damaged Transformer Detail
            </Typography>

            <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
              <Grid item size={1}>
                <Autocomplete
                  options={snNumberOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedInspection}
                  onChange={handleSnNumberChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select SN Number Range" />
                  )}
                />
              </Grid>

              {/* TRFSI Number Dropdown */}
              <Grid item size={1}>
                <Autocomplete
                  options={
                    selectedInspection?.sealingDetails?.map((s) => s.trfSiNo) ||
                    []
                  }
                  getOptionLabel={(option) => option.toString()}
                  value={selectedTrfsiNo}
                  onChange={(_, newValue) => setSelectedTrfsiNo(newValue)}
                  disabled={!selectedInspection}
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
                <DatePicker
                  label="Date of Inspection After Repair"
                  value={dateOfInspectionAfterRepair}
                  onChange={setDateOfInspectionAfterRepair}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Delivery Challan Fields */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Challan No"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                />
              </Grid>
              <Grid item size={1}>
                <DatePicker
                  label="Challan Date"
                  value={challanDate}
                  onChange={setChallanDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Delivered To ACOS"
                  value={deliveredToAcos}
                  onChange={(e) => setDeliveredToAcos(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save Damaged Transformer"
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </div>
    </LocalizationProvider>
  );
}
