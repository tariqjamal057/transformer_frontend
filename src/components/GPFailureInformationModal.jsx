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
  const [selectedChalan, setSelectedChalan] = useState(null);

  const [trfFailureList, setTrfFailureList] = useState([]);
  const [trfFailureDate, setTrfFailureDate] = useState(null);
  const [dateOfInformation, setDateOfInformation] = useState(null);
  const [placeWhereFailed, setPlaceWhereFailed] = useState("");

  const { data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () => api.get("/delivery-challans").then((res) => res.data),
  });

  // 🔹 Auto fetch whenever trfsiNo and rating are set
  useEffect(() => {
    if (trfsiNo && rating) {
      const found = deliveryChallans?.find((ch) => {
        const hasTrfsi = ch.finalInspectionDetail.shealingDetails.some(
          (s) => String(s.trfsiNo) === String(trfsiNo)
        );
        const sameRating =
          ch.finalInspectionDetail.deliverySchedule.rating
            .toLowerCase()
            .trim() === rating.toLowerCase().trim();

        return hasTrfsi && sameRating;
      });

      setSelectedChalan(found || null);
    } else {
      setSelectedChalan(null);
    }
  }, [trfsiNo, rating, deliveryChallans]);

  // Add trffailurelist to array
  const handleAddTRFFailureDetails = () => {
    if (!trfFailureDate || !dateOfInformation || !placeWhereFailed) return; // simple validation

    const newItem = {
      failureDate: dayjs(trfFailureDate).format("YYYY-MM-DD"),
      informationDate: dayjs(dateOfInformation).format("YYYY-MM-DD"),
      place: placeWhereFailed,
    };

    setTrfFailureList((prev) => [...prev, newItem]);
    setPlaceWhereFailed(""); // clear input
    setTrfFailureDate(null); // clear date
    setDateOfInformation(null);
  };

  // Remove particular trffailuredata from array
  const handleRemoveTRFFailureData = (index) => {
    setTrfFailureList((prev) => prev.filter((_, i) => i !== index));
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
    const data = {
      trfSiNo: parseInt(trfsiNo),
      rating,
      deliveryChalanId: selectedChalan.id,
      trfFailureList,
    };
    if (data) {
      updateGPFailure(data);
    } else {
      alert("No matching record found.");
    }
  };

  // Load initial data if editing
  useEffect(() => {
    if (gpFailureData) {
      setTrfsiNo(gpFailureData.trfSiNo || "");
      setRating(gpFailureData.rating || "");

      setSelectedChalan(gpFailureData.deliveryChalanDetails || "");

      const trfFailureList = (gpFailureData.trfFailureList || []).map((gp) => ({
        failureDate: gp.failureDate ? dayjs(gp.failureDate) : null,
        informationDate: gp.informationDate ? dayjs(gp.imposedDate) : null,
        place: gp.place,
      }));

      setTrfFailureList(trfFailureList);
    }
  }, [gpFailureData]);

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

          {selectedChalan &&
            (() => {
              const challanDate = new Date(selectedChalan.createdAt);
              const guaranteeMonths =
                selectedChalan.finalInspectionDetail.deliverySchedule
                  .guaranteePeriodMonths;

              // Expiry = challanCreatedDate + guaranteePeriodMonths
              const expiryDate = addMonths(challanDate, guaranteeMonths);

              // Status check
              const today = new Date();
              const isUnderGuarantee = isAfter(expiryDate, today);

              return (
                <>
                  <TextField
                    label="Material Name"
                    value={selectedChalan.materialDescription.materialName}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="TN Number"
                    value={
                      selectedChalan.finalInspectionDetail.deliverySchedule
                        .tnNumber
                    }
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="DI No"
                    value={selectedChalan.finalInspectionDetail.diNo}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="DI Date"
                    value={selectedChalan.finalInspectionDetail.diDate}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Challan No"
                    value={selectedChalan.challanNo}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Challan Created Date"
                    value={selectedChalan.createdAt}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Consignee Name"
                    value={selectedChalan.consigneeDetails.name}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Guarantee Period (Months)"
                    value={
                      selectedChalan.finalInspectionDetail.deliverySchedule
                        .guaranteePeriodMonths
                    }
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Guarantee Expiry Date"
                    value={format(expiryDate, "yyyy-MM-dd")}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    margin="normal"
                  />

                  <TextField
                    label="Guarantee Status"
                    value={isUnderGuarantee ? "Under Guarantee" : "Expired"}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                      style: {
                        color: isUnderGuarantee ? "green" : "red",
                        fontWeight: "bold",
                      },
                    }}
                  />

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="TFR Failure Date"
                      value={trfFailureDate}
                      onChange={(date) => setTrfFailureDate(date)}
                      sx={{ mt: 1, mb: 1 }}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Information Date"
                      value={dateOfInformation}
                      onChange={(date) => setDateOfInformation(date)}
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
                    onClick={handleAddTRFFailureDetails}
                    sx={{ mt: 1 }}
                  >
                    Add TRF Failure Details
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
                </>
              );
            })()}

          <Box mt={4} textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default GPFailureInformationModal;