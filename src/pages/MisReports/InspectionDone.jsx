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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import FiltersComponent from "../../components/FinalInspectionFilter";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const InspectionDone = () => {
  const navigate = useNavigate("");
  const { setIsHideSidebarAndHeader } = useContext(MyContext);
  const [filteredData, setFilteredData] = useState([]);

  const {
    data: inspectionData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["inspectionDoneDiPending"],
    queryFn: () =>
      api
        .get("/mis-reports/inspection-done-di-pending")
        .then((res) => res.data),
  });

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
    return () => {
      setIsHideSidebarAndHeader(false);
    };
  }, [setIsHideSidebarAndHeader]);

  useEffect(() => {
    if (inspectionData) {
      setFilteredData(inspectionData);
    }
  }, [inspectionData]);

  const getSnNumber = (from, to) => {
    if (from && to) {
      return `${from} TO ${to}`;
    }
    return from || to || "";
  };
  
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
          Inspection Done But D.I. Pending
        </Typography>
      </Box>
      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData}
        text="Awaiting for D.I."
        onExportPDF={true}
        onExportExcel={true}
        sheetName="Inspection done but DI pending"
        pdfTitle="Inspection Done But DI Pending"
      />
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          D.I. Pending Details
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
                <TableCell>Name Of Inspecting Officers</TableCell>
                <TableCell>Date Of Inspection</TableCell>
                <TableCell>Inspected Qty.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    Error fetching data
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
                    <TableCell>
                      {dayjs(row.offerDate).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell>{row.supplyTender.company.name}</TableCell>
                    <TableCell>
                      {row.supplyTender?.name || "N/A"}
                    </TableCell>
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>
                      {row.deliverySchedule.rating} KVA{" "}
                      {row.deliverySchedule.phase}
                    </TableCell>
                    <TableCell>
                      {getSnNumber(row.serialNumberFrom, row.serialNumberTo)}
                    </TableCell>
                    <TableCell>{row.offeredQuantity}</TableCell>
                    <TableCell>
                      <div className="d-flex flex-wrap gap-1">
                        {row.inspectionOfficers &&
                          row.inspectionOfficers.map((officer, idx) => (
                            <span
                              key={idx}
                              className="badge bg-info text-white px-2 py-1"
                              style={{
                                fontSize: "0.75rem",
                                borderRadius: "10px",
                              }}
                            >
                              {officer}
                            </span>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.inspectionDate
                        ? dayjs(row.inspectionDate).format("DD MMM YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell>{row.inspectedQuantity}</TableCell>
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

export default InspectionDone;