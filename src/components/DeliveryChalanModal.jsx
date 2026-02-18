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

  const [selectedNewTransformers, setSelectedNewTransformers] = useState([]);
  const [selectedRepairedTransformers, setSelectedRepairedTransformers] = useState([]);
  const [availableNewTransformers, setAvailableNewTransformers] = useState([]);
  const [availableRepairedTransformers, setAvailableRepairedTransformers] = useState([]);
  const [otherConsigneeSerialNumbers, setOtherConsigneeSerialNumbers] = useState("");

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
      const filtered = finalInspections.filter((fi) => {
        if (fi.deliveryScheduleId !== selectedDeliveryScheduleId) return false;

        if (!fi.consignees || fi.consignees.length === 0) return true;

        // Check if ANY consignee has remaining items (New or Repaired)
        return fi.consignees.some((consignee) => {
          let totalAssigned = 0;

          // 1. New Transformers Assigned
          if (consignee.subSnNumber) {
            const parts = consignee.subSnNumber.split(" TO ");
            if (parts.length === 2) {
              const start = parseInt(parts[0], 10);
              const end = parseInt(parts[1], 10);
              totalAssigned += end - start + 1;
            } else {
              totalAssigned += 1;
            }
          }

          // 2. Repaired Transformers Assigned
          if (consignee.repairedTransformerIds) {
            totalAssigned += consignee.repairedTransformerIds.length;
          }

          // Calculate Used
          let totalUsed = 0;
          const relevantChallans = deliveryChallansAll.filter(
            (dc) =>
              dc.finalInspectionId === fi.id &&
              dc.consigneeId === consignee.consigneeId &&
              dc.id !== deliveryChalanData?.id
          );

          relevantChallans.forEach((dc) => {
            if (dc.selectedTransformers && dc.selectedTransformers.length > 0) {
              totalUsed += dc.selectedTransformers.length;
            } else if (dc.subSerialNumberFrom && dc.subSerialNumberTo) {
              const start = parseInt(dc.subSerialNumberFrom, 10);
              const end = parseInt(dc.subSerialNumberTo, 10);
              totalUsed += end - start + 1;
            }

            if (dc.repairedSerialNumbers && Array.isArray(dc.repairedSerialNumbers)) {
              totalUsed += dc.repairedSerialNumbers.length;
            }
          });

          return totalUsed < totalAssigned;
        });
      });
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
      setSelectedConsigneeId("");
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

    const fullConsignee = consignees.find((item) => item.id === selectedId);
    if (fullConsignee) {
      setConsigneeAddress(fullConsignee.address);
      setConsigneeGSTNo(fullConsignee.gstNo);
    } else {
      setConsigneeAddress("");
      setConsigneeGSTNo("");
    }

    // Find the consignee details from within the selected final inspection
    const consigneeFromInspection = availableConsignees.find(c => c.consigneeId === selectedId);
    
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
          newSerials.push({ id: consigneeFromInspection.subSnNumber, serialNo: consigneeFromInspection.subSnNumber });
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
        if (
          dc.finalInspectionId === selectedRecord.id &&
          dc.id !== deliveryChalanData?.id
        ) {
          if (dc.consigneeId === selectedId) {
            // New transformers explicitly selected
            if (
              dc.selectedTransformers &&
              Array.isArray(dc.selectedTransformers) &&
              dc.selectedTransformers.length > 0
            ) {
              dc.selectedTransformers.forEach((s) => usedNew.add(String(s)));
            }
            // New transformers range
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
              dc.repairedSerialNumbers.forEach((s) => usedRepaired.add(String(s)));
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

    const filteredNew = newSerials.filter(s => !usedNew.has(s.id));
    const filteredRepaired = repairedSerials.filter(s => !usedRepaired.has(s.id));

    setAvailableNewTransformers(filteredNew);
    setAvailableRepairedTransformers(filteredRepaired);
    
    setSelectedNewTransformers([]);
    setSelectedRepairedTransformers([]);
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

    const inspectionRecord = selectedRecord || deliveryChalanData?.finalInspection;

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

      if (inspectionRecord && inspectionRecord.consignees) {
        inspectionRecord.consignees.forEach((c) => {
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
        alert(`Invalid Serial Numbers (not found in Inspection): ${invalidSerials.join(", ")}`);
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
      finalInspectionId:
        selectedRecord?.id || deliveryChalanData.finalInspectionId,
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
      const consigneeFromInspection = fi.consignees?.find(c => c.consigneeId === deliveryChalanData.consigneeId);
      
      let newSerials = [];
      let repairedSerials = [];

      if (consigneeFromInspection) {
        if (consigneeFromInspection.subSnNumber) {
          const parts = consigneeFromInspection.subSnNumber.split(" TO ");
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            for (let i = start; i <= end; i++) {
              newSerials.push({ id: String(i), serialNo: String(i) });
            }
          } else {
            newSerials.push({ id: consigneeFromInspection.subSnNumber, serialNo: consigneeFromInspection.subSnNumber });
          }
        }
        if (consigneeFromInspection.repairedTransformerIds) {
          consigneeFromInspection.repairedTransformerIds.forEach((id) => {
            repairedSerials.push({ id: String(id), serialNo: String(id) });
          });
        }
      }

      // Filter out used serials from OTHER challans
      const usedNew = new Set();
      const usedRepaired = new Set();

      deliveryChallansAll.forEach((dc) => {
        if (
          dc.finalInspectionId === fi.id &&
          dc.id !== deliveryChalanData.id
        ) {
          if (dc.consigneeId === deliveryChalanData.consigneeId) {
            if (
              dc.selectedTransformers &&
              Array.isArray(dc.selectedTransformers) &&
              dc.selectedTransformers.length > 0
            ) {
              dc.selectedTransformers.forEach((s) => usedNew.add(String(s)));
            } else if (dc.subSerialNumberFrom && dc.subSerialNumberTo) {
              const start = parseInt(dc.subSerialNumberFrom, 10);
              const end = parseInt(dc.subSerialNumberTo, 10);
              for (let i = start; i <= end; i++) usedNew.add(String(i));
            }
            if (
              dc.repairedSerialNumbers &&
              Array.isArray(dc.repairedSerialNumbers)
            ) {
              dc.repairedSerialNumbers.forEach((s) => usedRepaired.add(String(s)));
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

      const filteredNew = newSerials.filter(s => !usedNew.has(s.id));
      const filteredRepaired = repairedSerials.filter(s => !usedRepaired.has(s.id));

      setAvailableNewTransformers(filteredNew);
      setAvailableRepairedTransformers(filteredRepaired);

      // Set selected values based on current challan data
      const currentNewSelected = [];
      if (deliveryChalanData.subSerialNumberFrom && deliveryChalanData.subSerialNumberTo) {
        const start = parseInt(deliveryChalanData.subSerialNumberFrom, 10);
        const end = parseInt(deliveryChalanData.subSerialNumberTo, 10);
        for(let i=start; i<=end; i++) currentNewSelected.push(String(i));
      }
      setSelectedNewTransformers(currentNewSelected);
      setSelectedRepairedTransformers(deliveryChalanData.repairedSerialNumbers || []);
      setOtherConsigneeSerialNumbers(deliveryChalanData.otherConsigneeSerialNumbers || "");
      
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
            <InputLabel>New Transformers (TRFSI No)</InputLabel>
            <Select
              multiple
              value={selectedNewTransformers}
              onChange={(e) => setSelectedNewTransformers(e.target.value)}
              input={<OutlinedInput label="New Transformers (TRFSI No)" />}
              renderValue={(selected) => selected.join(", ")}
              disabled={!availableNewTransformers.length}
            >
              {availableNewTransformers?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox checked={selectedNewTransformers.includes(s.id)} />
                  <ListItemText primary={s.serialNo} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Repaired Transformers</InputLabel>
            <Select
              multiple
              value={selectedRepairedTransformers}
              onChange={(e) => setSelectedRepairedTransformers(e.target.value)}
              input={<OutlinedInput label="Repaired Transformers" />}
              renderValue={(selected) => selected.join(", ")}
              disabled={!availableRepairedTransformers.length}
            >
              {availableRepairedTransformers?.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  <Checkbox checked={selectedRepairedTransformers.includes(s.id)} />
                  <ListItemText primary={s.serialNo} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Other Consignee Serial Numbers (e.g. 1021-1050, 1055, 456)"
            value={otherConsigneeSerialNumbers}
            onChange={(e) => setOtherConsigneeSerialNumbers(e.target.value)}
            sx={{ mt: 2 }}
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
