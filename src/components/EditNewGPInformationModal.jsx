import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const EditNewGPInformationModal = ({ open, handleClose, newGPInformation }) => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [parentData, setParentData] = useState({
    challanReceiptedItemNo: "",
    challanReceiptedDate: null,
  });
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (newGPInformation) {
      setParentData({
        challanReceiptedItemNo: newGPInformation.challanReceiptedItemNo,
        challanReceiptedDate: newGPInformation.challanReceiptedDate
          ? dayjs(newGPInformation.challanReceiptedDate)
          : null,
      });
      setRecords(
        newGPInformation.records.map((r) => ({
          ...r,
          inspectionDate: r.inspectionDate ? dayjs(r.inspectionDate) : null,
          challanDate: r.challanDate ? dayjs(r.challanDate) : null,
        })) || []
      );
    }
  }, [newGPInformation]);

  const { mutate: updateInfo, isLoading } = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/new-gp-informations/${newGPInformation.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["newGpInformations"]);
      setAlertBox({ open: true, msg: "Updated successfully!", error: false });
      handleClose();
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = value;
    setRecords(updatedRecords);
  };

  const handleRecordCheckboxChange = (index, field, checked) => {
    const updatedRecords = [...records];
    updatedRecords[index][field] = checked;
    setRecords(updatedRecords);
  };

  const handleSubmit = () => {
    const submissionData = {
      ...parentData,
      challanReceiptedDate: parentData.challanReceiptedDate
        ? dayjs(parentData.challanReceiptedDate).toISOString()
        : null,
      records: records.map((r) => ({
        ...r,
        inspectionDate: r.inspectionDate
          ? dayjs(r.inspectionDate).toISOString()
          : null,
        challanDate: r.challanDate ? dayjs(r.challanDate).toISOString() : null,
      })),
    };
    updateInfo(submissionData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold">
              Edit New GP Information
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={1}>
              <TextField
                name="challanReceiptedItemNo"
                label="Challan Receipted Item No"
                value={parentData.challanReceiptedItemNo}
                onChange={handleParentChange}
                fullWidth
              />
            </Grid>
            <Grid item size={1}>
              <DatePicker
                label="Challan Receipted Date"
                value={parentData.challanReceiptedDate}
                onChange={(date) =>
                  setParentData((prev) => ({
                    ...prev,
                    challanReceiptedDate: date,
                  }))
                }
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="bold" mt={2}>
            Records
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>TRFSI No</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Poly Seal No</TableCell>
                  <TableCell>Challan No</TableCell>
                  <TableCell>Matched</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id || index}>
                    <TableCell>
                      <TextField
                        size="small"
                        value={record.trfsiNo}
                        onChange={(e) =>
                          handleRecordChange(index, "trfsiNo", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={record.rating}
                        onChange={(e) =>
                          handleRecordChange(index, "rating", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={record.polyCarbonateSealNo}
                        onChange={(e) =>
                          handleRecordChange(
                            index,
                            "polyCarbonateSealNo",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={record.challanNo}
                        onChange={(e) =>
                          handleRecordChange(index, "challanNo", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={record.isMatched}
                        onChange={(e) =>
                          handleRecordCheckboxChange(
                            index,
                            "isMatched",
                            e.target.checked
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Modal>
  );
};

export default EditNewGPInformationModal;
