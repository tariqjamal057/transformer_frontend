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
import { MyContext } from "../../App";

export const getDummyFinalInspectionDetails = () => {
  return [
    {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        poDetails: "PO-12345",
        poDate: "2025-05-10",
        guaranteePeriodMonths: 24,
        description:
          "Delivery challan for 1000 kVA transformers including transport charges, handling, and on-site installation as per the approved purchase order and delivery schedule.",
      },
      subSerialNo: [
        { id: "1", serialNo: "404" },
        { id: "2", serialNo: "302" },
      ],
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 120,
      serialNumberTo: 240,
      snNumber: "120 TO 240",
      nominationLetterNo: "NL/2025/001",
      nominationDate: "2025-07-10",
      inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
      inspectionDate: "2025-07-13",
      inspectedQuantity: 100,
      total: 120,
      diNo: "DI/2025/1001",
      diDate: "2025-07-16",
      shellingDetails: "Model X, Batch 3, 50 units per batch",
    },
    {
      id: "2",
      deliverySchedule: {
        tnNumber: "TN-002",
        poDetails: "PO-22345",
        poDate: "2025-06-01",
        guaranteePeriodMonths: 18,
        description:
          "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
      },
      subSerialNo: [
        { id: "3", serialNo: "407" },
        { id: "4", serialNo: "309" },
      ],
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 241,
      serialNumberTo: 390,
      snNumber: "241 TO 390",
      nominationLetterNo: "NL/2025/002",
      nominationDate: "2025-08-03",
      inspectionOfficers: ["Amit Verma", "Priya Singh"],
      inspectionDate: "2025-08-06",
      inspectedQuantity: 140,
      total: 150,
      diNo: "DI/2025/1002",
      diDate: "2025-08-08",
      shellingDetails: "Model Y, Batch 2, 30 units per batch",
    },
    {
      id: "3",
      deliverySchedule: {
        tnNumber: "TN-003",
        poDetails: "PO-32345",
        poDate: "2025-07-15",
        guaranteePeriodMonths: 12,
        description:
          "Material dispatch challan for 11kV outdoor vacuum circuit breakers, inclusive of installation accessories and detailed engineering drawings for commissioning.",
      },
      subSerialNo: [
        { id: "7", serialNo: "411" },
        { id: "8", serialNo: "321" },
      ],
      offeredDate: "2025-09-15",
      offeredQuantity: 180,
      serialNumberFrom: 391,
      serialNumberTo: 570,
      snNumber: "391 TO 570",
      nominationLetterNo: "NL/2025/003",
      nominationDate: "2025-09-12",
      inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
      inspectionDate: "2025-09-16",
      inspectedQuantity: 160,
      total: 180,
      diNo: "DI/2025/1003",
      diDate: "2025-09-18",
      shellingDetails: "Model Z, Batch 1, 60 units per batch",
    },
    {
      id: "4",
      deliverySchedule: {
        tnNumber: "TN-004",
        poDetails: "PO-42345",
        poDate: "2025-08-10",
        guaranteePeriodMonths: 36,
        description:
          "Challan covering delivery of galvanized steel poles and cross-arms, bundled with all necessary hardware and fasteners for the rural electrification project.",
      },
      subSerialNo: [
        { id: "12", serialNo: "434" },
        { id: "17", serialNo: "339" },
      ],
      offeredDate: "2025-10-20",
      offeredQuantity: 220,
      serialNumberFrom: 571,
      serialNumberTo: 790,
      snNumber: "571 TO 790",
      nominationLetterNo: "NL/2025/004",
      nominationDate: "2025-10-18",
      inspectionOfficers: ["Vikas Sharma", "Neha Yadav"],
      inspectionDate: "2025-10-21",
      inspectedQuantity: 200,
      total: 220,
      diNo: "DI/2025/1004",
      diDate: "2025-10-23",
      shellingDetails: "Model A, Batch 4, 55 units per batch",
    },
  ];
};

export const getDummyConsigneeDetails = () => {
  return [
    {
      name: "ABC Power Solutions Pvt. Ltd.",
      address:
        "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
      gstNo: "06ABCDE1234F1Z5",
    },
    {
      name: "XYZ Transformers Ltd.",
      address: "B-12, MIDC Industrial Estate, Pune, Maharashtra - 411019",
      gstNo: "27XYZAB6789C1Z3",
    },
    {
      name: "GreenVolt Energy Systems",
      address: "123/4, Electronic City Phase 2, Bengaluru, Karnataka - 560100",
      gstNo: "29GVEPL2345D1Z7",
    },
    {
      name: "PowerMax Electric Co.",
      address: "No. 89, GIDC Estate, Ahmedabad, Gujarat - 382445",
      gstNo: "24PMAXL4567E1Z9",
    },
    {
      name: "Sunrise Electricals",
      address: "15, Salt Lake Sector V, Kolkata, West Bengal - 700091",
      gstNo: "19SREPL7890F1Z2",
    },
  ];
};

export const getDummyChalanDescriptions = () => {
  return [
    {
      id: 1,
      description:
        "Delivery challan for 1000 kVA transformers including transport charges, handling, and on-site installation as per the approved purchase order and delivery schedule.",
    },
    {
      id: 2,
      description:
        "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
    },
    {
      id: 3,
      description:
        "Material dispatch challan for 11kV outdoor vacuum circuit breakers, inclusive of installation accessories and detailed engineering drawings for commissioning.",
    },
    {
      id: 4,
      description:
        "Challan covering delivery of galvanized steel poles and cross-arms, bundled with all necessary hardware and fasteners for the rural electrification project.",
    },
    {
      id: 5,
      description:
        "Delivery challan for power cables and terminations, covering 3.5 core XLPE insulated aluminum cables with full compliance to IS standards and safety protocols.",
    },
  ];
};

export const getDummyMaterialDescriptions = () => {
  return [
    {
      code: "TX-1001",
      description:
        "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
    },
    {
      code: "TX-2002",
      description:
        "200 kVA, 11/0.433 kV, 3-Phase, Copper Wound Distribution Transformer, ONAN Cooled, energy efficient level-2 with standard bushings, arcing horns, and lifting lugs as per latest IS standards.",
    },
    {
      code: "TX-5005",
      description:
        "500 kVA, 33/11 kV, 3-Phase Power Transformer with On-Load Tap Changer (OLTC), Oil Natural Air Natural Cooling, suitable for grid substation applications, complete with conservator, radiators, and marshalling box.",
    },
    {
      code: "CT-150",
      description:
        "150 Amp Current Transformer (CT), 11 kV Indoor Resin Cast Type, Class 1 accuracy, 5P10 protection class, suitable for metering and protection applications in medium voltage switchgear panels.",
    },
    {
      code: "PT-11KV",
      description:
        "11 kV Single Phase Potential Transformer (PT), Oil Immersed Outdoor Type, with Class 0.5 accuracy for metering and protection, designed for long life and reliable voltage measurement in distribution networks.",
    },
  ];
};

const AddDeliveryChalan = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const today = new Date();

  const dummyData = getDummyFinalInspectionDetails();

  const dummyConsignee = getDummyConsigneeDetails();

  const dummyMaterialDescriptions = getDummyMaterialDescriptions();

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
  const [selectedTransformers, setSelectedTransformers] = useState([]);

  const handleTNChange = (tnNumber) => {
    setSelectedTN(tnNumber);

    const record = dummyData.find(
      (item) => item.deliverySchedule.tnNumber === tnNumber
    );

    if (record) {
      setSelectedRecord(record);

      // auto-filled fields
      setDiNo(record.diNo);
      setDiDate(dayjs(record.diDate));
      setInspectionDate(dayjs(record.inspectionDate));
      setInspectionOfficers(record.inspectionOfficers.join(", "));
      setPoNo(record.deliverySchedule.poDetails);
      setPoDate(dayjs(record.deliverySchedule.poDate));
      setSerialNumber(record.snNumber);
      setChalanDescription(record.deliverySchedule.description);

      // ✅ VERY IMPORTANT
      setSelectedTransformers([]); // reset on TN change
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

  const [consigneeName, setConsigneeName] = useState("");
  const [selectedConsigneeRecord, setSelectedConsigneeRecord] = useState(null);
  const [consigneeAddress, setConsigneeAddress] = useState("");
  const [consigneeGSTNo, setConsigneeGSTNo] = useState("");

  const handleConsigneeChange = (event) => {
    const selectedName = event.target.value;
    setConsigneeName(selectedName);

    const record = dummyConsignee.find((item) => item.name === selectedName);
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
  const [selectedMaterialCode, setSelectedMaterialCode] = useState("");

  const handleMaterialSelect = (code) => {
    setSelectedMaterialCode(code);

    const record = dummyMaterialDescriptions.find((item) => item.code === code);
    if (record) {
      setMaterialDescription(record.description); // Fill the whole description
    } else {
      setMaterialDescription("");
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const selectedSubSerialNumbers =
      selectedRecord?.subSerialNo
        ?.filter((s) => selectedTransformers.includes(s.id))
        .map((s) => s.serialNo) || [];

    const data = {
      ...selectedRecord,
      challanNo,
      consignorName,
      consigneeAddress,
      consignorPhoneNo,
      consigneeGSTNo,
      consignorEmail,
      ...selectedConsigneeRecord,
      materialDescription,
      challanCreatedAt: dayjs().format("YYYY-MM-DD"),

      // ✅ FINAL, TN-WISE SUB SERIALS
      subSerialNo: selectedSubSerialNumbers,
    };

    console.log("Transformer Delivery Chalan Details", data);
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
                  {dummyData.map((tn) => (
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
                            selectedRecord?.subSerialNo.find((s) => s.id === id)
                              ?.serialNo || ""
                        )
                        .join(", ")
                    }
                    disabled={!selectedRecord?.subSerialNo?.length}
                  >
                    {selectedRecord?.subSerialNo?.map((s) => (
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
                  value={consigneeName}
                  onChange={handleConsigneeChange}
                >
                  {dummyConsignee.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
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
                  //onChange={(e) => setChallanDescription(e.target.value)}
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
                  value={selectedMaterialCode}
                  onChange={(e) => handleMaterialSelect(e.target.value)}
                  margin="normal"
                >
                  {dummyMaterialDescriptions.map((item) => {
                    const firstSixWords = item.description
                      .split(" ")
                      .slice(0, 6)
                      .join(" ");
                    return (
                      <MenuItem key={item.code} value={item.code}>
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
                >
                  <FaCloudUploadAlt />
                  {isLoading ? (
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
