import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 1400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const ViewNewGPInformationModal = ({ open, handleClose, newGPInformation }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold">
            Details for Challan: {newGPInformation?.challanReceiptedItemNo}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>TRFSI No</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Poly Seal No</TableCell>
                <TableCell>Received From ACOS</TableCell>
                <TableCell>Inspection Date</TableCell>
                <TableCell>Matched Challan No</TableCell>
                <TableCell>Matched Challan Date</TableCell>
                <TableCell>Consignee Name</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newGPInformation?.records?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.trfsiNo}</TableCell>
                  <TableCell>{record.rating}</TableCell>
                  <TableCell>{record.polyCarbonateSealNo}</TableCell>
                  <TableCell>{record.receivedFromACOS}</TableCell>
                  <TableCell>
                    {record.inspectionDate
                      ? dayjs(record.inspectionDate).format("DD-MM-YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{record.challanNo}</TableCell>
                  <TableCell>
                    {record.challanDate
                      ? dayjs(record.challanDate).format("DD-MM-YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell>{record.consigneeName}</TableCell>
                  <TableCell>
                    {record.isMatched ? (
                      <Chip label="Matched" color="success" size="small" />
                    ) : (
                      <Chip label="Not Matched" color="error" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default ViewNewGPInformationModal;
