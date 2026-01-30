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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

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
  const queryClient = useQueryClient();

  const { data: finalInspections } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () =>
      api.get("/final-inspections?all=true").then((res) => res.data),
  });

  const { data: consignees } = useQuery({
    queryKey: ["consignees"],
    queryFn: () => api.get("/consignees?all=true").then((res) => res.data),
  });

  const { data: materialDescriptions } = useQuery({
    queryKey: ["material-descriptions"],
    queryFn: () =>
      api.get("/material-descriptions?all=true").then((res) => res.data),
  });

  const { data: deliverySchedules } = useQuery({
    queryKey: ["allDeliverySchedules"],
    queryFn: () =>
      api.get("/delivery-schedules?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: deliveryChallansAll } = useQuery({
    queryKey: ["deliveryChallansAll"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const [selectedTransformers, setSelectedTransformers] = useState([]);
  const [availableSubSerialNumbers, setAvailableSubSerialNumbers] = useState(
    [],
  );

  const [selectedTN, setSelectedTN] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [selectedDeliveryScheduleId, setSelectedDeliveryScheduleId] =
    useState("");
  const [filteredFinalInspections, setFilteredFinalInspections] = useState([]);
  const [selectedFinalInspectionId, setSelectedFinalInspectionId] =
    useState("");

  // Filter final inspections based on selected delivery schedule, excluding those already used by other challans
  useEffect(() => {
    if (selectedDeliveryScheduleId && finalInspections && deliveryChallansAll) {
      const usedFinalInspectionIds = new Set(
        deliveryChallansAll
          .filter(
            (dc) =>
              dc.finalInspection?.deliveryScheduleId ===
                selectedDeliveryScheduleId &&
              dc.finalInspectionId !== deliveryChalanData?.finalInspectionId, // Exclude current challan's final inspection
          )
          .map((dc) => dc.finalInspectionId),
      );

      const filtered = finalInspections.filter(
        (fi) =>
          fi.deliveryScheduleId === selectedDeliveryScheduleId &&
          !usedFinalInspectionIds.has(fi.id),
      );
      setFilteredFinalInspections(filtered);
    } else if (finalInspections) {
      setFilteredFinalInspections(finalInspections);
    } else {
      setFilteredFinalInspections([]);
    }
  }, [
    selectedDeliveryScheduleId,
    finalInspections,
    deliveryChallansAll,
    deliveryChalanData,
  ]);

  // Auto-fill fields
  const [diNo, setDiNo] = useState("");
  const [diDate, setDiDate] = useState(null);
  const [inspectionDate, setInspectionDate] = useState(null);
  const [inspectionOfficers, setInspectionOfficers] = useState("");
  const [poNo, setPoNo] = useState("");
  const [poDate, setPoDate] = useState(null);
  const [chalanDescription, setChalanDescription] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const handleDeliveryScheduleChange = (deliveryScheduleId) => {
    setSelectedDeliveryScheduleId(deliveryScheduleId);
    setSelectedFinalInspectionId(""); // Reset final inspection when TN changes
    setSelectedRecord(null); // Reset selectedRecord

    // Reset other fields
    setDiNo("");
    setDiDate(null);
    setInspectionDate(null);
    setInspectionOfficers("");
    setPoNo("");
    setPoDate(null);
    setChalanDescription("");
    setSerialNumber("");
    setAvailableConsignees([]);
    setSelectedConsigneeId("");
    setConsigneeAddress("");
    setConsigneeGSTNo("");
    setSelectedTransformers([]);
    setAvailableSubSerialNumbers([]);
  };

  const handleFinalInspectionChange = (finalInspectionId) => {
    setSelectedFinalInspectionId(finalInspectionId);
    const record = finalInspections?.find(
      (item) => item?.id === finalInspectionId,
    );

    if (record) {
      setSelectedRecord(record);

      // auto-filled fields
      setDiNo(record.diNo || "");
      setDiDate(record.diDate ? dayjs(record.diDate) : null);
      setInspectionDate(
        record.inspectionDate ? dayjs(record.inspectionDate) : null,
      );
      setInspectionOfficers(record.inspectionOfficers.join(", ") || "");
      setPoNo(record.deliverySchedule?.po || "");
      setPoDate(
        record.deliverySchedule?.poDate
          ? dayjs(record.deliverySchedule.poDate)
          : null,
      );
      setChalanDescription(record.deliverySchedule?.chalanDescription || "");
      setSerialNumber(
        record.snNumber ||
          `${record.serialNumberFrom} TO ${record.serialNumberTo}` ||
          "",
      );

      // Consignee population
      if (record.consignees && deliveryChallansAll) {
        const usedConsigneeIds = new Set(
          deliveryChallansAll
            .filter(
              (dc) =>
                dc.finalInspectionId === finalInspectionId &&
                dc.consigneeId !== deliveryChalanData?.consigneeId, // Exclude current challan's consignee
            )
            .map((dc) => dc.consigneeId),
        );
        const filteredConsignees = record.consignees.filter(
          (c) => !usedConsigneeIds.has(c.consigneeId),
        );
        setAvailableConsignees(filteredConsignees);
      } else {
        setAvailableConsignees(record.consignees || []);
      }
      setSelectedConsigneeId("");
      setConsigneeAddress("");
      setConsigneeGSTNo("");

      // Sub-serial number population
      setSelectedTransformers([]);
      if (record.serialNumberFrom && record.serialNumberTo) {
        const from = parseInt(record.serialNumberFrom, 10);
        const to = parseInt(record.serialNumberTo, 10);
        const subSerialNumbers = [];
        for (let i = from; i <= to; i++) {
          subSerialNumbers.push({ id: String(i), serialNo: String(i) });
        }
        setAvailableSubSerialNumbers(subSerialNumbers);
      } else {
        setAvailableSubSerialNumbers([]);
      }
    } else {
      // Reset all fields if no record is found or selection is cleared
      setSelectedRecord(null);
      setDiNo("");
      setDiDate(null);
      setInspectionDate(null);
      setInspectionOfficers("");
      setPoNo("");
      setPoDate(null);
      setChalanDescription("");
      setSerialNumber("");
      setAvailableConsignees([]);
      setSelectedConsigneeId("");
      setConsigneeAddress("");
      setConsigneeGSTNo("");
      setSelectedTransformers([]);
      setAvailableSubSerialNumbers([]);
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

  const [availableConsignees, setAvailableConsignees] = useState([]);
  const [selectedConsigneeId, setSelectedConsigneeId] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeGSTNo, setConsigneeGSTNo] = useState("");

  const handleConsigneeChange = (event) => {
    const selectedId = event.target.value;
    setSelectedConsigneeId(selectedId);

    const record = availableConsignees.find(
      (item) => item.consigneeId === selectedId,
    );
    if (record) {
      setConsigneeAddress(record.consigneeAddress);
      setConsigneeGSTNo(record.consigneeGstNo);
    } else {
      setConsigneeAddress("");
      setConsigneeGSTNo("");
    }
  };

  const [driverName, setDriverName] = useState("");
  const [lorryNo, setLorryNo] = useState("");

  const [materialDescription, setMaterialDescription] = useState("");
  const [selectedMaterialCode, setSelectedMaterialCode] = useState("");

  const handleMaterialSelect = (id) => {
    setSelectedMaterialCode(id);

    const record = materialDescriptions.find((item) => item.id === id);
    if (record) {
      setMaterialDescription(record.description); // Fill the whole description
    } else {
      setMaterialDescription("");
    }
  };

  const { mutate: updateChallan, isLoading } = useMutation({
    mutationFn: (updatedChallan) =>
      api.put(
        `/delivery-challans/${deliveryChalanData.id}`,
        updatedChallan,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["deliveryChallans"]);
      handleClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    let subSerialNumberFrom = null;
    let subSerialNumberTo = null;

    if (selectedTransformers.length > 0) {
      const numericSerials = selectedTransformers.map((n) => parseInt(n, 10));
      subSerialNumberFrom = String(Math.min(...numericSerials));
      subSerialNumberTo = String(Math.max(...numericSerials));
    }

    const data = {
      finalInspectionId:
        selectedRecord?.id || deliveryChalanData.finalInspectionId,
      challanNo,
      subSerialNumberFrom,
      subSerialNumberTo,
      consignorName,
      consignorAddress,
      consignorPhone: consignorPhoneNo,
      consignorGST: consignorGSTNo,
      consignorEmail,
      consigneeId: selectedConsigneeId,
      lorryNo,
      truckDriverName: driverName,
      materialDescriptionId: selectedMaterialCode,
      challanDescription: chalanDescription,
      supplyTenderId:
        selectedRecord?.deliverySchedule?.supplyTenderId ||
        deliveryChalanData.supplyTenderId,
    };

    updateChallan(data);
  };

  // Load initial data if editing
  useEffect(() => {
    if (
      deliveryChalanData &&
      deliveryChalanData.finalInspection &&
      finalInspections &&
      deliverySchedules &&
      deliveryChallansAll
    ) {
      const fi = deliveryChalanData.finalInspection;
      const ds = fi.deliverySchedule;
      if (!fi || !ds) return;

      setSelectedDeliveryScheduleId(ds.id);
      setSelectedFinalInspectionId(fi.id);
      setSelectedRecord(fi);

      setSerialNumber(
        fi.snNumber || `${fi.serialNumberFrom} TO ${fi.serialNumberTo}`,
      );

      // Consignees & Sub-serials
      if (fi.consignees && deliveryChallansAll) {
        const usedConsigneeIds = new Set(
          deliveryChallansAll
            .filter(
              (dc) =>
                dc.finalInspectionId === fi.id &&
                dc.consigneeId !== deliveryChalanData.consigneeId, // Exclude current challan's consignee
            )
            .map((dc) => dc.consigneeId),
        );
        const filteredConsignees = fi.consignees.filter(
          (c) => !usedConsigneeIds.has(c.consigneeId),
        );
        setAvailableConsignees(filteredConsignees);
      } else {
        setAvailableConsignees(fi.consignees || []);
      }
      setSelectedConsigneeId(deliveryChalanData.consigneeId);

      // Sub-serial population
      if (fi.repaired_transformer_srno && fi.repaired_transformer_mapping) {
        const subSerialNumbers = fi.repaired_transformer_mapping.map(
          (srNoIst) => ({
            id: srNoIst.oldSrNo,
            serialNo: srNoIst.oldSrNo,
          }),
        );
        setAvailableSubSerialNumbers(subSerialNumbers);
      } else {
        setAvailableSubSerialNumbers([]);
      }

      const subSerialFrom = deliveryChalanData.subSerialNumberFrom;
      const subSerialTo = deliveryChalanData.subSerialNumberTo;
      if (subSerialFrom && subSerialTo) {
        const selected = [];
        for (let i = parseInt(subSerialFrom); i <= parseInt(subSerialTo); i++) {
          selected.push(String(i));
        }
        setSelectedTransformers(selected);
      }

      setDiNo(fi.diNo || "");
      setDiDate(fi.diDate ? dayjs(fi.diDate) : null);

      setInspectionDate(fi.inspectionDate ? dayjs(fi.inspectionDate) : null);
      setInspectionOfficers(fi.inspectionOfficers.join(", ") || []);

      setPoNo(ds.po || "");
      setPoDate(ds.poDate ? dayjs(ds.poDate) : null);

      setChallanNo(deliveryChalanData.challanNo || "");
      setChalanDescription(ds.chalanDescription || "");
      setSelectedMaterialCode(deliveryChalanData.materialDescriptionId || "");
      setMaterialDescription(
        deliveryChalanData.materialDescription?.description || "",
      );

      setConsignorName(deliveryChalanData.consignorName || "");
      setConsignorAddress(deliveryChalanData.consignorAddress || "");
      setConsignorPhoneNo(deliveryChalanData.consignorPhone || "");
      setConsignorGSTNo(deliveryChalanData.consignorGST || "");
      setConsignorEmail(deliveryChalanData.consignorEmail || "");

      setConsigneeAddress(deliveryChalanData.consignee?.address || "");
      setConsigneeGSTNo(deliveryChalanData.consignee?.gstNo || "");

      setLorryNo(deliveryChalanData.lorryNo || "");
      setDriverName(deliveryChalanData.truckDriverName || "");
    }
  }, [
    deliveryChalanData,
    finalInspections,
    deliverySchedules,
    deliveryChallansAll,
  ]);

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

        <Box mt={2} component="form" onSubmit={handleSubmit}>
          {/* TN Dropdown */}

          <TextField
            select
            fullWidth
            label="Select TN Number"
            value={selectedDeliveryScheduleId}
            onChange={(e) => handleDeliveryScheduleChange(e.target.value)}
            sx={{ mt: 2 }}
          >
            {deliverySchedules?.map((ds) => (
              <MenuItem key={ds?.id} value={ds?.id}>
                {ds?.tnNumber}
              </MenuItem>
            ))}
          </TextField>

          {/* Serial Number Dropdown */}
          <TextField
            select
            fullWidth
            label="Select Serial Number"
            value={selectedFinalInspectionId}
            onChange={(e) => handleFinalInspectionChange(e.target.value)}
            disabled={!selectedDeliveryScheduleId}
            sx={{ mt: 2 }}
          >
            {filteredFinalInspections?.map((fi) => (
              <MenuItem key={fi?.id} value={fi?.id}>
                {fi?.serialNumberFrom} TO {fi?.serialNumberTo}
              </MenuItem>
            ))}
          </TextField>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Sub Serial No</InputLabel>
            <Select
              multiple
              value={selectedTransformers}
              onChange={(e) => setSelectedTransformers(e.target.value)}
              input={<OutlinedInput label="Sub Serial No" />}
              renderValue={(selected) => selected.join(", ")}
              disabled={
                !selectedFinalInspectionId || !availableSubSerialNumbers?.length
              }
            >
              {availableSubSerialNumbers?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox checked={selectedTransformers.includes(s.id)} />
                  <ListItemText primary={s.serialNo} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
            />
          </LocalizationProvider>

          {/* Inspection Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Inspection Date"
              value={inspectionDate}
              //disabled
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
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
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
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
            value={selectedConsigneeId}
            onChange={handleConsigneeChange}
            sx={{ mt: 2 }}
            disabled={!selectedFinalInspectionId}
          >
            {availableConsignees?.map((item) => (
              <MenuItem key={item.consigneeId} value={item.consigneeId}>
                {item.consigneeName}
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
            InputProps={{ readOnly: true }}
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
            {materialDescriptions?.map((item) => {
              const firstSixWords = item.description
                .split(" ")
                .slice(0, 6)
                .join(" ");
              return (
                <MenuItem key={item.id} value={item.id}>
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
            InputProps={{ readOnly: true }}
            margin="normal"
            sx={{ mt: 2 }}
          />

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeliveryChalanModal;
