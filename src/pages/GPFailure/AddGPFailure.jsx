import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addMonths, format, isAfter } from "date-fns";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { MyContext } from "../../App";

// Dummy Data
export const dummyDeliveryChalans = [
  {
    id: "1",
    finalInspectionDetail: {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        poDetails: "PO-12345",
        poDate: "2025-05-10",
        rating: "100",
        guaranteePeriodMonths: 1,
        description:
          "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      nominationLetterNo: "NL/2025/001",
      nominationDate: "2025-07-10",
      inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
      inspectionDate: "2025-07-13",
      inspectedQuantity: 100,
      total: 120,
      diNo: "DI/2025/1001",
      diDate: "2025-07-16",
      shealingDetails: [
        { trfsiNo: 4907, polySealNo: "IAJ 5301 To IAJ 5302" },
        { trfsiNo: 4908, polySealNo: "IAJ 5303 To IAJ 5304" },
        { trfsiNo: 4909, polySealNo: "IAJ 5305 To IAJ 5306" },
        { trfsiNo: 4910, polySealNo: "IAJ 5307 To IAJ 5308" },
        { trfsiNo: 4911, polySealNo: "IAJ 5309 To IAJ 5310" },
      ],
    },
    subSerialNumberFrom: 4907,
    subSerialNumberTo: 4909,
    challanNo: "CH-1001",
    createdAt: "2025-06-22",
    consignorName: "PowerTech Transformers Pvt. Ltd.",
    consignorPhone: "9876543210",
    consignorAddress: "Plot 12, Industrial Zone, Mumbai",
    consignorGST: "27AAACP1234F1Z5",
    consignorEmail: "powertech@gmail.com",
    consigneeDetails: {
      id: "2",
      name: "ABC Power Solutions Pvt. Ltd.",
      address:
        "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
      gstNo: "06ABCDE1234F1Z5",
    },
    lorryNo: "MH12AB1234",
    truckDriverName: "Ramesh Yadav",
    materialDescription: {
      materialName: "150 Amp Current Transformer (CT)",
      phase: "11 KV",
      description:
        "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
    },
  },
  {
    id: "2",
    finalInspectionDetail: {
      id: "2",
      deliverySchedule: {
        tnNumber: "TN-002",
        poDetails: "PO-54321",
        poDate: "2025-06-01",
        rating: "200",
        guaranteePeriodMonths: 36,
        description:
          "Challan for delivery of copper wound distribution transformers with standard bushings and fittings.",
      },
      offeredDate: "2025-07-20",
      offeredQuantity: 150,
      serialNumberFrom: 6001,
      serialNumberTo: 6005,
      snNumber: "6001 TO 6005",
      nominationLetterNo: "NL/2025/002",
      nominationDate: "2025-07-18",
      inspectionOfficers: ["Arun Singh", "Meena Gupta"],
      inspectionDate: "2025-07-22",
      inspectedQuantity: 75,
      total: 80,
      diNo: "DI/2025/1002",
      diDate: "2025-07-25",
      shealingDetails: [
        { trfsiNo: 6001, polySealNo: "IAJ 5311 To IAJ 5312" },
        { trfsiNo: 6002, polySealNo: "IAJ 5313 To IAJ 5314" },
        { trfsiNo: 6003, polySealNo: "IAJ 5315 To IAJ 5316" },
        { trfsiNo: 6004, polySealNo: "IAJ 5317 To IAJ 5318" },
        { trfsiNo: 6005, polySealNo: "IAJ 5319 To IAJ 5320" },
      ],
    },
    subSerialNumberFrom: 6001,
    subSerialNumberTo: 6003,
    challanNo: "CH-1002",
    createdAt: "2025-07-28",
    consignorName: "Delta Power Equipments Ltd.",
    consignorPhone: "9811122233",
    consignorAddress: "Sector 24, Industrial Estate, Pune",
    consignorGST: "27DELT1234K9Z8",
    consignorEmail: "contact@deltapower.com",
    consigneeDetails: {
      id: "3",
      name: "XYZ Electricals Ltd.",
      address: "B-56, Industrial Phase 2, Noida, Uttar Pradesh - 201301",
      gstNo: "09XYZEL2345Q1W8",
    },
    lorryNo: "DL01CD5678",
    truckDriverName: "Amit Kumar",
    materialDescription: {
      materialName: "200 kVA Copper Wound Distribution Transformer",
      phase: "200 KVA",
      description:
        "200 kVA, 11/0.433 kV, 3-Phase, ONAN cooled, energy efficient distribution transformer as per IS standards.",
    },
  },
  {
    id: "3",
    finalInspectionDetail: {
      id: "3",
      deliverySchedule: {
        tnNumber: "TN-003",
        poDetails: "PO-67890",
        poDate: "2025-06-15",
        rating: "50",
        guaranteePeriodMonths: 18,
        description:
          "Challan for supply of power transformers with OLTC, conservator, and radiators suitable for substation application.",
      },
      offeredDate: "2025-07-30",
      offeredQuantity: 80,
      serialNumberFrom: 7001,
      serialNumberTo: 7003,
      snNumber: "7001 TO 7003",
      nominationLetterNo: "NL/2025/003",
      nominationDate: "2025-07-27",
      inspectionOfficers: ["Deepak Nair", "Shalini Verma"],
      inspectionDate: "2025-08-01",
      inspectedQuantity: 40,
      total: 42,
      diNo: "DI/2025/1003",
      diDate: "2025-08-04",
      shealingDetails: [
        { trfsiNo: 7001, polySealNo: "IAJ 5321 To IAJ 5322" },
        { trfsiNo: 7002, polySealNo: "IAJ 5323 To IAJ 5324" },
        { trfsiNo: 7003, polySealNo: "IAJ 5325 To IAJ 5326" },
      ],
    },
    subSerialNumberFrom: 7001,
    subSerialNumberTo: 7002,
    challanNo: "CH-1003",
    createdAt: "2025-08-05",
    consignorName: "ElectroFab Transformers",
    consignorPhone: "9753124680",
    consignorAddress: "GIDC Industrial Area, Ahmedabad",
    consignorGST: "24ELEC1234G1R6",
    consignorEmail: "sales@electrofab.com",
    consigneeDetails: {
      id: "4",
      name: "Northern Grid Corporation",
      address: "NH-8, Power Hub, Jaipur, Rajasthan - 302012",
      gstNo: "08NGC12345L6M9",
    },
    lorryNo: "RJ14EF9876",
    truckDriverName: "Karan Patel",
    materialDescription: {
      materialName: "500 kVA Power Transformer",
      phase: "500 KVA",
      description:
        "500 kVA, 33/11 kV, 3-Phase transformer with OLTC, ONAN cooling, conservator and marshalling box for grid substation use.",
    },
  },
  {
    id: "4",
    finalInspectionDetail: {
      id: "4",
      deliverySchedule: {
        tnNumber: "TN-004",
        poDetails: "PO-99887",
        poDate: "2025-06-20",
        rating: "150",
        guaranteePeriodMonths: 30,
        description:
          "Challan for supply of oil immersed potential transformers designed for metering and protection.",
      },
      offeredDate: "2025-08-03",
      offeredQuantity: 120,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      nominationLetterNo: "NL/2025/004",
      nominationDate: "2025-08-01",
      inspectionOfficers: ["Anita Das", "Rahul Mehta"],
      inspectionDate: "2025-08-06",
      inspectedQuantity: 60,
      total: 65,
      diNo: "DI/2025/1004",
      diDate: "2025-08-08",
      shealingDetails: [
        { trfsiNo: 4907, polySealNo: "IAJ 5401 To IAJ 5402" },
        { trfsiNo: 4908, polySealNo: "IAJ 5403 To IAJ 5404" },
        { trfsiNo: 4909, polySealNo: "IAJ 5405 To IAJ 5406" },
        { trfsiNo: 4910, polySealNo: "IAJ 5407 To IAJ 5408" },
        { trfsiNo: 4911, polySealNo: "IAJ 5409 To IAJ 5410" },
      ],
    },
    subSerialNumberFrom: 4907,
    subSerialNumberTo: 4910,
    challanNo: "CH-1004",
    createdAt: "2025-08-09",
    consignorName: "PrimeVolt Pvt. Ltd.",
    consignorPhone: "9988776655",
    consignorAddress: "Plot 88, Electronic City, Bengaluru",
    consignorGST: "29PRIM1234H7Z0",
    consignorEmail: "info@primevolt.com",
    consigneeDetails: {
      id: "5",
      name: "Southern Discom Ltd.",
      address: "Electric House, Mount Road, Chennai - 600002",
      gstNo: "33SDIS2345N8B7",
    },
    lorryNo: "KA05GH4567",
    truckDriverName: "Suresh Reddy",
    materialDescription: {
      materialName: "11 kV Potential Transformer (PT)",
      phase: "11 KV",
      description:
        "11 kV oil immersed outdoor PT, Class 0.5 accuracy, designed for protection and metering applications.",
    },
  },
  {
    id: "5",
    finalInspectionDetail: {
      id: "5",
      deliverySchedule: {
        tnNumber: "TN-005",
        poDetails: "PO-11122",
        poDate: "2025-07-01",
        rating: "250",
        guaranteePeriodMonths: 24,
        description:
          "Challan for supply of resin cast current transformers suitable for medium voltage switchgear.",
      },
      offeredDate: "2025-08-12",
      offeredQuantity: 300,
      serialNumberFrom: 9001,
      serialNumberTo: 9004,
      snNumber: "9001 TO 9004",
      nominationLetterNo: "NL/2025/005",
      nominationDate: "2025-08-10",
      inspectionOfficers: ["Vikram Joshi", "Pooja Thakur"],
      inspectionDate: "2025-08-14",
      inspectedQuantity: 150,
      total: 155,
      diNo: "DI/2025/1005",
      diDate: "2025-08-16",
      shealingDetails: [
        { trfsiNo: 9001, polySealNo: "IAJ 5335 To IAJ 5336" },
        { trfsiNo: 9002, polySealNo: "IAJ 5337 To IAJ 5338" },
        { trfsiNo: 9003, polySealNo: "IAJ 5339 To IAJ 5340" },
        { trfsiNo: 9004, polySealNo: "IAJ 5341 To IAJ 5342" },
      ],
    },
    subSerialNumberFrom: 9001,
    subSerialNumberTo: 9003,
    challanNo: "CH-1005",
    createdAt: "2025-08-18",
    consignorName: "VoltSafe Industries",
    consignorPhone: "9090909090",
    consignorAddress: "MIDC Industrial Estate, Nagpur",
    consignorGST: "27VSIN1234P9K8",
    consignorEmail: "support@voltsafe.com",
    consigneeDetails: {
      id: "6",
      name: "Western Power Supply Ltd.",
      address: "Shivaji Nagar, Pune - 411005",
      gstNo: "27WPSL5678Q1R2",
    },
    lorryNo: "MH20JK7890",
    truckDriverName: "Naresh Pawar",
    materialDescription: {
      materialName: "150 Amp Resin Cast Current Transformer",
      phase: "150 Amp",
      description:
        "150 Amp, 11 kV resin cast CT, Class 1 accuracy, 5P10 protection class, used in medium voltage panels.",
    },
  },
];

const AddGPFailureInformation = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox } = context;

  const [trfsiNo, setTrfsiNo] = useState("");
  const [rating, setRating] = useState("");
  const [selectedChalan, setSelectedChalan] = useState(null);
  const [subDivision, setSubDivision] = useState("");

  const [trfFailureList, setTrfFailureList] = useState([]);
  const [trfFailureDate, setTrfFailureDate] = useState(null);
  const [dateOfInformation, setDateOfInformation] = useState(null);
  const [placeWhereFailed, setPlaceWhereFailed] = useState("");

  // 🔹 Auto fetch whenever trfsiNo and rating are set
  useEffect(() => {
    if (trfsiNo && rating) {
      const found = dummyDeliveryChalans.find((ch) => {
        const hasTrfsi = ch.finalInspectionDetail.shealingDetails.some(
          (s) => String(s.trfsiNo) === String(trfsiNo)
        );
        const sameRating =
          ch.finalInspectionDetail.deliverySchedule.rating
            .toLowerCase()
            .trim() === rating.toLowerCase().trim();

        return hasTrfsi && sameRating;
      });

      setSelectedChalan(found || null);
    } else {
      setSelectedChalan(null);
    }
  }, [trfsiNo, rating]);

  // Add trffailurelist to array
  const handleAddTRFFailureDetails = () => {
    if (!trfFailureDate || !dateOfInformation || !placeWhereFailed) return; // simple validation

    const newItem = {
      failureDate: dayjs(trfFailureDate).format("YYYY-MM-DD"),
      informationDate: dayjs(dateOfInformation).format("YYYY-MM-DD"),
      place: placeWhereFailed,
    };

    setTrfFailureList((prev) => [...prev, newItem]);
    setPlaceWhereFailed(""); // clear input
    setTrfFailureDate(null); // clear date
    setDateOfInformation(null);
  };

  // Remove particular trffailuredata from array
  const handleRemoveTRFFailureData = (index) => {
    setTrfFailureList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data = {
      trfsiNo,
      rating,
      selectedChalan,
      trfFailureList,
    };
    if (data) {
      console.log("Submitted DeliveryChalan: ", data);
      alert("Failure information stored successfully!");
    } else {
      alert("No matching record found.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Add GP Failure Information
          </Typography>

          {/* Input Section */}
          <Grid container spacing={2} columns={{ xs: 1, sm: 1, lg: 3, md: 3 }} sx={{ mb: 3 }}>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="TRFSI No"
                variant="outlined"
                value={trfsiNo}
                onChange={(e) => setTrfsiNo(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Rating"
                variant="outlined"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                fullWidth
                label="Sub-division"
                variant="outlined"
                value={subDivision}
                onChange={(e) => setSubDivision(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Autofilled Details */}
          {selectedChalan &&
            (() => {
              const challanDate = new Date(selectedChalan.createdAt);
              const guaranteeMonths =
                selectedChalan.finalInspectionDetail.deliverySchedule
                  .guaranteePeriodMonths;

              // Expiry = challanCreatedDate + guaranteePeriodMonths
              const expiryDate = addMonths(challanDate, guaranteeMonths);

              // Status check
              const today = new Date();
              const isUnderGuarantee = isAfter(expiryDate, today);

              return (
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    bgcolor: "#f9f9f9",
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom color="secondary">
                    Transformer Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Material Name"
                        value={selectedChalan.materialDescription.materialName}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="TN Number"
                        value={
                          selectedChalan.finalInspectionDetail.deliverySchedule
                            .tnNumber
                        }
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="DI No"
                        value={selectedChalan.finalInspectionDetail.diNo}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="DI Date"
                        value={selectedChalan.finalInspectionDetail.diDate}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Challan No"
                        value={selectedChalan.challanNo}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Challan Created Date"
                        value={selectedChalan.createdAt}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Consignee Name"
                        value={selectedChalan.consigneeDetails.name}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Guarantee Period (Months)"
                        value={guaranteeMonths}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    {/* New Fields */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Guarantee Expiry Date"
                        value={format(expiryDate, "yyyy-MM-dd")}
                        fullWidth
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Guarantee Status"
                        value={isUnderGuarantee ? "Under Guarantee" : "Expired"}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                          style: {
                            color: isUnderGuarantee ? "green" : "red",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              );
            })()}

          {/* Input Section */}
          <Grid
            container
            spacing={2}
            columns={{ xs: 1, sm: 1, lg: 3, md: 3 }}
            sx={{ mb: 3, mt: 3 }}
          >
            <Grid item size={1}>
              <TextField
                label="place Where Failed"
                fullWidth
                value={placeWhereFailed}
                onChange={(e) => setPlaceWhereFailed(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <DatePicker
                label="Information Date"
                value={dateOfInformation}
                onChange={(date) =>
                  setDateOfInformation(date ? dayjs(date) : null)
                }
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <Box display="flex" gap={1}>
                <DatePicker
                  label="TFR Failure Date"
                  value={trfFailureDate}
                  onChange={(date) =>
                    setTrfFailureDate(date ? dayjs(date) : null)
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddTRFFailureDetails}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            {/* Show List of Failures in Table */}
            {trfFailureList.length > 0 && (
              <Grid item size={12}>
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#1976d2" }}>
                      <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          #
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Failure Date
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Information Date
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                          Place
                        </TableCell>
                        <TableCell
                          sx={{ color: "white", fontWeight: "bold" }}
                          align="center"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trfFailureList.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#f9f9f9",
                            },
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.failureDate}</TableCell>
                          <TableCell>{item.informationDate}</TableCell>
                          <TableCell>{item.place}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveTRFFailureData(index)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>

          {/* Submit Button */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
            >
              Submit Failure Info
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddGPFailureInformation;
