import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import api from "../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyContext } from "../App";

const sampleHeaders = [
  {
    deliveryChalanId: "clx... (example)",
    receiptedChallanNo: "RC-456",
    receiptedChallanDate: "2024-01-15",
  },
];

const DeliveryDetailsBulkUploadModal = ({ open, handleClose }) => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);

  const bulkUploadMutation = useMutation({
    mutationFn: (formData) =>
      api.post("/delivery-details/bulk-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (response) => {
      setAlertBox({
        open: true,
        msg: `Bulk upload successful! Created ${response.data.createdDetails.count} records.`,
        error: false,
      });
      queryClient.invalidateQueries(["deliveryDetails"]);
      setSelectedFile(null);
      handleClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.message;
      setAlertBox({ open: true, msg: errorMessage, error: true });
    },
  });

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = () => {
    if (!selectedFile) {
      setAlertBox({ open: true, msg: "Please select a file.", error: true });
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    bulkUploadMutation.mutate(formData);
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleHeaders);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "sample_delivery_details.xlsx");
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleModalClose} fullWidth>
      <DialogTitle className="d-flex justify-content-between align-items-center">
        Bulk Upload Delivery Details
        <IconButton onClick={handleModalClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Button
          onClick={handleDownloadSample}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Download Sample XLSX
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
            <Typography>Selected file: {selectedFile.name}</Typography>
          ) : (
            <Typography>
              Drag 'n' drop an Excel file here, or click to select a file
            </Typography>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!selectedFile || bulkUploadMutation.isLoading}
          startIcon={
            bulkUploadMutation.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {bulkUploadMutation.isLoading ? "Uploading..." : "Upload Details"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryDetailsBulkUploadModal;
