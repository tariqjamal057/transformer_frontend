import { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
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
    queryFn: () => api.get("/final-inspections").then((res) => res.data),
  });

  const { data: consignees } = useQuery({
    queryKey: ["consignees"],
    queryFn: () => api.get("/consignees").then((res) => res.data),
  });

  const { data: materialDescriptions } = useQuery({
    queryKey: ["material-descriptions"],
    queryFn: () => api.get("/material-descriptions").then((res) => res.data),
  });


  const handleTNChange = (tnNumber) => {
    setSelectedTN(tnNumber);
    const record = finalInspections.find(
      (item) => item.deliverySchedule.tnNumber === tnNumber
    );

    if (record) {
      setSelectedRecord(record);
      setDiNo(record.diNo);
      setDiDate(dayjs(record.diDate));
      setInspectionDate(dayjs(record.inspectionDate));
      setInspectionOfficers(record.inspectionOfficers.join(", "));
      setPoNo(record.deliverySchedule.poDetails);
      setPoDate(dayjs(record.deliverySchedule.poDate));
      setSerialNumber(record.snNumber);
      setChalanDescription(record.deliverySchedule.description);
    }
  };

  const [subSerialFrom, setSubSerialFrom] = useState("")
  const [subSerialTo, setSubSerialTo] = useState("")
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

  const [consigneeId, setConsigneeId] = useState("");
  const [selectedConsigneeRecord, setSelectedConsigneeRecord] = useState(null);
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeGSTNo, setConsigneeGSTNo] = useState("");

  const handleConsigneeChange = (event) => {
    const selectedId = event.target.value;
    setConsigneeId(selectedId);

    const record = consignees.find((item) => item.id === selectedId);
    if (record) {
      setSelectedConsigneeRecord(record);
      setConsigneeAddress(record.address);
      setConsigneeGSTNo(record.gstNo);
    } else {
      setSelectedConsigneeRecord(null);
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
      setAlertBox({open: true, msg: "Delivery Challan added successfully!", error: false});
      queryClient.invalidateQueries(["deliveryChallans"]);
      navigate("/deliveryChalan-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    // Store entire final inspection object
    const data = {
      finalInspectionDetailId: selectedRecord.id,
      challanNo,
      subSerialNumberFrom: parseInt(subSerialFrom),
      subSerialNumberTo: parseInt(subSerialTo),
      consignorName,
      consignorAddress,
      consignorPhone: consignorPhoneNo,
      consignorGST: consignorGSTNo,
      consignorEmail,
      consigneeId,
      lorryNo,
      truckDriverName: driverName,
      materialDescriptionId,
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
                    <MenuItem
                      key={tn.deliverySchedule.tnNumber}
                      value={tn.deliverySchedule.tnNumber}
                    >
                      {tn.deliverySchedule.tnNumber}
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

              <Grid item size={2} mt={1}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Sub Serial No
                </Typography>
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="From"
                  fullWidth
                  value={subSerialFrom}
                  onChange={(e) => setSubSerialFrom(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="To"
                  fullWidth
                  value={subSerialTo}
                  onChange={(e) => setSubSerialTo(e.target.value)}
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
                <TextField
                  fullWidth
                  label="PO No"
                  value={poNo}
                />
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
                >
                  {consignees?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
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