import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FaCloudUploadAlt } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { MyContext } from "../../App";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AddDeliverySchedule = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const today = dayjs();

  const [tnDetail, setTnDetail] = useState(""); // Changed back to tnDetail (string)
  const [rating, setRating] = useState("");
  const [loa, setLoa] = useState("");
  const [loaDate, setLoaDate] = useState(null);
  const [po, setPo] = useState("");
  const [poDate, setPoDate] = useState(null);
  const [commencementDays, setCommencementDays] = useState("");
  const [commencementDate, setCommencementDate] = useState(null);
  const [deliveryScheduleDate, setDeliveryScheduleDate] = useState(null);
  const [wound, setWound] = useState("");
  const [phase, setPhase] = useState("");

  // New State for Paired Logic
  const [imposedLiftingPairs, setImposedLiftingPairs] = useState([]);
  const [currentImposedLetter, setCurrentImposedLetter] = useState("");
  const [currentImposedDate, setCurrentImposedDate] = useState(null);
  const [currentLiftingLetter, setCurrentLiftingLetter] = useState("");
  const [currentLiftingDate, setCurrentLiftingDate] = useState(null);

  const [guranteeInMonth, setGuranteeInMonth] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [deliverySchedule, setDeliverySchedule] = useState([]);
  const [chalanDescription, setChalanDescription] = useState("");
  const [dateError, setDateError] = useState("");

  // State for Manual Schedule Entry
  const [newScheduleFrom, setNewScheduleFrom] = useState(null);
  const [newScheduleTo, setNewScheduleTo] = useState(null);
  const [newScheduleQty, setNewScheduleQty] = useState("");


  const addDeliveryScheduleMutation = useMutation({
    mutationFn: (newSchedule) => api.post("/delivery-schedules", newSchedule),
    onSuccess: () => {
      setAlertBox({ open: true, msg: "Delivery schedule added successfully!", error: false });
      queryClient.invalidateQueries(["deliverySchedules"]);
      navigate("/deliverySchedule-list"); // assuming this is the list page
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });


  // Auto calculate CP Date based on commencement days
  useEffect(() => {
    if (commencementDays && parseInt(commencementDays) > 0 && poDate) {
      const calculatedDate = dayjs(poDate).add(parseInt(commencementDays), "day");
      setCommencementDate(calculatedDate);
    } else {
      setCommencementDate(null);
    }
  }, [commencementDays, poDate]);

  // Add imposed letter to array
  const handleAddImposedLetter = () => {
    if (!currentImposedLetter || !currentImposedDate) return; // simple validation

    const newItem = {
      imposedLetterNo: currentImposedLetter,
      imposedDate: currentImposedDate,
      liftingLetterNo: null,
      liftingDate: null,
    };

    setImposedLiftingPairs((prev) => [...prev, newItem]);
    setCurrentImposedLetter(""); // clear input
    setCurrentImposedDate(null); // clear date
  };

  // Add lifting letter to array
  const handleAddLiftingLetter = () => {
    if (!currentLiftingLetter || !currentLiftingDate) return; // simple validation

    const updatedPairs = [...imposedLiftingPairs];
    const lastIndex = updatedPairs.length - 1;

    if (lastIndex >= 0) {
      updatedPairs[lastIndex] = {
        ...updatedPairs[lastIndex],
        liftingLetterNo: currentLiftingLetter,
        liftingDate: currentLiftingDate,
      };
      setImposedLiftingPairs(updatedPairs);
      setCurrentLiftingLetter(""); // clear input
      setCurrentLiftingDate(null); // clear date
    }
  };

  // Remove pair
  const handleRemovePair = (index) => {
    setImposedLiftingPairs((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ New Logic: Shift manual schedules when deferment changes
  useEffect(() => {
    if (deliverySchedule.length === 0) return;

    const validPairs = imposedLiftingPairs.filter((p) => p.imposedDate && p.liftingDate);

    const isDateDeferred = (date) => {
      return validPairs.some((pair) => {
        const imposed = dayjs(pair.imposedDate);
        const lifting = dayjs(pair.liftingDate);
        return (
          (date.isSame(imposed, "day") || date.isAfter(imposed, "day")) &&
          (date.isSame(lifting, "day") || date.isBefore(lifting, "day"))
        );
      });
    };

    const findEndDate = (startDate, activeDaysNeeded) => {
      let found = 0;
      let cursor = dayjs(startDate);
      while (found < activeDaysNeeded) {
        if (!isDateDeferred(cursor)) {
          found++;
        }
        if (found < activeDaysNeeded) {
          cursor = cursor.add(1, "day");
        }
      }
      return cursor;
    };

    let updatedSchedules = [];
    let currentStart = dayjs(commencementDate);

    deliverySchedule.forEach((seg, idx) => {
      // Calculate original active days (how many non-deferred days were in the original entry)
      // This is slightly complex because we need to know the state WHEN it was added.
      // Instead, we store the "intended duration" in a more robust way or recalculate.
      // For now, let's assume the user intended a specific number of calendar days if no deferment, 
      // or we use the current duration and just shift it.
      
      const prevStart = dayjs(seg.start, "DD MMM YYYY");
      const prevEnd = dayjs(seg.end, "DD MMM YYYY");
      
      // Calculate how many active days were in this segment previously
      let activeDays = 0;
      let temp = prevStart;
      while (temp.isBefore(prevEnd) || temp.isSame(prevEnd, "day")) {
         // Note: This recalculation uses the OLD deferment state? No, we don't have it.
         // Let's assume the user wants to keep the CURRENT duration but shift for NEW deferments.
         activeDays++; 
         temp = temp.add(1, "day");
      }

      // If it's the first segment, start at commencement
      if (idx === 0) {
        currentStart = dayjs(commencementDate);
      } else {
        currentStart = dayjs(updatedSchedules[idx - 1].end, "DD MMM YYYY").add(1, "day");
      }

      // Skip initial deferred days for the start
      while (isDateDeferred(currentStart)) {
        currentStart = currentStart.add(1, "day");
      }

      const newEnd = findEndDate(currentStart, activeDays);

      updatedSchedules.push({
        ...seg,
        start: currentStart.format("DD MMM YYYY"),
        end: newEnd.format("DD MMM YYYY"),
      });
    });

    // Only update if something actually changed to avoid infinite loops
    const hasChanged = JSON.stringify(updatedSchedules) !== JSON.stringify(deliverySchedule);
    if (hasChanged) {
      setDeliverySchedule(updatedSchedules);
    }
  }, [imposedLiftingPairs, commencementDate]);

  const handleAddSchedule = () => {
    if (!newScheduleFrom || !newScheduleTo || !newScheduleQty) {
      setAlertBox({
        open: true,
        msg: "Please fill all schedule fields: From, To, and Quantity.",
        error: true,
      });
      return;
    }

    const newItem = {
      start: newScheduleFrom.format("DD MMM YYYY"),
      end: newScheduleTo.format("DD MMM YYYY"),
      quantity: parseInt(newScheduleQty) || 0,
    };

    setDeliverySchedule((prev) => [...prev, newItem]);
    setNewScheduleFrom(null);
    setNewScheduleTo(null);
    setNewScheduleQty("");
  };

  const handleRemoveSchedule = (index) => {
    setDeliverySchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!tnDetail) missingFields.push("Tender No");
    if (!rating) missingFields.push("Rating");
    if (!wound) missingFields.push("Wound");
    if (!phase) missingFields.push("Phase");

    if (missingFields.length > 0) {
      setAlertBox({
        open: true,
        msg: `Please fill required fields: ${missingFields.join(", ")}`,
        error: true,
      });
      return;
    }

    const sumOfQuantities = deliverySchedule.reduce(
      (sum, item) => sum + (parseInt(item.quantity) || 0),
      0
    );

    if (totalQuantity && sumOfQuantities !== parseInt(totalQuantity)) {
      setAlertBox({
        open: true,
        error: true,
        msg: `Total quantity mismatch! Entered total = ${sumOfQuantities}, expected = ${totalQuantity}.`,
      });
      return;
    }

    const data = {
      tnNumber : tnDetail, // Use selectedTnId
      rating: rating ? parseInt(rating) : null,
      loa,
      loaDate: loaDate ? dayjs(loaDate).toISOString() : null,
      po,
      poDate: poDate ? dayjs(poDate).toISOString() : null,
      commencementDays: commencementDays ? parseInt(commencementDays) : null,
      commencementDate: commencementDate ? dayjs(commencementDate).toISOString() : null,
      deliveryScheduleDate: deliveryScheduleDate ? dayjs(deliveryScheduleDate).toISOString() : null,
      imposedLetters: imposedLiftingPairs
        .filter((p) => p.imposedLetterNo)
        .map((p) => ({
          imposedLetterNo: p.imposedLetterNo,
          date: p.imposedDate ? dayjs(p.imposedDate).format("YYYY-MM-DD") : null,
        })),
      liftingLetters: imposedLiftingPairs
        .filter((p) => p.liftingLetterNo)
        .map((p) => ({
          liftingLetterNo: p.liftingLetterNo,
          date: p.liftingDate ? dayjs(p.liftingDate).format("YYYY-MM-DD") : null,
        })),
      guaranteePeriodMonths: guranteeInMonth ? parseInt(guranteeInMonth) : null,
      totalQuantity: totalQuantity ? parseInt(totalQuantity) : null,
      deliverySchedule,
      chalanDescription: chalanDescription,
      wound,
      phase,
      createdAt: dayjs().toISOString(), // Add createdDate here
    };

    addDeliveryScheduleMutation.mutate(data);
  };

  const getMinFromDate = () => {
    if (deliverySchedule.length === 0) return commencementDate;
    const lastSchedule = deliverySchedule[deliverySchedule.length - 1];
    return dayjs(lastSchedule.end).add(1, "day");
  };

  const isScheduleComplete = () => {
    if (deliverySchedule.length === 0) return false;
    const lastSchedule = deliverySchedule[deliverySchedule.length - 1];
    return dayjs(lastSchedule.end).isSame(dayjs(deliveryScheduleDate), "day") || dayjs(lastSchedule.end).isAfter(dayjs(deliveryScheduleDate), "day");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Master Record
          </Typography>

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            {/* TN Number */}
            <Grid item size={1}>
              <TextField
                label="Tender No"
                fullWidth
                type="text"
                value={tnDetail}
                required
                onChange={(e) => setTnDetail(e.target.value)}
                
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                type="number"
                label="Rating"
                fullWidth
                required
                value={rating}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 || e.target.value === "") {
                    setRating(e.target.value);
                  }
                }}
                // Removed InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Wound"
                fullWidth
                required
                value={wound}
                onChange={(e) => setWound(e.target.value)}
                // Removed InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Phase"
                fullWidth
                required
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                // Removed InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* LOA and PO */}
            <Grid item size={1}>
              <TextField
                label="LOA No"
                fullWidth
                value={loa}
                onChange={(e) => setLoa(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="LOA Date"
                //minDate={today}
                value={loaDate}
                onChange={(date) => setLoaDate(date ? dayjs(date) : null)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="PO No"
                fullWidth
                value={po}
                onChange={(e) => setPo(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="PO Date"
                //minDate={today}
                value={poDate}
                onChange={(date) => setPoDate(date ? dayjs(date) : null)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            {/* CP Date and Days*/}
            <Grid item size={1}>
              <TextField
                type="number"
                label="Commencement Days"
                fullWidth
                value={commencementDays}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 || e.target.value === "") {
                    setCommencementDays(e.target.value);
                  }
                }}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="CP Date"
                minDate={today}
                value={commencementDate}
                readOnly
                //disabled
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="Delivery Schedule End Date"
                minDate={today}
                value={deliveryScheduleDate}
                onChange={(date) =>
                  setDeliveryScheduleDate(date ? dayjs(date) : null)
                }
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            {/* Total Quantity */}
            <Grid item size={1}>
              <TextField
                type="number"
                label="Total Order Quantity"
                fullWidth
                value={totalQuantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 || e.target.value === "") {
                    setTotalQuantity(e.target.value);
                  }
                }}
              />
            </Grid>


            {/* Deferment Pairs Logic */}
            <Grid item size={2}>
              <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                Defferment Details
              </Typography>
              {imposedLiftingPairs.map((pair, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  border={1}
                  borderColor="grey.300"
                  borderRadius={1}
                  mb={1}
                  bgcolor={pair.liftingLetterNo ? "#f1f8e9" : "#fff3e0"}
                >
                  <Box>
                    <Typography variant="body2">
                      <strong>Imposed:</strong> {pair.imposedLetterNo} (
                      {pair.imposedDate ? dayjs(pair.imposedDate).format("DD MMM YYYY") : ""})
                    </Typography>
                    {pair.liftingLetterNo && (
                      <Typography variant="body2">
                        <strong>Lifting:</strong> {pair.liftingLetterNo} (
                        {pair.liftingDate ? dayjs(pair.liftingDate).format("DD MMM YYYY") : ""})
                      </Typography>
                    )}
                  </Box>
                  <Button color="error" size="small" onClick={() => handleRemovePair(index)}>
                    <CancelIcon />
                  </Button>
                </Box>
              ))}
            </Grid>

            {/* Conditional Add Imposed/Lifting Inputs */}
            {(() => {
              const showAddImposed = imposedLiftingPairs.length === 0 || imposedLiftingPairs[imposedLiftingPairs.length - 1].liftingLetterNo;
              const showAddLifting = imposedLiftingPairs.length > 0 && !imposedLiftingPairs[imposedLiftingPairs.length - 1].liftingLetterNo;

              return (
                <>
                  {showAddImposed && (
                    <>
                      <Grid item size={1}>
                        <TextField
                          label="Defferment Imposed Letter No"
                          fullWidth
                          value={currentImposedLetter}
                          onChange={(e) => setCurrentImposedLetter(e.target.value)}
                        />
                      </Grid>
                      <Grid item size={1}>
                        <Box display="flex" gap={1}>
                          <DatePicker
                            label="Defferment Imposed Date"
                            value={currentImposedDate}
                            onChange={(date) => setCurrentImposedDate(date ? dayjs(date) : null)}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                          <Button variant="contained" onClick={handleAddImposedLetter}>
                            Add
                          </Button>
                        </Box>
                      </Grid>
                    </>
                  )}
                  {showAddLifting && (
                    <>
                      <Grid item size={1}>
                        <TextField
                          label="Defferment Lifting Letter No"
                          fullWidth
                          value={currentLiftingLetter}
                          onChange={(e) => setCurrentLiftingLetter(e.target.value)}
                        />
                      </Grid>
                      <Grid item size={1}>
                        <Box display="flex" gap={1}>
                          <DatePicker
                            label="Defferment Lifting Date"
                            value={currentLiftingDate}
                            onChange={(date) => setCurrentLiftingDate(date ? dayjs(date) : null)}
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                          <Button variant="contained" color="success" onClick={handleAddLiftingLetter}>
                            Add
                          </Button>
                        </Box>
                      </Grid>
                    </>
                  )}
                </>
              );
            })()}


            <Grid item size={1}>
              <TextField
                type="number"
                label="Gurantee Period In Month"
                fullWidth
                value={guranteeInMonth}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 || e.target.value === "") {
                    setGuranteeInMonth(e.target.value);
                  }
                }}
              />
            </Grid>

            <Grid item size={2}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Particulars"
                value={chalanDescription}
                onChange={(e) => setChalanDescription(e.target.value)}
                margin="normal"
              />
            </Grid>

            {/* Manual Delivery Schedule Entry */}
            {commencementDate && deliveryScheduleDate && !isScheduleComplete() && (
              <Grid item size={2}>
                <Typography variant="h6" mb={2}>
                  Add Delivery Schedule
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <DatePicker
                      label="From Date"
                      value={newScheduleFrom}
                      onChange={(date) => setNewScheduleFrom(date)}
                      minDate={getMinFromDate()}
                      maxDate={deliveryScheduleDate}
                      format="DD/MM/YYYY"
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <DatePicker
                      label="To Date"
                      value={newScheduleTo}
                      onChange={(date) => setNewScheduleTo(date)}
                      minDate={newScheduleFrom || getMinFromDate()}
                      maxDate={deliveryScheduleDate}
                      format="DD/MM/YYYY"
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={newScheduleQty}
                      onChange={(e) => setNewScheduleQty(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      onClick={handleAddSchedule}
                      fullWidth
                      className="btn-blue"
                    >
                      Add More Schedule
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item size={2}>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{ margin: "auto" }}
                disabled={addDeliveryScheduleMutation.isLoading}
              >
                <FaCloudUploadAlt />
                {addDeliveryScheduleMutation.isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "PUBLISH AND VIEW"
                )}
              </Button>
            </Grid>
          </Grid>

          {/* Date Error Message */}
          {dateError && (
            <Typography color="error" sx={{ mt: 2, fontWeight: "bold" }}>
              ⚠️ {dateError}
            </Typography>
          )}

          {/* Delivery Schedule Table */}
          {deliverySchedule.length > 0 && (
            <Paper sx={{ mt: 4, p: 2 }}>
              <Typography variant="h6" mb={2}>
                Delivery Schedule Calculation
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Period</TableCell>
                    <TableCell align="right">Quantity Per Month</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliverySchedule.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {item.start} - {item.end}
                      </TableCell>
                      <TableCell align="right">
                        {item.quantity}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveSchedule(idx)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* ✅ Show Total Row */}
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right" colSpan={2}>
                      <strong>
                        {deliverySchedule.reduce(
                          (sum, item) => sum + (parseInt(item.quantity) || 0),
                          0
                        )}
                        / {totalQuantity}
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {/* ✅ Live validation alert */}
              {totalQuantity && deliverySchedule.reduce(
                (sum, item) => sum + (parseInt(item.quantity) || 0),
                0
              ) !== parseInt(totalQuantity) && (
                <Typography color="error" mt={2}>
                  ⚠️ Quantities do not match the total order quantity!
                </Typography>
              )}
            </Paper>
          )}
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddDeliverySchedule;
