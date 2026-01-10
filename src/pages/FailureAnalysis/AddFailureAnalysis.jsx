import { useEffect, useState, useContext } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddFailureAnalysis = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
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

  const addFailureAnalysisMutation = useMutation({
    mutationFn: (newAnalysis) => api.post("/failure-analyses", newAnalysis),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Failure Analysis added successfully!", error: false});
      queryClient.invalidateQueries(["failureAnalyses"]);
      navigate("/failureAnalysis-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

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

      const wound = deliveryChalan.finalInspectionDetail.deliverySchedule.wound;
      const tnNumber = deliveryChalan.finalInspectionDetail.deliverySchedule.tnNumber;
      const phase = deliveryChalan.materialDescription.phase;

      setSelectedReceipt(foundRecord);

      setFormData((prev) => ({
        ...prev,
        trfSiNo: trfsiNo,
        rating,
        tnNumber,
        wound,
        phase,
        acosName: foundNote?.acosName || "",
      }));

      // Match in gpFailureData
      const matchedFailure = gpFailures.find(
        (f) =>
          f.trfSiNo === trfsiNo &&
          f.rating === rating &&
          f.deliveryChalan.finalInspectionDetail.deliverySchedule.wound === wound &&
          f.deliveryChalan.finalInspectionDetail.deliverySchedule.tnNumber === tnNumber
      );

      if (matchedFailure) {
        setSelectedFailure(matchedFailure);

        setFormData((prev) => ({
          ...prev,
          subDivision: matchedFailure.subDivision,
          locationOfFailure: matchedFailure.placeOfFailure || "",
          dateOfSupply: matchedFailure.dateOfInformation || "",
          dateOfExpiry: matchedFailure.dateOfFailure || "",
        }));
      }
    }
  }, [sinNo, gpReceiptNotes, gpFailures]);

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

    addFailureAnalysisMutation.mutate(payload);
  };

  return (
    <div className="right-content w-100">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Add Failure Analysis
        </Typography>

        {/* Input Section */}
        <Grid container spacing={2} columns={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
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
            <TextField fullWidth label="TRFSI No" variant="outlined" value={formData.trfSiNo} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="Rating" variant="outlined" value={formData.rating} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="Wound" variant="outlined" value={formData.wound} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="Phase" variant="outlined" value={formData.phase} />
          </Grid>

          <Grid item size={1}>
            <TextField fullWidth label="TN No." variant="outlined" value={formData.tnNumber} />
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
              <MenuItem value="Insulation Failure">Insulation Failure</MenuItem>
              <MenuItem value="Water Presence">Water Presence</MenuItem>
              <MenuItem value="Protection By Pass">Protection By Pass</MenuItem>
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

        {/* Submit Button */}
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ px: 5, py: 1.5, borderRadius: 3 }}
            disabled={addFailureAnalysisMutation.isLoading}
          >
            {addFailureAnalysisMutation.isLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit Failure Info"
            )}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default AddFailureAnalysis;