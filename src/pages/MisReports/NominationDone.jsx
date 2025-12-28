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
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

const getDummyFinalInspectionDetails = () => {
  return [
    {
      id: "1",
      deliverySchedule: {
        tnNumber: "TN-001",
        rating: "10",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      snNumber: "4907 TO 4911",
      inspectionOfficers: ["Amit Verma", "Priya Singh"],
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
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 5061,
      snNumber: "4912 TO 5061",
      inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
      diNo: "DI/2025/1001",
      diDate: "2025-07-16",
      consignees: [
        {
          consignee: {
            id: "1",
            name: "ABC Power Solutions Pvt. Ltd.",
          },
          quantity: 50,
          subSnNumber: "4912 TO 4961",
        },
        {
          consignee: {
            id: "2",
            name: "XYZ Transformers Ltd.",
          },
          quantity: 50,
          subSnNumber: "4962 TO 5011",
        },
        {
          consignee: {
            id: "3",
            name: "GreenVolt Energy Systems",
          },
          quantity: 50,
          subSnNumber: "5012 TO 5061",
        },
      ],
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
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
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
      },
      offeredDate: "2025-08-15",
      offeredQuantity: 300,
      serialNumberFrom: 4917,
      serialNumberTo: 4922,
      snNumber: "4917 TO 4922",
      inspectionOfficers: ["Vikas Sharma", "Neha Yadav"],
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
      },
      offeredDate: "2025-07-12",
      offeredQuantity: 200,
      serialNumberFrom: 4907,
      serialNumberTo: 4911,
      inspectionOfficers: ["Rajesh Gupta", "Raju Roy"],
      snNumber: "4907 TO 4911",
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
      },
      offeredDate: "2025-08-05",
      offeredQuantity: 150,
      serialNumberFrom: 4912,
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      inspectionOfficers: ["Vikas Sharma", "Sunita Sharma"],
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
};

const NominationDone = () => {
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
          Nomination Done But Inspection Pending
        </Typography>
      </Box>

      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData}
        text="Awaiting Inspection"
        onExportPDF={false}
        onExportExcel={false}
        sheetName="Nomination Done But Inspection Pending "
        pdfTitle= "Nomination Done But Inspection Pending"
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
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