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
      inspectionDate: "2025-07-20",
      inspectedQuantity: 150,
      diNo: "DI/2025/1001",
      diDate: "2025-07-16",
      consignees: [
        {
          consignee: {
            id: "1",
            name: "ABC Power Solutions Pvt. Ltd.",
          },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "4912 TO 4961",
        },
        {
          consignee: {
            id: "2",
            name: "XYZ Transformers Ltd.",
          },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "4962 TO 5011",
        },
        {
          consignee: {
            id: "3",
            name: "GreenVolt Energy Systems",
          },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "5012 TO 5061",
        },
      ],
      specialCase: "no",
      companyName: "Kalpana Industries",
      discom: "Ajmer",
    },
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
      serialNumberFrom: 4901,
      serialNumberTo: 5100, // 4901 + 200 - 1
      snNumber: "4901 TO 5100",
      inspectionOfficers: ["Amit Verma", "Priya Singh"],
      inspectionDate: "2025-07-13",
      inspectedQuantity: 200,
      diNo: "DI/2025/1002",
      diDate: "2025-07-18",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "4901 TO 5000",
        },
        {
          consignee: { id: "5", name: "Jhunjhunu" },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5001 TO 5100",
        },
      ],
      specialCase: "yes",
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
      serialNumberFrom: 5101,
      serialNumberTo: 5250, // 5101 + 150 - 1
      snNumber: "5101 TO 5250",
      inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
      inspectionDate: "2025-08-06",
      inspectedQuantity: 150,
      diNo: "DI/2025/1003",
      diDate: "2025-08-10",
      consignees: [
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 75,
          dispatch: 0,
          pending: 75,
          subSnNumber: "5101 TO 5188",
        },
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 75,
          dispatch: 0,
          pending: 75,
          subSnNumber: "5189 TO 5250",
        },
      ],
      specialCase: "no",
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
      serialNumberFrom: 5251,
      serialNumberTo: 5550, // 5251 + 300 - 1
      snNumber: "5251 TO 5550",
      inspectionOfficers: ["Vikas Sharma", "Neha Yadav"],
      inspectionDate: "2025-08-18",
      inspectedQuantity: 300,
      diNo: "DI/2025/1004",
      diDate: "2025-08-22",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5251 TO 5350",
        },
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5351 TO 5450",
        },
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5451 TO 5550",
        },
      ],
      specialCase: "yes",
      companyName: "Kalpana Industries",
      discom: "Jodhpur",
    },
    {
      id: "4",
      deliverySchedule: {
        tnNumber: "TN-004",
        rating: "5",
        guaranteePeriodMonths: 24,
        phase: "Single Phase",
      },
      offeredDate: "2025-07-20",
      offeredQuantity: 100,
      serialNumberFrom: 5551,
      serialNumberTo: 5650, // 5551 + 100 - 1
      snNumber: "5551 TO 5650",
      inspectionOfficers: ["Rajesh Gupta", "Raju Roy"],
      inspectionDate: "2025-07-22",
      inspectedQuantity: 100,
      diNo: "DI/2025/1005",
      diDate: "2025-07-25",
      consignees: [
        {
          consignee: { id: "2", name: "XYZ Transformers Ltd." },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "5551 TO 5600",
        },
        {
          consignee: { id: "5", name: "Jhunjhunu" },
          quantity: 50,
          dispatch: 0,
          pending: 50,
          subSnNumber: "5601 TO 5650",
        },
      ],
      specialCase: "no",
      companyName: "Yash Granties",
      discom: "Ajmer",
    },
    {
      id: "5",
      deliverySchedule: {
        tnNumber: "TN-005",
        rating: "25",
        guaranteePeriodMonths: 36,
        phase: "Power",
      },
      offeredDate: "2025-08-25",
      offeredQuantity: 200,
      serialNumberFrom: 5651,
      serialNumberTo: 5850, // 5651 + 200 - 1
      snNumber: "5651 TO 5850",
      inspectionOfficers: ["Vikas Sharma", "Sunita Sharma"],
      inspectionDate: "2025-08-28",
      inspectedQuantity: 200,
      diNo: "DI/2025/1006",
      diDate: "2025-08-31",
      consignees: [
        {
          consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5651 TO 5750",
        },
        {
          consignee: { id: "3", name: "GreenVolt Energy Systems" },
          quantity: 100,
          dispatch: 0,
          pending: 100,
          subSnNumber: "5751 TO 5850",
        },
      ],
      specialCase: "no",
      companyName: "Yash Granties",
      discom: "Jaipur",
    },
  ];
};

const DIReceived = () => {
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => {
                  return (
                    <React.Fragment key={row.id}>
                      {row.consignees && row.consignees.length > 0 ? (
                        row.consignees.map((c, cIdx) => {
                          // 👉 Logic for due date
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
                              {/* Main details only once per row */}
                              {cIdx === 0 && (
                                <>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {idx + 1}
                                  </TableCell>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {dayjs(row.offeredDate).format(
                                      "DD MMM YYYY"
                                    )}
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
                                      {row.inspectionOfficers.map(
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
                                        )
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell rowSpan={row.consignees.length}>
                                    {row.inspectionDate
                                      ? dayjs(row.inspectionDate).format(
                                          "DD MMM YYYY"
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

                              {/* Due Date (per consignee) */}
                              <TableCell>{dueDate}</TableCell>

                              {/* Consignee-specific details */}
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
                          <TableCell>
                            {row.inspectionDate
                              ? dayjs(row.inspectionDate).format("DD MMM YYYY")
                              : "-"}
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
