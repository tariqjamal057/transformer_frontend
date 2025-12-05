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
      inspectionDate: "2025-07-20",
      inspectedQuantity: 200,
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
      serialNumberTo: 4916,
      snNumber: "4912 TO 4916",
      inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
      inspectionDate: "2025-08-13",
      inspectedQuantity: 140,
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
      inspectionDate: "2025-08-20",
      inspectedQuantity: 150,
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
      inspectionDate: "2025-08-18",
      inspectedQuantity: 300,
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
      snNumber: "4907 TO 4911",
      inspectionOfficers: ["Rajesh Gupta", "Raju Roy"],
      inspectionDate: "2025-07-28",
      inspectedQuantity: 200,
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
      inspectionDate: "2025-08-18",
      inspectedQuantity: 140,
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
};

const InspectionDone = () => {
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
          Inspection Done But D.I. Pending
        </Typography>
      </Box>

      <FiltersComponent
        onFilteredData={setFilteredData}
        data={inspectionData}
        text= "Awaiting for D.I."
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
                        {row.inspectionOfficers.map((officer, idx) => (
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
                      {dayjs(row.inspectionDate).format("DD MMM YYYY")}
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