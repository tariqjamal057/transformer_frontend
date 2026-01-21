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
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

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

  const handleTNChange = (tnNumber) => {
    setSelectedTN(tnNumber);
    const record = finalInspections.find((item) => item?.id === tnNumber);

    if (record) {
      setSelectedRecord(record);

      // auto-filled fields
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
      setChalanDescription(record.deliverySchedule.chalanDescription);

      setAvailableConsignees(record.consignees || []);
      setConsigneeId("");
      setConsigneeAddress("");
      setConsigneeGSTNo("");
      setSelectedTransformers([]);
      console.log("record", record.repaired_transformer_srno);
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
  const [selectedTransformers, setSelectedTransformers] = useState([]);
  const [availableSubSerialNumbers, setAvailableSubSerialNumbers] = useState(
    [],
  );

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
  const [consigneeId, setConsigneeId] = useState("");
  const [selectedConsigneeRecord, setSelectedConsigneeRecord] = useState(null);
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeGSTNo, setConsigneeGSTNo] = useState("");

  const handleConsigneeChange = (event) => {
    const selectedId = event.target.value;
    setConsigneeId(selectedId);

    const fullConsignee = consignees.find((item) => item.id === selectedId);
    if (fullConsignee) {
      setConsigneeAddress(fullConsignee.address);
      setConsigneeGSTNo(fullConsignee.gstNo);
    } else {
      setConsigneeAddress("");
      setConsigneeGSTNo("");
    }
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
    if (!selectedRecord) return;

    const selectedSerialNumbers = availableSubSerialNumbers
      .filter((s) => selectedTransformers.includes(s.id))
      .map((s) => s.serialNo);

    const subSerialNumberFrom =
      selectedSerialNumbers.length > 0
        ? String(Math.min(...selectedSerialNumbers))
        : null;
    const subSerialNumberTo =
      selectedSerialNumbers.length > 0
        ? String(Math.max(...selectedSerialNumbers))
        : null;

    const data = {
      finalInspectionId: selectedRecord.id,
      challanNo,
      subSerialNumberFrom,
      subSerialNumberTo,
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
                  value={selectedTN}
                  onChange={(e) => handleTNChange(e.target.value)}
                >
                  {finalInspections?.map((tn) => (
                    <MenuItem key={tn?.id} value={tn?.id}>
                      {tn?.deliverySchedule?.tnNumber}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Serial Number */}
              <Grid item size={1}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={serialNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {/* ✅ Sub Serail No */}
              <Grid item size={1}>
                <FormControl fullWidth>
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
                        <Checkbox
                          checked={selectedTransformers.includes(s.id)}
                        />
                        <ListItemText primary={s.serialNo} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  //disabled
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* Inspection Date */}
              <Grid item size={1}>
                <DatePicker
                  label="Inspection Date"
                  value={inspectionDate}
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
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Consignee Receipt No"
                  fullWidth
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
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
