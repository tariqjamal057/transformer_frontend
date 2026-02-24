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
  Alert,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import dayjs from "dayjs";

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

  const [selectedNewGPReceiptRecord, setSelectedNewGPReceiptRecord] =
    useState(null);
  const [selectedGPFailure, setSelectedGPFailure] = useState(null);

  const { data: newGPReceiptRecords, isLoading: isLoadingNewGPReceiptRecords } =
    useQuery({
      queryKey: ["newGPReceiptRecordsWithRelations"],
      queryFn: () =>
        api
          .get("/new-gp-receipt-records?all=true&includeRelations=true")
          .then((res) => res.data),
    });

  const { data: gpFailures, isLoading: isLoadingGPFailures } = useQuery({
    queryKey: ["gpFailuresWithRelations"],
    queryFn: () =>
      api
        .get("/gp-failures?all=true&includeRelations=true")
        .then((res) => res.data),
  });

  const { data: gpReceiptNotes, isLoading: isLoadingGPReceiptNotes } = useQuery(
    {
      queryKey: ["gpReceiptNotes"],
      queryFn: () =>
        api.get("/gp-receipt-notes?all=true").then((res) => res.data),
    },
  );

  const addFailureAnalysisMutation = useMutation({
    mutationFn: (newAnalysis) => api.post("/failure-analyses", newAnalysis),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Failure Analysis added successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["failureAnalyses"]);
      navigate("/failureAnalysis-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
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
      setSelectedNewGPReceiptRecord(null);
      setSelectedGPFailure(null);
      return;
    }

    if (newGPReceiptRecords && gpFailures && gpReceiptNotes) {
      const foundNewGPReceiptRecord = newGPReceiptRecords.find(
        (rec) => String(rec.sinNo) === String(sinNo),
      );

      setSelectedNewGPReceiptRecord(foundNewGPReceiptRecord || null);

      if (foundNewGPReceiptRecord) {
        const trfSiNo = foundNewGPReceiptRecord.trfsiNo;
        const rating = foundNewGPReceiptRecord.rating;
        const wound =
          foundNewGPReceiptRecord.deliveryChallan?.finalInspection
            ?.deliverySchedule?.wound || "";
        const phase =
          foundNewGPReceiptRecord.deliveryChallan?.materialDescription?.phase ||
          "";
        const tnNumber =
          foundNewGPReceiptRecord.deliveryChallan?.finalInspection
            ?.deliverySchedule?.tnNumber || "";

        const gpReceiptNoteId = foundNewGPReceiptRecord.gpReceiptNoteId;
        const relatedNote = gpReceiptNotes.find(
          (n) => n.id === gpReceiptNoteId,
        );
        const acosName = relatedNote?.acos || "";

        setFormData((prev) => ({
          ...prev,
          trfSiNo,
          rating,
          tnNumber,
          wound,
          phase,
          acosName,
        }));

        // Match in gpFailures
        const matchedGPFailure = gpFailures.find(
          (gf) =>
            String(gf.trfsiNo) === String(trfSiNo) ||
            String(gf.rating) === String(rating) ||
            String(
              gf.deliveryChallan?.finalInspection?.deliverySchedule?.wound,
            ) === String(wound) ||
            String(
              gf.deliveryChallan?.finalInspection?.deliverySchedule?.tnNumber,
            ) === String(tnNumber),
        );

        setSelectedGPFailure(matchedGPFailure || null);

        if (matchedGPFailure) {
          const failureDetails = matchedGPFailure.failureDetails?.[0]; // Assuming first detail
          setFormData((prev) => ({
            ...prev,
            subDivision: matchedGPFailure.subDivision,
            locationOfFailure: failureDetails?.place || "",
            dateOfSupply: failureDetails?.informationDate
              ? dayjs(failureDetails.informationDate).format("YYYY-MM-DD")
              : "",
            dateOfExpiry: failureDetails?.failureDate
              ? dayjs(failureDetails.failureDate).format("YYYY-MM-DD")
              : "",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            subDivision: "",
            locationOfFailure: "",
            dateOfSupply: "",
            dateOfExpiry: "",
          }));
        }
      } else {
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
      }
    }
  }, [sinNo, newGPReceiptRecords, gpFailures, gpReceiptNotes]);

  // Handle Submit
  const handleSubmit = () => {
    const missingFields = [];
    if (!sinNo) missingFields.push("SIN No");
    if (!reason) missingFields.push("Reason of Failure");
    if (reason === "Other Reason" && !otherReason) missingFields.push("Specify Other Reason");

    if (missingFields.length > 0) {
      setAlertBox({
        open: true,
        msg: `Please fill required fields: ${missingFields.join(", ")}`,
        error: true,
      });
      return;
    }

    if (!selectedNewGPReceiptRecord || !selectedGPFailure) {
      setAlertBox({
        open: true,
        msg: "Please ensure both GP Receipt Record and GP Failure are matched.",
        error: true,
      });
      return;
    }

    const finalReason = reason === "Other Reason" ? otherReason : reason;
    const payload = {
      acosName: formData.acosName,
      reasonOfFailure: finalReason,
      newGPReceiptRecordId: selectedNewGPReceiptRecord.id,
      gpFailureId: selectedGPFailure.id,
    };

    addFailureAnalysisMutation.mutate(payload);
  };

  const isDataLoading =
    isLoadingNewGPReceiptRecords ||
    isLoadingGPFailures ||
    isLoadingGPReceiptNotes;

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

        {isDataLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
            <Typography ml={2}>Loading necessary data...</Typography>
          </Box>
        )}
        {!isDataLoading &&
          (!newGPReceiptRecords || !gpFailures || !gpReceiptNotes) && (
            <Alert severity="error" sx={{ my: 2 }}>
              Failed to load required data. Please try again.
            </Alert>
          )}

        {/* Input Section */}
        <Grid container spacing={2} columns={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
          {/* SIN No */}
          <Grid item xs={1}>
            <TextField
              fullWidth
              label="SIN No"
              variant="outlined"
              value={sinNo}
              onChange={(e) => setSinNo(e.target.value)}
              disabled={isDataLoading}
              required
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="TRFSI No"
              variant="outlined"
              value={formData.trfSiNo}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Rating"
              variant="outlined"
              value={formData.rating}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Wound"
              variant="outlined"
              value={formData.wound}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Phase"
              variant="outlined"
              value={formData.phase}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="TN No."
              variant="outlined"
              value={formData.tnNumber}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Received From Acos"
              variant="outlined"
              value={formData.acosName}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Sub-Division"
              variant="outlined"
              value={formData.subDivision}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Location Of Failure"
              variant="outlined"
              value={formData.locationOfFailure}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
            <TextField
              fullWidth
              label="Date Of Supply"
              variant="outlined"
              value={formData.dateOfSupply}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={1}>
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
          <FormControl fullWidth required>
            <InputLabel id="reason-label">Reason of Failure</InputLabel>
            <Select
              labelId="reason-label"
              label="Reason Of Failure"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={
                !selectedNewGPReceiptRecord ||
                !selectedGPFailure ||
                isDataLoading
              }
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
              disabled={isDataLoading}
              required
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
            disabled={
              addFailureAnalysisMutation.isLoading ||
              isDataLoading ||
              !selectedNewGPReceiptRecord ||
              !selectedGPFailure
            }
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
