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
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../services/api";

export default function DamagedTransformerPage() {
  const { data: finalInspectionList = [] } = useQuery({
    queryKey: ["final-inspections"],
    queryFn: () => api.get("/final-inspections").then((res) => res.data),
  });

  const { data: deliveryChallanList = [] } = useQuery({
    queryKey: ["delivery-challans"],
    queryFn: () => api.get("/delivery-challans").then((res) => res.data),
  });

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

  const { mutate: saveDamagedTransformer } = useMutation({
    mutationFn: (payload) => api.post("/damaged-transformers", payload),
    onSuccess: () => {
      alert("Saved! Check console for payload.");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  // 👉 On Submit
  const handleSubmit = () => {
    if (!selectedSN || !selectedTRFSI || !selectedInspection) {
      alert("Please select SN Number and TRFSI Number");
      return;
    }

    const payload = {
      snNumber: selectedSN,
      trfsiNo: selectedTRFSI.trfsiNo,
      finalInspectionId: selectedInspection.id,
      inspectionDate: selectedInspection.inspectionDate,
      reasonOfDamaged,
      ctlReportNo,
      ctlReportDate: dayjs(ctlReportDate).format("YYYY-MM-DD"),
      liftingLetterNo,
      liftingLetterDate: dayjs(liftingLetterDate).format("YYYY-MM-DD"),
      liftingFromAcos,
    };

    saveDamagedTransformer(payload);
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
