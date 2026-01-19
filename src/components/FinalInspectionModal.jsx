import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Chip,
  Button,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MyContext } from "../App";
import { Cancel } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import * as XLSX from "xlsx";

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

const FinalInspectionModal = ({ open, handleClose, inspectionData }) => {
  const today = dayjs();
  const queryClient = useQueryClient();

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const { data: deliverySchedules } = useQuery({
    queryKey: ["allDeliverySchedules"],
    queryFn: () =>
      api.get("/delivery-schedules?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: consignees } = useQuery({
    queryKey: ["allConsignees"],
    queryFn: () => api.get("/consignees?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const [tnDetail, setTnDetail] = useState("");
  const [serialNumberFrom, setSerialNumberFrom] = useState("");
  const [serialNumberTo, setSerialNumberTo] = useState("");
  const [sr, setSr] = useState("");
  const [inspectionDate, setInspectionDate] = useState(null);
  const [inspectedQuantity, setInspectedQuantity] = useState("");
  const [nominationLetterNo, setNominationLetterNo] = useState("");
  const [nominationDate, setNominationDate] = useState(null);
  const [offerDate, setOfferDate] = useState(null);
  const [offeredQuantity, setOfferedQuantity] = useState("");
  const [inspectionOfficer, setInspectionOfficer] = useState("");
  const [selectedInspectionOfficer, setSelectedInspectionOfficer] = useState(
    [],
  );
  const [total, setTotal] = useState("");
  const [diNo, setDiNo] = useState("");
  const [diDate, setDiDate] = useState(null);
  const [warranty, setWarranty] = useState("");

  // 👉 New Consignee States
  const [consigneeList, setConsigneeList] = useState([]); // final array
  const [selectedConsignee, setSelectedConsignee] = useState("");
  const [consigneeQuantity, setConsigneeQuantity] = useState("");

  const [sealingDetails, setSealingDetails] = useState([]);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (inspectionData) {
      console.log("inspectionData", inspectionData);
      setTnDetail(inspectionData?.deliverySchedule);
      setSerialNumberFrom(inspectionData?.serialNumberFrom);
      setSerialNumberTo(inspectionData?.serialNumberTo);
      setSr(inspectionData?.snNumber);
      setInspectionDate(
        inspectionData.inspectionDate
          ? dayjs(inspectionData.inspectionDate)
          : null,
      );
      setInspectedQuantity(inspectionData?.inspectedQuantity);
      setNominationLetterNo(inspectionData.nominationLetterNo || "");
      setNominationDate(
        inspectionData.nominationDate
          ? dayjs(inspectionData.nominationDate)
          : null,
      );
      setOfferDate(
        inspectionData.offerDate ? dayjs(inspectionData.offerDate) : null,
      );
      setOfferedQuantity(inspectionData.offeredQuantity);
      setSelectedInspectionOfficer(inspectionData.inspectionOfficers || []);

      setTotal(inspectionData.total || "");
      setDiNo(inspectionData.diNo || "");
      setDiDate(inspectionData.diDate ? dayjs(inspectionData.diDate) : null);
      setWarranty(
        inspectionData?.deliverySchedule?.guaranteePeriodMonths || "",
      );
      setSealingDetails(inspectionData.sealingDetails || []);

      // ✅ Load existing consignee list
      setConsigneeList(inspectionData.consignees || []);
    }
  }, [inspectionData]);

  const handleAddInspectionOfficer = () => {
    const trimmed = inspectionOfficer.trim();
    if (trimmed && !selectedInspectionOfficer.includes(trimmed)) {
      setSelectedInspectionOfficer([...selectedInspectionOfficer, trimmed]);
      setInspectionOfficer("");
    }
  };

  const handleRemove = (officer) => {
    setSelectedInspectionOfficer(
      selectedInspectionOfficer.filter((o) => o !== officer),
    );
  };

  const handleTnChange = (_, selected) => {
    setTnDetail(selected || null);

    if (selected) {
      setWarranty(`${selected.guaranteePeriodMonths} Months`);
    } else {
      setWarranty("");
    }
  };

  // 👉 Handle Add Consignee
  const handleAddConsignee = () => {
    if (!selectedConsignee || !consigneeQuantity) {
      setAlertBox({
        msg: "Please select consignee & quantity",
        open: true,
        error: true,
      });
      return;
    }

    const from = parseInt(serialNumberFrom);
    const to = parseInt(serialNumberTo);
    if (!from || !to || from >= to) {
      setAlertBox({
        msg: "Invalid serial number range",
        open: true,
        error: true,
      });
      return;
    }

    const totalAvailable = to - from + 1;
    const totalDistributed = consigneeList.reduce(
      (sum, c) => sum + c.quantity,
      0,
    );
    const newTotal = totalDistributed + parseInt(consigneeQuantity);

    if (newTotal > totalAvailable) {
      setAlertBox({
        msg: "Quantity exceeds available transformers!",
        open: true,
        error: true,
      });
      return;
    }

    // Calculate sub serial range
    const startSn = from + totalDistributed;
    const endSn = startSn + parseInt(consigneeQuantity) - 1;
    const subSnNumber = `${startSn} TO ${endSn}`;

    const selectedConsigneeObj = consignees.find(
      (c) => c.id === selectedConsignee,
    );

    const newConsignee = {
      consigneeId: selectedConsignee,
      consigneeName: selectedConsigneeObj?.name,
      quantity: parseInt(consigneeQuantity),
      subSnNumber,
    };

    setConsigneeList([...consigneeList, newConsignee]);
    setSelectedConsignee("");
    setConsigneeQuantity("");
  };

  // 👉 Delete Consignee
  const handleDeleteConsignee = (idx) => {
    const updated = [...consigneeList];
    updated.splice(idx, 1);
    setConsigneeList(updated);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name); // show file name

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const filteredData = jsonData.map((row) => ({
        trfSiNo: row["TRF SL No."],
        polySealNo: row["Poly Carbonate Seal No."],
      }));

      setSealingDetails(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };

  const { mutate: updateFinalInspection, isLoading } = useMutation({
    mutationFn: (updatedData) =>
      api.put(`/final-inspections/${inspectionData.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["finalInspections"]);
      handleClose();
      setAlertBox({
        open: true,
        msg: "Final Inspection details updated successfully!",
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

  const handleSubmit = () => {
    console.log("condif ", consigneeList);
    const updatedData = {
      deliveryScheduleId: tnDetail?.id || null,
      serialNumberFrom: serialNumberFrom
        ? parseInt(serialNumberFrom, 10)
        : null,
      serialNumberTo: serialNumberTo ? parseInt(serialNumberTo, 10) : null,
      offerDate: offerDate ? dayjs(offerDate).toISOString() : null,
      offeredQuantity: offeredQuantity ? parseInt(offeredQuantity, 10) : null,
      inspectionDate: inspectionDate
        ? dayjs(inspectionDate).toISOString()
        : null,
      inspectedQuantity: inspectedQuantity
        ? parseInt(inspectedQuantity, 10)
        : null,
      inspectionOfficers: selectedInspectionOfficer,
      nominationLetterNo: nominationLetterNo || null,
      nominationDate: nominationDate
        ? dayjs(nominationDate).toISOString()
        : null,
      diNo: diNo || null,
      diDate: diDate ? dayjs(diDate).toISOString() : null,
      warranty: warranty ? String(warranty) : null,
      consignees: consigneeList.map((c) => ({
        consigneeId: c.consigneeId || c.consignee?.id,
        consigneeName: c.consigneeName,
        quantity: c.quantity,
        subSnNumber: c.subSnNumber,
        repairedTransformerIds: c.repairedTransformerIds || [],
      })),
      sealingDetails,
    };
    updateFinalInspection(updatedData);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Edit Final Inspection Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box mt={2}>
          <Autocomplete
            options={deliverySchedules || []}
            getOptionLabel={(option) => option.tnNumber}
            value={tnDetail}
            onChange={handleTnChange}
            sx={{ mt: 2 }}
            renderInput={(params) => (
              <TextField {...params} label="TN Number" fullWidth />
            )}
          />

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Rating In KVA"
            value={tnDetail?.rating || ""}
            InputProps={{ readOnly: true }}
          />

          <TextField
            fullWidth
            label="Wound"
            sx={{ mt: 2 }}
            value={tnDetail?.wound || ""}
            InputProps={{ readOnly: true }}
          />

          <TextField
            fullWidth
            label="Phase"
            sx={{ mt: 2 }}
            value={tnDetail?.phase || ""}
            InputProps={{ readOnly: true }}
          />

          <TextField
            type="number"
            label="Serial Number From"
            fullWidth
            value={serialNumberFrom}
            onChange={(e) => setSerialNumberFrom(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            type="number"
            label="Serial Number To"
            fullWidth
            value={serialNumberTo}
            onChange={(e) => setSerialNumberTo(e.target.value)}
            sx={{ mt: 2 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Of Offer"
              value={offerDate}
              onChange={setOfferDate}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />

            <TextField
              label="Offered Quantity"
              fullWidth
              type="number"
              value={offeredQuantity}
              onChange={(e) => setOfferedQuantity(e.target.value)}
              sx={{ mt: 2 }}
            />

            <TextField
              label="Nomination Letter No"
              fullWidth
              value={nominationLetterNo}
              onChange={(e) => setNominationLetterNo(e.target.value)}
              sx={{ mt: 2 }}
            />

            <DatePicker
              label="Nomination Date"
              value={nominationDate}
              onChange={setNominationDate}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />

            <Stack direction="row" gap={1} mt={2}>
              <TextField
                fullWidth
                label="Inspection Officer Name"
                value={inspectionOfficer}
                onChange={(e) => setInspectionOfficer(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddInspectionOfficer}>
                Add
              </Button>
            </Stack>

            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {selectedInspectionOfficer.map((officer, idx) => (
                <Chip
                  key={idx}
                  label={officer}
                  onDelete={() => handleRemove(officer)}
                />
              ))}
            </Box>

            <DatePicker
              label="Inspection Date"
              value={inspectionDate}
              onChange={setInspectionDate}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />

            <TextField
              label="Inspected Quantity"
              fullWidth
              type="number"
              value={inspectedQuantity}
              onChange={(e) => setInspectedQuantity(e.target.value)}
              sx={{ mt: 2 }}
            />

            <TextField
              label="Grand Total"
              fullWidth
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              sx={{ mt: 2 }}
            />

            <TextField
              label="DI No"
              fullWidth
              value={diNo}
              onChange={(e) => setDiNo(e.target.value)}
              sx={{ mt: 2 }}
            />

            <DatePicker
              label="DI Date"
              value={diDate}
              onChange={setDiDate}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />
          </LocalizationProvider>

          <TextField
            label="Warranty Period"
            fullWidth
            value={warranty}
            sx={{ mt: 2 }}
            InputProps={{ readOnly: true }}
          />

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={2}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Consignee Details
              </Typography>
            </Grid>

            <Grid item size={1}>
              <FormControl fullWidth>
                <InputLabel>Consignee</InputLabel>
                <Select
                  value={selectedConsignee}
                  onChange={(e) => setSelectedConsignee(e.target.value)}
                  label="Consignee"
                >
                  {(consignees || []).map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <Box display="flex" gap={1}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={consigneeQuantity}
                  onChange={(e) => setConsigneeQuantity(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddConsignee}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            {/* Table */}
            <Grid item size={2}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Consignee</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Sub Serial No.</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consigneeList.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{c.consigneeName}</TableCell>
                      <TableCell>{c.quantity}</TableCell>
                      <TableCell>{c.subSnNumber}</TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          onClick={() => handleDeleteConsignee(idx)}
                        >
                          <Cancel />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {consigneeList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No Consignees Added
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Grid>
          </Grid>

          <Box mt={2}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Sealing Details
              <input
                type="file"
                accept=".xls,.xlsx"
                hidden
                onChange={handleExcelUpload}
              />
            </Button>
            {fileName && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                📄 {fileName}
              </Typography>
            )}
          </Box>

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

export default FinalInspectionModal;
