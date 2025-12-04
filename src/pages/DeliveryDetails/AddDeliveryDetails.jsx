import { useContext, useState } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MyContext } from "../../App";

const deliveryChalanData = [
  {
    id: "101",
    trData: {
      id: "2",
      tnId: { id: "1", name: "TN-001" },
      serialNumber: "SR-1001",
      diNo: "DI-001",
      diDate: "2025-07-15",
      inspectionOfficers: [
        { name: "A. Kumar", designation: "Sr. Engineer" },
        { name: "P. Verma", designation: "Inspector" },
      ],
      inspectionDate: "2025-07-18",
      totalQuantity: 100,
      suppliedQuantity: 85,
      gpExpiryDate: "2026-07-24",
    },
    poNumber: "PO-5454",
    poDate: "2025-08-21",
    challanNo: "CH-1001",
    challanDate: "2025-07-22",
    consignorName: "PowerTech Transformers Pvt. Ltd.",
    consignorPhone: "9876543210",
    consignorAddress: "Plot 12, Industrial Zone, Mumbai",
    consignorGST: "27AAACP1234F1Z5",
    consigneeName: "State Electricity Board",
    consigneeAddress: "Substation Road, Pune",
    consigneeGST: "27SEB0001F2Z3",
    lorryNo: "MH12AB1234",
    truckDriverName: "Ramesh Yadav",
    deliveryChallanDescription: "Delivery of 3-phase oil-cooled transformer",
    materialDescription:
      "500 KVA 11/0.433 kV Distribution Transformer, Copper Wound, BIS Certified",
  },
  {
    id: "102",
    trData: {
      id: "3",
      tnId: { id: "1", name: "TN-001" },
      serialNumber: "SR-1002",
      diNo: "DI-002",
      diDate: "2025-07-16",
      inspectionOfficers: [
        { name: "R. Singh", designation: "Chief Inspector" },
        { name: "S. Mehra", designation: "Engineer" },
      ],
      inspectionDate: "2025-07-22",
      totalQuantity: 200,
      suppliedQuantity: 170,
      gpExpiryDate: "2026-08-12",
    },
    poNumber: "PO-5499",
    poDate: "2025-08-24",
    challanNo: "CH-1002",
    challanDate: "2025-07-28",
    consignorName: "MegaVolt Transformers Ltd.",
    consignorPhone: "9123456780",
    consignorAddress: "Sector 45, Electronic City, Bengaluru",
    consignorGST: "29MEGA1234G1Z9",
    consigneeName: "Northern Grid Corporation",
    consigneeAddress: "Grid Office, Delhi",
    consigneeGST: "07NGC0001F5Z6",
    lorryNo: "KA01CD5678",
    truckDriverName: "Sandeep Kumar",
    deliveryChallanDescription:
      "Delivery of transformer with testing certificates",
    materialDescription:
      "250 KVA 33/0.433 kV Distribution Transformer, Aluminum Wound, Outdoor Type",
  },
];

const AddDeliveryDetails = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const [selectedDI, setSelectedDI] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [recieptedChallanNo, setRecieptedChallanNo] = useState("");
  const [recieptedChallanDate, setRecieptedChallanDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDIChange = (event) => {
    const diNo = event.target.value;
    setSelectedDI(diNo);

    // find the record
    const record = deliveryChalanData.find((item) => item.trData.diNo === diNo);
    setSelectedData(record || null);
  };

  // Handle Submit
  const handleSubmit = () => {
    if (!selectedData) {
      alert("Please select a DI Number first.");
      return;
    }

    const data = {
        deliveryChalanId: selectedData.id,
        gpExpiry: selectedData.trData.gpExpiryDate,
        recieptedChallanNo,
        recieptedChallanDate: dayjs(recieptedChallanDate).format("YYYY-MM-DD"),
    }

    // Store or process the selected data
    console.log("Selected Delivery Details:", data);

    
    alert(`Delivery Chalan ID ${selectedData.id} saved successfully!`);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="right-content w-100">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Add Delivery Details
            </Typography>

            <Stack spacing={2}>
              {/* DI Dropdown */}
              <TextField
                select
                label="DI No"
                value={selectedDI}
                onChange={handleDIChange}
                fullWidth
              >
                {deliveryChalanData.map((item) => (
                  <MenuItem key={item.id} value={item.trData.diNo}>
                    {item.trData.diNo}
                  </MenuItem>
                ))}
              </TextField>

              {/* Auto-Populated Fields */}
              {selectedData && (
                <>
                  <TextField
                    label="DI Date"
                    value={dayjs(selectedData.trData.diDate).format(
                      "YYYY-MM-DD"
                    )}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Challan No"
                    value={selectedData.challanNo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Challan Date"
                    value={dayjs(selectedData.challanDate).format("YYYY-MM-DD")}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Consignee Name"
                    value={selectedData.consigneeName}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Total Quantity"
                    value={selectedData.trData.totalQuantity}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Supplied Quantity"
                    value={selectedData.trData.suppliedQuantity}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Transformer Serial No"
                    value={selectedData.trData.serialNumber}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="GP Expiry Date"
                    value={dayjs(selectedData.trData.gpExpiryDate).format(
                      "YYYY-MM-DD"
                    )}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </>
              )}

              <TextField
                label="Receipt Challan No"
                value={recieptedChallanNo}
                fullWidth
                onChange={(e) => setRecieptedChallanNo(e.target.value)}
              />

              <DatePicker
                label="Receipt Challan Date"
                //minDate={today}
                value={recieptedChallanDate}
                onChange={setRecieptedChallanDate}
                slotProps={{ textField: { fullWidth: true } }}
              />

              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-4 d-flex"
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
            </Stack>
          </Paper>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default AddDeliveryDetails;
