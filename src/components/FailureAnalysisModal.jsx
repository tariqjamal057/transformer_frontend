import { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
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

const FailureAnalysisModal = ({ open, handleClose, failureAnalysisData }) => {
  const queryClient = useQueryClient();
  const [sinNo, setSinNo] = useState("");
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const [formData, setFormData] = useState({
    trfSiNo: "",
    rating: "",
    wound: "",
    phase: "",
    tnNumber: "",
    acosName: "",
    subDivision: "",
    locationOfFailure: "",
    dateOfSupply: "",
    dateOfExpiry: "",
  });

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedFailure, setSelectedFailure] = useState(null);

  const { data: gpReceiptNotes } = useQuery({
    queryKey: ["gpReceiptNotes"],
    queryFn: () => api.get("/gp-receipt-notes").then((res) => res.data),
  });

  const { data: gpFailures } = useQuery({
    queryKey: ["gpFailures"],
    queryFn: () => api.get("/gp-failures").then((res) => res.data),
  });

  // When user types SIN No → search in gpReceiptNotes
  useEffect(() => {
    if (sinNo === "") {
      setFormData({
        trfSiNo: "",
        rating: "",
        wound: "",
        phase: "",
        tnNumber: "",
        acosName: "",
        subDivision: "",
        locationOfFailure: "",
        dateOfSupply: "",
        dateOfExpiry: "",
      });
      setSelectedReceipt(null);
      setSelectedFailure(null);
      return;
    }

    let foundRecord = null;
    let foundNote = null;

    gpReceiptNotes?.forEach((note) => {
      if (note.sinNo.toLowerCase() === sinNo.toLowerCase()) {
        foundRecord = note;
        foundNote = note;
      }
    });

    if (foundRecord) {
      const { trfsiNo, rating, deliveryChalan } = foundRecord;

      const wound =
        deliveryChalan.finalInspectionDetail.deliverySchedule.wound;
      const tnNumber =
        deliveryChalan.finalInspectionDetail.deliverySchedule.tnNumber;
      const phase = deliveryChalan.materialDescription.phase;

      setSelectedReceipt(foundRecord);

      setFormData((prev) => ({
        ...prev,
        trfSiNo: trfsiNo,
        rating,
        wound,
        phase,
        tnNumber,
        acosName: foundNote?.acosName || "", // ✅ FIX: pull from gpReceiptNotes.acosName
      }));

      // Match in gpFailureData
      const matchedFailure = gpFailures?.find(
        (f) =>
          f.trfSiNo === trfsiNo &&
          f.rating === rating &&
          f.deliveryChalan.finalInspectionDetail.deliverySchedule
            .wound === wound &&
          f.deliveryChalan.finalInspectionDetail.deliverySchedule
            .tnNumber === tnNumber
      );

      if (matchedFailure) {
        setSelectedFailure(matchedFailure);

        setFormData((prev) => ({
          ...prev,
          subDivision: matchedFailure.subDivision,
          locationOfFailure: matchedFailure.trfFailureList[0]?.place || "",
          dateOfSupply: matchedFailure.trfFailureList[0]?.informationDate || "",
          dateOfExpiry: matchedFailure.trfFailureList[0]?.failureDate || "",
        }));
      }
    }
  }, [sinNo, gpReceiptNotes, gpFailures]);

  const { mutate: updateFailureAnalysis, isLoading } = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/failure-analyses/${failureAnalysisData.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["failureAnalyses"]);
      handleClose();
    },
  });

  // Handle Submit
  const handleSubmit = () => {
    const finalReason = reason === "Other Reason" ? otherReason : reason;
    const payload = {
      sinNo,
      acosName: formData.acosName,
      gpReceiptNoteId: selectedReceipt.id,
      gpFailureId: selectedFailure.id,
      reasonOfFailure: finalReason,
    };

    updateFailureAnalysis(payload);
  };

  // Load initial data if editing
  useEffect(() => {
    if (failureAnalysisData) {
      setSinNo(failureAnalysisData.sinNo || "");

      // Predefined reasons
      const predefinedReasons = [
        "Oil theft",
        "Oil leakage",
        "Over Load",
        "Insulation Failure",
        "Water Presense",
        "Protection By Pass",
        "Other Reason",
      ];

      // ✅ If reason is in list → set normally
      // ✅ If reason is custom → set dropdown to "Other Reason" and input value separately
      if (predefinedReasons.includes(failureAnalysisData.reasonOfFailure)) {
        setReason(failureAnalysisData.reasonOfFailure);
        setOtherReason("");
      } else {
        setReason("Other Reason");
        setOtherReason(failureAnalysisData.reasonOfFailure || "");
      }

      // ✅ set receipt & failure objects directly
      setSelectedReceipt(failureAnalysisData.receiptData || null);
      setSelectedFailure(failureAnalysisData.failureData || null);

      // ✅ map into formData for inputs
      const receipt = failureAnalysisData.receiptData || {};
      const failure = failureAnalysisData.failureData || {};
      const delivery =
        receipt.deliveryChalanDetails?.finalInspectionDetail
          ?.deliverySchedule || {};
      const material = receipt.deliveryChalanDetails?.materialDescription || {};

      setFormData({
        trfSiNo: receipt.trfsiNo || failure.trfSiNo || "",
        rating: receipt.rating || failure.rating || "",
        wound: delivery.wound || "",
        phase: material.phase || "",
        tnNumber: delivery.tnNumber || "",
        acosName: failureAnalysisData.acosName || "",
        subDivision: failure.subDivision || "",
        locationOfFailure: failure.trfFailureList?.[0]?.place || "",
        dateOfSupply: failure.trfFailureList?.[0]?.informationDate || "",
        dateOfExpiry: failure.trfFailureList?.[0]?.failureDate || "",
      });
    }
  }, [failureAnalysisData]);

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
              {/* SIN No */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="SIN No"
                  variant="outlined"
                  value={sinNo}
                  onChange={(e) => setSinNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="TRFSI No"
                  variant="outlined"
                  value={formData.trfSiNo}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Rating"
                  variant="outlined"
                  value={formData.rating}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Wound"
                  variant="outlined"
                  value={formData.wound}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Phase"
                  variant="outlined"
                  value={formData.phase}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Received From Acos"
                  variant="outlined"
                  value={formData.acosName}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Sub-Division"
                  variant="outlined"
                  value={formData.subDivision}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Location Of Failure"
                  variant="outlined"
                  value={formData.locationOfFailure}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Date Of Supply"
                  variant="outlined"
                  value={formData.dateOfSupply}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Date Of Expiry Of GP"
                  variant="outlined"
                  value={formData.dateOfExpiry}
                />
              </Grid>
            </Grid>

            {/* Reason of Failure Section */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="reason-label">Reason of Failure</InputLabel>
                <Select
                  label="Reason Of Failure"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
                />
              )}
            </Box>

            <Box mt={2} textAlign="center">
              <Button variant="contained" size="large" onClick={handleSubmit} disabled={isLoading}>
                {isLoading? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default FailureAnalysisModal;
