import { useContext, useEffect, useState } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  OutlinedInput,
  Select,
} from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import api from "../../services/api";

const AddDeliveryChalan = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const [otherConsigneeSerialNumbers, setOtherConsigneeSerialNumbers] = useState("");

  // New state for split selection
  const [selectedNewTransformers, setSelectedNewTransformers] = useState([]);
  const [selectedRepairedTransformers, setSelectedRepairedTransformers] =
    useState([]);
  const [availableNewTransformers, setAvailableNewTransformers] = useState([]);
  const [availableRepairedTransformers, setAvailableRepairedTransformers] =
    useState([]);

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

  const { data: deliveryChallansAll } = useQuery({
    queryKey: ["deliveryChallansAll"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const { data: deliverySchedules } = useQuery({
    queryKey: ["allDeliverySchedules"],
    queryFn: () =>
      api.get("/delivery-schedules?all=true").then((res) => res.data),
    placeholderData: [],
  });

  const [selectedFinalInspectionId, setSelectedFinalInspectionId] =
    useState("");

  const [selectedDeliveryScheduleId, setSelectedDeliveryScheduleId] =
    useState("");
  const [filteredFinalInspections, setFilteredFinalInspections] = useState([]);

  const companyId = localStorage.getItem("companyId");

  const { data: companyDetails } = useQuery({
    queryKey: ["companyDetails", companyId],
    queryFn: () =>
      companyId
        ? api.get(`/companies/${companyId}`).then((res) => res.data)
        : null,
    enabled: !!companyId,
  });

  // Filter final inspections based on selected delivery schedule
  useEffect(() => {
    if (selectedDeliveryScheduleId && finalInspections && deliveryChallansAll) {
      const filtered = finalInspections.filter((fi) => {
        if (fi.deliveryScheduleId !== selectedDeliveryScheduleId) return false;

        if (!fi.consignees || fi.consignees.length === 0) return true;

        // Check if ANY consignee has remaining items (New or Repaired)
        return fi.consignees.some((consignee) => {
          const assignedSerials = new Set();

          // 1. New Transformers Assigned
          if (consignee.subSnNumber) {
            const parts = consignee.subSnNumber.split(" TO ");
            if (parts.length === 2) {
              const start = parseInt(parts[0], 10);
              const end = parseInt(parts[1], 10);
              for (let i = start; i <= end; i++) assignedSerials.add(String(i));
            } else {
              assignedSerials.add(consignee.subSnNumber);
            }
          }

          // 2. Repaired Transformers Assigned
          if (consignee.repairedTransformerIds) {
            consignee.repairedTransformerIds.forEach((id) =>
              assignedSerials.add(String(id))
            );
          }

          const totalAssigned = assignedSerials.size;

          // Calculate Used
          let totalUsed = 0;
          const relevantChallans = deliveryChallansAll.filter(
            (dc) => dc.finalInspectionId === fi.id
          );

          relevantChallans.forEach((dc) => {
            if (dc.selectedTransformers && dc.selectedTransformers.length > 0) {
              dc.selectedTransformers.forEach((s) => {
                if (assignedSerials.has(String(s))) totalUsed++;
              });
            } else if (dc.subSerialNumberFrom && dc.subSerialNumberTo) {
              const start = parseInt(dc.subSerialNumberFrom, 10);
              const end = parseInt(dc.subSerialNumberTo, 10);
              for (let i = start; i <= end; i++) {
                if (assignedSerials.has(String(i))) totalUsed++;
              }
            }

            if (
              dc.repairedSerialNumbers &&
              Array.isArray(dc.repairedSerialNumbers)
            ) {
              dc.repairedSerialNumbers.forEach((s) => {
                if (assignedSerials.has(String(s))) totalUsed++;
              });
            }
          });

          return totalUsed < totalAssigned;
        });
      });
      setFilteredFinalInspections(filtered);
    } else {
      setFilteredFinalInspections(finalInspections || []);
    }
    console.log("setFilteredFinalInspections ", filteredFinalInspections);
  }, [selectedDeliveryScheduleId, finalInspections, deliveryChallansAll]);

  const handleTNChange = (deliveryScheduleId) => {
    setSelectedDeliveryScheduleId(deliveryScheduleId);
    setSelectedFinalInspectionId(""); // Reset final inspection when TN changes
    // Reset all other fields
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
    setConsigneeId("");
    setConsigneeAddress("");
    setConsigneeGSTNo("");
    setSelectedNewTransformers([]);
    setSelectedRepairedTransformers([]);
    setAvailableNewTransformers([]);
    setAvailableRepairedTransformers([]);
    setOtherConsigneeSerialNumbers("");
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
      // We show all consignees here, filtering of serials happens on selection
      if (record.consignees && deliveryChallansAll) {
        const filteredConsignees = record.consignees.filter((consignee) => {
          const assignedSerials = new Set();

          // 1. New Transformers Assigned
          if (consignee.subSnNumber) {
            const parts = consignee.subSnNumber.split(" TO ");
            if (parts.length === 2) {
              const start = parseInt(parts[0], 10);
              const end = parseInt(parts[1], 10);
              for (let i = start; i <= end; i++) assignedSerials.add(String(i));
            } else {
              assignedSerials.add(consignee.subSnNumber);
            }
          }

          // 2. Repaired Transformers Assigned
          if (consignee.repairedTransformerIds) {
            consignee.repairedTransformerIds.forEach((id) =>
              assignedSerials.add(String(id))
            );
          }

          const totalAssigned = assignedSerials.size;

          // Calculate Used
          let totalUsed = 0;
          const relevantChallans = deliveryChallansAll.filter(
            (dc) => dc.finalInspectionId === record.id
          );

          relevantChallans.forEach((dc) => {
            if (dc.selectedTransformers && dc.selectedTransformers.length > 0) {
              dc.selectedTransformers.forEach((s) => {
                if (assignedSerials.has(String(s))) totalUsed++;
              });
            } else if (dc.subSerialNumberFrom && dc.subSerialNumberTo) {
              const start = parseInt(dc.subSerialNumberFrom, 10);
              const end = parseInt(dc.subSerialNumberTo, 10);
              for (let i = start; i <= end; i++) {
                if (assignedSerials.has(String(i))) totalUsed++;
              }
            }

            if (
              dc.repairedSerialNumbers &&
              Array.isArray(dc.repairedSerialNumbers)
            ) {
              dc.repairedSerialNumbers.forEach((s) => {
                if (assignedSerials.has(String(s))) totalUsed++;
              });
            }
          });

          return totalUsed < totalAssigned;
        });
        setAvailableConsignees(filteredConsignees);
      } else {
        setAvailableConsignees(record.consignees || []);
      }

      setConsigneeId(""); // Reset selected consignee
      setConsigneeAddress("");
      setConsigneeGSTNo("");

      // Sub-serial number population
      setSelectedNewTransformers([]);
      setSelectedRepairedTransformers([]);
      setAvailableNewTransformers([]);
      setAvailableRepairedTransformers([]);
      setOtherConsigneeSerialNumbers("");
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
      setConsigneeId("");
      setConsigneeAddress("");
      setConsigneeGSTNo("");
      setSelectedNewTransformers([]);
      setSelectedRepairedTransformers([]);
      setAvailableNewTransformers([]);
      setAvailableRepairedTransformers([]);
      setOtherConsigneeSerialNumbers("");
    }
  };

  const [challanNo, setChallanNo] = useState("");

  const [consignorName, setConsignorName] = useState("");
  const [consignorAddress, setConsignorAddress] = useState("");
  const [consignorPhoneNo, setConsignorPhoneNo] = useState("");
  const [consignorGSTNo, setConsignorGSTNo] = useState("");
  const [consignorEmail, setConsignorEmail] = useState("");

  // ✅ Load Consignor Details from Company API
  useEffect(() => {
    if (companyDetails) {
      setConsignorName(companyDetails.name || "");
      setConsignorAddress(companyDetails.address || "");
      setConsignorPhoneNo(companyDetails.phone || "");
      setConsignorGSTNo(companyDetails.gstNo || "");
      setConsignorEmail(companyDetails.email || "");
    }
  }, [companyDetails]);

  const [availableConsignees, setAvailableConsignees] = useState([]);
  const [consigneeId, setConsigneeId] = useState("");
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeGSTNo, setConsigneeGSTNo] = useState("");

  const handleConsigneeChange = (event) => {
    const selectedId = event.target.value;
    setConsigneeId(selectedId);

    // Find the full original consignee record from the main consignees list
    const fullConsignee = consignees.find((item) => item.id === selectedId);
    if (fullConsignee) {
      setConsigneeAddress(fullConsignee.address);
      setConsigneeGSTNo(fullConsignee.gstNo);
    } else {
      setConsigneeAddress("");
      setConsigneeGSTNo("");
    }

    // Find the consignee details from within the selected final inspection
    const consigneeFromInspection = availableConsignees.find(
      (c) => c.consigneeId === selectedId,
    );

    let newSerials = [];
    let repairedSerials = [];

    if (consigneeFromInspection) {
      // 1. Parse New Transformers Range
      if (consigneeFromInspection.subSnNumber) {
        const parts = consigneeFromInspection.subSnNumber.split(" TO ");
        if (parts.length === 2) {
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);
          for (let i = start; i <= end; i++) {
            newSerials.push({ id: String(i), serialNo: String(i) });
          }
        } else {
          newSerials.push({
            id: consigneeFromInspection.subSnNumber,
            serialNo: consigneeFromInspection.subSnNumber,
          });
        }
      }
      // 2. Add Repaired Transformers
      if (consigneeFromInspection.repairedTransformerIds) {
        consigneeFromInspection.repairedTransformerIds.forEach((id) => {
          repairedSerials.push({ id: String(id), serialNo: String(id) });
        });
      }
    }

    // Filter out used serials from existing challans
    const usedNew = new Set();
    const usedRepaired = new Set();

    if (deliveryChallansAll && selectedRecord) {
      deliveryChallansAll.forEach((dc) => {
        if (dc.finalInspectionId === selectedRecord.id) {
          if (dc.consigneeId === selectedId) {
            // New transformers explicitly selected
            if (
              dc.selectedTransformers &&
              Array.isArray(dc.selectedTransformers) &&
              dc.selectedTransformers.length > 0
            ) {
              dc.selectedTransformers.forEach((s) => usedNew.add(String(s)));
            }
            // New transformers range (fallback for old records)
            else if (dc.subSerialNumberFrom && dc.subSerialNumberTo) {
              const start = parseInt(dc.subSerialNumberFrom, 10);
              const end = parseInt(dc.subSerialNumberTo, 10);
              for (let i = start; i <= end; i++) usedNew.add(String(i));
            }
            // Repaired transformers
            if (
              dc.repairedSerialNumbers &&
              Array.isArray(dc.repairedSerialNumbers)
            ) {
              dc.repairedSerialNumbers.forEach((s) =>
                usedRepaired.add(String(s))
              );
            }
          }

          // Other Consignee Serial Numbers
          if (dc.otherConsigneeSerialNumbers) {
            const parts = dc.otherConsigneeSerialNumbers
              .split(",")
              .map((s) => s.trim());
            parts.forEach((part) => {
              if (part.includes("-")) {
                const [start, end] = part
                  .split("-")
                  .map((n) => parseInt(n, 10));
                if (!isNaN(start) && !isNaN(end)) {
                  for (let i = start; i <= end; i++) {
                    usedNew.add(String(i));
                    usedRepaired.add(String(i));
                  }
                }
              } else {
                usedNew.add(part);
                usedRepaired.add(part);
              }
            });
          }
        }
      });
    }

    const filteredNew = newSerials.filter((s) => !usedNew.has(s.id));
    const filteredRepaired = repairedSerials.filter(
      (s) => !usedRepaired.has(s.id),
    );

    setAvailableNewTransformers(filteredNew);
    setAvailableRepairedTransformers(filteredRepaired);

    setSelectedNewTransformers([]);
    setSelectedRepairedTransformers([]);
  };

  const [driverName, setDriverName] = useState("");
  const [lorryNo, setLorryNo] = useState("");

  const [materialDescription, setMaterialDescription] = useState("");
  const [materialDescriptionId, setMaterialDescriptionId] = useState("");

  const handleMaterialSelect = (id) => {
    setMaterialDescriptionId(id);

    const record = materialDescriptions.find((item) => item.id === id);
    if (record) {
      setMaterialDescription(record.description); // Fill the whole description
    } else {
      setMaterialDescription("");
    }
  };

  const addDeliveryChallanMutation = useMutation({
    mutationFn: (newChallan) => api.post("/delivery-challans", newChallan),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Delivery Challan added successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["deliveryChallans"]);
      navigate("/deliveryChalan-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const missingFields = [];
    if (!selectedDeliveryScheduleId) missingFields.push("TN Number");
    if (!selectedFinalInspectionId) missingFields.push("Serial Number");
    if (selectedNewTransformers.length === 0) missingFields.push("New Transformers");
    if (!challanNo) missingFields.push("Consignee Receipt No");
    if (!consigneeId) missingFields.push("Consignee Name");
    if (!materialDescriptionId) missingFields.push("Material Description");

    if (missingFields.length > 0) {
      setAlertBox({
        open: true,
        msg: `Please fill required fields: ${missingFields.join(", ")}`,
        error: true,
      });
      return;
    }
    if (!selectedRecord) return;

    // Process otherConsigneeSerialNumbers
    let manualNewSerials = [];
    let manualRepairedSerials = [];

    if (otherConsigneeSerialNumbers.trim()) {
      const parts = otherConsigneeSerialNumbers.split(",").map((s) => s.trim()).filter(Boolean);
      const enteredSerials = [];

      parts.forEach((part) => {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map((n) => parseInt(n, 10));
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) {
              enteredSerials.push(String(i));
            }
          }
        } else {
          enteredSerials.push(part);
        }
      });

      // Validation against Inspection Record
      const validNew = new Set();
      const validRepaired = new Set();

      if (selectedRecord.consignees) {
        selectedRecord.consignees.forEach((c) => {
          // New Transformers
          if (c.subSnNumber) {
            const rangeParts = c.subSnNumber.split(" TO ");
            if (rangeParts.length === 2) {
              const s = parseInt(rangeParts[0], 10);
              const e = parseInt(rangeParts[1], 10);
              for (let i = s; i <= e; i++) validNew.add(String(i));
            } else {
              validNew.add(c.subSnNumber);
            }
          }
          // Repaired Transformers
          if (c.repairedTransformerIds) {
            c.repairedTransformerIds.forEach((id) => validRepaired.add(String(id)));
          }
        });
      }

      const invalidSerials = [];
      enteredSerials.forEach((s) => {
        if (validNew.has(s)) {
          manualNewSerials.push(s);
        } else if (validRepaired.has(s)) {
          manualRepairedSerials.push(s);
        } else {
          invalidSerials.push(s);
        }
      });

      if (invalidSerials.length > 0) {
        setAlertBox({
          open: true,
          msg: `Invalid Serial Numbers (not found in Inspection): ${invalidSerials.join(", ")}`,
          error: true,
        });
        return;
      }
    }

    let subSerialNumberFrom = null;
    let subSerialNumberTo = null;

    if (selectedNewTransformers.length > 0) {
      const numericSerials = selectedNewTransformers.map((n) => parseInt(n, 10));
      subSerialNumberFrom = String(Math.min(...numericSerials));
      subSerialNumberTo = String(Math.max(...numericSerials));
    }

    const data = {
      finalInspectionId: selectedRecord.id,
      challanNo,
      subSerialNumberFrom,
      subSerialNumberTo,
      selectedTransformers: selectedNewTransformers,
      repairedSerialNumbers: selectedRepairedTransformers,
      otherConsigneeSerialNumbers,
      consignorName,
      consignorAddress,
      consignorPhone: consignorPhoneNo,
      consignorGST: consignorGSTNo,
      consignorEmail,
      consigneeId,
      lorryNo,
      truckDriverName: driverName,
      materialDescriptionId,
      challanDescription: chalanDescription,
      supplyTenderId: selectedRecord?.deliverySchedule?.supplyTenderId,
    };

    addDeliveryChallanMutation.mutate(data);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="right-content w-100">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
              Create Delivery Chalan
            </Typography>

            <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
              {/* TN Number Dropdown */}
              <Grid item size={1}>
                <TextField
                  select
                  fullWidth
                  label="Select TN Number"
                  value={selectedDeliveryScheduleId}
                  onChange={(e) => handleTNChange(e.target.value)}
                  required
                >
                  {deliverySchedules?.map((ds) => (
                    <MenuItem key={ds?.id} value={ds?.id}>
                      {ds?.tnNumber}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Serial Number Dropdown */}
              <Grid item size={1}>
                <TextField
                  select
                  fullWidth
                  label="Select Serial Number"
                  value={selectedFinalInspectionId}
                  onChange={(e) => handleFinalInspectionChange(e.target.value)}
                  // disabled={!selectedDeliveryScheduleId}
                  disabled={!filteredFinalInspections.length}
                  required
                >
                  {filteredFinalInspections?.map((fi) => (
                    <MenuItem key={fi?.id} value={fi?.id}>
                      {fi?.serialNumberFrom} TO {fi?.serialNumberTo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth required>
                  <InputLabel>New Transformers (TRFSI No)</InputLabel>
                  <Select
                    multiple
                    value={selectedNewTransformers}
                    onChange={(e) => setSelectedNewTransformers(e.target.value)}
                    input={
                      <OutlinedInput label="New Transformers (TRFSI No)" />
                    }
                    renderValue={(selected) => selected.join(", ")}
                    disabled={!availableNewTransformers.length}
                  >
                    {availableNewTransformers?.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        <Checkbox
                          checked={selectedNewTransformers.includes(s.id)}
                        />
                        <ListItemText primary={s.serialNo} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={1}>
                <FormControl fullWidth>
                  <InputLabel>Repaired Transformers</InputLabel>
                  <Select
                    multiple
                    value={selectedRepairedTransformers}
                    onChange={(e) =>
                      setSelectedRepairedTransformers(e.target.value)
                    }
                    input={<OutlinedInput label="Repaired Transformers" />}
                    renderValue={(selected) => selected.join(", ")}
                    disabled={!availableRepairedTransformers.length}
                  >
                    {availableRepairedTransformers?.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        <Checkbox
                          checked={selectedRepairedTransformers.includes(s.id)}
                        />
                        <ListItemText primary={s.serialNo} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item size={2}>
                <TextField
                  fullWidth
                  label="Other Consignee Serial Numbers (e.g. 1021-1050, 1055, 456)"
                  value={otherConsigneeSerialNumbers}
                  onChange={(e) => setOtherConsigneeSerialNumbers(e.target.value)}
                />
              </Grid>

              {/* DI No */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="DI No"
                  value={diNo}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* DI Date */}
              <Grid item size={1}>
                <DatePicker
                  label="DI Date"
                  value={diDate}
                  format="DD/MM/YYYY"
                  //disabled
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Inspection Date */}
              <Grid item size={1}>
                <DatePicker
                  label="Inspection Date"
                  value={inspectionDate}
                  format="DD/MM/YYYY"
                  //disabled
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Inspection Officers */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Inspection Officers"
                  value={inspectionOfficers}
                  InputProps={{ readOnly: true }}
                  multiline
                />
              </Grid>

              {/* PO No */}
              <Grid item size={1}>
                <TextField fullWidth label="PO No" value={poNo} />
              </Grid>

              {/* PO Date */}
              <Grid item size={1}>
                <DatePicker
                  label="PO Date"
                  value={poDate}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Consignee Receipt No"
                  fullWidth
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  required
                />
              </Grid>

              <Grid item size={2} mt={3}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  CONSIGNOR Details
                </Typography>
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Consignor Name"
                  fullWidth
                  value={consignorName}
                  onChange={(e) => setConsignorName(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Address"
                  fullWidth
                  value={consignorAddress}
                  onChange={(e) => setConsignorAddress(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={consignorPhoneNo}
                  onChange={(e) => setConsignorPhoneNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="GST No"
                  fullWidth
                  value={consignorGSTNo}
                  onChange={(e) => setConsignorGSTNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Email"
                  fullWidth
                  value={consignorEmail}
                  onChange={(e) => setConsignorEmail(e.target.value)}
                />
              </Grid>

              {/*Consignee Form*/}

              <Grid item size={2} mt={3}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  CONSIGNEE Details
                </Typography>
              </Grid>

              <Grid item size={1}>
                <TextField
                  select
                  fullWidth
                  label="Select Consignee Name"
                  value={consigneeId}
                  onChange={handleConsigneeChange}
                  disabled={!availableConsignees.length}
                  required
                >
                  {availableConsignees.map((item) => (
                    <MenuItem key={item.consigneeId} value={item.consigneeId}>
                      {item.consigneeName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Address"
                  fullWidth
                  value={consigneeAddress}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item size={1.01}>
                <TextField
                  label="GST No"
                  fullWidth
                  value={consigneeGSTNo}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/*Truck Details Form*/}

              <Grid item size={2} mt={3}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Truck Details
                </Typography>
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Lorry No"
                  fullWidth
                  value={lorryNo}
                  onChange={(e) => setLorryNo(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Driver Name"
                  fullWidth
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </Grid>

              <Grid item size={2} mt={3}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Challan Description
                </Typography>
              </Grid>

              <Grid item size={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Delivery Challan Description"
                  value={chalanDescription}
                  readOnly
                  //onChange={(e) => setChalanDescription(e.target.value)}
                  margin="normal"
                />
              </Grid>

              <Grid item size={2} mt={3}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Material Description
                </Typography>
              </Grid>

              <Grid item size={2}>
                <TextField
                  select
                  fullWidth
                  label="Select Material Description"
                  value={materialDescriptionId}
                  onChange={(e) => handleMaterialSelect(e.target.value)}
                  margin="normal"
                  required
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
              </Grid>

              <Grid item size={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description Of Material"
                  value={materialDescription}
                  readOnly
                  //onChange={(e) => setMaterialDescription(e.target.value)}
                  margin="normal"
                />
              </Grid>

              <Grid item size={2}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                  style={{
                    margin: "auto",
                  }}
                  disabled={addDeliveryChallanMutation.isLoading}
                >
                  <FaCloudUploadAlt />
                  {addDeliveryChallanMutation.isLoading ? (
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

export default AddDeliveryChalan;
