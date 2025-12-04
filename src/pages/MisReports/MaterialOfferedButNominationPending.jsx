// MaterialOfferedPage.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Box,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import FiltersComponent from "../../components/FinalInspectionFilter";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

export const getDummyFinalInspectionDetails = () => {
  return [
    {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "10",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      companyName: "Kalpana Industries",
      discom: "Ajmer",
    },
    {
      id: "8",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Three Phase",
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      companyName: "Kalpana Industries",
      discom: "Ajmer",
    },
    {
      id: "2",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Three Phase",
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      companyName: "Kalpana Industries",
      discom: "Jaipur",
    },
    {
      id: "3",
      deliverySchedule: {
        tnNumber: "TN-003",
        rating: "16",
        guaranteePeriodMonths: 18,
        phase: "Three Phase",
      },
      offeredDate: "2025-08-15",
      offeredQuantity: 300,
      serialNumberFrom: 4917,
      serialNumberTo: 4922,
      snNumber: "4917 TO 4922",
      companyName: "Kalpana Industries",
      discom: "Jodhpur",
    },
    {
      id: "4",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "5",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      companyName: "Yash Granties",
      discom: "Ajmer",
    },
    {
      id: "5",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Power",
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
};

export const companies = [
  {
    id: 1,
    name: "Kalpana Industries",
  },
  {
    id: 2,
    name: "Yash Granties",
  },
  {
    id: 3,
    name: "Kalpana Granties",
  },
];

export const discoms = [
  {
    id: 1,
    name: "Ajmer",
    company: {
      id: "1",
      name: "Kalpana Industries",
    },
  },
  {
    id: 2,
    name: "Jaipur",
    company: {
      id: "1",
      name: "Kalpana Industries",
    },
  },
  {
    id: 3,
    name: "Jodhpur",
    company: {
      id: "1",
      name: "Kalpana Industries",
    },
  },
  {
    id: 4,
    name: "Ajmer",
    company: {
      id: "2",
      name: "Yash Granties",
    },
  },
  {
    id: 5,
    name: "Jaipur",
    company: {
      id: "2",
      name: "Yash Granties",
    },
  },
  {
    id: 6,
    name: "Jodhpur",
    company: {
      id: "3",
      name: "Kalpana Granties",
    },
  },
];

export const deliverySchedules = [
  {
    tnNumber: "TN-001",
    rating: "10",
    guaranteePeriodMonths: 24,
    phase: "Single Phase",
    wound: "Copper",
    totalQuantity:1000,
    createdAt: "2025-08-15",
    companyName: "Kalpana Industries",
    discom: "Ajmer",
  },
  {
    tnNumber: "TN-001",
    rating: "10",
    guaranteePeriodMonths: 24,
    phase: "Three Phase",
    wound: "Aluminium",
    totalQuantity:2000,
    createdAt: "2025-08-10",
    companyName: "Kalpana Industries",
    discom: "Ajmer",
  },
  {
    tnNumber: "TN-001",
    rating: "25",
    guaranteePeriodMonths: 24,
    phase: "Three Phase",
    wound: "Copper",
    totalQuantity:3000,
    createdAt: "2025-07-28",
    companyName: "Kalpana Industries",
    discom: "Ajmer",
  },
  {
    tnNumber: "TN-002",
    rating: "25",
    guaranteePeriodMonths: 36,
    phase: "Three Phase",
    wound: "Copper",
    totalQuantity:1500,
    createdAt: "2025-07-15",
    companyName: "Kalpana Industries",
    discom: "Jaipur",
  },
  {
    tnNumber: "TN-003",
    rating: "16",
    guaranteePeriodMonths: 18,
    phase: "Three Phase",
    wound: "Aluminium",
    totalQuantity:800,
    createdAt: "2025-07-20",
    companyName: "Kalpana Industries",
    discom: "Jodhpur",
  },
  {
    tnNumber: "TN-001",
    rating: "5",
    guaranteePeriodMonths: 24,
    phase: "Single Phase",
    wound: "Copper",
    totalQuantity:1800,
    createdAt: "2025-07-01",
    companyName: "Yash Granties",
    discom: "Ajmer",
  },
  {
    tnNumber: "TN-002",
    rating: "25",
    guaranteePeriodMonths: 36,
    phase: "Power",
    wound: "Aluminium",
    totalQuantity:4000,
    createdAt: "2025-06-15",
    companyName: "Yash Granties",
    discom: "Jaipur",
  },
  {
    tnNumber: "TN-001",
    rating: "10",
    guaranteePeriodMonths: 24,
    phase: "Single Phase",
    wound: "Copper",
    totalQuantity:1200,
    createdAt: "2025-06-10",
    companyName: "Kalpana Granties",
    discom: "Jodhpur",
  },
];

const MaterialOfferedButNominationPending = () => {
  const navigate = useNavigate("");

  const { setIsHideSidebarAndHeader } = useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, [setIsHideSidebarAndHeader]);

  const [filteredData, setFilteredData] = useState([]);

  const inspectionData = useMemo(() => getDummyFinalInspectionDetails(), []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        {/* Back Button (left corner) */}
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/mis-reports")}
          sx={{
            position: "absolute",
            left: 0,
            borderRadius: "25px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Back
        </Button>

        {/* Center Title */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          Material Offered But Nomination Pending
        </Typography>
      </Box>

      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData}
        text= "Awaiting Nomination"
        onExportPDF={true} 
        onExportExcel={true}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          Nomination Pending Details
        </Typography>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" aria-label="final-inspection-table">
            <TableHead>
              <TableRow>
                <TableCell>Sr</TableCell>
                <TableCell>Offered Date</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Discom</TableCell>
                <TableCell>TN No</TableCell>
                <TableCell>Material Name</TableCell>
                <TableCell>Tfr. Serial No.</TableCell>
                <TableCell>Offered Qty</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {dayjs(row.offeredDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.discom}</TableCell>
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>
                      {row.deliverySchedule.rating} KVA{" "}
                      {row.deliverySchedule.phase}
                    </TableCell>
                    <TableCell>{row.snNumber}</TableCell>
                    <TableCell>{row.offeredQuantity}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default MaterialOfferedButNominationPending;
