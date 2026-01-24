import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
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
        deliveryScheduleId: "enter_a_real_delivery_schedule_id_here",
        serialNumberFrom: 101,
        serialNumberTo: 110,
        offerDate: new Date().toISOString(),
        offeredQuantity: 10,
        inspectionDate: new Date().toISOString(),
        inspectedQuantity: 10,
        inspectionOfficers: JSON.stringify(["Officer A", "Officer B"]),
        diNo: "DI-12345",
        diDate: new Date().toISOString(),
        warranty: "60 Months",
        nominationLetterNo: "NL-001",
        nominationDate: new Date().toISOString(),
        consignees: JSON.stringify([
          {
            consigneeId: "enter_a_real_consignee_id_here",
            quantity: 10,
            subSerialNumber: "101-110",
          },
        ]),
        sealingDetails: JSON.stringify([
          { trfSiNo: "101", polySealNo: "PS-A" },
          { trfSiNo: "102", polySealNo: "PS-B" },
        ]),
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
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
      setAlertBox({ open: true, msg: "Bulk upload successful!", error: false });
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
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
          }}
          fullWidth
        >
          <DialogTitle className="d-flex justify-content-between align-items-center">
            Bulk Upload Final Inspections
            <IconButton
              onClick={() => {
                setBulkUploadModalOpen(false);
                setSelectedFile(null);
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
