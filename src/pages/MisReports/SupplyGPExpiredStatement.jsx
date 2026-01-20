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
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import SupplyGPExpiredStatementFilter from "../../components/MisGP/SupplyGPExpiredStatementFilter";

const SupplyGPExpiredStatement = () => {
  const navigate = useNavigate();
  const { setIsHideSidebarAndHeader } = useContext(MyContext);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
    return () => {
      setIsHideSidebarAndHeader(false);
    };
  }, [setIsHideSidebarAndHeader]);

  const {
    data: reportData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["supplyGpExpiredStatement"],
    queryFn: async () => {
      const res = await api.get(`/mis-reports/supply-gp-expired-statement`);
      return res.data;
    },
  });

  useEffect(() => {
    if (reportData) {
      setFilteredData(reportData);
    }
  }, [reportData]);

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
          Supply G.P. Expired Statement
        </Typography>
      </Box>

      <SupplyGPExpiredStatementFilter
        onFilteredData={setFilteredData}
        data={reportData || []}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          Supply G.P. Expired Statement
        </Typography>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table
            stickyHeader
            size="small"
            aria-label="gp-expired-statement-table"
          >
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Firm Name</TableCell>
                <TableCell>Discom</TableCell>
                <TableCell>Tn No</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>G.P. Tfrs received up to date</TableCell>
                <TableCell>Qty Balance</TableCell>
                <TableCell>Last GP Supply Expiry Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Error fetching data
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.companyName}</TableCell>
                    <TableCell>{row.discom}</TableCell>
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>{row.totalReceivedUnderGPTillDate}</TableCell>
                    <TableCell>{row.qtyBalance}</TableCell>
                    <TableCell>
                      {row.lastGPSupplyExpiryDate
                        ? new Date(
                            row.lastGPSupplyExpiryDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
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

export default SupplyGPExpiredStatement;
