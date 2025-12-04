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
import GPExtendedWarrantyFilter from "../../components/MisGP/GPExtendedWarrantyFilter";

const newGPTransformersData = () => {
  const rawData = [
    {
      id: "1",
      tfrSrNo: 4007,
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "10",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
        wound: "Copper",
      },
      inspetionDate: "10-07-2025",
      gpExpiryDateAsPerOriginalSupply: "15-08-2024",
      remainingOriginalGuranteePeriod: 60,
      tranformersNotInService: 120,
      extendedWarranty: 24,
      companyName: "Kalpana Industries",
      discom: "Ajmer",
    },
    {
      id: "8",
      tfrSrNo: 4012,
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Three Phase",
        wound: "Aluminium",
      },
      inspetionDate: "12-08-2025",
      gpExpiryDateAsPerOriginalSupply: "20-09-2024",
      remainingOriginalGuranteePeriod: 90,
      tranformersNotInService: 50,
      extendedWarranty: 36,
      companyName: "Kalpana Industries",
      discom: "Ajmer",
    },
    {
      id: "2",
      tfrSrNo: 4015,
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Three Phase",
        wound: "Copper",
      },
      inspetionDate: "14-08-2025",
      gpExpiryDateAsPerOriginalSupply: "20-09-2024",
      remainingOriginalGuranteePeriod: 90,
      tranformersNotInService: 30,
      extendedWarranty: 36,
      companyName: "Kalpana Industries",
      discom: "Jaipur",
    },
    {
      id: "3",
      tfrSrNo: 4020,
      deliverySchedule: {
        tnNumber: "TN-003",
        rating: "16",
        guaranteePeriodMonths: 18,
        phase: "Three Phase",
        wound: "Aluminium",
      },
      inspetionDate: "16-09-2025",
      gpExpiryDateAsPerOriginalSupply: "25-10-2024",
      remainingOriginalGuranteePeriod: 30,
      tranformersNotInService: 10,
      extendedWarranty: 45,
      companyName: "Kalpana Industries",
      discom: "Jodhpur",
    },
    {
      id: "4",
      tfrSrNo: 4025,
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "5",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
        wound: "Copper",
      },
      inspetionDate: "18-09-2025",
      gpExpiryDateAsPerOriginalSupply: "15-08-2024",
      remainingOriginalGuranteePeriod: 60,
      tranformersNotInService: 20,
      extendedWarranty: 24,
      companyName: "Yash Granties",
      discom: "Ajmer",
    },
    {
      id: "5",
      tfrSrNo: 4030,
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Power",
        wound: "Aluminium",
      },
      inspetionDate: "12-09-2025",
      gpExpiryDateAsPerOriginalSupply: "20-09-2024",
      remainingOriginalGuranteePeriod: 90,
      tranformersNotInService: 40,
      extendedWarranty: 180,
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
  return rawData;
};

const GPExtendedWarrantyInformation = () => {
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
          G.P. Extended Warranty Information
        </Typography>
      </Box>

      <GPExtendedWarrantyFilter
        onFilteredData={setFilteredData}
        data={inspectionData}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          G.P. Table
        </Typography>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" aria-label="final-inspection-table">
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Tfr Sr No.</TableCell>
                <TableCell>TN NO.</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>GP Expiry Date As Per Original Supply</TableCell>
                <TableCell>Remaining Original Gurantee Period</TableCell>
                <TableCell>Transformers Not In Services</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Extended Warranty</TableCell>
                <TableCell>Final GP Expiry Date</TableCell>
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
                    <TableCell>{row.tfrSrNo}</TableCell>
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>{row.gpExpiryDateAsPerOriginalSupply}</TableCell>
                    <TableCell>
                      {row.remainingOriginalGuranteePeriod} Months
                    </TableCell>
                    <TableCell>{row.tranformersNotInService} Months</TableCell>
                    <TableCell>
                      {row.remainingOriginalGuranteePeriod +
                        row.tranformersNotInService}{" "}
                      Months
                    </TableCell>
                    <TableCell>{row.extendedWarranty} Months</TableCell>
                    {/* ✅ Last column: show the higher value */}
                    <TableCell>
                      {Math.max(
                        row.remainingOriginalGuranteePeriod +
                          row.tranformersNotInService,
                        row.extendedWarranty
                      )}{" "}
                      Months
                    </TableCell>
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

export default GPExtendedWarrantyInformation;
