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
import { getDummyConsigneeDetails } from "../pages/Consignee/ConsigneeList";
import { MyContext } from "../App";
import { Cancel } from "@mui/icons-material";

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

const deliverySchedules = [
  {
    id: "1",
    tnNumber: "TN-001",
    rating: "100", // in KVA
    wound: "Aluminium",
    phase: "100 KVA",
    poDetails: "PO-12345",
    poDate: "2025-05-10",
    loaDetails: "LOA-5678",
    loaDate: "2025-05-01",
    cpDays: 90,
    createdDate: "2025-05-15",
    cpDate: "2025-08-13", // 90 days from createdDate
    imposedLetterNo: "IMP-101",
    liftingLetterNo: "LIFT-201",
    imposedDate: "2025-08-18",
    liftingDate: "2025-10-15",
    totalQuantity: 1000,
    guaranteePeriodMonths: 24,
  },
  {
    id: "2",
    tnNumber: "TN-002",
    rating: "50",
    wound: "Aluminium",
    phase: "50 KVA",
    poDetails: "PO-22345",
    poDate: "2025-06-01",
    loaDetails: "LOA-6678",
    loaDate: "2025-05-20",
    cpDays: 60,
    createdDate: "2025-06-05",
    cpDate: "2025-08-04", // 60 days from createdDate
    imposedLetterNo: "IMP-102",
    liftingLetterNo: "LIFT-202",
    imposedDate: "2025-08-09",
    liftingDate: "2025-10-01",
    totalQuantity: 500,
    guaranteePeriodMonths: 18,
  },
  {
    id: "3",
    tnNumber: "TN-003",
    rating: "150",
    wound: "Copper",
    phase: "150 KVA",
    poDetails: "PO-32345",
    poDate: "2025-07-15",
    loaDetails: "LOA-7678",
    loaDate: "2025-07-05",
    cpDays: 45,
    createdDate: "2025-07-20",
    cpDate: "2025-09-03", // 45 days from createdDate
    imposedLetterNo: "IMP-103",
    liftingLetterNo: "LIFT-203",
    imposedDate: "2025-09-08",
    liftingDate: "2025-11-01",
    totalQuantity: 750,
    guaranteePeriodMonths: 12,
  },
  {
    id: "4",
    tnNumber: "TN-004",
    rating: "200",
    wound: "Copper",
    phase: "200 KVA",
    poDetails: "PO-42345",
    poDate: "2025-08-10",
    loaDetails: "LOA-8678",
    loaDate: "2025-08-01",
    cpDays: 30,
    createdDate: "2025-08-15",
    cpDate: "2025-09-14", // 30 days from createdDate
    imposedLetterNo: "IMP-104",
    liftingLetterNo: "LIFT-204",
    imposedDate: "2025-09-19",
    liftingDate: "2025-11-10",
    totalQuantity: 1200,
    guaranteePeriodMonths: 36,
  },
];

const FinalInspectionModal = ({ open, handleClose, inspectionData }) => {
  const today = dayjs();

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

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
    []
  );
  const [total, setTotal] = useState("");
  const [diNo, setDiNo] = useState("");
  const [diDate, setDiDate] = useState(null);
  const [warranty, setWarranty] = useState("");

  // 👉 New Consignee States
  const [consigneeList, setConsigneeList] = useState([]); // final array
  const [selectedConsignee, setSelectedConsignee] = useState("");
  const [consigneeQuantity, setConsigneeQuantity] = useState("");

  const [shellingDetails, setShellingDetails] = useState("");

  useEffect(() => {
    if (inspectionData) {
      setTnDetail(inspectionData?.deliverySchedule);
      setSerialNumberFrom(inspectionData?.serialNumberFrom);
      setSerialNumberTo(inspectionData?.serialNumberTo);
      setSr(inspectionData?.snNumber);
      setInspectionDate(
        inspectionData.inspectionDate
          ? dayjs(inspectionData.inspectionDate)
          : null
      );
      setInspectedQuantity(inspectionData?.inspectedQuantity);
      setNominationLetterNo(inspectionData.nominationLetterNo || "");
      setNominationDate(
        inspectionData.nominationDate
          ? dayjs(inspectionData.nominationDate)
          : null
      );
      setOfferDate(
        inspectionData.offeredDate ? dayjs(inspectionData.offeredDate) : null
      );
      setOfferedQuantity(inspectionData.offeredQuantity);
      setSelectedInspectionOfficer(inspectionData.inspectionOfficers || []);

      setTotal(inspectionData.total || "");
      setDiNo(inspectionData.diNo || "");
      setDiDate(inspectionData.diDate ? dayjs(inspectionData.diDate) : null);
      setWarranty(
        inspectionData?.deliverySchedule?.guaranteePeriodMonths || ""
      );
      setShellingDetails(inspectionData.shellingDetails || "");

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
      selectedInspectionOfficer.filter((o) => o !== officer)
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

  const consignees = getDummyConsigneeDetails();

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
      0
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

    const newConsignee = {
      consignee: consignees.find((c) => c.id === selectedConsignee), // for store id I have to pass only selectedConsignee
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

  const handleSubmit = () => {
    const updatedData = {
      tnDetail: tnDetail?.id,
      serialNumberFrom,
      serialNumberTo,
      srNumber: `${serialNumberFrom} TO ${serialNumberTo}`,
      offerDate: dayjs(offerDate).format("YYYY-MM-DD"),
      offeredQuantity,
      inspectionDate: dayjs(inspectionDate).format("YYYY-MM-DD"),
      inspectedQuantity,
      selectedInspectionOfficer,
      diNo,
      diDate: dayjs(diDate).format("YYYY-MM-DD"),
      warranty,
      consignees: consigneeList, // ✅ New Array
    };
    console.log(updatedData);
    handleClose();
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
            options={deliverySchedules}
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
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 || e.target.value === "") {
                setSerialNumberFrom(e.target.value);
              }
            }}
            sx={{ mt: 2 }}
          />

          <TextField
            type="number"
            label="Serial Number To"
            fullWidth
            value={serialNumberTo}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 || e.target.value === "") {
                setSerialNumberTo(e.target.value);
              }
            }}
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
              value={inspectedQuantity}
              onChange={(e) => setInspectedQuantity(e.target.value)}
              sx={{ mt: 2 }}
            />

            <TextField
              label="Grand Total"
              fullWidth
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
                  {consignees.map((c) => (
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
                      <TableCell>{c.consignee.name}</TableCell>
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

          {/*<TextField
            label="Shelling Details"
            fullWidth
            value={shellingDetails}
            onChange={(e) => setShellingDetails(e.target.value)}
            sx={{ mt: 2 }}
          />*/}

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

export default FinalInspectionModal;
