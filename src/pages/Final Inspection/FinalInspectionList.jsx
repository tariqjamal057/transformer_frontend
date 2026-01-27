import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import FinalInspectionModal from "../../components/FinalInspectionModal";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

const FinalInspectionList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedFinalInspection, setSelectedFinalInspection] = useState(null);

  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]); // State for bulk upload errors

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const {
    data: finalInspections,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["finalInspections", currentPage, debouncedSearchQuery],
    queryFn: () =>
      api
        .get(
          `/final-inspections?page=${currentPage}&search=${debouncedSearchQuery}`,
        )
        .then((res) => res.data),
    placeholderData: { items: [], totalPages: 1 },
  });

  const totalPages = finalInspections.totalPages;

  const downloadSample = () => {
    const sampleData = [
      {
        Company: "Sample Company A",
        Discom: "Sample Discom X",
        TNNumber: "TN-001",
        serialNumberFrom: 101,
        serialNumberTo: 105,
        offerDate: "2024-01-10",
        offeredQuantity: 5,
        inspectionDate: "2024-01-15",
        inspectedQuantity: 5,
        diNo: "DI-12345",
        diDate: "2024-01-16",
        warranty: "60 Months",
        nominationLetterNo: "NL-001",
        nominationDate: "2024-01-14",
        inspectionOfficer: "Officer A",
        ConsigneeName: "Consignee Alpha",
        ConsigneeQuantity: 3,
        ConsigneeSubSerialNumber: "101-103",
        TRFSINo: "101",
        PolySealNo: "PS-001",
      },
      {
        Company: "", // Empty for subsequent rows in the same group
        Discom: "", // Empty
        TNNumber: "", // Empty
        serialNumberFrom: "", // Empty
        serialNumberTo: "", // Empty
        offerDate: "", // Empty
        offeredQuantity: "", // Empty
        inspectionDate: "", // Empty
        inspectedQuantity: "", // Empty
        diNo: "", // Empty
        diDate: "", // Empty
        warranty: "", // Empty
        nominationLetterNo: "", // Empty
        nominationDate: "", // Empty
        inspectionOfficer: "Officer B",
        ConsigneeName: "Consignee Beta",
        ConsigneeQuantity: 2,
        ConsigneeSubSerialNumber: "104-105",
        TRFSINo: "102",
        PolySealNo: "PS-002",
      },
      {
        Company: "Sample Company B",
        Discom: "Sample Discom Y",
        TNNumber: "TN-002",
        serialNumberFrom: 201,
        serialNumberTo: 202,
        offerDate: "2024-02-01",
        offeredQuantity: 2,
        inspectionDate: "2024-02-05",
        inspectedQuantity: 2,
        diNo: "DI-67890",
        diDate: "2024-02-06",
        warranty: "36 Months",
        inspectionOfficer: "Officer Gamma",
        ConsigneeName: "Consignee Delta",
        ConsigneeQuantity: 2,
        ConsigneeSubSerialNumber: "201-202",
        TRFSINo: "201",
        PolySealNo: "PS-003",
      },
    ];

    const mainWorksheet = XLSX.utils.json_to_sheet(sampleData);

    // Create an instruction sheet
    const instructionsData = [
      {
        "Field Name": "Company",
        Description: "Name of the Company (e.g., Sample Company A)",
        Required: "Yes",
      },
      {
        "Field Name": "Discom",
        Description: "Name of the Supply Tender (e.g., Sample Discom X)",
        Required: "Yes",
      },
      {
        "Field Name": "TNNumber",
        Description: "Tender Number from Delivery Schedule",
        Required: "Yes",
      },
      {
        "Field Name": "serialNumberFrom",
        Description: "Starting serial number (e.g., 101)",
        Required: "Yes",
      },
      {
        "Field Name": "serialNumberTo",
        Description: "Ending serial number (e.g., 105)",
        Required: "Yes",
      },
      {
        "Field Name": "offeredQuantity",
        Description: "Quantity offered (number)",
        Required: "Yes",
      },
      {
        "Field Name": "inspectionOfficers",
        Description: "Name of an inspection officer. Add one per row.",
        Required: "Yes (at least one)",
      },
      {
        "Field Name": "ConsigneeName",
        Description:
          "Name of a consignee. All 3 consignee fields are required together.",
        Required: "Yes",
      },
      {
        "Field Name": "ConsigneeQuantity",
        Description:
          "Quantity for this consignee. All 3 consignee fields are required together.",
        Required: "Yes",
      },
      {
        "Field Name": "ConsigneeSubSerialNumber",
        Description:
          "Sub serial number for this consignee (e.g., 101-103). All 3 consignee fields are required together.",
        Required: "Yes",
      },
      {
        "Field Name": "TRFSINo",
        Description:
          "TRF SI No for sealing. Both TRF SI No and Poly Seal No are required together. Add one per row.",
        Required: "Yes",
      },
      {
        "Field Name": "PolySealNo",
        Description:
          "Poly Seal No for sealing. Both TRF SI No and Poly Seal No are required together. Add one per row.",
        Required: "Yes",
      },
      // ... other fields and their descriptions
      {
        "Field Name": "offerDate",
        Description: "Date of offer (YYYY-MM-DD)",
        Required: "Yes",
      },
      {
        "Field Name": "inspectionDate",
        Description: "Date of inspection (YYYY-MM-DD)",
        Required: "Yes",
      },
      {
        "Field Name": "diNo",
        Description: "DI Number",
        Required: "No",
      },
      {
        "Field Name": "diDate",
        Description: "DI Date (YYYY-MM-DD)",
        Required: "No",
      },
      {
        "Field Name": "warranty",
        Description: "Warranty period (e.g., 60 Months)",
        Required: "No",
      },
      {
        "Field Name": "nominationLetterNo",
        Description: "Nomination Letter Number",
        Required: "No",
      },
      {
        "Field Name": "nominationDate",
        Description: "Nomination Date (YYYY-MM-DD)",
        Required: "No",
      },
    ];
    const instructionsWorksheet = XLSX.utils.json_to_sheet(instructionsData);

    const workbook = {
      Sheets: {
        "Final Inspection Data": mainWorksheet,
        Instructions: instructionsWorksheet,
      },
      SheetNames: ["Final Inspection Data", "Instructions"],
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "final_inspection_sample.xlsx");
  };

  const { mutate: bulkUpload, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/final-inspections/bulk-upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["finalInspections"]);
      setBulkUploadModalOpen(false);
      setSelectedFile(null);
      setUploadErrors([]); // Clear errors on success
      setAlertBox({ open: true, msg: "Bulk upload successful!", error: false });
    },
    onError: (error) => {
      let errors = [];
      if (
        error.response?.data?.details &&
        Array.isArray(error.response.data.details)
      ) {
        errors = error.response.data.details;
      } else {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "An unexpected error occurred.";
        errors = [{ error: errorMessage }]; // Fallback for generic errors
      }
      setUploadErrors(errors); // Set state with structured errors
    },
  });

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    setUploadErrors([]); // Clear previous errors on new file drop
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleBulkUploadSubmit = () => {
    if (selectedFile) {
      bulkUpload(selectedFile);
    } else {
      setAlertBox({ open: true, msg: "Please select a file.", error: true });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/final-inspections/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Final Inspection deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["finalInspections"]);
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEditClick = (item) => {
    setSelectedFinalInspection(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedFinalInspection(null);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Final Inspection List</h5>
          <div className="d-flex align-items-center">
            <TextField
              variant="outlined"
              placeholder="Search Tn Number, Rating and Officers...."
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
            {hasPermission("FinalInspectionCreate") && (
              <>
                <Button
                  className="btn-blue ms-3 ps-3 pe-3"
                  onClick={() => setBulkUploadModalOpen(true)}
                >
                  Bulk Upload
                </Button>

                <Link to={"/add-finalInspection"}>
                  <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bulk Upload Modal */}
        <Dialog
          open={bulkUploadModalOpen}
          onClose={() => {
            setBulkUploadModalOpen(false);
            setSelectedFile(null);
            setUploadErrors([]); // Clear errors on modal close
          }}
          fullWidth
        >
          <DialogTitle className="d-flex justify-content-between align-items-center">
            Bulk Upload Final Inspections
            <IconButton
              onClick={() => {
                setBulkUploadModalOpen(false);
                setSelectedFile(null);
                setUploadErrors([]); // Clear errors on icon click close
              }}
            >
              <IoCloseSharp />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Button onClick={downloadSample} variant="outlined" sx={{ mb: 2 }}>
              Download Sample
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
                <p>Drag 'n' drop a file here, or click to select a file</p>
              )}
            </div>
            {uploadErrors.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "error.main",
                  borderRadius: 1,
                  maxHeight: "200px",
                  overflowY: "auto",
                  backgroundColor: "#ffebee",
                }}
              >
                <Typography color="error" variant="h6" gutterBottom>
                  Upload Failed
                </Typography>
                {uploadErrors.map((err, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography color="error.main" variant="body2">
                      <strong>
                        - Row {err.row} (Key: {err.key}):
                      </strong>
                      {Array.isArray(err.errors) ? (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "20px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {err.errors.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ marginLeft: "8px" }}>{err.error}</span>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setBulkUploadModalOpen(false);
                setSelectedFile(null);
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
                  <th>Sr No</th>
                  <th>Date of Offer</th>
                  <th>Offered Quantity</th>
                  <th>TN No.</th>
                  <th>Rating</th>
                  <th>Phase</th>
                  <th>Wound</th>
                  <th>Offered Sr. No.</th>
                  <th>Sub Sr. No.</th>
                  <th>Inspection Officers</th>
                  <th>Nomination Letter No</th>
                  <th>Nomination Date</th>
                  <th>Inspection Date</th>
                  <th>Inspected Quantity</th>
                  <th>Total</th>
                  <th>DI No & Date</th>
                  <th>Warranty Period</th>
                  {hasPermission("FinalInspectionUpdate") && <th>Action</th>}
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="18">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="18">Error fetching data</td>
                  </tr>
                ) : finalInspections.items.length > 0 ? (
                  finalInspections.items.map((item, index) => (
                    <tr key={item.id}>
                      <td># {index + 1 + (currentPage - 1) * 10}</td>
                      <td>{format(new Date(item.offerDate), "dd MMM yyyy")}</td>
                      <td>{item.offeredQuantity}</td>

                      <td>{item.deliverySchedule?.tnNumber}</td>
                      <td>{item.deliverySchedule?.rating}</td>
                      <td>{item.deliverySchedule?.phase}</td>
                      <td>{item.deliverySchedule?.wound}</td>
                      <td>
                        {item.serialNumberFrom} TO {item.serialNumberTo}
                      </td>
                      <td>
                        {item.consignees?.map((consignee, idx) => (
                          <div key={idx} className="mb-1">
                            {consignee.subSnNumber}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap justify-content-center gap-1">
                          {Array.isArray(item.inspectionOfficers) &&
                            item.inspectionOfficers.map((officer, idx) => (
                              <span
                                key={idx}
                                className="badge bg-info text-white px-2 py-1"
                                style={{
                                  fontSize: "0.75rem",
                                  borderRadius: "10px",
                                }}
                              >
                                {officer}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td>{item.nominationLetterNo || "-"}</td>
                      <td>
                        {item.nominationDate
                          ? format(new Date(item.nominationDate), "dd MMM yyyy")
                          : "-"}
                      </td>
                      <td>
                        {format(new Date(item.inspectionDate), "dd MMM yyyy")}
                      </td>
                      <td>{item.inspectedQuantity}</td>
                      <td>{item.total || "-"}</td>
                      <td>
                        <div className="fw-semibold">{item.diNo}</div>
                        <div className="text-muted small">
                          {format(new Date(item.diDate), "dd MMM yyyy")}
                        </div>
                      </td>
                      <td>
                        {item.deliverySchedule?.guaranteePeriodMonths} Months
                      </td>
                      {hasPermission("FinalInspectionUpdate") && (
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                            {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash />
                          </button> */}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="18" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {totalPages > 1 && (
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <FinalInspectionModal
        open={openModal}
        handleClose={handleModalClose}
        inspectionData={selectedFinalInspection}
      />
    </>
  );
};

export default FinalInspectionList;
