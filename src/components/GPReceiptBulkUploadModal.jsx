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
  Box,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import api from "../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyContext } from "../App";

const GPReceiptBulkUploadModal = ({ open, handleClose }) => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadErrors, setUploadErrors] = useState([]);

  const bulkUploadMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/new-gp-receipt-records/bulk-upload", formData);
    },
    onSuccess: (response) => {
      setAlertBox({
        open: true,
        msg: `Bulk upload successful!`,
        error: false,
      });
      queryClient.invalidateQueries(["newGpReceiptRecords"]);
      setSelectedFile(null);
      setUploadErrors([]);
      handleClose();
    },
    onError: (error) => {
      let errors = [];
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        errors = error.response.data.details;
      } else {
        errors = [{ error: error.response?.data?.error || "Upload failed" }];
      }
      setUploadErrors(errors);
    }
  });

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    setUploadErrors([]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = () => {
    if (selectedFile) {
      bulkUploadMutation.mutate(selectedFile);
    } else {
      setAlertBox({ open: true, msg: "Please select a file.", error: true });
    }
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        "Challan No": "CH-123",
        "Account Receipt Note No": "ACC-123",
        "Account Receipt Note Date": "10/01/2024",
        "SIN No": "SIN-123",
        "Consignee Name": "Consignee Alpha",
        "Discom Receipt Note No": "DIS-123",
        "Discom Receipt Note Date": "11/01/2024",
        "Rec. Challan Item No": "REC-001",
        "Rec. Challan Item Date": "12/01/2024",
        "TRFSI No": "TRF-001",
        "Rating": "100",
        "Poly Seal No": "PS-001",
        "Remarks": "Sample remarks"
      }
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = { Sheets: { Sheet1: worksheet }, SheetNames: ["Sheet1"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "sample_gp_receipt_record.xlsx");
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setUploadErrors([]);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleModalClose} fullWidth>
      <DialogTitle className="d-flex justify-content-between align-items-center">
        Bulk Upload New GP Receipt Records
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
        
        {uploadErrors.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
            <Typography color="error" variant="subtitle2">Upload Errors:</Typography>
            {uploadErrors.map((err, idx) => (
              <Typography key={idx} variant="caption" color="error" display="block">
                • Row {err.row || '?'}: {err.error}
              </Typography>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!selectedFile || bulkUploadMutation.isPending}
        >
          {bulkUploadMutation.isPending ? <CircularProgress size={20} color="inherit" /> : "Upload Records"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GPReceiptBulkUploadModal;
