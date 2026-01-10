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
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";

const MaterialOfferedButNominationPending = () => {
  const { setIsHideSidebarAndHeader } = useContext(MyContext);
  
    useEffect(() => {
      setIsHideSidebarAndHeader(true);
      window.scrollTo(0, 0);
    }, [setIsHideSidebarAndHeader]);
  const navigate = useNavigate("");

  const [filteredData, setFilteredData] = useState([]);

  const { data: inspectionData, isLoading } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () => api.get("/final-inspections").then((res) => res.data || []), // Ensure it always returns an array
  });

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => api.get("/companies").then((res) => res.data.data),
  });

  const { data: deliverySchedules } = useQuery({
    queryKey: ["deliverySchedules"],
    queryFn: () => api.get("/delivery-schedules").then((res) => res.data.data),
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
          Material Offered But Nomination Pending
        </Typography>
      </Box>

      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData || []}
        text="Awaiting Nomination"
        onExportPDF={true}
        onExportExcel={true}
        sheetName="Material offered but Nomination pending detail"
        pdfTitle="Material Offered But Nomination Pending"
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData?.map((row, idx) => (
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
