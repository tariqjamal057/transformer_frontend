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
import { useNavigate } from "react-router-dom";
import ProductionFilter from "../../components/ProductionFilter";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const SinglePhaseTable = ({ data }) => {
  const singlePhaseData = data.filter(
    (item) => item.deliverySchedule.phase === "Single Phase"
  );

  const summary = singlePhaseData.reduce((acc, item) => {
    const rating = `${item.deliverySchedule.rating} KVA`;
    if (!acc[rating]) {
      acc[rating] = { rating, total: 0, supplyDue: 0, planning: 0 };
    }
    acc[rating].total += item.deliverySchedule.totalOrderQuantity || 0;
    acc[rating].supplyDue += item.totalSupplyDueInCurrentMonth || 0;
    acc[rating].planning += item.plannedForMonth || 0;
    return acc;
  }, {});

  const rows = Object.values(summary);

  if (rows.length === 0) return null;

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

const PowerTransformerTable = ({ data }) => {
  const powerData = data.filter(
    (item) => item.deliverySchedule.phase === "Power"
  );

  const summary = powerData.reduce((acc, item) => {
    const rating = `${item.deliverySchedule.rating} KVA`;
    if (!acc[rating]) {
      acc[rating] = { rating, total: 0, supplyDue: 0, planning: 0 };
    }
    acc[rating].total += item.deliverySchedule.totalOrderQuantity || 0;
    acc[rating].supplyDue += item.totalSupplyDueInCurrentMonth || 0;
    acc[rating].planning += item.plannedForMonth || 0;
    return acc;
  }, {});

  const rows = Object.values(summary);

  if (rows.length === 0) return null;

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

const ThreePhaseTable = ({ data }) => {
  const threePhaseData = data.filter(
    (item) => item.deliverySchedule.phase === "Three Phase"
  );

  const summary = threePhaseData.reduce((acc, item) => {
    const rating = `${item.deliverySchedule.rating} KVA`;
    if (!acc[rating]) {
      acc[rating] = { rating, total: 0, supplyDue: 0, planning: 0 };
    }
    acc[rating].total += item.deliverySchedule.totalOrderQuantity || 0;
    acc[rating].supplyDue += item.totalSupplyDueInCurrentMonth || 0;
    acc[rating].planning += item.plannedForMonth || 0;
    return acc;
  }, {});

  const rows = Object.values(summary);

  if (rows.length === 0) return null;

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

const InverterDutyTable = ({ data }) => {
  const rows = [
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

  const [filteredData, setFilteredData] = useState([]);

  const { data: inspectionData, isLoading } = useQuery({
    queryKey: ["productionPlanning"],
    queryFn: () => api.get("/mis-reports/production-planning").then((res) => res.data),
  });

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
        data={inspectionData || []}
      />

      <Grid container spacing={3} columns={{ xs: 1, sm: 2 }} sx={{ mt: 3 }}>
        <Grid item xs={1}>
          <SinglePhaseTable data={filteredData} />
        </Grid>
        <Grid item xs={1}>
          <PowerTransformerTable data={filteredData} />
        </Grid>
        <Grid item xs={1}>
          <ThreePhaseTable data={filteredData} />
        </Grid>
        <Grid item xs={1}>
          <InverterDutyTable data={filteredData} />
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
                <TableCell>Balance due to be Insp. Current month</TableCell>
                <TableCell>Balance Pending</TableCell>
                <TableCell>Tfr Sr. No.</TableCell>
                <TableCell>Planned For Month</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={19} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={19} align="center">
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
                    <TableCell>
                      {row.deliverySchedule?.wound || "Copper"}
                    </TableCell>
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
