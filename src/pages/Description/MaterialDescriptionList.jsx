import { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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

const MaterialDescriptionList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState("");
  const [rating, setRating] = useState("");
  const [wound, setWound] = useState("");
  const [description, setDescription] = useState("");

  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    data: materialDescriptions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["materialDescriptions", currentPage],
    queryFn: () =>
      api
        .get(`/material-descriptions?page=${currentPage}`)
        .then((res) => res.data),
    placeholderData: { items: [], totalPages: 1 },
  });

  const totalPages = materialDescriptions.totalPages;

  const downloadSample = () => {
    const sampleData = [
      {
        name: "Sample Material",
        phase: "THREE",
        rating: "500KVA",
        wound: "COPPER",
        description: "This is a sample description.",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "material_description_sample.xlsx");
  };

  const { mutate: bulkUpload, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/material-descriptions/bulk-upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["materialDescriptions"]);
      setBulkUploadModalOpen(false);
      setSelectedFile(null);
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
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/material-descriptions/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Material Description deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["materialDescriptions"]);
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedDescription) =>
      api.put(
        `/material-descriptions/${selectedDescription.id}`,
        updatedDescription,
      ),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Material Description updated successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["materialDescriptions"]);
      handleModalClose();
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
    setSelectedDescription(item);
    setName(item.name);
    setPhase(item.phase);
    setRating(item.rating);
    setWound(item.wound);
    setDescription(item.description);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedDescription(null);
    setName("");
    setPhase("");
    setRating("");
    setWound("");
    setDescription("");
  };

  const handleSaveChanges = () => {
    updateMutation.mutate({
      name,
      phase,
      rating,
      wound,
      description,
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Material Description List</h5>
          {hasPermission("MaterialDescriptionCreate") && (
            <div className="ms-auto d-flex align-items-center">
              <Button
                className="btn-blue ms-3 ps-3 pe-3"
                onClick={() => setBulkUploadModalOpen(true)}
              >
                Bulk Upload
              </Button>
              <Link to={"/add-materialDescription"}>
                <Button className="btn-blue ms-3 ps-3 pe-3">
                  Add Material Description
                </Button>
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
          }}
          fullWidth
        >
          <DialogTitle className="d-flex justify-content-between align-items-center">
            Bulk Upload Material Descriptions
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
                  <th>NO</th>
                  <th>MATERIAL NAME</th>
                  <th>Phase</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>MATERIAL DESCRIPTION</th>
                  {hasPermission("MaterialDescriptionUpdate") && (
                    <th>ACTION</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="7">Error fetching data</td>
                  </tr>
                ) : materialDescriptions.items.length > 0 ? (
                  materialDescriptions.items.map((item, index) => {
                    const shortDescription =
                      item.description.split(" ").slice(0, 8).join(" ") +
                      (item.description.split(" ").length > 8 ? " ..." : "");

                    return (
                      <tr key={index}>
                        <td># {index + 1 + (currentPage - 1) * 10}</td>
                        <td>{item.name}</td>
                        <td>{item.phase}</td>
                        <td>{item.rating}</td>
                        <td>{item.wound}</td>
                        <td>{shortDescription}</td>
                        {hasPermission("MaterialDescriptionUpdate") && (
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
                              onClick={() => handleDelete(item.id)}
                            >
                              <MdDelete />
                            </button> */}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
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

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Details
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Material Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Phase"
            fullWidth
            margin="normal"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
          />

          <TextField
            label="Rating"
            fullWidth
            margin="normal"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <TextField
            label="Wound"
            fullWidth
            margin="normal"
            value={wound}
            onChange={(e) => setWound(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description Of Material"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
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

export default MaterialDescriptionList;
