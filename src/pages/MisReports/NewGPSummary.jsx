import { useContext, useEffect, useState } from "react";
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
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import NewGPSummaryFilter from "../../components/MisGP/NewGPSummaryFilter";
import api from "../../services/api";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const NewGPSummary = () => {
  const navigate = useNavigate("");
  const { setIsHideSidebarAndHeader } = useContext(MyContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
    fetchData();
  }, [setIsHideSidebarAndHeader]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/mis-reports/new-gp-summary");
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.get(
        `/mis-reports/new-gp-summary?export=${format}`,
        {
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `new-gp-summary.${format === "excel" ? "xlsx" : "pdf"}`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting to ${format}`, error);
    }
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
          onClick={() => navigate("/new-gp-transformers")}
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
          New GP Summary
        </Typography>
      </Box>

      <NewGPSummaryFilter onFilteredData={setFilteredData} data={data} />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6">New GP Summary</Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport("excel")}
              sx={{ mr: 1 }}
            >
              Excel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleExport("pdf")}
            >
              PDF
            </Button>
          </Box>
        </Box>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader size="small" aria-label="final-inspection-table">
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Firm</TableCell>
                <TableCell>Discom</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>Total Qty Supplied (New) Till Date</TableCell>
                <TableCell>Total Qty Received Under G.P. Till Date</TableCell>
                <TableCell>Total Qty Inspected Till Date</TableCell>
                <TableCell>Total Qty Dispatched Till Date</TableCell>
                <TableCell>GP Tfr. Balance Now</TableCell>
                <TableCell>Inspected Pending To Be Delivered</TableCell>
                <TableCell>GP Receipt In Month</TableCell>
                <TableCell>GP Dispatch In Month</TableCell>
                <TableCell>GP Inspected In Month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    Error: {error.message}
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.discom}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>{row.totalSuppliedNewTillDate}</TableCell>
                    <TableCell>{row.totalReceivedUnderGPTillDate}</TableCell>
                    <TableCell>{row.totalInspectedTillDate}</TableCell>
                    <TableCell>{row.totalDispatchedTillDate}</TableCell>
                    <TableCell>{row.gpTierBalanceNow}</TableCell>
                    <TableCell>{row.inspectedPendingToBeDelivered}</TableCell>
                    <TableCell>{row.gpReceiptInMonth}</TableCell>
                    <TableCell>{row.gpDispatchInMonth}</TableCell>
                    <TableCell>{row.gpInspectedInMonth}</TableCell>
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

export default NewGPSummary;
