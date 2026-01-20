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

  const [imposedLetterList, setImposedLetterList] = useState([]);
  const [imposedLetter, setImposedLetter] = useState("");
  const [imposedDate, setImposedDate] = useState(null);

  const [liftingLetterList, setLiftingLetterList] = useState([]);
  const [liftingLetter, setLiftingLetter] = useState("");
  const [liftingDate, setLiftingDate] = useState(null);

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
    if (commencementDays && parseInt(commencementDays) > 0) {
      const calculatedDate = today.add(parseInt(commencementDays), "day");
      setCommencementDate(calculatedDate);
    } else {
      setCommencementDate(null);
    }
  }, [commencementDays]);

  // Add imposed letter to array
  const handleAddImposedLetter = () => {
    if (!imposedLetter || !imposedDate) return; // simple validation

    const newItem = {
      imposedLetterNo: imposedLetter,
      date: dayjs(imposedDate).format("YYYY-MM-DD"),
    };

    setImposedLetterList((prev) => [...prev, newItem]);
    setImposedLetter(""); // clear input
    setImposedDate(null); // clear date
  };

  // Remove imposed letter from array
  const handleRemoveImposedLetter = (index) => {
    setImposedLetterList((prev) => prev.filter((_, i) => i !== index));
  };

  // Add imposed letter to array
  const handleAddLiftingLetter = () => {
    if (!liftingLetter || !liftingDate) return; // simple validation

    const newItem = {
      liftingLetterNo: liftingLetter,
      date: dayjs(liftingDate).format("YYYY-MM-DD"),
    };

    setLiftingLetterList((prev) => [...prev, newItem]);
    setLiftingLetter(""); // clear input
    setLiftingDate(null); // clear date
  };

  // Remove imposed letter from array
  const handleRemoveLiftingLetter = (index) => {
    setLiftingLetterList((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Generate monthly delivery schedule (dates only, no auto quantity)
  useEffect(() => {
    setDateError("");
    if (!commencementDate || !deliveryScheduleDate) return;

    const start = dayjs(commencementDate);
    const end = dayjs(deliveryScheduleDate);

    if (!start.isBefore(end)) {
      setDateError("Commencement Date (CP Date) must be before Delivery Schedule Date.");
      setDeliverySchedule([]);
      return;
    }

    let segments = [];
    let currentStart = start;

    while (currentStart.isBefore(end)) {
      let currentEnd = currentStart.add(30, "day");
      if (currentEnd.isAfter(end)) {
        currentEnd = end;
      }

      segments.push({
        start: currentStart.format("DD MMM YYYY"),
        end: currentEnd.format("DD MMM YYYY"),
        quantity: "", // leave empty for manual entry
      });

      currentStart = currentEnd;
    }

    setDeliverySchedule(segments);
  }, [commencementDate, deliveryScheduleDate]);

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
      imposedLetters: imposedLetterList,
      liftingLetters: liftingLetterList,
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
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="Delivery Schedule Date"
                minDate={today}
                value={deliveryScheduleDate}
                onChange={(date) =>
                  setDeliveryScheduleDate(date ? dayjs(date) : null)
                }
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

            {/* Imposed Letter */}
            <Grid item size={1}>
              <TextField
                label="Defferment Imposed Letter No"
                fullWidth
                value={imposedLetter}
                onChange={(e) => setImposedLetter(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <Box display="flex" gap={1}>
                <DatePicker
                  label="Defferment Imposed Date"
                  minDate={
                    commencementDate ? commencementDate.add(1, "day") : today
                  }
                  value={imposedDate}
                  onChange={(date) => setImposedDate(date ? dayjs(date) : null)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <Button variant="contained" onClick={handleAddImposedLetter}>
                  Add
                </Button>
              </Box>
            </Grid>

            {/* Show List of imposed */}
            {imposedLetterList && (
              <Grid item size={2}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {imposedLetterList.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      <span>
                        {item.imposedLetterNo} - {item.date}
                      </span>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleRemoveImposedLetter(index)}
                      >
                        <CancelIcon />
                      </Button>
                    </div>
                  ))}
                </Box>
              </Grid>
            )}

            {/* Lifting Letter */}
            <Grid item size={1}>
              <TextField
                label="Defferment Lifting Letter No"
                fullWidth
                value={liftingLetter}
                onChange={(e) => setLiftingLetter(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <Box display="flex" gap={1}>
                <DatePicker
                  label="Defferment Lifting Date"
                  minDate={imposedDate ? imposedDate.add(1, "day") : today}
                  value={liftingDate}
                  onChange={(date) => setLiftingDate(date ? dayjs(date) : null)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <Button variant="contained" onClick={handleAddLiftingLetter}>
                  Add
                </Button>
              </Box>
            </Grid>

            {/* Show List of lifting */}
            {liftingLetterList && (
              <Grid item size={2}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {liftingLetterList.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      <span>
                        {item.liftingLetterNo} - {item.date}
                      </span>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleRemoveLiftingLetter(index)}
                      >
                        <CancelIcon />
                      </Button>
                    </div>
                  ))}
                </Box>
              </Grid>
            )}

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
