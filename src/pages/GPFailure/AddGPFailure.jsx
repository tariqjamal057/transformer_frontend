import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addMonths, format, isAfter } from "date-fns";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddGPFailureInformation = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [trfsiNo, setTrfsiNo] = useState("");
  const [rating, setRating] = useState("");
  const [selectedChalan, setSelectedChalan] = useState(null);
  const [subDivision, setSubDivision] = useState("");

  const [trfFailureList, setTrfFailureList] = useState([]);
  const [trfFailureDate, setTrfFailureDate] = useState(null);
  const [dateOfInformation, setDateOfInformation] = useState(null);
  const [placeWhereFailed, setPlaceWhereFailed] = useState("");

  const { data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () => api.get("/delivery-challans?all=true").then((res) => res.data),
  });

  const addGPFailureMutation = useMutation({
    mutationFn: (newFailure) => api.post("/gp-failures", newFailure),
    onSuccess: () => {
      setAlertBox({open: true, msg: "GP Failure Information added successfully!", error: false});
      queryClient.invalidateQueries(["gpFailures"]);
      navigate("/GPFailureInformation-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  useEffect(() => {
    if (trfsiNo && rating) {
      const found = deliveryChallans?.find((ch) => {
        const hasTrfsi = ch.finalInspection.sealingDetails.some(
          (s) => String(s.trfSiNo) === String(trfsiNo)
        );
        if (hasTrfsi){
          return ch
        }
        // // const sameRating =
        // //   ch.finalInspection.deliverySchedule.rating === rating;
        
        // console.log("hastrsif ", hasTrfsi)
        // // console.log("sameRating ", sameRating)
        // return hasTrfsi;
      });
      console.log("found ", found)
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

  const handleSubmit = () => {
    if (!selectedChalan) {
      setAlertBox({open: true, msg: "No matching record found. Please check TRFSI No and Rating.", error: true});
      return;
    }

    const challanDate = new Date(selectedChalan.createdAt);
    const guaranteeMonths = selectedChalan.finalInspection.deliverySchedule.guaranteePeriodMonths;
    const expiryDate = addMonths(challanDate, guaranteeMonths);
    const today = new Date();
    const isUnderGuarantee = isAfter(expiryDate, today);

    const data = {
      trfsiNo: trfsiNo,
      rating,
      deliveryChallanId: selectedChalan.id,
      subDivision,
      failureDetails: trfFailureList, // Renamed
      guaranteeExpiry: expiryDate.toISOString(), // Added
      guaranteeStatus: isUnderGuarantee ? "Under Guarantee" : "Expired", // Added
    };
    addGPFailureMutation.mutate(data);
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
            Add GP Failure Information
          </Typography>

          {/* Input Section */}
          <Grid container spacing={2} columns={{ xs: 1, sm: 1, lg: 3, md: 3 }} sx={{ mb: 3 }}>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="TRFSI No"
                variant="outlined"
                value={trfsiNo}
                onChange={(e) => setTrfsiNo(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Rating"
                variant="outlined"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                fullWidth
                label="Sub-division"
                variant="outlined"
                value={subDivision}
                onChange={(e) => setSubDivision(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Autofilled Details */}
          {selectedChalan &&
            (() => {
              const challanDate = new Date(selectedChalan.createdAt);
              const guaranteeMonths =
                selectedChalan.finalInspection.deliverySchedule
                  .guaranteePeriodMonths;

              // Expiry = challanCreatedDate + guaranteePeriodMonths
              const expiryDate = addMonths(challanDate, guaranteeMonths);

              // Status check
              const today = new Date();
              const isUnderGuarantee = isAfter(expiryDate, today);

              return (
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
                        value={selectedChalan.materialDescription.name}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="TN Number"
                        value={
                          selectedChalan.finalInspection.deliverySchedule
                            .tnNumber
                        }
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="DI No"
                        value={selectedChalan.finalInspection.diNo}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="DI Date"
                        value={selectedChalan.finalInspection.diDate}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Challan No"
                        value={selectedChalan.challanNo}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Challan Created Date"
                        value={selectedChalan.createdAt}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Consignee Name"
                        value={selectedChalan.consignee.name}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Guarantee Period (Months)"
                        value={guaranteeMonths}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    {/* New Fields */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Guarantee Expiry Date"
                        value={format(expiryDate, "yyyy-MM-dd")}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Guarantee Status"
                        value={isUnderGuarantee ? "Under Guarantee" : "Expired"}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                          style: {
                            color: isUnderGuarantee ? "green" : "red",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              );
            })()}

          {/* Input Section */}
          <Grid
            container
            spacing={2}
            columns={{ xs: 1, sm: 1, lg: 3, md: 3 }}
            sx={{ mb: 3, mt: 3 }}
          >
            <Grid item size={1}>
              <TextField
                label="place Where Failed"
                fullWidth
                value={placeWhereFailed}
                onChange={(e) => setPlaceWhereFailed(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="Information Date"
                value={dateOfInformation}
                onChange={(date) =>
                  setDateOfInformation(date ? dayjs(date) : null)
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <Box display="flex" gap={1}>
                <DatePicker
                  label="TFR Failure Date"
                  value={trfFailureDate}
                  onChange={(date) =>
                    setTrfFailureDate(date ? dayjs(date) : null)
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddTRFFailureDetails}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            {/* Show List of Failures in Table */}
            {trfFailureList.length > 0 && (
              <Grid item size={12}>
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          #
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Failure Date
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Information Date
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Place
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", fontWeight: "bold" }}
                          align="center"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trfFailureList.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#f9f9f9",
                            },
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.failureDate}</TableCell>
                          <TableCell>{item.informationDate}</TableCell>
                          <TableCell>{item.place}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveTRFFailureData(index)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>

          {/* Submit Button */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
              disabled={addGPFailureMutation.isLoading}
            >
              {addGPFailureMutation.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Submit Failure Info"
              )}
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddGPFailureInformation;
