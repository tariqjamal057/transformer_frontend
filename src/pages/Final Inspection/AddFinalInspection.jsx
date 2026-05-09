import { useContext, useState, useEffect, useMemo } from "react";
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

  const [tnDetail, setTnDetail] = useState(null); 
  const [serialNumberFrom, setSerialNumberFrom] = useState("");
  const [serialNumberTo, setSerialNumberTo] = useState("");
  const [inspectionDate, setInspectionDate] = useState(null);
  const [inspectedQuantity, setInspectedQuantity] = useState("");
  const [nominationLetterNo, setNominationLetterNo] = useState("");
  const [nominationDate, setNominationDate] = useState(null);
  const [offerDate, setOfferDate] = useState(null);
  const [offeredQuantity, setOfferedQuantity] = useState("");
  const [inspectionOfficer, setInspectionOfficer] = useState("");
  const [selectedInspectionOfficer, setSelectedInspectionOfficer] = useState([]);
  const [total, setTotal] = useState("");
  const [diNo, setDiNo] = useState("");
  const [diDate, setDiDate] = useState(null);
  const [warranty, setWarranty] = useState("");

  const [consigneeList, setConsigneeList] = useState([]); 
  const [selectedConsignee, setSelectedConsignee] = useState("");
  const [consigneeQuantity, setConsigneeQuantity] = useState("");

  const [sealingDetails, setSealingDetails] = useState([]);
  const [fileName, setFileName] = useState("");

  const [repairedTransformerSrno, setRepairedTransformerSrno] = useState([]);
  const [repairedTransformerMapping, setRepairedTransformerMapping] = useState([]);

  const { data: deliverySchedules } = useQuery({
    queryKey: ["allDeliverySchedules"],
    queryFn: () => api.get("/delivery-schedules?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: consignees } = useQuery({
    queryKey: ["allConsignees"],
    queryFn: () => api.get("/consignees?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: damagedTransformers } = useQuery({
    queryKey: ["allDamagedTransformers"],
    queryFn: () => api.get("/damaged-transformers?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: allInspections } = useQuery({
    queryKey: ["finalInspectionsAll"],
    queryFn: () => api.get("/final-inspections?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: totalInspectedQuantityData } = useQuery({
    queryKey: ["totalInspectedQuantity"],
    queryFn: () => api.get(`/final-inspections/total-inspected-quantity`).then((res) => res.data.totalInspectedQuantity),
    placeholderData: 0,
  });

  // Calculate used serial numbers from ALL existing inspections
  const globallyUsedRepairedSerials = useMemo(() => {
    const used = new Set();
    allInspections?.forEach(fi => {
      fi.repaired_transformer_srno?.forEach(sn => used.add(String(sn)));
    });
    return used;
  }, [allInspections]);

  const [availableTransformers, setAvailableTransformers] = useState([]);

  useEffect(() => {
    if (totalInspectedQuantityData !== undefined) {
      setTotal(totalInspectedQuantityData);
    }
  }, [totalInspectedQuantityData]);

  useEffect(() => {
    if (damagedTransformers) {
      const flattened = [];
      damagedTransformers.forEach((t) => {
        const serials = Array.isArray(t.serialNo) ? t.serialNo : [t.serialNo];
        serials.forEach((sn) => {
          // Check if this specific serial is in the globally used list
          if (!globallyUsedRepairedSerials.has(String(sn))) {
            flattened.push({ id: t.id, serialNo: sn });
          }
        });
      });
      setAvailableTransformers(flattened);
    }
  }, [damagedTransformers, globallyUsedRepairedSerials]);

  const totalRepairedPool = useMemo(() => {
    const assigned = consigneeList.flatMap(c => (c.repairedTransformerIds || []).map(String));
    return [...new Set([...assigned, ...repairedTransformerSrno.map(String)])];
  }, [consigneeList, repairedTransformerSrno]);

  useEffect(() => {
    const to = parseInt(serialNumberTo);
    if (!isNaN(to) && totalRepairedPool.length > 0) {
      const mapping = totalRepairedPool.map((sn, index) => ({
        oldSrNo: sn,
        newSrNo: to + 1 + index,
      }));
      setRepairedTransformerMapping(mapping);
    } else {
      setRepairedTransformerMapping([]);
    }
  }, [serialNumberTo, totalRepairedPool]);

  const addFinalInspectionMutation = useMutation({
    mutationFn: (newInspection) => api.post("/final-inspections", newInspection),
    onSuccess: () => {
      setAlertBox({ open: true, msg: "Final Inspection added successfully!", error: false });
      queryClient.invalidateQueries(["finalInspections"]);
      queryClient.invalidateQueries(["allDamagedTransformers"]);
      queryClient.invalidateQueries(["finalInspectionsAll"]);
      navigate("/finalInspection-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleAddInspectionOfficer = () => {
    if (inspectionOfficer.trim() && !selectedInspectionOfficer.includes(inspectionOfficer.trim())) {
      setSelectedInspectionOfficer([...selectedInspectionOfficer, inspectionOfficer.trim()]);
      setInspectionOfficer("");
    }
  };

  const handleRemove = (officer) => {
    setSelectedInspectionOfficer(selectedInspectionOfficer.filter((o) => o !== officer));
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
      setAlertBox({ open: true, msg: "Please enter valid range first.", error: true });
      e.target.value = null;
      return;
    }
    setFileName(file.name);
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
      setSealingDetails(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };

  const [selectedConsigneeSubSerials, setSelectedConsigneeSubSerials] = useState([]);

  const handleAddConsignee = () => {
    if (!selectedConsignee || (!consigneeQuantity && selectedConsigneeSubSerials.length === 0)) {
      setAlertBox({ open: true, msg: "Please select consignee and quantity or sub-serials.", error: true });
      return;
    }

    const from = parseInt(serialNumberFrom);
    const to = parseInt(serialNumberTo);
    if (isNaN(from) || isNaN(to) || from > to) {
      setAlertBox({ open: true, msg: "Invalid serial number range", error: true });
      return;
    }

    const requestedNewQty = parseInt(consigneeQuantity) || 0;
    const newDistributed = consigneeList.reduce((sum, c) => sum + (c.newQuantity || 0), 0);

    if (newDistributed + requestedNewQty > (to - from + 1)) {
      setAlertBox({ open: true, msg: "New Quantity exceeds available pool!", error: true });
      return;
    }

    let subSnNumber = null;
    if (requestedNewQty > 0) {
      const startSn = from + newDistributed;
      const endSn = startSn + requestedNewQty - 1;
      subSnNumber = `${startSn} TO ${endSn}`;
    }

    const selectedConsigneeObj = consignees.find((c) => c.id === selectedConsignee);

    const newConsignee = {
      consigneeId: selectedConsignee,
      consigneeName: selectedConsigneeObj?.name,
      quantity: requestedNewQty + selectedConsigneeSubSerials.length,
      newQuantity: requestedNewQty,
      repairedQuantity: selectedConsigneeSubSerials.length,
      subSnNumber: subSnNumber,
      repairedTransformerIds: [...selectedConsigneeSubSerials],
    };

    setConsigneeList([...consigneeList, newConsignee]);
    setSelectedConsignee("");
    setConsigneeQuantity("");
    setSelectedConsigneeSubSerials([]); 
  };

  const handleDeleteConsignee = (idx) => {
    const updated = [...consigneeList];
    updated.splice(idx, 1);
    setConsigneeList(updated);
  };

  const assignedSubSerials = useMemo(() => {
    return new Set(consigneeList.flatMap(c => (c.repairedTransformerIds || []).map(String)));
  }, [consigneeList]);

  const availableSubSerialsForConsignee = useMemo(() => {
    return repairedTransformerSrno.filter(sn => !assignedSubSerials.has(String(sn)));
  }, [repairedTransformerSrno, assignedSubSerials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      deliveryScheduleId: tnDetail?.id || null,
      serialNumberFrom: parseInt(serialNumberFrom),
      serialNumberTo: parseInt(serialNumberTo),
      offerDate: offerDate ? dayjs(offerDate).toISOString() : null,
      offeredQuantity: parseInt(offeredQuantity),
      inspectionDate: inspectionDate ? dayjs(inspectionDate).toISOString() : null,
      inspectedQuantity: parseInt(inspectedQuantity),
      inspectionOfficers: selectedInspectionOfficer,
      nominationLetterNo: nominationLetterNo || null,
      nominationDate: nominationDate ? dayjs(nominationDate).toISOString() : null,
      diNo: diNo || null,
      diDate: diDate ? dayjs(diDate).toISOString() : null,
      consignees: consigneeList,
      sealingDetails,
      warranty: warranty || null,
      repaired_transformer_srno: totalRepairedPool,
      subSerialNumber: totalRepairedPool.join(", "),
      repaired_transformer_mapping: repairedTransformerMapping,
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
                  renderInput={(params) => <TextField {...params} label="TN Number" fullWidth required />}
                />
              </Grid>

              <Grid item size={1}><TextField fullWidth label="Rating In KVA" value={tnDetail?.rating || ""} InputProps={{ readOnly: true }} /></Grid>
              <Grid item size={1}><TextField fullWidth label="Phase" value={tnDetail?.phase || ""} InputProps={{ readOnly: true }} /></Grid>
              <Grid item size={1}><TextField fullWidth label="Wound" value={tnDetail?.wound || ""} InputProps={{ readOnly: true }} /></Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Date Of Offer"
                  value={offerDate}
                  onChange={setOfferDate}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>

              <Grid item size={1}><TextField label="Offered Quantity" required fullWidth value={offeredQuantity} onChange={(e) => setOfferedQuantity(e.target.value)} /></Grid>
              <Grid item size={1}><TextField type="number" label="Serial Number From" required fullWidth value={serialNumberFrom} onChange={(e) => setSerialNumberFrom(e.target.value)} /></Grid>
              <Grid item size={1}><TextField type="number" label="Serial Number To" required fullWidth value={serialNumberTo} onChange={(e) => setSerialNumberTo(e.target.value)} /></Grid>

              <Grid item size={1}>
                <FormControl fullWidth>
                  <InputLabel>Sub Serial No</InputLabel>
                  <Select
                    multiple
                    input={<OutlinedInput label="Sub Serial No" />}
                    value={repairedTransformerSrno}
                    onChange={(e) => setRepairedTransformerSrno(e.target.value)}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {(availableTransformers || [])
                      .filter(t => !consigneeList.flatMap(c => (c.repairedTransformerIds || []).map(String)).includes(String(t.serialNo)))
                      .map((t) => (
                        <MenuItem key={`${t.id}-${t.serialNo}`} value={String(t.serialNo)}>
                          <Checkbox checked={repairedTransformerSrno.includes(String(t.serialNo))} />
                          <ListItemText primary={t.serialNo} />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={1}><TextField label="Nomination Letter no" fullWidth value={nominationLetterNo} onChange={(e) => setNominationLetterNo(e.target.value)} /></Grid>
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
                  <TextField fullWidth label="Inspection Officers name" variant="outlined" value={inspectionOfficer} onChange={(e) => setInspectionOfficer(e.target.value)} />
                  <Button variant="contained" onClick={handleAddInspectionOfficer}>Add</Button>
                </Box>
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {selectedInspectionOfficer.map((i, index) => (
                    <Chip key={index} label={i} onDelete={() => handleRemove(i)} color="primary" variant="outlined" />
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
                    if (!isNaN(currentInspected)) setTotal(totalInspectedQuantityData + currentInspected);
                    else setTotal(totalInspectedQuantityData);
                  }}
                />
              </Grid>

              <Grid item size={1}><TextField label="Grand Total" fullWidth type="number" value={total} onChange={(e) => setTotal(e.target.value)} /></Grid>
              <Grid item size={1}><TextField label="DI No" fullWidth value={diNo} onChange={(e) => setDiNo(e.target.value)} /></Grid>
              <Grid item size={1}>
                <DatePicker
                  label="DI Date"
                  value={diDate}
                  onChange={setDiDate}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}><TextField label="Warranty Period" fullWidth value={warranty} InputProps={{ readOnly: true }} /></Grid>
              
              <Grid item size={2}><Typography variant="h6" sx={{ mt: 2 }}>Consignee Details</Typography></Grid>

              <Grid item size={2}>
                <Box display="flex" gap={2} alignItems="flex-start">
                  <FormControl fullWidth sx={{ flex: 1.5 }}>
                    <InputLabel>Select Consignee</InputLabel>
                    <Select value={selectedConsignee} onChange={(e) => setSelectedConsignee(e.target.value)} label="Select Consignee">
                      {(consignees || []).map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </Select>
                  </FormControl>

                  <TextField label="Quantity" type="number" fullWidth sx={{ flex: 1 }} value={consigneeQuantity} onChange={(e) => setConsigneeQuantity(e.target.value)} />

                  <FormControl fullWidth sx={{ flex: 2 }}>
                    <InputLabel>Sub Serial No</InputLabel>
                    <Select
                      multiple
                      input={<OutlinedInput label="Sub Serial No" />}
                      value={selectedConsigneeSubSerials}
                      onChange={(e) => setSelectedConsigneeSubSerials(e.target.value)}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {availableSubSerialsForConsignee.map((sn) => (
                        <MenuItem key={sn} value={String(sn)}>
                          <Checkbox checked={selectedConsigneeSubSerials.includes(String(sn))} />
                          <ListItemText primary={sn} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button variant="contained" color="primary" onClick={handleAddConsignee} sx={{ height: '56px', flex: 1 }} fullWidth>Add Consignee</Button>
                </Box>
              </Grid>

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
                        <TableCell>{consignees.find((con) => con.id === c.consigneeId)?.name}</TableCell>
                        <TableCell>{c.quantity}</TableCell>
                        <TableCell>{c.subSnNumber || "—"}</TableCell>
                        <TableCell>{(c.repairedTransformerIds || []).join(", ") || "—"}</TableCell>
                        <TableCell><Button color="error" onClick={() => handleDeleteConsignee(idx)}><Cancel /></Button></TableCell>
                      </TableRow>
                    ))}
                    {consigneeList.length === 0 && <TableRow><TableCell colSpan={5} align="center">No Consignees Added</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Grid>

              <Grid item size={2}>
                <div>
                  <Button variant="outlined" component="label" fullWidth>Upload Sealing Details<input type="file" accept=".xls,.xlsx" hidden onChange={handleExcelUpload} /></Button>
                  {fileName && <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>📄 {fileName}</Typography>}
                </div>
              </Grid>

              <Grid item xs={2} >
                <Button type="submit" onClick={handleSubmit} className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex" style={{ margin: "auto" }} disabled={addFinalInspectionMutation.isPending}>
                  <FaCloudUploadAlt />
                  {addFinalInspectionMutation.isPending ? <CircularProgress color="inherit" size={20} /> : "PUBLISH AND VIEW"}
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
