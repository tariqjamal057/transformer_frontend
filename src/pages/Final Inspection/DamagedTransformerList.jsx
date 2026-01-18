import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import { IoCloseSharp } from "react-icons/io5";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DamagedTransformerList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransformer, setSelectedTransformer] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetching data
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["damagedTransformers", currentPage, debouncedSearchQuery],
    queryFn: () =>
      api
        .get(
          `/damaged-transformers?page=${currentPage}&search=${debouncedSearchQuery}`
        )
        .then((res) => res.data),
    placeholderData: { items: [], totalPages: 1 },
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/damaged-transformers/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Record deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["damagedTransformers"]);
    },
    onError: (error) =>
      setAlertBox({ open: true, msg: error.message, error: true }),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/damaged-transformers/${selectedTransformer.id}`, updatedData),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Record updated successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["damagedTransformers"]);
      setEditModalOpen(false);
    },
    onError: (error) =>
      setAlertBox({ open: true, msg: error.message, error: true }),
  });

  const { mutate: bulkUpload, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/damaged-transformers/bulk-upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["damagedTransformers"]);
      setBulkUploadModalOpen(false);
      setSelectedFile(null);
      setAlertBox({ open: true, msg: "Bulk upload successful!", error: false });
    },
    onError: (error) =>
      setAlertBox({
        open: true,
        msg: error.response?.data?.error || error.message,
        error: true,
      }),
  });

  // Handlers
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEditClick = (item) => {
    setSelectedTransformer(item);
    setEditedData({
      ...item,
      ctlReportDate: item.ctlReportDate ? dayjs(item.ctlReportDate) : null,
      liftingLetterDate: item.liftingLetterDate
        ? dayjs(item.liftingLetterDate)
        : null,
      dateOfInspectionAfterRepair: item.dateOfInspectionAfterRepair
        ? dayjs(item.dateOfInspectionAfterRepair)
        : null,
      challanDate: item.challanDate ? dayjs(item.challanDate) : null,
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setEditedData((prev) => ({ ...prev, [name]: date }));
  };

  const handleEditSave = () => {
    const dataToSave = {
      ...editedData,
      ctlReportDate: editedData.ctlReportDate
        ? dayjs(editedData.ctlReportDate).toISOString()
        : null,
      liftingLetterDate: editedData.liftingLetterDate
        ? dayjs(editedData.liftingLetterDate).toISOString()
        : null,
      dateOfInspectionAfterRepair: editedData.dateOfInspectionAfterRepair
        ? dayjs(editedData.dateOfInspectionAfterRepair).toISOString()
        : null,
      challanDate: editedData.challanDate
        ? dayjs(editedData.challanDate).toISOString()
        : null,
    };
    updateMutation.mutate(dataToSave);
  };

  const downloadSample = () => {
    const sampleData = [
      {
        serialNo: "Enter Unique TRFSI No",
        snNumberRange: "e.g., 4912 TO 5061",
        finalInspectionId: "Optional: Real ID from Final Inspection",
        reasonOfDamaged: "Overheating",
        ctlReportNo: "CTL-001",
        ctlReportDate: new Date().toISOString(),
        liftingLetterNo: "LL-001",
        liftingLetterDate: new Date().toISOString(),
        liftingFromAcos: "ACOS-1",
        dateOfInspectionAfterRepair: new Date().toISOString(),
        challanNo: "CHALLAN-001",
        challanDate: new Date().toISOString(),
        deliveredToAcos: "ACOS-2",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "damaged_transformer_sample.xlsx"
    );
  };

  const onDrop = (acceptedFiles) => setSelectedFile(acceptedFiles[0]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const handleBulkUploadSubmit = () => {
    if (selectedFile) bulkUpload(selectedFile);
    else setAlertBox({ open: true, msg: "Please select a file.", error: true });
  };

  return (
    <div className="right-content w-100">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Damaged Transformer List</h5>
        <div className="d-flex align-items-center">
          <TextField
            variant="outlined"
            placeholder="Search by Serial No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#f0883d" },
                "&.Mui-focused fieldset": { borderColor: "#f0883d" },
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
          <Button
            className="btn-blue ms-2"
            onClick={() => setBulkUploadModalOpen(true)}
          >
            Bulk Upload
          </Button>
          <Button
            className="btn-blue ms-2"
            onClick={() => navigate("/damageTransformer")}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Main List Table */}
      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead className="table-primary text-white text-uppercase text-center">
              <tr>
                <th>Serial No (TRFSI)</th>
                <th>SN Number Range</th>
                <th>Reason Of Damage</th>
                <th>CTL Report No</th>
                <th>CTL Report Date</th>
                <th>Lifting Letter No</th>
                <th>Lifting Letter Date</th>
                <th>Lifting From Acos</th>
                {/* <th>Inspection After Repair Date</th>
                <th>Challan No</th>
                <th>Challan Date</th>
                <th>Delivered To ACOS</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center align-middle">
              {isLoading ? (
                <tr>
                  <td colSpan="13">Loading...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="13">Error fetching data</td>
                </tr>
              ) : apiResponse?.items.length > 0 ? (
                apiResponse.items.map((row) => (
                  <tr key={row.id}>
                    <td>{row.serialNo}</td>
                    <td>{row.snNumberRange}</td>
                    <td>{row.reasonOfDamaged}</td>
                    <td>{row.ctlReportNo}</td>
                    <td>
                      {row.ctlReportDate
                        ? dayjs(row.ctlReportDate).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                    <td>{row.liftingLetterNo}</td>
                    <td>
                      {row.liftingLetterDate
                        ? dayjs(row.liftingLetterDate).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                    <td>{row.liftingFromAcos}</td>
                    {/* <td>
                      {row.dateOfInspectionAfterRepair
                        ? dayjs(row.dateOfInspectionAfterRepair).format(
                            "YYYY-MM-DD"
                          )
                        : "-"}
                    </td>
                    <td>{row.challanNo || "-"}</td>
                    <td>
                      {row.challanDate
                        ? dayjs(row.challanDate).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                    <td>{row.deliveredToAcos || "-"}</td> */}
                    <td>
                      <div className="d-flex gap-2 align-items-center justify-content-center">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleEditClick(row)}
                        >
                          <FaPencilAlt />
                        </button>
                        {/* <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(row.id)}
                        >
                          <FaTrash />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {apiResponse?.totalPages > 1 && (
        <ResponsivePagination
          current={currentPage}
          total={apiResponse.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Damaged Transformer</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField
              margin="dense"
              label="Serial No (TRFSI)"
              name="serialNo"
              value={editedData.serialNo || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="SN Number Range"
              name="snNumberRange"
              value={editedData.snNumberRange || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Reason of Damage"
              name="reasonOfDamaged"
              value={editedData.reasonOfDamaged || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="CTL Report No"
              name="ctlReportNo"
              value={editedData.ctlReportNo || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <DatePicker
              label="CTL Report Date"
              value={editedData.ctlReportDate}
              onChange={(date) => handleDateChange("ctlReportDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
            <TextField
              margin="dense"
              label="Lifting Letter No"
              name="liftingLetterNo"
              value={editedData.liftingLetterNo || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <DatePicker
              label="Lifting Letter Date"
              value={editedData.liftingLetterDate}
              onChange={(date) => handleDateChange("liftingLetterDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
            <TextField
              margin="dense"
              label="Lifting From Acos"
              name="liftingFromAcos"
              value={editedData.liftingFromAcos || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <DatePicker
              label="Inspection After Repair Date"
              value={editedData.dateOfInspectionAfterRepair}
              onChange={(date) =>
                handleDateChange("dateOfInspectionAfterRepair", date)
              }
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
            <TextField
              margin="dense"
              label="Challan No"
              name="challanNo"
              value={editedData.challanNo || ""}
              onChange={handleEditChange}
              fullWidth
            />
            <DatePicker
              label="Challan Date"
              value={editedData.challanDate}
              onChange={(date) => handleDateChange("challanDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            />
            <TextField
              margin="dense"
              label="Delivered To ACOS"
              name="deliveredToAcos"
              value={editedData.deliveredToAcos || ""}
              onChange={handleEditChange}
              fullWidth
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={updateMutation.isPending}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog
        open={bulkUploadModalOpen}
        onClose={() => setBulkUploadModalOpen(false)}
        fullWidth
      >
        <DialogTitle>
          Bulk Upload Damaged Transformers
          <IconButton
            onClick={() => setBulkUploadModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Button onClick={downloadSample} variant="outlined" sx={{ mb: 2 }}>
            Download Sample File
          </Button>
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <p>Selected file: {selectedFile.name}</p>
            ) : (
              <p>Drag 'n' drop a file here, or click to select</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkUploadModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBulkUploadSubmit}
            variant="contained"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DamagedTransformerList;
