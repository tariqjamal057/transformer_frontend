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

  const { data: deliveryChallanList = [] } = useQuery({
    queryKey: ["allDeliveryChallans"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
    placeholderData: [],
  });

  // State for selected objects from dropdowns
  const [selectedSr, setSelectedSr] = useState(null);
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

  const srNumberOptions = useMemo(() => {
    return deliveryChallanList.map((challan) => ({
      label: `${challan.finalInspection.serialNumberFrom} TO ${challan.finalInspection.serialNumberTo}`,
      challan,
    }));
  }, [deliveryChallanList]);

  const challanOptions = useMemo(() => {
    if (!selectedSr) return [];
    const finalInspectionId = selectedSr.challan.finalInspectionId;
    return deliveryChallanList.filter(
      (challan) => challan.finalInspectionId === finalInspectionId,
    );
  }, [deliveryChallanList, selectedSr]);

  const challanNoOptions = useMemo(() => {
    return challanOptions.map((challan) => challan.challanNo);
  }, [challanOptions]);

  const challanDateOptions = useMemo(() => {
    return challanOptions.map((challan) =>
      dayjs(challan.challanCreatedAt).format("YYYY-MM-DD"),
    );
  }, [challanOptions]);

  const deliveredFromAcosOptions = useMemo(() => {
    return challanOptions.map((challan) => challan.consignorName);
  }, [challanOptions]);

  const handleSrNumberChange = (_, value) => {
    setSelectedSr(value);
    setSelectedTrfsiNo(null);
    setSelectedChallanNo(null);
    setSelectedChallanDate(null);
    setSelectedDeliveredFromAcos(null);
  };

  const handleSubmit = () => {
    if (!selectedSr || !selectedTrfsiNo) {
      setAlertBox({
        open: true,
        msg: "Please select an SR No and a TRFSI Number.",
        error: true,
      });
      return;
    }

    const payload = {
      serialNo: String(selectedTrfsiNo),

      snNumberRange: selectedSr.label,

      deliveryChallanId: selectedSr.challan.id,

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

      challanNo: selectedSr.challan.challanNo,

      challanDate: selectedSr.challan.challanCreatedAt,

      deliveredToAcos: selectedSr.challan.consignorName,
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
                  options={srNumberOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedSr}
                  onChange={handleSrNumberChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Select SR No" />
                  )}
                />
              </Grid>

              {/* TRFSI Number Dropdown */}
              <Grid item size={1}>
                <Autocomplete
                  options={
                    selectedSr?.challan?.finalInspection?.sealingDetails?.map(
                      (s) => s.trfSiNo,
                    ) || []
                  }
                  getOptionLabel={(option) => option.toString()}
                  value={selectedTrfsiNo}
                  onChange={(_, newValue) => setSelectedTrfsiNo(newValue)}
                  disabled={!selectedSr}
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
                  value={
                    selectedSr?.challan?.finalInspection?.deliverySchedule
                      ?.tnNumber || ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Rating In KVA"
                  value={
                    selectedSr?.challan?.finalInspection?.deliverySchedule
                      ?.rating || ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Wound"
                  value={
                    selectedSr?.challan?.finalInspection?.deliverySchedule
                      ?.wound || ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Phase"
                  value={
                    selectedSr?.challan?.finalInspection?.deliverySchedule
                      ?.phase || ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Inspection Officers"
                  value={
                    selectedSr?.challan?.finalInspection?.inspectionOfficers?.join(
                      ", ",
                    ) || ""
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
                  label="Date of Inspection After Repair"
                  value={
                    selectedSr?.challan?.finalInspection?.inspectionDate
                      ? dayjs(
                          selectedSr.challan.finalInspection.inspectionDate,
                        ).format("YYYY-MM-DD")
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
                  value={selectedSr?.challan?.challanNo || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Challan Date"
                  value={
                    selectedSr?.challan?.challanCreatedAt
                      ? dayjs(selectedSr.challan.challanCreatedAt).format(
                          "YYYY-MM-DD",
                        )
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Delivered From ACOS"
                  value={selectedSr?.challan?.consignorName || ""}
                  InputProps={{ readOnly: true }}
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
