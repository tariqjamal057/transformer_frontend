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
  Checkbox,
  ListItemText,
  OutlinedInput,
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

  const [tnDetail, setTnDetail] = useState("");
  const [serialNumberFrom, setSerialNumberFrom] = useState("");
  const [serialNumberTo, setSerialNumberTo] = useState("");
  const [sr, setSr] = useState("");
  const [inspectionDate, setInspectionDate] = useState(null);
  const [inspectedQuantity, setInspectedQuantity] = useState("");
  const [nominationLetterNo, setNominationLetterNo] = useState("");
  const [nominationDate, setNominationDate] = useState(null);
  const [imposeLetterNo, setImposeLetterNo] = useState("");
  const [imposeDate, setImposeDate] = useState(null);
  const [liftingLetterNo, setLiftingLetterNo] = useState("");
  const [liftingDate, setLiftingDate] = useState(null);
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
  const [repairedTransformerSrno, setRepairedTransformerSrno] = useState([]);
  const [repairedTransformerMapping, setRepairedTransformerMapping] = useState(
    [],
  );
  const [availableTransformers, setAvailableTransformers] = useState([]);

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
      setImposeLetterNo(inspectionData.imposeLetterNo || "");
      setImposeDate(
        inspectionData.imposeDate
          ? dayjs(inspectionData.imposeDate)
          : null,
      );
      setLiftingLetterNo(inspectionData.liftingLetterNo || "");
      setLiftingDate(
        inspectionData.liftingDate ? dayjs(inspectionData.liftingDate) : null,
      );
      setOfferDate(
        inspectionData.offerDate ? dayjs(inspectionData.offerDate) : null,
      );
      setOfferedQuantity(inspectionData.offeredQuantity);
      setSelectedInspectionOfficer(inspectionData.inspectionOfficers || []);

      setDiNo(inspectionData.diNo || "");
      setDiDate(inspectionData.diDate ? dayjs(inspectionData.diDate) : null);
      setWarranty(
        inspectionData?.deliverySchedule?.guaranteePeriodMonths || "",
      );
      setSealingDetails(inspectionData.sealingDetails || []);
      setRepairedTransformerSrno(
        (inspectionData.repaired_transformer_srno || []).map(String),
      );

      // ✅ Load existing consignee list
      const loadedConsignees = (inspectionData.consignees || []).map(c => ({
        ...c,
        // Ensure newQuantity is set. If missing, infer from quantity - repaired count
        newQuantity: c.newQuantity !== undefined 
          ? c.newQuantity 
          : (c.quantity - (c.repairedTransformerIds?.length || 0))
      }));
      setConsigneeList(loadedConsignees);
    }
  }, [inspectionData]);

  // New useEffect to handle total state
  useEffect(() => {
    if (inspectionData && inspectionData.total !== undefined && inspectionData.total !== null) {
      setTotal(inspectionData.total); // Use existing total from inspectionData if present
    } else if (totalInspectedQuantityData !== undefined) {
      setTotal(totalInspectedQuantityData); // Otherwise, use fetched total
    } else {
      setTotal(""); // Default empty if no data
    }
  }, [inspectionData, totalInspectedQuantityData]);

  useEffect(() => {
    if (damagedTransformers) {
      const flattened = [];
      damagedTransformers.forEach((t) => {
        const serials = Array.isArray(t.serialNo) ? t.serialNo : [t.serialNo];
        serials.forEach((sn) => {
          const isCurrent =
            inspectionData?.repaired_transformer_srno?.includes(sn);
          if (!t.used || isCurrent) {
            flattened.push({
              id: t.id,
              serialNo: sn,
            });
          }
        });
      });
      setAvailableTransformers(flattened);
    }
  }, [damagedTransformers, inspectionData]);

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
  }, [serialNumberTo, repairedTransformerSrno]);

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
    // Calculate already assigned repaired transformers
    const assignedRepaired = consigneeList.flatMap(c => c.repairedTransformerIds || []);
    const currentConsigneeRepaired = repairedTransformerSrno.filter(sn => !assignedRepaired.includes(sn));

    if (!selectedConsignee || (!consigneeQuantity && currentConsigneeRepaired.length === 0)) {
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

    const requestedNewQty = parseInt(consigneeQuantity) || 0;
    const totalNewAvailable = to - from + 1;

    // Calculate already distributed NEW quantities
    const newDistributed = consigneeList.reduce(
      (sum, c) => sum + (c.newQuantity || 0),
      0,
    );

    if (newDistributed + requestedNewQty > totalNewAvailable) {
      setAlertBox({
        open: true,
        msg: "New Quantity exceeds available new transformers!",
        error: true,
      });
      return;
    }

    // Get the sub-serial number range for new transformers
    let subSnNumber = null;
    if (requestedNewQty > 0) {
      const startSn = from + newDistributed;
      const endSn = startSn + requestedNewQty - 1;
      subSnNumber = `${startSn} TO ${endSn}`;
    }

    const selectedConsigneeObj = consignees.find(
      (c) => c.id === selectedConsignee,
    );

    const newConsignee = {
      consigneeId: selectedConsignee,
      consigneeName: selectedConsigneeObj?.name,
      quantity: requestedNewQty + currentConsigneeRepaired.length, // Total
      newQuantity: requestedNewQty,
      repairedQuantity: currentConsigneeRepaired.length,
      subSnNumber: subSnNumber,
      repairedTransformerIds: currentConsigneeRepaired,
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
      imposeLetterNo: imposeLetterNo || null,
      imposeDate: imposeDate
        ? dayjs(imposeDate).toISOString()
        : null,
      liftingLetterNo: liftingLetterNo || null,
      liftingDate: liftingDate ? dayjs(liftingDate).toISOString() : null,
      diNo: diNo || null,
      diDate: diDate ? dayjs(diDate).toISOString() : null,
      warranty: warranty ? String(warranty) : null,
      repaired_transformer_srno: repairedTransformerSrno.map(String),
      repaired_transformer_mapping: repairedTransformerMapping.map((item) => ({
        ...item,
        oldSrNo: String(item.oldSrNo),
      })),
      consignees: consigneeList.map((c) => ({
        consigneeId: c.consigneeId || c.consignee?.id,
        consigneeName: c.consigneeName,
        quantity: c.quantity,
        subSnNumber: c.subSnNumber,
        repairedTransformerIds: c.repairedTransformerIds || [],
      })),
      sealingDetails,
      grandTotal: total ? parseInt(total, 10) : null,
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
              format="DD/MM/YYYY"
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
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />

            <TextField
              label="Impose Letter No"
              fullWidth
              value={imposeLetterNo}
              onChange={(e) => setImposeLetterNo(e.target.value)}
              sx={{ mt: 2 }}
            />

            <DatePicker
              label="Impose Date"
              value={imposeDate}
              onChange={setImposeDate}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />

            <TextField
              label="Lifting Letter No"
              fullWidth
              value={liftingLetterNo}
              onChange={(e) => setLiftingLetterNo(e.target.value)}
              sx={{ mt: 2 }}
            />

            <DatePicker
              label="Lifting Date"
              value={liftingDate}
              onChange={setLiftingDate}
              format="DD/MM/YYYY"
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
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ mt: 2, width: "100%" }}
            />

            <TextField
              label="Inspected Quantity"
              fullWidth
              type="number"
              value={inspectedQuantity}
              onChange={(e) => {
                setInspectedQuantity(e.target.value);
                const currentInspected = parseInt(e.target.value, 10);
                let baseTotal = totalInspectedQuantityData;
                if (inspectionData?.id && inspectionData?.inspectedQuantity) {
                  baseTotal = baseTotal - inspectionData.inspectedQuantity;
                }

                if (!isNaN(currentInspected)) {
                  setTotal(baseTotal + currentInspected);
                } else {
                  setTotal(baseTotal);
                }
              }}
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
              format="DD/MM/YYYY"
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

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Serial No</InputLabel>
            <Select
              multiple
              input={<OutlinedInput label="Sub Serial No" />}
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

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={2}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Consignee Details
              </Typography>{" "}
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
                    <TableCell>Serial No.</TableCell>
                    <TableCell>Sub-Serial No.</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consigneeList.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{c.consigneeName}</TableCell>
                      <TableCell>{c.quantity}</TableCell>
                      <TableCell>{c.subSnNumber || "—"}</TableCell>
                      <TableCell>
                        {[
                          ...(c.repairedTransformerIds || []),
                          ...(c.repaired_transformer_srno || []),
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
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
