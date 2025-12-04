import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  IconButton,
  Stack,
  MenuItem,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  getDummyChalanDescriptions,
  getDummyConsigneeDetails,
  getDummyFinalInspectionDetails,
  getDummyMaterialDescriptions,
} from "../pages/DeliveryChallan/AddDeliveryChalan";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const DeliveryChalanModal = ({ open, handleClose, deliveryChalanData }) => {
  const dummyData = getDummyFinalInspectionDetails();

  const dummyConsignee = getDummyConsigneeDetails();

  const dummyDeliveryChalans = getDummyChalanDescriptions();

  const dummyMaterialDescriptions = getDummyMaterialDescriptions();

  const [selectedTN, setSelectedTN] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Auto-fill fields
  const [diNo, setDiNo] = useState("");
  const [diDate, setDiDate] = useState(null);
  const [inspectionDate, setInspectionDate] = useState(null);
  const [inspectionOfficers, setInspectionOfficers] = useState("");
  const [poNo, setPoNo] = useState("");
  const [poDate, setPoDate] = useState(null);
  const [chalanDescription, setChalanDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const handleTNChange = (tnNumber) => {
    setSelectedTN(tnNumber);
    const record = dummyData.find(
      (item) => item.deliverySchedule.tnNumber === tnNumber
    );

    if (record) {
      setSelectedRecord(record);
      setDiNo(record.diNo);
      setDiDate(dayjs(record.diDate));
      setInspectionDate(dayjs(record.inspectionDate));
      setInspectionOfficers(record.inspectionOfficers.join(", "));
      setPoNo(record.deliverySchedule.poDetails);
      setPoDate(dayjs(record.deliverySchedule.poDate));
      setSerialNumber(record.snNumber);
      setChalanDescription(record.deliverySchedule.description);
    }
  };

  const [challanNo, setChallanNo] = useState("");

  const [consignorName, setConsignorName] = useState("");
  const [consignorAddress, setConsignorAddress] = useState("");
  const [consignorPhoneNo, setConsignorPhoneNo] = useState("");
  const [consignorGSTNo, setConsignorGSTNo] = useState("");
  const [consignorEmail, setConsignorEmail] = useState("");

  // ✅ Load Consignor Details from LocalStorage
  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setConsignorName(company.name || "");
      setConsignorAddress(company.address || "");
      setConsignorPhoneNo(company.phone || "");
      setConsignorGSTNo(company.gst || "");
      setConsignorEmail(company.email || "");
    }
  }, []);

  const [consigneeName, setConsigneeName] = useState("");
  const [selectedConsigneeRecord, setSelectedConsigneeRecord] = useState(null);
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeGSTNo, setConsigneeGSTNo] = useState("");

  const handleConsigneeChange = (event) => {
    const selectedName = event.target.value;
    setConsigneeName(selectedName);

    const record = dummyConsignee.find((item) => item.name === selectedName);
    if (record) {
      setSelectedConsigneeRecord(record);
      setConsigneeAddress(record.address);
      setConsigneeGSTNo(record.gstNo);
    } else {
      setSelectedConsigneeRecord(null);
      setConsigneeAddress("");
      setConsigneeGSTNo("");
    }
  };

  const [driverName, setDriverName] = useState("");
  const [lorryNo, setLorryNo] = useState("");

  const [materialDescription, setMaterialDescription] = useState("");
  const [selectedMaterialCode, setSelectedMaterialCode] = useState("");

  const handleMaterialSelect = (code) => {
    setSelectedMaterialCode(code);

    const record = dummyMaterialDescriptions.find((item) => item.code === code);
    if (record) {
      setMaterialDescription(record.description); // Fill the whole description
    } else {
      setMaterialDescription("");
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    // Store entire final inspection object
    const data = {
      ...selectedRecord,
      challanNo,
      consignorName,
      consigneeAddress,
      consignorPhoneNo,
      consigneeGSTNo,
      consignorEmail,
      ...selectedConsigneeRecord,
      materialDescription,
      challanCreatedAt: dayjs().format("YYYY-MM-DD"),
    };

    console.log("Transformer Delivery Chalan Details", data);
    handleClose();
  };

  // Load initial data if editing
  useEffect(() => {
    if (deliveryChalanData && deliveryChalanData.finalInspectionDetail) {
      const fi = deliveryChalanData.finalInspectionDetail;
      const ds = fi.deliverySchedule;

      // 🔹 TN & Serial Numbers
      setSelectedTN(ds.tnNumber || "");
      setSerialNumber(fi.snNumber || "");

      // 🔹 DI Details
      setDiNo(fi.diNo || "");
      setDiDate(fi.diDate ? dayjs(fi.diDate) : null);

      // 🔹 Inspection
      setInspectionDate(fi.inspectionDate ? dayjs(fi.inspectionDate) : null);
      setInspectionOfficers(fi.inspectionOfficers || []);

      // 🔹 PO Details
      setPoNo(ds.poDetails || "");
      setPoDate(ds.poDate ? dayjs(ds.poDate) : null);

      // 🔹 Challan
      setChallanNo(deliveryChalanData.challanNo || "");
      setChalanDescription(
        ds.description || ""
      );
      setMaterialDescription(
        deliveryChalanData.materialDescription?.description || ""
      );

      // 🔹 Consignor
      setConsignorName(deliveryChalanData.consignorName || "");
      setConsignorAddress(deliveryChalanData.consignorAddress || "");
      setConsignorPhoneNo(deliveryChalanData.consignorPhone || "");
      setConsignorGSTNo(deliveryChalanData.consignorGST || "");
      setConsignorEmail(deliveryChalanData.consignorEmail || "");

      // 🔹 Consignee
      setConsigneeName(deliveryChalanData.consigneeDetails?.name || "");
      setConsigneeAddress(deliveryChalanData.consigneeDetails?.address || "");
      setConsigneeGSTNo(deliveryChalanData.consigneeDetails?.gstNo || "");

      // 🔹 Transport Details
      setLorryNo(deliveryChalanData.lorryNo || "");
      setDriverName(deliveryChalanData.truckDriverName || "");
    }
  }, [deliveryChalanData]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Edit Delivery Chalan
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box mt={2}>
          {/* TN Dropdown */}

          <TextField
            select
            fullWidth
            label="Select TN Number"
            value={selectedTN}
            onChange={(e) => handleTNChange(e.target.value)}
            sx={{ mt: 2 }}
          >
            {dummyData.map((tn) => (
              <MenuItem
                key={tn.deliverySchedule.tnNumber}
                value={tn.deliverySchedule.tnNumber}
              >
                {tn.deliverySchedule.tnNumber}
              </MenuItem>
            ))}
          </TextField>

          {/* Serial Number */}

          <TextField
            fullWidth
            label="Serial Number"
            value={serialNumber}
            sx={{ mt: 2 }}
            InputProps={{ readOnly: true }}
          />

          <TextField
            fullWidth
            label="DI No"
            value={diNo}
            sx={{ mt: 2 }}
            InputProps={{ readOnly: true }}
          />

          {/* DI Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="DI Date"
              value={diDate}
              //disabled
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2 }}
            />
          </LocalizationProvider>

          {/* Inspection Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Inspection Date"
              value={inspectionDate}
              //disabled
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2 }}
            />
          </LocalizationProvider>

          {/* Inspection Officers */}

          <TextField
            fullWidth
            label="Inspection Officers"
            value={inspectionOfficers}
            InputProps={{ readOnly: true }}
            multiline
            sx={{ mt: 2 }}
          />

          {/* PO No */}

          <TextField
            fullWidth
            label="PO No"
            value={poNo}
            //onChange={(e) => setPoNo(e.target.value)}
            sx={{ mt: 2 }}
          />

          {/* PO Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="PO Date"
              value={poDate}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2 }}
            />
          </LocalizationProvider>

          <TextField
            label="Challan No"
            fullWidth
            value={challanNo}
            onChange={(e) => setChallanNo(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Grid item size={2} mt={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              CONSIGNOR Details
            </Typography>
          </Grid>

          <TextField
            label="Consignor Name"
            fullWidth
            value={consignorName}
            onChange={(e) => setConsignorName(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Address"
            fullWidth
            value={consignorAddress}
            onChange={(e) => setConsignorAddress(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Phone"
            fullWidth
            value={consignorPhoneNo}
            onChange={(e) => setConsignorPhoneNo(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            label="GST No"
            fullWidth
            value={consignorGSTNo}
            onChange={(e) => setConsignorGSTNo(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Email"
            fullWidth
            value={consignorEmail}
            onChange={(e) => setConsignorEmail(e.target.value)}
            sx={{ mt: 2 }}
          />

          {/*Consignee Form*/}

          <Grid item size={2} mt={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              CONSIGNEE Details
            </Typography>
          </Grid>

          <TextField
            select
            fullWidth
            label="Select Consignee Name"
            value={consigneeName}
            onChange={handleConsigneeChange}
            sx={{ mt: 2 }}
          >
            {dummyConsignee.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Address"
            fullWidth
            value={consigneeAddress}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />

          <TextField
            label="GST No"
            fullWidth
            value={consigneeGSTNo}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2 }}
          />

          {/*Truck Details Form*/}

          <Grid item size={2} mt={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Truck Details
            </Typography>
          </Grid>

          <TextField
            label="Lorry No"
            fullWidth
            value={lorryNo}
            onChange={(e) => setLorryNo(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Driver Name"
            fullWidth
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Grid item size={2} mt={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Challan Description
            </Typography>
          </Grid>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Delivery Challan Description"
            value={chalanDescription}
            readOnly
            margin="normal"
            sx={{ mt: 2 }}
          />

          <Grid item size={2} mt={3}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Material Description
            </Typography>
          </Grid>

          <TextField
            select
            fullWidth
            label="Select Material Description"
            value={selectedMaterialCode}
            onChange={(e) => handleMaterialSelect(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          >
            {dummyMaterialDescriptions.map((item) => {
              const firstSixWords = item.description
                .split(" ")
                .slice(0, 6)
                .join(" ");
              return (
                <MenuItem key={item.code} value={item.code}>
                  {firstSixWords}...
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description Of Material"
            value={materialDescription}
            readOnly
            //onChange={(e) => setMaterialDescription(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          />

          <Box mt={4} textAlign="center">
            <Button variant="contained" size="large" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeliveryChalanModal;
