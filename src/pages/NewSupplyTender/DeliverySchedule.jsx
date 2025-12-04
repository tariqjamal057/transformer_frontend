import { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MyContext } from "../../App";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { format, differenceInDays, addMonths, isAfter } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";

const DeliveryScheduleList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const today = new Date();

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const tnNumbers = ["TN-001", "TN-002", "TN-003", "TN-004"];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [tnDetail, setTnDetail] = useState("");
  const [rating, setRating] = useState("");
  const [loa, setLoa] = useState("");
  const [loaDate, setLoaDate] = useState(null);
  const [po, setPo] = useState("");
  const [poDate, setPoDate] = useState(null);
  const [commencementDays, setCommencementDays] = useState("");
  const [commencementDate, setCommencementDate] = useState(null);
  const [createdDate, setCreatedDate] = useState(null); // fixed backend date

  const [deliveryScheduleDate, setDeliveryScheduleDate] = useState(null);

  const [imposedLetterList, setImposedLetterList] = useState([]);
  const [imposedLetter, setImposedLetter] = useState("");
  const [imposedDate, setImposedDate] = useState(null);

  const [liftingLetterList, setLiftingLetterList] = useState([]);
  const [liftingLetter, setLiftingLetter] = useState("");
  const [liftingDate, setLiftingDate] = useState(null);

  const [guranteeInMonth, setGuranteeInMonth] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [chalanDescription, setChalanDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /*const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));*/

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getDummyDeliverySchedules = () => {
    return [
      {
        tnNumber: "TN-001",
        rating: 100, // in KVA
        poDetails: "PO-12345",
        poDate: "2025-05-10",
        loaDetails: "LOA-5678",
        loaDate: "2025-05-01",
        cpDays: 90,
        createdDate: "2025-05-15",
        cpDate: "2025-08-13", // 90 days from createdDate
        deliveryScheduleDate: "2025-11-17",
        imposedLetterList: [
          { imposedLetterNo: "IMP230", imposedDate: "2025-08-18" },
          { imposedLetterNo: "IMP231", imposedDate: "2025-08-20" },
        ],
        liftingLetterList: [
          { liftingLetterNo: "LIFT230", liftingDate: "2025-10-15" },
          { liftingLetterNo: "LIFT231", liftingDate: "2025-10-20" },
        ],
        status: "active",
        totalQuantity: 1000,
        guaranteePeriodMonths: 24,
        description:
          "Delivery challan for 1000 kVA transformers including transport charges, handling, and on-site installation as per the approved purchase order and delivery schedule.",
      },
      {
        tnNumber: "TN-002",
        rating: 250,
        poDetails: "PO-22345",
        poDate: "2025-06-01",
        loaDetails: "LOA-6678",
        loaDate: "2025-05-20",
        cpDays: 60,
        createdDate: "2025-06-05",
        cpDate: "2025-08-04", // 60 days from createdDate
        deliveryScheduleDate: "2025-12-25",
        imposedLetterList: [
          { imposedLetterNo: "IMP240", imposedDate: "2025-08-09" },
          { imposedLetterNo: "IMP241", imposedDate: "2025-08-11" },
        ],
        liftingLetterList: [
          { liftingLetterNo: "LIFT240", liftingDate: "2025-10-01" },
        ],
        status: "deffered",
        totalQuantity: 500,
        guaranteePeriodMonths: 18,
        description:
          "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
      },
      {
        tnNumber: "TN-003",
        rating: 160,
        poDetails: "PO-32345",
        poDate: "2025-07-15",
        loaDetails: "LOA-7678",
        loaDate: "2025-07-05",
        cpDays: 45,
        createdDate: "2025-07-20",
        cpDate: "2025-09-03", // 45 days from createdDate
        deliveryScheduleDate: "2025-12-30",
        imposedLetterList: [
          { imposedLetterNo: "IMP250", imposedDate: "2025-09-08" },
          { imposedLetterNo: "IMP251", imposedDate: "2025-09-10" },
        ],
        liftingLetterList: [
          { liftingLetterNo: "LIFT250", liftingDate: "2025-11-01" },
          { liftingLetterNo: "LIFT251", liftingDate: "2025-11-03" },
        ],
        status: "active",
        totalQuantity: 750,
        guaranteePeriodMonths: 12,
        description:
          "Material dispatch challan for 11kV outdoor vacuum circuit breakers, inclusive of installation accessories and detailed engineering drawings for commissioning.",
      },
      {
        tnNumber: "TN-004",
        rating: 200,
        poDetails: "PO-42345",
        poDate: "2025-08-10",
        loaDetails: "LOA-8678",
        loaDate: "2025-08-01",
        cpDays: 30,
        createdDate: "2025-08-15",
        cpDate: "2025-09-14", // 30 days from createdDate
        deliveryScheduleDate: "2026-03-19",
        imposedLetterList: [
          { imposedLetterNo: "IMP260", imposedDate: "2025-09-19" },
          { imposedLetterNo: "IMP261", imposedDate: "2025-09-21" },
        ],
        liftingLetterList: [
          { liftingLetterNo: "LIFT260", liftingDate: "2025-11-10" },
        ],
        status: "deffered",
        totalQuantity: 1200,
        guaranteePeriodMonths: 36,
        description:
          "Challan covering delivery of galvanized steel poles and cross-arms, bundled with all necessary hardware and fasteners for the rural electrification project.",
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState(
    getDummyDeliverySchedules()
  );

  useEffect(() => {
    const results = getDummyDeliverySchedules().filter((user) =>
      user.tnNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchedules(results);
  }, [searchQuery]);

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

  // Calculate segmented delivery quantities
  const calculateSegments = (cpDate, deliveryScheduleDate, totalQuantity) => {
    const start = new Date(cpDate);
    const end = new Date(deliveryScheduleDate);

    const totalDays = differenceInDays(end, start);
    const perDayQty = totalQuantity / totalDays;

    let segments = [];
    let currentStart = start;
    let allocated = 0;

    while (currentStart < end) {
      let nextSegmentEnd = addMonths(currentStart, 1);

      // If overshoots, clamp to final end
      if (isAfter(nextSegmentEnd, end)) {
        nextSegmentEnd = end;
      }

      const segmentDays = differenceInDays(nextSegmentEnd, currentStart);
      let rawQty = perDayQty * segmentDays;

      let segmentQuantity = Math.floor(rawQty);
      allocated += segmentQuantity;

      segments.push({
        start: format(currentStart, "dd MMM yyyy"),
        end: format(nextSegmentEnd, "dd MMM yyyy"),
        days: segmentDays,
        quantity: segmentQuantity,
      });

      currentStart = nextSegmentEnd;
    }

    // Fix rounding error: adjust last segment to match total
    const diff = totalQuantity - allocated;
    if (segments.length > 0) {
      segments[segments.length - 1].quantity += diff;
    }

    return segments;
  };

  useEffect(() => {
    if (commencementDays === "") {
      setCommencementDate(null); // Clear if empty
      return;
    }

    if (commencementDays && createdDate) {
      const days = parseInt(commencementDays);
      if (!isNaN(days) && days > 0) {
        // Add days to createdDate
        const calculatedDate = dayjs(createdDate).add(days, "day");
        setCommencementDate(calculatedDate);
      } else {
        setCommencementDate(null);
      }
    }
  }, [commencementDays, createdDate]);

  const handleEditClick = (item) => {
    setSelectedDelivery(item);
    setTnDetail(item.tnNumber);
    setRating(item.rating);
    setPo(item.poDetails);
    setPoDate(item.poDate ? dayjs(item.poDate) : null);
    setLoa(item.loaDetails);
    setLoaDate(item.loaDate ? dayjs(item.loaDate) : null);
    setCreatedDate(item.createdDate ? dayjs(item.createdDate) : null);
    setCommencementDays(item.cpDays);
    setCommencementDate(item.cpDate ? dayjs(item.cpDate) : null);
    setDeliveryScheduleDate(
      item.deliveryScheduleDate ? dayjs(item.deliveryScheduleDate) : null
    );

    // Convert imposedLetterList dates to dayjs
    const imposedList = (item.imposedLetterList || []).map((letter) => ({
      imposedLetterNo: letter.imposedLetterNo,
      date: letter.imposedDate ? dayjs(letter.imposedDate) : null,
    }));

    // Convert liftingLetterList dates to dayjs
    const liftingList = (item.liftingLetterList || []).map((letter) => ({
      liftingLetterNo: letter.liftingLetterNo,
      date: letter.liftingDate ? dayjs(letter.liftingDate) : null,
    }));

    setImposedLetterList(imposedList);
    setLiftingLetterList(liftingList);

    setGuranteeInMonth(item.guaranteePeriodMonths);
    setChalanDescription(item.description);
    setTotalQuantity(item.totalQuantity);

    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedDelivery(null);
    setTnDetail("");
    setRating("");
    setPo("");
    setPoDate(null);
    setLoa("");
    setLoaDate(null);
    setCommencementDays("");
    setDeliveryScheduleDate(null);
    setCommencementDate(null);
    setImposedLetter("");
    setLiftingLetter("");
    setImposedDate(null);
    setLiftingDate(null);
    setGuranteeInMonth("");
    setChalanDescription("");
    setTotalQuantity("");
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Transformer Delivery details updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Master Records</h5>

          <TextField
            variant="outlined"
            placeholder="Search through TN Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginLeft: "auto",
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#f0883d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f0883d",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#f0883d" }} />
                </InputAdornment>
              ),
            }}
          />

          <div className="d-flex align-items-center">
            <Link to={"/add-deliverySchedule"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>TENDER NUMBER</th>
                  <th>RATING</th>
                  <th>PO DETAILS</th>
                  <th>LOA DETAILS</th>
                  <th>CP DATE & DAYS</th>
                  <th>DELIVERY SCHEDULE</th>
                  <th>CREATED AT</th>
                  <th>IMPOSED LETTER LIST</th>
                  <th>LIFTING LETTER LIST</th>
                  <th>GURANTEE PERIODS IN MONTH</th>
                  <th>TOTAL QUANTITY</th>
                  {/*<th>DELIVERY SCHEDULE (AUTO CALCULATED)</th>*/}
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((item, index) => {
                    const segments = calculateSegments(
                      item.cpDate,
                      item.deliveryScheduleDate,
                      item.totalQuantity
                    );

                    return (
                      <tr key={index}>
                        <td># {index + 1}</td>
                        <td>{item.tnNumber}</td>
                        <td>{item.rating}</td>
                        <td>
                          <div>{item.poDetails}</div>
                          <strong>
                            {format(new Date(item.poDate), "dd MMM yyyy")}
                          </strong>
                        </td>
                        <td>
                          <div>{item.loaDetails}</div>
                          <strong>
                            {format(new Date(item.loaDate), "dd MMM yyyy")}
                          </strong>
                        </td>
                        <td>
                          <div>{item.cpDays} Days</div>
                          <strong>
                            {format(new Date(item.cpDate), "dd MMM yyyy")}
                          </strong>
                        </td>
                        <td>
                          {format(
                            new Date(item.deliveryScheduleDate),
                            "dd MMM yyyy"
                          )}
                        </td>
                        <td>
                          {format(new Date(item.createdDate), "dd MMM yyyy")}
                        </td>
                        {/* Imposed Letter List */}
                        <td>
                          {item.imposedLetterList &&
                          item.imposedLetterList.length > 0 ? (
                            <ul
                              style={{
                                listStyle: "disc",
                                paddingLeft: "20px",
                                margin: 0,
                              }}
                            >
                              {item.imposedLetterList.map((letter, i) => (
                                <li key={i}>
                                  {letter.imposedLetterNo} -{" "}
                                  {format(
                                    new Date(letter.imposedDate),
                                    "dd MMM yyyy"
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Lifting Letter List */}
                        <td>
                          {item.liftingLetterList &&
                          item.liftingLetterList.length > 0 ? (
                            <ul
                              style={{
                                listStyle: "disc",
                                paddingLeft: "20px",
                                margin: 0,
                              }}
                            >
                              {item.liftingLetterList.map((letter, i) => (
                                <li key={i}>
                                  {letter.liftingLetterNo} -{" "}
                                  {format(
                                    new Date(letter.liftingDate),
                                    "dd MMM yyyy"
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>{item.guaranteePeriodMonths}</td>
                        <td>{item.totalQuantity}</td>
                        {/* 
                          <td className="text-start">
                          {segments.map((seg, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor:
                                  idx % 2 === 0 ? "#e8f5e9" : "#e3f2fd", // green-blue alternate
                                padding: "6px 10px",
                                borderRadius: "6px",
                                marginBottom: "5px",
                                border: "1px solid #ccc",
                              }}
                            >
                              <strong>
                                📅 {format(seg.start, "dd MMM yyyy")} →{" "}
                                {format(seg.end, "dd MMM yyyy")}
                              </strong>
                              <br />
                              <span style={{ fontSize: "0.9em" }}>
                                {seg.quantity} Transformers ({seg.days} days)
                              </span>
                            </div>
                          ))}
                        </td>
                        */}

                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontWeight: "bold",
                              color: "white",
                              backgroundColor:
                                item.status.toLowerCase() === "active"
                                  ? "#28a745"
                                  : "#dc3545",
                            }}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2 align-item-center justify-content-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/*<ResponsivePagination
          page={currentPage}
          count={totalPages}
          onChange={(event, value) => setCurrentPage(value)}
        />*/}
      </div>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        fullWidth
        //fullScreen={fullScreen}
      >
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Details
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Tender No"
            fullWidth
            type="text"
            value={tnDetail}
            onChange={(e) => setTnDetail(e.target.value)}
            sx={{ mt: 2 }}
          />

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
            sx={{ mt: 2 }}
          />

          <TextField
            label="LOA Details"
            fullWidth
            value={loa}
            onChange={(e) => setLoa(e.target.value)}
            sx={{ mt: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="LOA Date"
              //minDate={dayjs(today)}
              value={loaDate} // always Day.js or null
              onChange={(date) => setLoaDate(date)}
              sx={{ mt: 2, width: "100%" }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <TextField
            label="PO Details"
            fullWidth
            value={po}
            onChange={(e) => setPo(e.target.value)}
            sx={{ mt: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="PO Date"
              //minDate={dayjs(today)}
              value={poDate} // always Day.js or null
              onChange={(date) => setPoDate(date)}
              sx={{ mt: 2, width: "100%" }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

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
            sx={{ mt: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="CP Date"
              minDate={createdDate || dayjs()} // Optional: CP can't be before createdDate
              value={commencementDate}
              readOnly
              //disabled
              sx={{ mt: 2, width: "100%" }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Delivery Schedule Date"
              value={deliveryScheduleDate}
              onChange={(date) => setDeliveryScheduleDate(date)}
              sx={{ mt: 2, width: "100%" }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          {/* Imposed Letters */}
          <Box mt={2}>
            <Typography variant="subtitle1">Imposed Letters</Typography>
            {imposedLetterList.map((letter, i) => (
              <li key={i}>
                {letter.imposedLetterNo} -{" "}
                {letter.date ? dayjs(letter.date).format("YYYY-MM-DD") : ""}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImposedLetter(i)}
                >
                  ❌
                </IconButton>
              </li>
            ))}
          </Box>

          {/* Add new imposed letter */}
          <TextField
            label="Imposed Letter No"
            value={imposedLetter}
            onChange={(e) => setImposedLetter(e.target.value)}
            sx={{ mt: 1 }}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Imposed Date"
              value={imposedDate}
              onChange={(date) => setImposedDate(date)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 1 }}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            onClick={handleAddImposedLetter}
            sx={{ mt: 1 }}
          >
            Add Imposed Letter
          </Button>

          {/* Lifting Letters */}
          <Box mt={2}>
            <Typography variant="subtitle1">Lifting Letters</Typography>
            {liftingLetterList.map((letter, i) => (
              <li key={i}>
                {letter.liftingLetterNo} -{" "}
                {letter.date ? dayjs(letter.date).format("YYYY-MM-DD") : ""}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveLiftingLetter(i)}
                >
                  ❌
                </IconButton>
              </li>
            ))}
          </Box>

          {/* Add new lifting letter */}
          <TextField
            label="Lifting Letter No"
            value={liftingLetter}
            onChange={(e) => setLiftingLetter(e.target.value)}
            sx={{ mt: 1 }}
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Lifting Date"
              value={liftingDate}
              onChange={(date) => setLiftingDate(date)}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 1 }}
            />
          </LocalizationProvider>
          <Button
            variant="outlined"
            onClick={handleAddLiftingLetter}
            sx={{ mt: 1 }}
          >
            Add Lifting Letter
          </Button>

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
            sx={{ mt: 2 }}
          />

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
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Particulars"
            value={chalanDescription}
            onChange={(e) => setChalanDescription(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeliveryScheduleList;
