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
import { useNavigate } from "react-router-dom";
import NewGPTransformersFilter from "../../components/MisGP/NewGPTransformersFilter";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const NewGPTranformers = () => {
  const navigate = useNavigate("");

  const [filteredData, setFilteredData] = useState([]);

  const { data: inspectionData, isLoading } = useQuery({
    queryKey: ["newGpTransformers"],
    queryFn: () => api.get("/mis-reports/new-gp-transformers").then((res) => res.data),
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
          MIS Of New G.P. Transformers
        </Typography>
      </Box>

      <NewGPTransformersFilter
        onFilteredData={setFilteredData}
        data={inspectionData || []}
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
                <TableCell>TN NO.</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>Total Qty Supplied (New) Till Date</TableCell>
                <TableCell>Total Qty Received Under G.P. Till Date</TableCell>
                <TableCell>Total Qty Inspected Till Date</TableCell>
                <TableCell>Total Qty Dispatched Till Date</TableCell>
                <TableCell>Total Qty Pending Including Inspected</TableCell>
                <TableCell>Inspected But Not Dispatched</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>{row.totalSuppliedNewTillDate}</TableCell>
                    <TableCell>{row.totalReceivedUnderGPTillDate}</TableCell>
                    <TableCell>{row.totalInspectedTillDate}</TableCell>
                    <TableCell>{row.totalDispatchedTillDate}</TableCell>
                    <TableCell>{row.totalPendingIncludingInspected}</TableCell>
                    <TableCell>{row.inspectedButNotDispatched}</TableCell>
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

export default NewGPTranformers;
