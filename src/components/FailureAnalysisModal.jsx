import { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";

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

const FailureAnalysisModal = ({ open, handleClose, failureAnalysisData }) => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [sinNo, setSinNo] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [acosName, setAcosName] = useState("");

  const [formData, setFormData] = useState({
    trfSiNo: "",
    rating: "",
    wound: "",
    phase: "",
    tnNumber: "",
    subDivision: "",
    locationOfFailure: "",
    dateOfSupply: "",
    dateOfExpiry: "",
  });

  useEffect(() => {
    if (failureAnalysisData) {
      const { newGPReceiptRecord, gpFailure } = failureAnalysisData;

      setSinNo(newGPReceiptRecord?.sinNo || "");
      setAcosName(failureAnalysisData.acosName || "");

      const predefinedReasons = [
        "Oil theft",
        "Oil leakage",
        "Over Load",
        "Insulation Failure",
        "Water Presence",
        "Protection By Pass",
      ];
      if (predefinedReasons.includes(failureAnalysisData.reasonOfFailure)) {
        setReason(failureAnalysisData.reasonOfFailure);
        setOtherReason("");
      } else {
        setReason("Other Reason");
        setOtherReason(failureAnalysisData.reasonOfFailure || "");
      }

      const wound =
        newGPReceiptRecord?.deliveryChallan?.finalInspection?.deliverySchedule
          ?.wound || "";
      const tnNumber =
        newGPReceiptRecord?.deliveryChallan?.finalInspection?.deliverySchedule
          ?.tnNumber || "";
      const phase =
        newGPReceiptRecord?.deliveryChallan?.materialDescription?.phase || "";
      const trfSiNo = newGPReceiptRecord?.trfsiNo || "";
      const rating = newGPReceiptRecord?.rating || "";

      const failureDetails = gpFailure?.failureDetails?.[0]; // Assuming first detail for display

      setFormData({
        trfSiNo: trfSiNo,
        rating: rating,
        wound: wound,
        phase: phase,
        tnNumber: tnNumber,
        subDivision: gpFailure?.subDivision || "",
        locationOfFailure: failureDetails?.place || "",
        dateOfSupply: failureDetails?.informationDate
          ? dayjs(failureDetails.informationDate).format("DD-MM-YYYY")
          : "",
        dateOfExpiry: failureDetails?.failureDate
          ? dayjs(failureDetails.failureDate).format("DD-MM-YYYY")
          : "",
      });
    }
  }, [failureAnalysisData]);

  const { mutate: updateFailureAnalysis, isLoading } = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/failure-analyses/${failureAnalysisData.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["failureAnalyses"]);
      setAlertBox({
        open: true,
        msg: "Failure Analysis updated successfully!",
        error: false,
      });
      handleClose();
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  // Handle Submit
  const handleSubmit = () => {
    const finalReason = reason === "Other Reason" ? otherReason : reason;
    const payload = {
      acosName: acosName, // This can be edited
      reasonOfFailure: finalReason,
      newGPReceiptRecordId: failureAnalysisData.newGPReceiptRecordId, // Not editable in this modal
      gpFailureId: failureAnalysisData.gpFailureId, // Not editable in this modal
    };
    updateFailureAnalysis(payload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Edit Failure Analysis Details
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box mt={2}>
            {/* Input Section */}
            <Grid
              container
              spacing={2}
              columns={{ xs: 1, sm: 2 }}
              sx={{ mb: 3 }}
            >
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="SIN No"
                  variant="outlined"
                  value={sinNo}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="TRFSI No"
                  variant="outlined"
                  value={formData.trfSiNo}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Rating"
                  variant="outlined"
                  value={formData.rating}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Wound"
                  variant="outlined"
                  value={formData.wound}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Phase"
                  variant="outlined"
                  value={formData.phase}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="TN No."
                  variant="outlined"
                  value={formData.tnNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="ACOS Name"
                  variant="outlined"
                  value={acosName}
                  onChange={(e) => setAcosName(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Sub-Division"
                  variant="outlined"
                  value={formData.subDivision}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Location Of Failure"
                  variant="outlined"
                  value={formData.locationOfFailure}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Date Of Supply"
                  variant="outlined"
                  value={formData.dateOfSupply}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Date Of Expiry Of GP"
                  variant="outlined"
                  value={formData.dateOfExpiry}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>

            {/* Reason of Failure Section */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="reason-label">Reason of Failure</InputLabel>
                <Select
                  labelId="reason-label"
                  label="Reason Of Failure"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                >
                  <MenuItem value="Oil theft">Oil theft</MenuItem>
                  <MenuItem value="Oil leakage">Oil leakage</MenuItem>
                  <MenuItem value="Over Load">Over Load</MenuItem>
                  <MenuItem value="Insulation Failure">
                    Insulation Failure
                  </MenuItem>
                  <MenuItem value="Water Presence">Water Presence</MenuItem>
                  <MenuItem value="Protection By Pass">
                    Protection By Pass
                  </MenuItem>
                  <MenuItem value="Other Reason">Other Reason</MenuItem>
                </Select>
              </FormControl>

              {reason === "Other Reason" && (
                <TextField
                  sx={{ mt: 2 }}
                  fullWidth
                  label="Specify Other Reason"
                  variant="outlined"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  disabled={isLoading}
                />
              )}
            </Box>

            <Box mt={2} textAlign="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{ px: 5, py: 1.5, borderRadius: 3 }}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default FailureAnalysisModal;
