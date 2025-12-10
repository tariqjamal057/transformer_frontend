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
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import SupplyGPExpiredStatementFilter from "../../components/MisGP/SupplyGPExpiredStatementFilter";

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
      totalReceivedUnderGPTillDate: 480,
      qtyBalance: 480,
      lastGPSupplyExpiryDate: "15-08-2024",
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
      totalReceivedUnderGPTillDate: 290,
      qtyBalance: 290,
      lastGPSupplyExpiryDate: "20-09-2024",
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
      totalReceivedUnderGPTillDate: 290,
      qtyBalance: 290,
      lastGPSupplyExpiryDate: "20-09-2024",
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
      totalReceivedUnderGPTillDate: 390,
      qtyBalance: 390,
      lastGPSupplyExpiryDate: "25-10-2024",
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
      totalReceivedUnderGPTillDate: 590,
      qtyBalance: 590,
      lastGPSupplyExpiryDate: "15-08-2024",
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
      totalReceivedUnderGPTillDate: 340,
      qtyBalance: 340,
      lastGPSupplyExpiryDate: "20-09-2024",
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
    return rawData;
};

const SupplyGPExpiredStatement = () => {
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
            Supply G.P. Expired Statement
        </Typography>
      </Box>

      <SupplyGPExpiredStatementFilter
        onFilteredData={setFilteredData}
        data={inspectionData}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          Supply G.P. Expired Statement
        </Typography>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" aria-label="final-inspection-table">
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Firm</TableCell>
                <TableCell>Discom</TableCell>
                <TableCell>TN NO.</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>G.P. Tfrs received up to date</TableCell>
                <TableCell>Qty Balance</TableCell>
                <TableCell>Last Supply GP Expiry Date</TableCell>
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
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>{row.totalReceivedUnderGPTillDate}</TableCell>
                    <TableCell>{row.qtyBalance}</TableCell>
                    <TableCell>{row.lastGPSupplyExpiryDate}</TableCell>
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

export default SupplyGPExpiredStatement;
