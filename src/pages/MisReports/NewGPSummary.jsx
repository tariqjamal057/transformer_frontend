// MaterialOfferedPage.jsx
import { useContext, useEffect, useMemo, useState } from "react";
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
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import NewGPSummaryFilter from "../../components/MisGP/NewGPSummaryFilter";

const newGPTransformersData = () => {
  const rawData = [
    {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "10",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
        wound: "Copper",
      },
      totalSuppliedNewTillDate: 500,
      totalReceivedUnderGPTillDate: 480,
      totalInspectedTillDate: 470,
      totalDispatchedTillDate: 460,
      gpTierBalanceNow: 300,
      gpReceiptInMonth: 200,
      gpDispatchInMonth: 150,
      gpInspectedInMonth: 180,
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
        wound: "Aluminium",
      },
      totalSuppliedNewTillDate: 300,
      totalReceivedUnderGPTillDate: 290,
      totalInspectedTillDate: 280,
      totalDispatchedTillDate: 270,
      gpTierBalanceNow: 350,
      gpReceiptInMonth: 400,
      gpDispatchInMonth: 350,
      gpInspectedInMonth: 380,
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
        wound: "Copper",
      },
      totalSuppliedNewTillDate: 300,
      totalReceivedUnderGPTillDate: 290,
      totalInspectedTillDate: 280,
      totalDispatchedTillDate: 270,
      gpTierBalanceNow: 180,
      gpReceiptInMonth: 240,
      gpDispatchInMonth: 220,
      gpInspectedInMonth: 230,
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
        wound: "Aluminium",
      },
      totalSuppliedNewTillDate: 400,
      totalReceivedUnderGPTillDate: 390,
      totalInspectedTillDate: 380,
      totalDispatchedTillDate: 370,
      gpTierBalanceNow: 380,
      gpReceiptInMonth: 400,
      gpDispatchInMonth: 350,
      gpInspectedInMonth: 380,
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
        wound: "Copper",
      },
      totalSuppliedNewTillDate: 600,
      totalReceivedUnderGPTillDate: 590,
      totalInspectedTillDate: 580,
      totalDispatchedTillDate: 570,
      gpTierBalanceNow: 320,
      gpReceiptInMonth: 260,
      gpDispatchInMonth: 230,
      gpInspectedInMonth: 250,
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
        wound: "Aluminium",
      },
      totalSuppliedNewTillDate: 350,
      totalReceivedUnderGPTillDate: 340,
      totalInspectedTillDate: 330,
      totalDispatchedTillDate: 320,
      gpTierBalanceNow: 340,
      gpReceiptInMonth: 480,
      gpDispatchInMonth: 450,
      gpInspectedInMonth: 480,
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
  // ✅ Compute derived fields automatically
  return rawData.map((item) => ({
    ...item,
    inspectedPendingToBeDelivered:
      item.totalReceivedUnderGPTillDate - item.totalDispatchedTillDate,
  }));
};

const NewGPSummary = () => {
  const navigate = useNavigate("");

  const { setIsHideSidebarAndHeader } = useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, [setIsHideSidebarAndHeader]);

  const [filteredData, setFilteredData] = useState([]);

  const inspectionData = useMemo(() => newGPTransformersData(), []);

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
          onClick={() => navigate("/new-gp-transformers")}
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
          New GP Summary
        </Typography>
      </Box>

      <NewGPSummaryFilter
        onFilteredData={setFilteredData}
        data={inspectionData}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          New GP Summary
        </Typography>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" aria-label="final-inspection-table">
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Firm</TableCell>
                <TableCell>Discom</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>Total Qty Supplied (New) Till Date</TableCell>
                <TableCell>Total Qty Received Under G.P. Till Date</TableCell>
                <TableCell>Total Qty Inspected Till Date</TableCell>
                <TableCell>Total Qty Dispatched Till Date</TableCell>
                <TableCell>GP Tfr. Balance Now</TableCell>
                <TableCell>Inspected Pending To Be Delivered</TableCell>
                <TableCell>GP Receipt In Month</TableCell>
                <TableCell>GP Dispatch In Month</TableCell>
                <TableCell>GP Inspected In Month</TableCell>
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
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.discom}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>{row.totalSuppliedNewTillDate}</TableCell>
                    <TableCell>{row.totalReceivedUnderGPTillDate}</TableCell>
                    <TableCell>{row.totalInspectedTillDate}</TableCell>
                    <TableCell>{row.totalDispatchedTillDate}</TableCell>
                    <TableCell>{row.gpTierBalanceNow}</TableCell>
                    <TableCell>{row.inspectedPendingToBeDelivered}</TableCell>
                    <TableCell>{row.gpReceiptInMonth}</TableCell>
                    <TableCell>{row.gpDispatchInMonth}</TableCell>
                    <TableCell>{row.gpInspectedInMonth}</TableCell>
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

export default NewGPSummary