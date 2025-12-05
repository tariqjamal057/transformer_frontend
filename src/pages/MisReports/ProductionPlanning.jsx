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
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import ProductionFilter from "../../components/ProductionFilter";

export const getDummyFinalInspectionDetails = () => {
  return [
    {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "10",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
        status: "Active",
        scheduleDate: "2025-07-01",
        totalOrderQuantity: 500,
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      companyName: "Kalpana Industries",
      discom: "Ajmer",

      quantityPerMonthInSchedule: 100,
      totalSupplyDueInCurrentMonth: 80,
      offeredForInspectionTotal: 200,
      finalInspectionTotal: 180,
      actualSuppliedTotal: 150,
      balanceDueToBeInspectedInCurrentMonth: 30,
      balancePending: 50,
      plannedForMonth: 120,
    },
    {
      id: "8",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Three Phase",
        status: "Deferred",
        scheduleDate: "2025-08-01",
        totalOrderQuantity: 800,
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      companyName: "Kalpana Industries",
      discom: "Ajmer",

      quantityPerMonthInSchedule: 200,
      totalSupplyDueInCurrentMonth: 100,
      offeredForInspectionTotal: 150,
      finalInspectionTotal: 140,
      actualSuppliedTotal: 120,
      balanceDueToBeInspectedInCurrentMonth: 20,
      balancePending: 60,
      plannedForMonth: 180,
    },
    {
      id: "2",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Three Phase",
        status: "Active",
        scheduleDate: "2025-08-10",
        totalOrderQuantity: 600,
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      companyName: "Kalpana Industries",
      discom: "Jaipur",

      quantityPerMonthInSchedule: 150,
      totalSupplyDueInCurrentMonth: 90,
      offeredForInspectionTotal: 150,
      finalInspectionTotal: 130,
      actualSuppliedTotal: 100,
      balanceDueToBeInspectedInCurrentMonth: 50,
      balancePending: 70,
      plannedForMonth: 160,
    },
    {
      id: "3",
      deliverySchedule: {
        tnNumber: "TN-003",
        rating: "16",
        guaranteePeriodMonths: 18,
        phase: "Three Phase",
        status: "Active",
        scheduleDate: "2025-08-15",
        totalOrderQuantity: 1000,
      },
      offeredDate: "2025-08-15",
      offeredQuantity: 300,
      serialNumberFrom: 4917,
      serialNumberTo: 4922,
      snNumber: "4917 TO 4922",
      companyName: "Kalpana Industries",
      discom: "Jodhpur",

      quantityPerMonthInSchedule: 300,
      totalSupplyDueInCurrentMonth: 150,
      offeredForInspectionTotal: 300,
      finalInspectionTotal: 270,
      actualSuppliedTotal: 200,
      balanceDueToBeInspectedInCurrentMonth: 100,
      balancePending: 200,
      plannedForMonth: 250,
    },
    {
      id: "4",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "5",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
        status: "Deferred",
        scheduleDate: "2025-07-20",
        totalOrderQuantity: 400,
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      companyName: "Yash Granties",
      discom: "Ajmer",

      quantityPerMonthInSchedule: 100,
      totalSupplyDueInCurrentMonth: 80,
      offeredForInspectionTotal: 200,
      finalInspectionTotal: 190,
      actualSuppliedTotal: 150,
      balanceDueToBeInspectedInCurrentMonth: 40,
      balancePending: 60,
      plannedForMonth: 120,
    },
    {
      id: "5",
      deliverySchedule: {
        tnNumber: "TN-002",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Power",
        status: "Active",
        scheduleDate: "2025-08-25",
        totalOrderQuantity: 700,
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      companyName: "Yash Granties",
      discom: "Jaipur",

      quantityPerMonthInSchedule: 200,
      totalSupplyDueInCurrentMonth: 120,
      offeredForInspectionTotal: 150,
      finalInspectionTotal: 140,
      actualSuppliedTotal: 100,
      balanceDueToBeInspectedInCurrentMonth: 60,
      balancePending: 80,
      plannedForMonth: 200,
    },
  ];
};

const SinglePhaseTable = () => {
  const rows = [
    { rating: "10 KVA", total: 300, supplyDue: 30, planning: 35 },
    { rating: "16 KVA", total: 250, supplyDue: 15, planning: 20 },
    { rating: "25 KVA", total: 400, supplyDue: 50, planning: 55 },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#cfd8dc",
          p: 1,
        }}
      >
        SINGLE PHASE TRANSFORMERS
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#dcedc8" }}>
              <TableCell sx={{ fontWeight: "bold" }}>RATING IN KVA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TOTAL ORDER</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                SUPPLY DUE IN CURRENT MONTH
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                PLANNING FOR PRODUCTION IN CURRENT MONTH
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.supplyDue}</TableCell>
                <TableCell>{row.planning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const PowerTransformerTable = () => {
  const rows = [
    { rating: "3150 KVA", total: 50, supplyDue: 5, planning: 6 },
    { rating: "5000 KVA", total: 30, supplyDue: 3, planning: 4 },
    { rating: "8000 KVA", total: 20, supplyDue: 2, planning: 3 },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#cfd8dc",
          p: 1,
        }}
      >
        POWER TRANSFORMERS
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#dcedc8" }}>
              <TableCell sx={{ fontWeight: "bold" }}>RATING IN KVA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TOTAL ORDER</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                SUPPLY DUE IN CURRENT MONTH
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                PLANNING FOR PRODUCTION IN CURRENT MONTH
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.supplyDue}</TableCell>
                <TableCell>{row.planning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const ThreePhaseTable = () => {
  const rows = [
    { rating: "10 KVA", total: 200, supplyDue: 15, planning: 18 },
    { rating: "16 KVA", total: 300, supplyDue: 20, planning: 22 },
    { rating: "25 KVA", total: 400, supplyDue: 25, planning: 28 },
    { rating: "40 KVA", total: 180, supplyDue: 8, planning: 10 },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#cfd8dc",
          p: 1,
        }}
      >
        THREE PHASE TRANSFORMERS
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#dcedc8" }}>
              <TableCell sx={{ fontWeight: "bold" }}>RATING IN KVA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TOTAL ORDER</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                SUPPLY DUE IN CURRENT MONTH
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                PLANNING FOR PRODUCTION IN CURRENT MONTH
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.supplyDue}</TableCell>
                <TableCell>{row.planning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const InverterDutyTable = () => {
  const rows = [
    { rating: "5.5 MVA", total: 40, supplyDue: 3, planning: 5 },
    { rating: "6.25 MVA", total: 25, supplyDue: 2, planning: 3 },
    { rating: "12.5 MVA", total: 15, supplyDue: 1, planning: 2 },
    { rating: "17.6 MVA", total: 10, supplyDue: 1, planning: 2 },
  ];

  return (
    <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#cfd8dc",
          p: 1,
        }}
      >
        INVERTER DUTY TRANSFORMERS
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#dcedc8" }}>
              <TableCell sx={{ fontWeight: "bold" }}>RATING IN MVA</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>TOTAL ORDER</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                SUPPLY DUE IN CURRENT MONTH
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                PLANNING FOR PRODUCTION IN CURRENT MONTH
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.supplyDue}</TableCell>
                <TableCell>{row.planning}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const ProductionPlanning = () => {
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
          Production Planning
        </Typography>
      </Box>

      <ProductionFilter
        onFilteredData={setFilteredData}
        data={inspectionData}
      />

      <Grid container spacing={3} columns={{ xs: 1, sm: 2 }} sx={{ mt: 3 }}>
        <Grid item size={1}>
          <SinglePhaseTable />
        </Grid>
        <Grid item size={1}>
          <PowerTransformerTable />
        </Grid>
        <Grid item size={1}>
          <ThreePhaseTable />
        </Grid>
        <Grid item size={1}>
          <InverterDutyTable />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          Production Planning Details
        </Typography>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" aria-label="final-inspection-table">
            <TableHead>
              <TableRow>
                <TableCell>Sr</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Discom</TableCell>
                <TableCell>TN No.</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Schedule Date</TableCell>
                <TableCell>Total Order Qty</TableCell>
                <TableCell>Qty Per Month In Schedule</TableCell>
                <TableCell>Total Supply Due In Current Month</TableCell>
                <TableCell>Offered For Ins Total</TableCell>
                <TableCell>Final Ins. Total</TableCell>
                <TableCell>Actual Supplied Total</TableCell>
                <TableCell>
                  Balance due to be Insp. Current month
                </TableCell>
                <TableCell>Balance Pending</TableCell>
                <TableCell>Tfr Sr. No.</TableCell>
                <TableCell>Planned For Month</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={18} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.discom}</TableCell>
                    <TableCell>{row.deliverySchedule?.tnNumber}</TableCell>
                    <TableCell>{row.deliverySchedule?.rating}</TableCell>
                    <TableCell>{row.deliverySchedule?.phase}</TableCell>
                    <TableCell>{row.deliverySchedule?.wound || "Copper"}</TableCell>
                    <TableCell>{row.deliverySchedule?.status}</TableCell>
                    <TableCell>
                      {row.deliverySchedule?.scheduleDate
                        ? dayjs(row.deliverySchedule.scheduleDate).format(
                            "DD MMM YYYY"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {row.deliverySchedule?.totalOrderQuantity}
                    </TableCell>
                    <TableCell>{row.quantityPerMonthInSchedule}</TableCell>
                    <TableCell>{row.totalSupplyDueInCurrentMonth}</TableCell>
                    <TableCell>{row.offeredForInspectionTotal}</TableCell>
                    <TableCell>{row.finalInspectionTotal}</TableCell>
                    <TableCell>{row.actualSuppliedTotal}</TableCell>
                    <TableCell>
                      {row.balanceDueToBeInspectedInCurrentMonth}
                    </TableCell>
                    <TableCell>{row.balancePending}</TableCell>
                    <TableCell>{row.snNumber}</TableCell>
                    <TableCell>{row.plannedForMonth}</TableCell>
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

export default ProductionPlanning;
