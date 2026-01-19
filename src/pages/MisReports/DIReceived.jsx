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

const DIReceived = () => {
  const navigate = useNavigate("");
  const { setIsHideSidebarAndHeader } = useContext(MyContext);
  const [filteredData, setFilteredData] = useState([]);

  const {
    data: inspectionData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["diReceivedDispatchPending"],
    queryFn: () =>
      api
        .get("/mis-reports/di-received-dispatch-pending")
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
          Material Inspected, D.I. Received But Dispatch Pending
        </Typography>
      </Box>
      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData}
        text="Dispatch Pending"
        onExportPDF={true}
        onExportExcel={true}
        sheetName="Material inspected DI received but dispatch pending"
        pdfTitle="Material Inspected DI Received But Dispatch Pending"
      />
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          Dispatch Pending Details
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
                <TableCell>Date OF Inspection</TableCell>
                <TableCell>Inspected Quantity</TableCell>
                <TableCell>D.I. NO.</TableCell>
                <TableCell>D.I. Date</TableCell>
                <TableCell>Due Of Date Delivery</TableCell>
                <TableCell>Consignee</TableCell>
                <TableCell>SR. NO. OF TFR.</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Dispatch</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={19} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={19} align="center">
                    Error fetching data
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={19} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => {
                  return (
                    <React.Fragment key={row.id}>
                      {row.consignees && row.consignees.length > 0 ? (
                        row.consignees.map((c, cIdx) => {
                          const baseDate =
                            row.specialCase === "yes"
                              ? row.inspectionDate
                              : row.diDate || row.inspectionDate;
                          let dueDate;
                          if (
                            c.consignee?.name?.toLowerCase() === "jhunjhunu"
                          ) {
                            dueDate = dayjs(baseDate)
                              .add(7, "day")
                              .format("DD MMM YYYY");
                          } else {
                            dueDate = dayjs(baseDate)
                              .add(12, "day")
                              .format("DD MMM YYYY");
                          }
                          return (
                            <TableRow key={`${row.id}-${cIdx}`}>
                              {cIdx === 0 && (
                                <>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {idx + 1}
                                  </TableCell>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {dayjs(row.offerDate).format("DD MMM YYYY")}
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
                                      {row.inspectionOfficers &&
                                        row.inspectionOfficers.map(
                                          (officer, i) => (
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
                                          ),
                                        )}
                                    </div>
                                  </TableCell>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {row.inspectionDate
                                      ? dayjs(row.inspectionDate).format(
                                          "DD MMM YYYY",
                                        )
                                      : "-"}
                                  </TableCell>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {row.inspectedQuantity || ""}
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
                              <TableCell>{dueDate}</TableCell>
                              <TableCell>{c.consignee?.name}</TableCell>
                              <TableCell>{c.subSnNumber}</TableCell>
                              <TableCell>{c.quantity}</TableCell>
                              <TableCell>{c.dispatch}</TableCell>
                              <TableCell>{c.pending}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            {dayjs(row.offerDate).format("DD MMM YYYY")}
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
                              {row.inspectionOfficers &&
                                row.inspectionOfficers.map((officer, i) => (
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
                          <TableCell>
                            {row.inspectionDate
                              ? dayjs(row.inspectionDate).format("DD MMM YYYY")
                              : "-"}
                          </TableCell>
                          <TableCell>{row.inspectedQuantity || ""}</TableCell>
                          <TableCell>{row.diNo || "-"}</TableCell>
                          <TableCell>
                            {row.diDate
                              ? dayjs(row.diDate).format("DD MMM YYYY")
                              : "-"}
                          </TableCell>
                          <TableCell colSpan={6} align="center">
                            No Consignees
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default DIReceived;
