import { useContext, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  Grid,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { Cancel } from "@mui/icons-material";

const AddFinalInspection = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const today = new Date();

  const [tnDetail, setTnDetail] = useState(null); // store full TN object
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

  const [shealingDetails, setShealingDetails] = useState([]);
  const [fileName, setFileName] = useState("");

  const [selectedTransformers, setSelectedTransformers] = useState([]);

  const { data: deliverySchedules } = useQuery({
    queryKey: ["deliverySchedules"],
    queryFn: () => api.get("/delivery-schedules").then((res) => res.data),
  });

  const { data: consignees } = useQuery({
    queryKey: ["consignees"],
    queryFn: () => api.get("/consignees").then((res) => res.data),
  });
  
  const { data: damagedTransformers } = useQuery({
    queryKey: ["damagedTransformers"],
    queryFn: () => api.get("/damaged-transformers").then((res) => res.data),
  });
  
  const [availableTransformers, setAvailableTransformers] = useState(
    damagedTransformers
  );

  const addFinalInspectionMutation = useMutation({
    mutationFn: (newInspection) =>
      api.post("/final-inspections", newInspection),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Final Inspection added successfully!", error: false});
      queryClient.invalidateQueries(["finalInspections"]);
      navigate("/finalInspection-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });


  const handleAddInspectionOfficer = () => {
    if (
      inspectionOfficer.trim() &&
      !selectedInspectionOfficer.includes(inspectionOfficer.trim())
    ) {
      setSelectedInspectionOfficer([
        ...selectedInspectionOfficer,
        inspectionOfficer.trim(),
      ]);
      setInspectionOfficer("");
    }
  };

  const handleRemove = (officer) => {
    setSelectedInspectionOfficer(
      inspectionOfficer.filter((o) => o !== officer)
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

      // Keep only TRFSI No & Polycarbonate Seal No columns
      const filteredData = jsonData.map((row) => ({
        trfSiNo: row["TRF SL No."],
        polySealNo: row["Poly Carbonate Seal No."],
      }));

      setShealingDetails(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };

  // 👉 Handle Add Consignee
  const handleAddConsignee = () => {
    if (!selectedConsignee || !consigneeQuantity) {
      setAlertBox({open: true, msg: "Please select consignee & quantity", error: true});
      return;
    }

    const from = parseInt(serialNumberFrom);
    const to = parseInt(serialNumberTo);
    if (!from || !to || from >= to) {
      setAlertBox({open: true, msg: "Invalid serial number range", error: true});
      return;
    }

    const totalAvailable = to - from + 1;
    const totalDistributed = consigneeList.reduce(
      (sum, c) => sum + c.quantity,
      0
    );
    const newTotal = totalDistributed + parseInt(consigneeQuantity);

    if (newTotal > totalAvailable) {
      setAlertBox({open: true, msg: "Quantity exceeds available transformers!", error: true});
      return;
    }

    // Calculate sub serial range
    const startSn = from + totalDistributed;
    const endSn = startSn + parseInt(consigneeQuantity) - 1;
    const subSnNumber = `${startSn} TO ${endSn}`;

    // ✅ Attach selected repaired transformers
    const selectedTransformerObjects = availableTransformers.filter((t) =>
      selectedTransformers.includes(t.id)
    );

    const newConsignee = {
      consigneeId: selectedConsignee,
      quantity: parseInt(consigneeQuantity),
      subSnNumber,
      repairedTransformerIds: selectedTransformers,
    };

    // ✅ Remove assigned transformers from available list
    const updatedAvailable = availableTransformers.filter(
      (t) => !selectedTransformers.includes(t.id)
    );

    setAvailableTransformers(updatedAvailable);
    setConsigneeList([...consigneeList, newConsignee]);
    setSelectedTransformers([]);
    setSelectedConsignee("");
    setConsigneeQuantity("");
  };

  // 👉 Delete Consignee
  const handleDeleteConsignee = (idx) => {
    const removed = consigneeList[idx];
    // Restore those transformers back into available list
    if (removed.repairedTransformerIds?.length > 0) {
      setAvailableTransformers((prev) => [
        ...prev,
        ...damagedTransformers.filter((t) => removed.repairedTransformerIds.includes(t.id)),
      ]);
    }
    const updated = [...consigneeList];
    updated.splice(idx, 1);
    setConsigneeList(updated);
  };

  // 👉 Final Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      deliveryScheduleId: tnDetail?.id,
      serialNumberFrom: parseInt(serialNumberFrom),
      serialNumberTo: parseInt(serialNumberTo),
      offeredDate: dayjs(offerDate).format("YYYY-MM-DD"),
      offeredQuantity: parseInt(offeredQuantity),
      inspectionDate: dayjs(inspectionDate).format("YYYY-MM-DD"),
      inspectedQuantity: parseInt(inspectedQuantity),
      inspectionOfficers: selectedInspectionOfficer,
      nominationLetterNo,
      nominationDate: dayjs(nominationDate).format("YYYY-MM-DD"),
      diNo,
      diDate: dayjs(diDate).format("YYYY-MM-DD"),
      total: parseInt(total),
      consignees: consigneeList,
      shealingDetails,
    };

    addFinalInspectionMutation.mutate(data);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="right-content w-100">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
              FINAL INSPECTION DETAILS
            </Typography>

            <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
              <Grid item size={2}>
                <Autocomplete
                  options={deliverySchedules || []}
                  getOptionLabel={(option) => option.tnNumber}
                  value={tnDetail}
                  onChange={handleTnChange}
                  renderInput={(params) => (
                    <TextField {...params} label="TN Number" fullWidth />
                  )}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Rating In KVA"
                  value={tnDetail?.rating || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Phase"
                  value={tnDetail?.phase || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Wound"
                  value={tnDetail?.wound || ""}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Date Of Offer"
                  minDate={today}
                  value={offerDate}
                  onChange={setOfferDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Offered Quantity"
                  fullWidth
                  value={offeredQuantity}
                  onChange={(e) => setOfferedQuantity(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
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
                />
              </Grid>

              <Grid item size={1}>
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
                />
              </Grid>

              {/* 👉 Consignee Section */}
              <Grid item size={2}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Consignee Details
                </Typography>
              </Grid>

              {/* Consignee Dropdown */}
              <Grid item size={2}>
                <FormControl fullWidth>
                  <InputLabel>Select Consignee</InputLabel>
                  <Select
                    value={selectedConsignee}
                    onChange={(e) => setSelectedConsignee(e.target.value)}
                    label="Select Consignee"
                  >
                    {consignees?.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Quantity Input */}
              <Grid item size={2}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={consigneeQuantity}
                  onChange={(e) => setConsigneeQuantity(e.target.value)}
                />
              </Grid>

              {/* ✅ New Dropdown for Repaired Transformers */}
              <Grid item size={2}>
                <FormControl fullWidth>
                  <InputLabel>Select Repaired Transformers</InputLabel>
                  <Select
                    multiple
                    input={
                      <OutlinedInput label="Select Repaired Transformers" />
                    }
                    value={selectedTransformers}
                    onChange={(e) => setSelectedTransformers(e.target.value)}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (id) =>
                            availableTransformers?.find((t) => t.id === id)
                              ?.serialNo || ""
                        )
                        .join(", ")
                    }
                  >
                    {availableTransformers?.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        <Checkbox
                          checked={selectedTransformers.includes(t.id)}
                        />
                        <ListItemText primary={t.serialNo} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Add Button */}
              <Grid item size={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddConsignee}
                >
                  Add
                </Button>
              </Grid>

              {/* ✅ Consignee Table */}
              <Grid item xs={12}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Consignee</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Sub Serial No.</TableCell>
                      <TableCell>Repaired Transformers</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consigneeList.map((c, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{consignees.find(con => con.id === c.consigneeId)?.name}</TableCell>
                        <TableCell>{c.quantity}</TableCell>
                        <TableCell>{c.subSnNumber}</TableCell>
                        <TableCell>
                          {c.repairedTransformerIds?.length > 0
                            ? c.repairedTransformerIds
                                .map((t_id) => damagedTransformers.find(dt => dt.id === t_id)?.serialNo)
                                .join(", ")
                            : "—"}
                        </TableCell>
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
                        <TableCell colSpan={5} align="center">
                          No Consignees Added
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Nomination Letter no"
                  fullWidth
                  value={nominationLetterNo}
                  onChange={(e) => setNominationLetterNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Nomination Date"
                  minDate={today}
                  value={nominationDate}
                  onChange={setNominationDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <Box display="flex" gap={1}>
                  <TextField
                    fullWidth
                    label="Inspection Officers name"
                    variant="outlined"
                    value={inspectionOfficer}
                    onChange={(e) => setInspectionOfficer(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddInspectionOfficer}
                  >
                    Add
                  </Button>
                </Box>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {selectedInspectionOfficer.map((i, index) => (
                    <Chip
                      key={index}
                      label={i}
                      onDelete={() => handleRemove(i)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Inspection Date"
                  minDate={today}
                  value={inspectionDate}
                  onChange={setInspectionDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Inspected Quantity"
                  fullWidth
                  value={inspectedQuantity}
                  onChange={(e) => setInspectedQuantity(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Grand Total"
                  fullWidth
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="DI No"
                  fullWidth
                  value={diNo}
                  onChange={(e) => setDiNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="DI Date"
                  minDate={today}
                  value={diDate}
                  onChange={setDiDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Warranty Period"
                  fullWidth
                  value={warranty}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              

              

              <Grid item size={2}>
                <div>
                  <Button variant="outlined" component="label" fullWidth>
                    Upload Sealing Details
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      hidden
                      onChange={handleExcelUpload}
                    />
                  </Button>

                  {/* Show file name */}
                  {fileName && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      📄 {fileName}
                    </Typography>
                  )}

                  {/* Debug - Show stored data */}
                  {shealingDetails.length > 0 && (
                    <pre
                      style={{
                        fontSize: 12,
                        background: "#f4f4f4",
                        padding: 8,
                      }}
                    >
                      {JSON.stringify(shealingDetails, null, 2)}
                    </pre>
                  )}
                </div>
              </Grid>

              <Grid item size={2}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                  style={{
                    margin: "auto",
                  }}
                  disabled={addFinalInspectionMutation.isLoading}
                >
                  <FaCloudUploadAlt />
                  {addFinalInspectionMutation.isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "PUBLISH AND VIEW"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default AddFinalInspection;
