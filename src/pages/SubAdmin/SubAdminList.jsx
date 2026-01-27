import { useContext, useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  Typography,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDropzone } from "react-dropzone";
import { defaultPermissions } from "../../data/permission";

const SubAdminList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPageAccess, setEditedPageAccess] = useState([]);
  const [editedLoginId, setEditedLoginId] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]); // State for bulk upload errors

  const allAccessPages = Object.keys(defaultPermissions);
  const subAdminRoles = ["OWNER", "MANAGER", "DATA_FEEDER", "SUPERVISOR"];

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subadmins", currentPage],
    queryFn: () =>
      api.get(`/users?page=${currentPage}`).then((res) => res.data),
    placeholderData: { items: [], totalPages: 1 },
  });

  const totalPages = usersData.totalPages;

  const downloadSample = () => {
    const sampleData = [
      {
        Company: "Sample Company A",
        Discom: "Sample Discom X",
        name: "John Doe",
        loginId: "john.doe",
        number: "1234567890",
        password: "password123",
        role: "MANAGER",
        pages: "DeliveryScheduleCreate, DeliveryScheduleList, ConsigneeList",
      },
      {
        Company: "Sample Company B",
        Discom: "Sample Discom Y",
        name: "Jane Smith",
        loginId: "jane.smith",
        number: "9876543210",
        password: "securepassword",
        role: "DATA_FEEDER",
        pages: "FinalInspectionCreate, FinalInspectionList",
      },
    ];

    const mainWorksheet = XLSX.utils.json_to_sheet(sampleData);

    // Create a second sheet for permissions reference
    const permissionsData = allAccessPages.map(p => ({ "Available Permissions": p }));
    const permissionsWorksheet = XLSX.utils.json_to_sheet(permissionsData);

    const workbook = {
      Sheets: {
        "User Data": mainWorksheet, // Renamed Sheet1 for clarity
        "Available Permissions": permissionsWorksheet, // New sheet
      },
      SheetNames: ["User Data", "Available Permissions"], // Updated sheet names
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "subadmin_sample.xlsx");
  };

  const { mutate: bulkUpload, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/users/bulk-upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subadmins"]);
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
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "User deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["subadmins"]);
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser) =>
      api.put(`/users/${selectedSubAdmin.id}`, updatedUser),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "User details updated successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["subadmins"]);
      handleModalClose();
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Sub-admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditClick = (item) => {
    setSelectedSubAdmin(item);
    setEditedUserName(item.name);

    let pages = [];
    if (item.pages) {
      if (typeof item.pages === "string") {
        try {
          pages = JSON.parse(item.pages);
        } catch (e) {
          console.error("Failed to parse pages JSON string:", e);
          pages = [];
        }
      } else if (Array.isArray(item.pages)) {
        pages = item.pages;
      }
    }
    setEditedPageAccess(pages);

    setEditedLoginId(item.loginId);
    setEditedNumber(item.number);
    setEditedRole(item.role);
    setEditedPassword(item.password); // Clear password field for security
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSubAdmin(null);
    setEditedUserName("");
    setEditedPageAccess([]);
    setEditedLoginId("");
    setEditedNumber("");
    setEditedRole("");
    setEditedPassword("");
  };

  const handleSaveChanges = () => {
    const editData = {
      name: editedUserName,
      loginId: editedLoginId,
      number: editedNumber,
      role: editedRole,
      pages: editedPageAccess,
    };
    if (editedPassword) {
      editData.password = editedPassword;
    }
    updateMutation.mutate(editData);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">SubAdmin List</h5>
          {hasPermission("SubAdminCreate") && (
            <div className="ms-auto d-flex align-items-center">
              <Button
                className="btn-blue ms-3 ps-3 pe-3"
                onClick={() => setBulkUploadModalOpen(true)}
              >
                Bulk Upload
              </Button>
              <Link to={"/signup"}>
                <Button className="btn-blue ms-3 ps-3 pe-3">Add Users</Button>
              </Link>
            </div>
          )}
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
            Bulk Upload Sub-Admins
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
                        - Row {err.row} (Login ID: {err.loginId}):
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
                  <th>NO</th>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>Login Id</th>
                  {hasPermission("SubAdminUpdate") && <th>ACTION</th>}
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="5">Error fetching data</td>
                  </tr>
                ) : usersData.items.length > 0 ? (
                  usersData.items.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1 + (currentPage - 1) * 10}</td>
                      <td>
                        <div className="fw-semibold">{item.name}</div>
                        <span className="text-muted">{item.number}</span>
                      </td>
                      <td>{item.role}</td>
                      <td>{item.loginId}</td>
                      {hasPermission("SubAdminUpdate") && (
                        <td>
                          <div className="d-flex gap-2 align-item-center justify-content-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                            {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(item.id)}
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
                    <td colSpan="5" className="text-center">
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

      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Sub-Admin
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={editedUserName}
            onChange={(e) => setEditedUserName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Access Pages</InputLabel>
            <Select
              multiple
              value={editedPageAccess}
              onChange={(e) => setEditedPageAccess(e.target.value)}
              input={<OutlinedInput label="Access Pages" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {allAccessPages.map((page) => (
                <MenuItem key={page} value={page}>
                  <Checkbox checked={editedPageAccess.indexOf(page) > -1} />
                  <ListItemText primary={page} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="text"
            label="Login Id"
            margin="normal"
            value={editedLoginId}
            onChange={(e) => setEditedLoginId(e.target.value)}
          />
          <TextField
            fullWidth
            type="text"
            label="Contact no"
            margin="normal"
            value={editedNumber}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setEditedNumber(numericValue.slice(0, 10));
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
              label="Role"
            >
              {subAdminRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            placeholder="Enter new password to update"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
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
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubAdminList;
