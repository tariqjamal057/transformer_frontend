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

  const [selectedTN, setSelectedTN] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [selectedTransformers, setSelectedTransformers] = useState([]);
  const [availableSubSerialNumbers, setAvailableSubSerialNumbers] = useState(
    [],
  );

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
    const record = finalInspections.find(
      (item) => item?.id === tnNumber,
    );

    if (record) {
      setSelectedRecord(record);
      setDiNo(record.diNo);
      setDiDate(dayjs(record.diDate));
      setInspectionDate(dayjs(record.inspectionDate));
      setInspectionOfficers(record.inspectionOfficers.join(", "));
      setPoNo(record.deliverySchedule.po);
      setPoDate(dayjs(record.deliverySchedule.poDate));
      setSerialNumber(
        record.snNumber ||
          `${record.serialNumberFrom} TO ${record.serialNumberTo}`,
      );
      setChalanDescription(record.deliverySchedule.description);

      setAvailableConsignees(record.consignees || []);
      setSelectedConsigneeId("");
      setConsigneeAddress("");
      setConsigneeGSTNo("");
      setSelectedTransformers([]);

      if (record.repaired_transformer_srno) {
        const subSerialNumbers = record.repaired_transformer_mapping.map(
          (srNoIst) => ({
            id: srNoIst.oldSrNo,
            serialNo: srNoIst.oldSrNo,
          }),
        );
        setAvailableSubSerialNumbers(subSerialNumbers);
      } else {
        setAvailableSubSerialNumbers([]);
      }
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

    const record = consignees.find((item) => item.id === selectedId);
    if (record) {
      setConsigneeAddress(record.address);
      setConsigneeGSTNo(record.gstNo);
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
      api.put(`/delivery-challans/${deliveryChalanData.id}`, updatedChallan),
    onSuccess: () => {
      queryClient.invalidateQueries(["deliveryChallans"]);
      handleClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the selected consignee to get subSnNumber
    const selectedConsignee = availableConsignees.find(
      (c) => c.consigneeId === selectedConsigneeId
    );

    let subSerialNumberFrom = null;
    let subSerialNumberTo = null;

    if (selectedConsignee && selectedConsignee.subSnNumber) {
      const [from, to] = selectedConsignee.subSnNumber.split(" TO ");
      subSerialNumberFrom = from ? String(from) : null;
      subSerialNumberTo = to ? String(to) : null;
    }

    const data = {
      finalInspectionId:
        selectedRecord?.id || deliveryChalanData.finalInspection.id,
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
        deliveryChalanData.finalInspection.deliverySchedule.supplyTenderId,
    };

    updateChallan(data);
  };

  // Load initial data if editing
  useEffect(() => {
    if (
      deliveryChalanData &&
      deliveryChalanData.finalInspection &&
      finalInspections
    ) {
      const fi = finalInspections.find(
        (f) => f.id === deliveryChalanData.finalInspectionId,
      );
      const ds = fi?.deliverySchedule;
      if (!fi || !ds) return;

      setSelectedRecord(fi);

      // 🔹 TN & Serial Numbers
      setSelectedTN(ds?.tnNumber || "");
      setSerialNumber(
        fi.snNumber || `${fi.serialNumberFrom} TO ${fi.serialNumberTo}`,
      );

      // 🔹 Consignees & Sub-serials
      const consigneesFromFI = fi.consignees || [];
      setAvailableConsignees(consigneesFromFI);
      setSelectedConsigneeId(deliveryChalanData.consigneeId);

      if (fi.repaired_transformer_srno) {
        const subSerialNumbers = fi.repaired_transformer_srno.map((srNo) => ({
          id: srNo,
          serialNo: srNo,
        }));
        setAvailableSubSerialNumbers(subSerialNumbers);
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

      // 🔹 DI Details
      setDiNo(fi.diNo || "");
      setDiDate(fi.diDate ? dayjs(fi.diDate) : null);

      // 🔹 Inspection
      setInspectionDate(fi.inspectionDate ? dayjs(fi.inspectionDate) : null);
      setInspectionOfficers(fi.inspectionOfficers.join(", ") || []);

      // 🔹 PO Details
      setPoNo(ds.po || "");
      setPoDate(ds.poDate ? dayjs(ds.poDate) : null);

      // 🔹 Challan
      setChallanNo(deliveryChalanData.challanNo || "");
      setChalanDescription(ds.chalanDescription || "");
      setMaterialDescription(
        deliveryChalanData.materialDescription?.description || "",
      );
      setSelectedMaterialCode(deliveryChalanData.materialDescriptionId || "");

      // 🔹 Consignor
      setConsignorName(deliveryChalanData.consignorName || "");
      setConsignorAddress(deliveryChalanData.consignorAddress || "");
      setConsignorPhoneNo(deliveryChalanData.consignorPhone || "");
      setConsignorGSTNo(deliveryChalanData.consignorGST || "");
      setConsignorEmail(deliveryChalanData.consignorEmail || "");

      // 🔹 Consignee
      setConsigneeAddress(deliveryChalanData.consignee?.address || "");
      setConsigneeGSTNo(deliveryChalanData.consignee?.gstNo || "");

      // 🔹 Transport Details
      setLorryNo(deliveryChalanData.lorryNo || "");
      setDriverName(deliveryChalanData.truckDriverName || "");
    }
  }, [deliveryChalanData, consignees, finalInspections]);

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
            {finalInspections?.map((tn) => (
              <MenuItem
                key={tn?.id}
                value={tn?.id}
              >
                {tn.deliverySchedule?.tnNumber}
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

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Sub Serial No</InputLabel>
            <Select
              multiple
              value={selectedTransformers}
              onChange={(e) => setSelectedTransformers(e.target.value)}
              input={<OutlinedInput label="Sub Serial No" />}
              renderValue={(selected) =>
                selected
                  .map(
                    (id) =>
                      availableSubSerialNumbers.find((s) => s.id === id)
                        ?.serialNo || "",
                  )
                  .join(", ")
              }
              disabled={!selectedTN || !availableSubSerialNumbers?.length}
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
            value={selectedConsigneeId}
            onChange={handleConsigneeChange}
            sx={{ mt: 2 }}
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
            readOnly
            //onChange={(e) => setMaterialDescription(e.target.value)}
            margin="normal"
            sx={{ mt: 2 }}
          />

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
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
