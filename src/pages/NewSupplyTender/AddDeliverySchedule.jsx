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

  // ✅ Generate monthly delivery schedule (dates only, no auto quantity)
  useEffect(() => {
    setDateError("");
    if (!commencementDate || !deliveryScheduleDate) {
      setDeliverySchedule([]);
      return;
    }

    const start = dayjs(commencementDate);
    const end = dayjs(deliveryScheduleDate);

    if (!start.isBefore(end)) {
      setDateError("Commencement Date (CP Date) must be before Delivery Schedule Date.");
      setDeliverySchedule([]);
      return;
    }

    const oldQuantities = deliverySchedule.reduce((acc, seg) => {
      acc[seg.start] = seg.quantity;
      return acc;
    }, {});

    let totalDeffermentDays = 0;
    const validPairs = imposedLiftingPairs.filter(p => p.imposedDate && p.liftingDate && dayjs(p.liftingDate).isAfter(dayjs(p.imposedDate)));
    validPairs.forEach(pair => {
      totalDeffermentDays += dayjs(pair.liftingDate).diff(dayjs(pair.imposedDate), 'day');
    });

    const effectiveEndDate = end.add(totalDeffermentDays, 'day');
    const totalQty = parseInt(totalQuantity) || 0;
    const totalDeliveryDays = effectiveEndDate.diff(start, 'day') - totalDeffermentDays;
    const perDayQty = totalDeliveryDays > 0 ? totalQty / totalDeliveryDays : 0;

    let segments = [];
    let currentStart = start;
    let allocatedQty = 0;

    while (currentStart.isBefore(effectiveEndDate)) {
      let isDeferred = false;
      for (const pair of validPairs) {
        const imposed = dayjs(pair.imposedDate);
        const lifting = dayjs(pair.liftingDate);
        if (currentStart.isSame(imposed) || (currentStart.isAfter(imposed) && currentStart.isBefore(lifting))) {
          currentStart = lifting.add(1, 'day');
          isDeferred = true;
          break;
        }
      }
      if (isDeferred) continue;

      let segmentEndDate = currentStart.add(30, 'day');

      let nextImposedDate = null;
      for (const pair of validPairs) {
        const imposed = dayjs(pair.imposedDate);
        if (imposed.isAfter(currentStart) && (!nextImposedDate || imposed.isBefore(nextImposedDate))) {
          nextImposedDate = imposed;
        }
      }

      if (nextImposedDate && segmentEndDate.isAfter(nextImposedDate)) {
        segmentEndDate = nextImposedDate.subtract(1, 'day');
      }

      if (segmentEndDate.isAfter(effectiveEndDate)) {
        segmentEndDate = effectiveEndDate;
      }

      const segmentDays = segmentEndDate.diff(currentStart, 'day') + 1;
      let segmentQty = 0;
      if (totalQty > 0) {
        segmentQty = Math.floor(perDayQty * segmentDays);
        allocatedQty += segmentQty;
      }

      const formattedStart = currentStart.format("DD MMM YYYY");
      segments.push({
        start: formattedStart,
        end: segmentEndDate.format("DD MMM YYYY"),
        quantity: oldQuantities[formattedStart] || segmentQty,
      });

      currentStart = segmentEndDate.add(1, 'day');
      if (!currentStart.isBefore(effectiveEndDate)) break;
    }

    if (totalQty > 0 && segments.length > 0) {
      const remainingQty = totalQty - segments.reduce((sum, seg) => sum + (parseInt(seg.quantity, 10) || 0), 0);
      const lastSegment = segments[segments.length - 1];
      lastSegment.quantity = (parseInt(lastSegment.quantity, 10) || 0) + remainingQty;
    }
    
    setDeliverySchedule(segments);
  }, [commencementDate, deliveryScheduleDate, totalQuantity, imposedLiftingPairs]);

  // ✅ Handle manual quantity input
  const handleQuantityChange = (index, value) => {
    setDeliverySchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
                onChange={(e) => setTnDetail(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                type="number"
                label="Rating"
                fullWidth
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
                value={wound}
                onChange={(e) => setWound(e.target.value)}
                // Removed InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Phase"
                fullWidth
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliverySchedule.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {item.start} - {item.end}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(idx, e.target.value)
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* ✅ Show Total Row */}
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">
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
