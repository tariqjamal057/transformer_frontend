import React, { useContext, useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import FiltersComponent from "../../components/FinalInspectionFilter";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Pagination from "../../components/Pagination";

const MaterialOfferedButNominationPending = () => {
  const { setIsHideSidebarAndHeader } = useContext(MyContext);
  const PAGE_SIZE = 10;
  
    useEffect(() => {
      setIsHideSidebarAndHeader(true);
      window.scrollTo(0, 0);
      return () => setIsHideSidebarAndHeader(false);
    }, [setIsHideSidebarAndHeader]);
  const navigate = useNavigate("");

  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: inspectionData, isLoading, isError } = useQuery({
    queryKey: ["nominationPendingInspections"],
    queryFn: () => api.get("/final-inspections/nomination-pending").then((res) => res.data || []),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Alert severity="error">Error fetching data</Alert>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {(currentPage - 1) * PAGE_SIZE + idx + 1}
                    </TableCell>
                    <TableCell>
                      {dayjs(row.offeredDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>
                      {row.deliverySchedule?.supplyTender?.company?.name}
                    </TableCell>
                    <TableCell>
                      {row.deliverySchedule?.supplyTender?.name}
                    </TableCell>
                    <TableCell>{row.deliverySchedule?.tnNumber}</TableCell>
                    <TableCell>
                      {row.deliverySchedule?.rating} KVA{" "}
                      {row.deliverySchedule?.phase}
                    </TableCell>
                    <TableCell>
                      {row.serialNumberFrom} to {row.serialNumberTo}
                    </TableCell>
                    <TableCell>{row.offeredQuantity}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  );
};

export default MaterialOfferedButNominationPending;

