import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  IconButton,
  Stack,
  MenuItem,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { addMonths, format, isAfter } from "date-fns";
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

const GPFailureInformationModal = ({ open, handleClose, gpFailureData }) => {
  const queryClient = useQueryClient();
  const [trfsiNo, setTrfsiNo] = useState("");
  const [rating, setRating] = useState("");
  const [subDivision, setSubDivision] = useState("");

  const [trfFailureList, setTrfFailureList] = useState([]);
  const [trfFailureDate, setTrfFailureDate] = useState(null);
  const [dateOfInformation, setDateOfInformation] = useState(null);
  const [placeWhereFailed, setPlaceWhereFailed] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Load initial data if editing
  useEffect(() => {
    if (gpFailureData) {
      setTrfsiNo(gpFailureData.trfsiNo || "");
      setRating(gpFailureData.rating || "");
      setSubDivision(gpFailureData.subDivision || "");
      setTrfFailureList(gpFailureData.failureDetails || []);
    }
  }, [gpFailureData]);

  // Add or update trffailurelist to array
  const handleAddOrUpdateTRFFailureDetails = () => {
    if (!trfFailureDate || !dateOfInformation || !placeWhereFailed) return; // simple validation

    const newItem = {
      failureDate: dayjs(trfFailureDate).format("YYYY-MM-DD"),
      informationDate: dayjs(dateOfInformation).format("YYYY-MM-DD"),
      place: placeWhereFailed,
    };

    if (editingIndex !== null) {
      const updatedList = [...trfFailureList];
      updatedList[editingIndex] = newItem;
      setTrfFailureList(updatedList);
      setEditingIndex(null);
    } else {
      setTrfFailureList((prev) => [...prev, newItem]);
    }
    
    setPlaceWhereFailed(""); // clear input
    setTrfFailureDate(null); // clear date
    setDateOfInformation(null);
  };

  // Remove particular trffailuredata from array
  const handleRemoveTRFFailureData = (index) => {
    setTrfFailureList((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleEditTRFFailureData = (index) => {
    const item = trfFailureList[index];
    setTrfFailureDate(dayjs(item.failureDate));
    setDateOfInformation(dayjs(item.informationDate));
    setPlaceWhereFailed(item.place);
    setEditingIndex(index);
  };

  const { mutate: updateGPFailure, isLoading } = useMutation({
    mutationFn: (updatedFailure) =>
      api.put(`/gp-failures/${gpFailureData.id}`, updatedFailure),
    onSuccess: () => {
      queryClient.invalidateQueries(["gpFailures"]);
      handleClose();
    },
  });

  const handleSubmit = () => {
    // if (!gpFailureData || !gpFailureData.deliveryChallan) {
    //   // Handle the case where deliveryChalan is not available
    //   alert("Delivery Challan data is not available.");
    //   return;
    // }

    const challanDate = new Date(gpFailureData.deliveryChallan?.createdAt);
    const guaranteeMonths =
      gpFailureData.deliveryChallan.finalInspection.deliverySchedule.guaranteePeriodMonths;
    const expiryDate = addMonths(challanDate, guaranteeMonths);
    const today = new Date();
    const isUnderGuarantee = isAfter(expiryDate, today);

    const data = {
      trfsiNo: trfsiNo,
      rating,
      deliveryChalanId: gpFailureData?.deliveryChalanId,
      subDivision,
      failureDetails: trfFailureList,
      guaranteeExpiry: expiryDate.toISOString(),
      guaranteeStatus: isUnderGuarantee ? "Under Guarantee" : "Expired",
    };
    updateGPFailure(data);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Edit G.P. Failure Information
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box mt={2}>
          <TextField
            fullWidth
            label="TRFSI No"
            variant="outlined"
            margin="normal"
            value={trfsiNo}
            onChange={(e) => setTrfsiNo(e.target.value)}
          />

          <TextField
            fullWidth
            label="Rating"
            variant="outlined"
            margin="normal"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          
          <TextField
            fullWidth
            label="Sub-division"
            variant="outlined"
            margin="normal"
            value={subDivision}
            onChange={(e) => setSubDivision(e.target.value)}
          />

          {gpFailureData?.deliveryChallan && (
            <Paper
              elevation={2}
              sx={{
                p: 3,
                bgcolor: "#f9f9f9",
                borderRadius: 2,
                mt: 2,
              }}
            >
              <Typography variant="h6" gutterBottom color="secondary">
                Transformer Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Material Name"
                    value={gpFailureData.deliveryChallan?.materialDescription?.name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="TN Number"
                    value={
                      gpFailureData?.deliveryChallan?.finalInspection?.deliverySchedule
                        ?.tnNumber
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="DI No"
                    value={gpFailureData.deliveryChallan?.finalInspection?.diNo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="DI Date"
                    value={gpFailureData.deliveryChallan?.finalInspection?.diDate}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Challan No"
                    value={gpFailureData.deliveryChallan?.challanNo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Challan Created Date"
                    value={gpFailureData.deliveryChallan?.createdAt}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Consignee Name"
                    value={gpFailureData.deliveryChallan?.consignee?.name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Guarantee Period (Months)"
                    value={
                      gpFailureData.deliveryChallan?.finalInspection?.deliverySchedule
                        ?.guaranteePeriodMonths
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* New Fields */}
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    label="Guarantee Expiry Date"
                    value={gpFailureData.guaranteeExpiry && !isNaN(new Date(gpFailureData.guaranteeExpiry)) ? format(new Date(gpFailureData.guaranteeExpiry), "yyyy-MM-DD") : "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Guarantee Status"
                    value={gpFailureData.guaranteeStatus}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      style: {
                        color: gpFailureData.guaranteeStatus === "Under Guarantee" ? "green" : "red",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="TFR Failure Date"
              value={trfFailureDate}
              onChange={(date) => setTrfFailureDate(date)}
              format="DD/MM/YYYY"
              sx={{ mt: 1, mb: 1 }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Information Date"
              value={dateOfInformation}
              onChange={(date) => setDateOfInformation(date)}
              format="DD/MM/YYYY"
              sx={{ mt: 1, mb: 1 }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <TextField
            label="place Where Failed"
            fullWidth
            value={placeWhereFailed}
            margin="normal"
            onChange={(e) => setPlaceWhereFailed(e.target.value)}
          />

          <Button
            variant="outlined"
            onClick={handleAddOrUpdateTRFFailureDetails}
            sx={{ mt: 1 }}
          >
            {editingIndex !== null ? "Update" : "Add"} TRF Failure Details
          </Button>

          <Box mt={3}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
            >
              TRF Failure List
            </Typography>

            <TableContainer
              component={Paper}
              elevation={3}
              sx={{ borderRadius: 2 }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      #
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Failure Date
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Information Date
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Place
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {trfFailureList.length > 0 ? (
                    trfFailureList.map((gp, i) => (
                      <TableRow key={i} hover>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {gp.failureDate
                            ? dayjs(gp.failureDate).format("YYYY-MM-DD")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {gp.informationDate
                            ? dayjs(gp.informationDate).format(
                                "YYYY-MM-DD"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>{gp.place || "-"}</TableCell>
                        <TableCell align="center">
                          {/* <IconButton
                            color="primary"
                            onClick={() => handleEditTRFFailureData(i)}
                          >
                            Edit
                          </IconButton> */}
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleRemoveTRFFailureData(i)
                            }
                          >
                            ❌
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No TRF Failure Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

          <Box mt={4} textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
    </Modal>
  );
};

export default GPFailureInformationModal;