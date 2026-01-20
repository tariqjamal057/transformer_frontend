import { useContext, useEffect, useMemo, useState } from "react";
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
import GPExtendedWarrantyFilter from "../../components/MisGP/GPExtendedWarrantyFilter";

const GPExtendedWarrantyInformation = () => {
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
    queryKey: ["gpExtendedWarranty"],
    queryFn: async () => {
      const res = await api.get(`/mis-reports/gp-extended-warranty`);
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
          G.P. Extended Warranty Information
        </Typography>
      </Box>

      <GPExtendedWarrantyFilter
        onFilteredData={setFilteredData}
        data={reportData || []}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" mb={1}>
          G.P. Extended warranty information
        </Typography>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table
            stickyHeader
            size="small"
            aria-label="gp-extended-warranty-table"
          >
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Tfr Sr No.</TableCell>
                <TableCell>TN NO.</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell>Wound</TableCell>
                <TableCell>GP Expiry Date As Per Original Supply</TableCell>
                <TableCell>Remaining Original Gurantee Period</TableCell>
                <TableCell>Transformers Not In Services</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Extended Warranty</TableCell>
                <TableCell>Final GP Expiry Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    Error fetching data
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.tfrSrNo}</TableCell>
                    <TableCell>{row.deliverySchedule.tnNumber}</TableCell>
                    <TableCell>{row.deliverySchedule.rating}</TableCell>
                    <TableCell>{row.deliverySchedule.phase}</TableCell>
                    <TableCell>{row.deliverySchedule.wound}</TableCell>
                    <TableCell>
                      {new Date(
                        row.gpExpiryDateAsPerOriginalSupply,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {row.remainingOriginalGuranteePeriod} Months
                    </TableCell>
                    <TableCell>{row.tranformersNotInService} Months</TableCell>
                    <TableCell>
                      {row.remainingOriginalGuranteePeriod +
                        row.tranformersNotInService}{" "}
                      Months
                    </TableCell>
                    <TableCell>{row.extendedWarranty} Months</TableCell>
                    <TableCell>
                      {Math.max(
                        row.remainingOriginalGuranteePeriod +
                          row.tranformersNotInService,
                        row.extendedWarranty,
                      )}{" "}
                      Months
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

export default GPExtendedWarrantyInformation;
