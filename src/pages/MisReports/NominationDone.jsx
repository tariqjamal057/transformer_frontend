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

const NominationDone = () => {
  const navigate = useNavigate("");

  const [filteredData, setFilteredData] = useState([]);

  const { data: inspectionData, isLoading } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () => api.get("/final-inspections").then((res) => res.data),
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
          Nomination Done But Inspection Pending
        </Typography>
      </Box>

      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData || []}
        text="Awaiting Inspection"
        onExportPDF={false}
        onExportExcel={false}
        sheetName="Nomination Done But Inspection Pending "
        pdfTitle="Nomination Done But Inspection Pending"
        dueDateofDeliveryIncluded={false}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          Inspection Pending Details
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
                <TableCell>Inspecting Officers</TableCell>
                <TableCell>D.I. NO.</TableCell>
                <TableCell>D.I. Date</TableCell>
                <TableCell>Consignee</TableCell>
                <TableCell>SR. NO. OF TFR.</TableCell>
                <TableCell>Qty</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <React.Fragment key={row.id}>
                    {row.consignees && row.consignees.length > 0 ? (
                      row.consignees.map((c, cIdx) => (
                        <TableRow key={`${row.id}-${cIdx}`}>
                          {/* Only show main details for the first consignee row */}
                          {cIdx === 0 && (
                            <>
                              <TableCell rowSpan={row.consignees.length}>
                                {idx + 1}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {dayjs(row.offeredDate).format("DD MMM YYYY")}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.companyName}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.discom}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.deliverySchedule.tnNumber}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.deliverySchedule.rating} KVA{" "}
                                {row.deliverySchedule.phase}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.snNumber}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.offeredQuantity}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                <div className="d-flex flex-wrap gap-1">
                                  {row.inspectionOfficers.map((officer, i) => (
                                    <span
                                      key={i}
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
                              <TableCell rowSpan={row.consignees.length}>
                                {row.diNo || "-"}
                              </TableCell>
                              <TableCell rowSpan={row.consignees.length}>
                                {row.diDate
                                  ? dayjs(row.diDate).format("DD MMM YYYY")
                                  : "-"}
                              </TableCell>
                            </>
                          )}

                          {/* Consignee-specific details */}
                          <TableCell>{c.consignee?.name}</TableCell>
                          <TableCell>{c.subSnNumber}</TableCell>
                          <TableCell>{c.quantity}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // If no consignees
                      <TableRow>
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
                        <TableCell>
                          <div className="d-flex flex-wrap gap-1">
                            {row.inspectionOfficers.map((officer, i) => (
                              <span
                                key={i}
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
                        <TableCell>{row.diNo || "-"}</TableCell>
                        <TableCell>
                          {row.diDate
                            ? dayjs(row.diDate).format("DD MMM YYYY")
                            : "-"}
                        </TableCell>
                        <TableCell colSpan={3} align="center">
                          No Consignees
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default NominationDone;