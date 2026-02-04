import { useContext, useState, useEffect } from "react";
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

  const [consigneeList, setConsigneeList] = useState([]); // final array
  const [selectedConsignee, setSelectedConsignee] = useState("");
  const [consigneeQuantity, setConsigneeQuantity] = useState("");

  const [sealingDetails, setSealingDetails] = useState([]);
  const [fileName, setFileName] = useState("");

  const [repairedTransformerSrno, setRepairedTransformerSrno] = useState([]);
  const [repairedTransformerMapping, setRepairedTransformerMapping] = useState(
    [],
  );

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

  const { data: damagedTransformers } = useQuery({
    queryKey: ["allDamagedTransformers"],
    queryFn: () =>
      api.get("/damaged-transformers?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: totalInspectedQuantityData } = useQuery({
    queryKey: ["totalInspectedQuantity"],
    queryFn: () =>
      api
        .get(
          `/final-inspections/total-inspected-quantity`,
        )
        .then((res) => res.data.totalInspectedQuantity),
    placeholderData: 0,
  });

  const [availableTransformers, setAvailableTransformers] = useState([]); // Initialize with empty array

  useEffect(() => {
    if (totalInspectedQuantityData !== undefined) {
      setTotal(totalInspectedQuantityData);
    }
  }, [totalInspectedQuantityData]);

  useEffect(() => {
    if (damagedTransformers) {
      const flattened = [];
      damagedTransformers.forEach((t) => {
        if (!t.used) {
          const serials = Array.isArray(t.serialNo) ? t.serialNo : [t.serialNo];
          serials.forEach((sn) => {
            flattened.push({
              id: t.id,
              serialNo: sn,
            });
          });
        }
      });
      setAvailableTransformers(flattened);
    }
  }, [damagedTransformers]);

  useEffect(() => {
    const to = parseInt(serialNumberTo);
    if (!isNaN(to) && repairedTransformerSrno.length > 0) {
      const mapping = repairedTransformerSrno.map((sn, index) => {
        return {
          oldSrNo: sn,
          newSrNo: to + 1 + index,
        };
      });
      setRepairedTransformerMapping(mapping);
    } else {
      setRepairedTransformerMapping([]);
    }
  }, [serialNumberTo, repairedTransformerSrno, damagedTransformers]);

  const addFinalInspectionMutation = useMutation({
    mutationFn: (newInspection) =>
      api.post("/final-inspections", newInspection),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Final Inspection added successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["finalInspections"]);
      navigate("/finalInspection-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
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

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const from = parseInt(serialNumberFrom);
    const to = parseInt(serialNumberTo);

    if (isNaN(from) || isNaN(to) || from > to) {
      setAlertBox({
        open: true,
        msg: "Please enter valid Serial Number From and To range before uploading.",
        error: true,
      });
      e.target.value = null;
      return;
    }

    setFileName(file.name); // show file name

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const filteredData = jsonData.map((row) => ({
        trfSiNo: row["TrfsiNo"],
        polySealNo: row["PolyCarbonateSealNo"],
      }));

      const uploadedSet = new Set(filteredData.map((d) => parseInt(d.trfSiNo)));
      const missing = [];

      // Check for missing TRFSI in the serial number range
      for (let i = from; i <= to; i++) {
        if (!uploadedSet.has(i)) {
          missing.push(i);
        }
      }

      // Check for missing TRFSI for repaired transformers (old serial numbers)
      const repairedMapping = repairedTransformerSrno.map((srNo, index) => {
        return {
          oldSrNo: srNo,
          newSrNo: to + 1 + index,
        };
      });

      repairedMapping.forEach((item) => {
        if (item.oldSrNo && !uploadedSet.has(parseInt(item.oldSrNo))) {
          missing.push(item.oldSrNo);
        }
      });

      if (missing.length > 0) {
        setAlertBox({
          open: true,
          msg: `Missing TRFSI Numbers in file: ${missing.join(", ")}`,
          error: true,
        });
        setSealingDetails([]);
        setFileName("");
        e.target.value = null;
        return;
      }

      setSealingDetails(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddConsignee = () => {
    if (!selectedConsignee || !consigneeQuantity) {
      setAlertBox({
        open: true,
        msg: "Please select consignee & quantity",
        error: true,
      });
      return;
    }

    const from = parseInt(serialNumberFrom);
    const to = parseInt(serialNumberTo);
    if (isNaN(from) || isNaN(to) || from > to) {
      setAlertBox({
        open: true,
        msg: "Invalid serial number range",
        error: true,
      });
      return;
    }

    const requestedQty = parseInt(consigneeQuantity);
    const totalNewAvailable = to - from + 1;
    const totalRepairedAvailable = repairedTransformerSrno.length;

    const totalDistributed = consigneeList.reduce(
      (sum, c) => sum + c.quantity,
      0,
    );

    if (totalDistributed + requestedQty > totalNewAvailable + totalRepairedAvailable) {
      setAlertBox({
        open: true,
        msg: "Quantity exceeds total available transformers!",
        error: true,
      });
      return;
    }

    // Calculate already distributed quantities
    const newDistributed = consigneeList.reduce(
      (sum, c) => sum + (c.newQuantity || 0),
      0,
    );
    const repairedDistributed = consigneeList.reduce(
      (sum, c) => sum + (c.repairedQuantity || 0),
      0,
    );

    const remainingNewQty = totalNewAvailable - newDistributed;
    
    // Determine allocation for this consignee
    const newQtyForThis = Math.min(requestedQty, remainingNewQty);
    const repairedQtyForThis = requestedQty - newQtyForThis;

    // Get the sub-serial number range for new transformers
    let subSnNumber = null;
    if (newQtyForThis > 0) {
      const startSn = from + newDistributed;
      const endSn = startSn + newQtyForThis - 1;
      subSnNumber = `${startSn} TO ${endSn}`;
    }

    // Get the assigned repaired transformer serial numbers
    const assignedRepairedIds = repairedTransformerSrno.slice(
      repairedDistributed,
      repairedDistributed + repairedQtyForThis,
    );

    const selectedConsigneeObj = consignees.find(
      (c) => c.id === selectedConsignee,
    );

    const newConsignee = {
      consigneeId: selectedConsignee,
      consigneeName: selectedConsigneeObj?.name,
      quantity: requestedQty,
      newQuantity: newQtyForThis,
      repairedQuantity: repairedQtyForThis,
      subSnNumber: subSnNumber,
      repairedTransformerIds: assignedRepairedIds,
    };

    setConsigneeList([...consigneeList, newConsignee]);
    setSelectedConsignee("");
    setConsigneeQuantity("");
  };

  const handleDeleteConsignee = (idx) => {
    const updated = [...consigneeList];
    updated.splice(idx, 1);
    setConsigneeList(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      deliveryScheduleId: tnDetail?.id || null,
      serialNumberFrom: serialNumberFrom ? parseInt(serialNumberFrom) : null,
      serialNumberTo: serialNumberTo ? parseInt(serialNumberTo) : null,
      offerDate: offerDate ? dayjs(offerDate).toISOString() : null,
      offeredQuantity: offeredQuantity ? parseInt(offeredQuantity) : null,
      inspectionDate: inspectionDate
        ? dayjs(inspectionDate).toISOString()
        : null,
      inspectedQuantity: inspectedQuantity ? parseInt(inspectedQuantity) : null,
      inspectionOfficers: selectedInspectionOfficer,
      nominationLetterNo: nominationLetterNo || null,
      nominationDate: nominationDate
        ? dayjs(nominationDate).toISOString()
        : null,
      diNo: diNo || null,
      diDate: diDate ? dayjs(diDate).toISOString() : null,
      consignees: consigneeList,
      sealingDetails: sealingDetails.map((s) => ({
        trfSiNo: s.trfSiNo,
        polySealNo: s.polySealNo,
      })),
      warranty: warranty || null,
      repaired_transformer_srno: repairedTransformerSrno.map(String),
      repaired_transformer_mapping: repairedTransformerMapping.map((item) => ({
        ...item,
        oldSrNo: String(item.oldSrNo),
      })),
      status: "Active",
      grandTotal: total ? parseInt(total, 10) : null,
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
                  value={offerDate}
                  onChange={setOfferDate}
                  format="dd/MM/yyyy"
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
                  onChange={(e) => setSerialNumberFrom(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  type="number"
                  label="Serial Number To"
                  fullWidth
                  value={serialNumberTo}
                  onChange={(e) => setSerialNumberTo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth>
                  <InputLabel>Sub Serial No</InputLabel>
                  <Select
                    multiple
                    input={
                      <OutlinedInput label="Sub Serial No" />
                    }
                    value={repairedTransformerSrno}
                    onChange={(e) => setRepairedTransformerSrno(e.target.value)}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {(availableTransformers || []).map((t) => (
                      <MenuItem
                        key={`${t.id}-${t.serialNo}`}
                        value={String(t.serialNo)}
                      >
                        <Checkbox
                          checked={repairedTransformerSrno.includes(
                            String(t.serialNo),
                          )}
                        />
                        <ListItemText primary={t.serialNo} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  value={nominationDate}
                  onChange={setNominationDate}
                  format="dd/MM/yyyy"
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
                  value={inspectionDate}
                  onChange={setInspectionDate}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Inspected Quantity"
                  type="number"
                  fullWidth
                  value={inspectedQuantity}
                  onChange={(e) => {
                    setInspectedQuantity(e.target.value);
                    const currentInspected = parseInt(e.target.value, 10);
                    if (!isNaN(currentInspected)) {
                      setTotal(totalInspectedQuantityData + currentInspected);
                    } else {
                      setTotal(totalInspectedQuantityData);
                    }
                  }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Grand Total"
                  fullWidth
                  type="number"
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
                  value={diDate}
                  onChange={setDiDate}
                  format="dd/MM/yyyy"
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
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Consignee Details
                </Typography>
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth>
                  <InputLabel>Select Consignee</InputLabel>
                  <Select
                    value={selectedConsignee}
                    onChange={(e) => setSelectedConsignee(e.target.value)}
                    label="Select Consignee"
                  >
                    {(consignees || []).map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Quantity Input */}
              <Grid item size={1}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={consigneeQuantity}
                  onChange={(e) => setConsigneeQuantity(e.target.value)}
                />
              </Grid>

              {/* Add Button */}
              <Grid item size={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddConsignee}
                >
                  Add Consignee
                </Button>
              </Grid>

              {/* ✅ Consignee Table */}
              <Grid item size={12}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Consignee</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Serial No.</TableCell>
                      <TableCell>Sub-Serial No.</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consigneeList.map((c, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {
                            consignees.find((con) => con.id === c.consigneeId)
                              ?.name
                          }
                        </TableCell>
                        <TableCell>{c.quantity}</TableCell>
                        <TableCell>{c.subSnNumber || "—"}</TableCell>
                        <TableCell>
                          {(c.repairedTransformerIds || []).join(", ") || "—"}
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
                  {fileName && (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      📄 {fileName}
                    </Typography>
                  )}
                </div>
              </Grid>

              <Grid item xs={2}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                  style={{ margin: "auto" }}
                  disabled={addFinalInspectionMutation.isPending}
                >
                  <FaCloudUploadAlt />
                  {addFinalInspectionMutation.isPending ? (
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
