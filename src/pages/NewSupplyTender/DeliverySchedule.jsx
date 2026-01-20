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
import CancelIcon from "@mui/icons-material/Cancel";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { format, differenceInDays, addMonths, isAfter } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import ResponsivePagination from "react-responsive-pagination";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";

const DeliverySchedule = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);
  const queryClient = useQueryClient();

  const { data: deliverySchedules, isLoading: deliverySchedulesLoading } =
    useQuery({
      queryKey: ["deliverySchedules", currentPage],
      queryFn: () =>
        api
          .get(`/delivery-schedules?page=${currentPage}`)
          .then((res) => res.data),
      placeholderData: { items: [], totalPages: 1 },
    });

  const totalPages = deliverySchedules.totalPages;
  const today = new Date();

  const { data: tnNumbers } = useQuery({
    queryKey: ["tnNumbers"],
    queryFn: () => api.get("/tns").then((res) => res.data),
  });

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

  // New State for Paired Logic
  const [imposedLiftingPairs, setImposedLiftingPairs] = useState([]);
  const [currentImposedLetter, setCurrentImposedLetter] = useState("");
  const [currentImposedDate, setCurrentImposedDate] = useState(null);
  const [currentLiftingLetter, setCurrentLiftingLetter] = useState("");
  const [currentLiftingDate, setCurrentLiftingDate] = useState(null);

  const [guranteeInMonth, setGuranteeInMonth] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [chalanDescription, setChalanDescription] = useState("");
  const [wound, setWound] = useState("");
  const [phase, setPhase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const downloadSample = () => {
    const sampleData = [
      {
        tnNumber: "TN-001",
        rating: 5,
        loa: "LOA-001",
        loaDate: new Date("2024-01-01").toISOString(),
        po: "PO-001",
        poDate: new Date("2024-01-01").toISOString(),
        commencementDays: 30,
        commencementDate: new Date("2024-01-31").toISOString(), // Note: This is usually calculated based on other dates.
        deliveryScheduleDate: new Date("2024-03-01").toISOString(),
        imposedLetters: JSON.stringify([
          {
            imposedLetterNo: "ILN001",
            date: new Date("2025-01-01").toISOString(),
          },
        ]),
        liftingLetters: JSON.stringify([
          {
            liftingLetterNo: "LLN001",
            date: new Date("2025-01-01").toISOString(),
          },
        ]),
        guaranteePeriodMonths: 12,
        totalQuantity: 100,
        deliverySchedule: JSON.stringify([
          // Note: This is usually calculated.
          {
            start: new Date("2024-01-31").toISOString(),
            end: new Date("2024-02-29").toISOString(),
            quantity: 50,
          },
          {
            start: new Date("2024-03-01").toISOString(),
            end: new Date("2024-03-01").toISOString(),
            quantity: 50,
          },
        ]),
        chalanDescription: "Sample description",
        wound: "COPPER",
        phase: "THREE",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "DeliveryScheduleSampleData.xlsx");
  };

  const { mutate: bulkUpload, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/delivery-schedules/bulk-upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["deliverySchedules"]);
      setBulkUploadModalOpen(false);
      setSelectedFile(null); // Clear selected file on success
      setAlertBox({
        open: true,
        msg: "Bulk upload successful!",
        error: false,
      });
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.message,
        error: true,
      });
    },
  });

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    //setBulkUploadModalOpen(true); // Open modal if not already open
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
    //setBulkUploadModalOpen(true); // Open modal if not already open
  };

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []);

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (deliverySchedules && deliverySchedules.items) {
      const results = deliverySchedules.items.filter((user) =>
        user.tnNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredSchedules(results);
    }
  }, [searchQuery, deliverySchedules]);

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
    setPo(item.po);
    setPoDate(item.poDate ? dayjs(item.poDate) : null);
    setLoa(item.loa);
    setLoaDate(item.loaDate ? dayjs(item.loaDate) : null);
    setCreatedDate(item.createdAt ? dayjs(item.createdAt) : null);
    setCommencementDays(item.commencementDays);
    setCommencementDate(
      item.commencementDate ? dayjs(item.commencementDate) : null,
    );
    setDeliveryScheduleDate(
      item.deliveryScheduleDate ? dayjs(item.deliveryScheduleDate) : null,
    );

    // Reconstruct pairs from separate lists
    const pairs = [];
    const imposed = item.imposedLetters || [];
    const lifting = item.liftingLetters || [];
    const maxLen = Math.max(imposed.length, lifting.length);

    for (let i = 0; i < maxLen; i++) {
      pairs.push({
        imposedLetterNo: imposed[i]?.imposedLetterNo || null,
        imposedDate: imposed[i]?.date ? dayjs(imposed[i].date) : null,
        liftingLetterNo: lifting[i]?.liftingLetterNo || null,
        liftingDate: lifting[i]?.date ? dayjs(lifting[i].date) : null,
      });
    }
    setImposedLiftingPairs(pairs);

    setGuranteeInMonth(item.guaranteePeriodMonths);
    setChalanDescription(item.chalanDescription);
    setTotalQuantity(item.totalQuantity);
    setWound(item.wound);
    setPhase(item.phase);

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

    setImposedLiftingPairs([]);
    setCurrentImposedLetter("");
    setCurrentImposedDate(null);
    setCurrentLiftingLetter("");
    setCurrentLiftingDate(null);

    setGuranteeInMonth("");
    setChalanDescription("");
    setTotalQuantity("");
    setWound("");
    setPhase("");
    // Clear selected file when bulk upload modal is closed
    if (bulkUploadModalOpen) {
      setSelectedFile(null);
    }
    setBulkUploadModalOpen(false); // Close bulk upload modal if open
  };

  const handleBulkUploadSubmit = () => {
    if (selectedFile) {
      bulkUpload(selectedFile);
    } else {
      setAlertBox({
        open: true,
        msg: "Please select a file to upload.",
        error: true,
      });
    }
  };

  const { mutate: updateDeliverySchedule } = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/delivery-schedules/${selectedDelivery.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["deliverySchedules"]);
      handleModalClose();
      setAlertBox({
        open: true,
        msg: "Transformer Delivery details updated successfully!",
        error: false,
      });
    },
    onError: (error) => {
      setAlertBox({
        open: true,
        msg: error.message,
        error: true,
      });
    },
  });

  const handleSaveChanges = () => {
    const dataToUpdate = {
      tnNumber: tnDetail,
      rating: rating ? parseInt(rating) : null,
      po: po,
      poDate: poDate ? dayjs(poDate).toISOString() : null,
      loa: loa,
      loaDate: loaDate ? dayjs(loaDate).toISOString() : null,
      commencementDays: commencementDays ? parseInt(commencementDays) : null,
      deliveryScheduleDate: deliveryScheduleDate
        ? dayjs(deliveryScheduleDate).toISOString()
        : null,
      imposedLetters: imposedLiftingPairs
        .filter((p) => p.imposedLetterNo)
        .map((p) => ({
          imposedLetterNo: p.imposedLetterNo,
          date: p.imposedDate
            ? dayjs(p.imposedDate).format("YYYY-MM-DD")
            : null,
        })),
      liftingLetters: imposedLiftingPairs
        .filter((p) => p.liftingLetterNo)
        .map((p) => ({
          liftingLetterNo: p.liftingLetterNo,
          date: p.liftingDate
            ? dayjs(p.liftingDate).format("YYYY-MM-DD")
            : null,
        })),
      guaranteePeriodMonths: guranteeInMonth ? parseInt(guranteeInMonth) : null,
      totalQuantity: totalQuantity ? parseInt(totalQuantity) : null,
      chalanDescription: chalanDescription,
      wound: wound,
      phase: phase,
    };
    updateDeliverySchedule(dataToUpdate);
  };

  // Logic for Min Dates
  const getLastLiftingDate = () => {
    if (imposedLiftingPairs.length === 0) return null;
    const lastPair = imposedLiftingPairs[imposedLiftingPairs.length - 1];
    return lastPair.liftingDate;
  };

  const getLastImposedDate = () => {
    if (imposedLiftingPairs.length === 0) return null;
    const lastPair = imposedLiftingPairs[imposedLiftingPairs.length - 1];
    return lastPair.imposedDate;
  };

  const minImposedDate =
    imposedLiftingPairs.length > 0 && getLastLiftingDate()
      ? dayjs(getLastLiftingDate()).add(1, "day")
      : dayjs(); // Today if no previous pairs

  const minLiftingDate = getLastImposedDate()
    ? dayjs(getLastImposedDate())
    : dayjs();

  const showAddImposed =
    imposedLiftingPairs.length === 0 ||
    imposedLiftingPairs[imposedLiftingPairs.length - 1].liftingLetterNo;
  const showAddLifting =
    imposedLiftingPairs.length > 0 &&
    !imposedLiftingPairs[imposedLiftingPairs.length - 1].liftingLetterNo;

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
            <Button
              className="btn-blue ms-3 ps-3 pe-3"
              onClick={() => setBulkUploadModalOpen(true)}
            >
              Bulk Upload
            </Button>
            <Link to={"/add-deliverySchedule"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        <Dialog
          open={bulkUploadModalOpen}
          onClose={() => {
            setBulkUploadModalOpen(false);
            setSelectedFile(null); // Clear selected file when modal is closed
          }}
          fullWidth
        >
          <DialogTitle className="d-flex justify-content-between align-items-center">
            Bulk Upload
            <IconButton
              onClick={() => {
                setBulkUploadModalOpen(false);
                setSelectedFile(null); // Clear selected file when modal is closed
              }}
            >
              <IoCloseSharp />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Button onClick={downloadSample}>Download Sample</Button>
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <p>Selected file: {selectedFile.name}</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setBulkUploadModalOpen(false);
                setSelectedFile(null); // Clear selected file when modal is closed
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUploadSubmit}
              variant="contained"
              color="primary"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

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
                {deliverySchedulesLoading ? (
                  <tr>
                    <td colSpan={14}>Loading...</td>
                  </tr>
                ) : (
                  filteredSchedules?.map((item, index) => {
                    const segments = calculateSegments(
                      item.commencementDate,
                      item.deliveryScheduleDate,
                      item.totalQuantity,
                    );

                    return (
                      <tr key={index}>
                        <td># {index + 1}</td>
                        <td>{item.tnNumber}</td>
                        <td>{item.rating}</td>
                        <td>
                          <div>{item.po}</div>
                          <strong>
                            {item.poDate
                              ? format(new Date(item.poDate), "dd MMM yyyy")
                              : ""}
                          </strong>
                        </td>
                        <td>
                          <div>{item.loa}</div>
                          <strong>
                            {item.loaDate
                              ? format(new Date(item.loaDate), "dd MMM yyyy")
                              : ""}
                          </strong>
                        </td>
                        <td>
                          <div>{item.commencementDays} Days</div>
                          <strong>
                            {item.commencementDate
                              ? format(
                                  new Date(item.commencementDate),
                                  "dd MMM yyyy",
                                )
                              : ""}
                          </strong>
                        </td>
                        <td>
                          {item.deliveryScheduleDate
                            ? format(
                                new Date(item.deliveryScheduleDate),
                                "dd MMM yyyy",
                              )
                            : ""}
                        </td>
                        <td>
                          {item.createdAt
                            ? format(new Date(item.createdAt), "dd MMM yyyy")
                            : ""}
                        </td>
                        {/* Imposed Letter List */}
                        <td>
                          {item.imposedLetters &&
                          item.imposedLetters.length > 0 ? (
                            <ul
                              style={{
                                listStyle: "disc",
                                paddingLeft: "20px",
                                margin: 0,
                              }}
                            >
                              {item.imposedLetters.map((letter, i) => (
                                <li key={i}>
                                  {letter.imposedLetterNo} -{" "}
                                  {letter.date
                                    ? format(
                                        new Date(letter.date),
                                        "dd MMM yyyy",
                                      )
                                    : ""}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Lifting Letter List */}
                        <td>
                          {item.liftingLetters &&
                          item.liftingLetters.length > 0 ? (
                            <ul
                              style={{
                                listStyle: "disc",
                                paddingLeft: "20px",
                                margin: 0,
                              }}
                            >
                              {item.liftingLetters.map((letter, i) => (
                                <li key={i}>
                                  {letter.liftingLetterNo} -{" "}
                                  {letter.date
                                    ? format(
                                        new Date(letter.date),
                                        "dd MMM yyyy",
                                      )
                                    : ""}
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
                                (item.status || "active").toLowerCase() ===
                                "active"
                                  ? "#28a745"
                                  : "#dc3545",
                            }}
                          >
                            {(item.status || "ACTIVE").toUpperCase()}
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={handlePageChange}
          />
        )}
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

          {/* Imposed/Lifting Pairs List */}
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Defferment Details
            </Typography>
            {imposedLiftingPairs.map((pair, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  backgroundColor: pair.liftingLetterNo ? "#f1f8e9" : "#fff3e0",
                }}
              >
                <Box>
                  <Typography variant="body2">
                    <strong>Imposed:</strong> {pair.imposedLetterNo} (
                    {pair.imposedDate
                      ? dayjs(pair.imposedDate).format("DD MMM YYYY")
                      : ""}
                    )
                  </Typography>
                  {pair.liftingLetterNo && (
                    <Typography variant="body2">
                      <strong>Lifting:</strong> {pair.liftingLetterNo} (
                      {pair.liftingDate
                        ? dayjs(pair.liftingDate).format("DD MMM YYYY")
                        : ""}
                      )
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemovePair(index)}
                >
                  <CancelIcon />
                </IconButton>
              </div>
            ))}
          </Box>

          {/* Add Imposed Letter Input */}
          {showAddImposed && (
            <Box display="flex" gap={1} mt={1} alignItems="center">
              <TextField
                label="Imposed Letter No"
                value={currentImposedLetter}
                onChange={(e) => setCurrentImposedLetter(e.target.value)}
                size="small"
                fullWidth
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Imposed Date"
                  value={currentImposedDate}
                  onChange={(date) => setCurrentImposedDate(date)}
                  minDate={minImposedDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                onClick={handleAddImposedLetter}
                size="small"
              >
                Add
              </Button>
            </Box>
          )}

          {/* Add Lifting Letter Input */}
          {showAddLifting && (
            <Box display="flex" gap={1} mt={1} alignItems="center">
              <TextField
                label="Lifting Letter No"
                value={currentLiftingLetter}
                onChange={(e) => setCurrentLiftingLetter(e.target.value)}
                size="small"
                fullWidth
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Lifting Date"
                  value={currentLiftingDate}
                  onChange={(date) => setCurrentLiftingDate(date)}
                  minDate={minLiftingDate}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddLiftingLetter}
                size="small"
              >
                Add
              </Button>
            </Box>
          )}

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

          <TextField
            fullWidth
            label="Wound"
            value={wound}
            onChange={(e) => setWound(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Phase"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
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
export default DeliverySchedule;
