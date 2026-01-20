import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, TextField, MenuItem, Button } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const SupplyGPExpiredStatementFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const uniqueCompanies = useMemo(
    () => [...new Set(data.map((item) => item.companyName).filter(Boolean))],
    [data],
  );
  const uniqueDiscoms = useMemo(
    () => [...new Set(data.map((item) => item.discom).filter(Boolean))],
    [data],
  );

  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : [];

    if (selectedCompany !== "all") {
      result = result.filter((item) => item.companyName === selectedCompany);
    }
    if (selectedDiscom !== "all") {
      result = result.filter((item) => item.discom === selectedDiscom);
    }
    if (selectedDate) {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      result = result.filter((item) =>
        item.lastGPSupplyExpiryDate?.startsWith(dateStr),
      );
    }
    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.deliverySchedule.tnNumber
            ?.toLowerCase()
            .includes(lowercasedQuery) ||
          item.deliverySchedule.rating
            ?.toString()
            .toLowerCase()
            .includes(lowercasedQuery) ||
          item.deliverySchedule.phase?.toLowerCase().includes(lowercasedQuery),
      );
    }

    onFilteredData(result);
  }, [
    data,
    selectedCompany,
    selectedDiscom,
    searchQuery,
    selectedDate,
    onFilteredData,
  ]);

  const exportExcel = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    const excelData = data.map((item, index) => ({
      "S.No": index + 1,
      FirmName: item.companyName,
      Discom: item.discom,
      "Tn No": item.deliverySchedule.tnNumber,
      Rating: item.deliverySchedule.rating,
      Phase: item.deliverySchedule.phase,
      Wound: item.deliverySchedule.wound,
      "G.P. Tiers received up to date": item.totalReceivedUnderGPTillDate,
      "Qty Balance": item.qtyBalance,
      "Last GP Supply Expiry Date": item.lastGPSupplyExpiryDate
        ? new Date(item.lastGPSupplyExpiryDate).toLocaleDateString()
        : "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    const sheetName = "Supply_GP_Expired_Statement";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(
      "Supply G.P. Expired Statement",
      doc.internal.pageSize.getWidth() / 2,
      25,
      {
        align: "center",
      },
    );

    const pdfData = data.map((item, index) => [
      index + 1,
      item.companyName || "",
      item.discom || "",
      item.deliverySchedule?.tnNumber || "",
      item.deliverySchedule?.rating || "",
      item.deliverySchedule?.phase || "",
      item.deliverySchedule?.wound || "",
      item.totalReceivedUnderGPTillDate ?? 0,
      item.qtyBalance ?? 0,
      item.lastGPSupplyExpiryDate
        ? new Date(item.lastGPSupplyExpiryDate).toLocaleDateString()
        : "N/A",
    ]);

    const headers = [
      "S.No",
      "Firm Name",
      "Discom",
      "Tn No",
      "Rating",
      "Phase",
      "Wound",
      "G.P. Tfrs\nreceived up\nto date",
      "Qty\nBalance",
      "Last GP Supply\nExpiry Date",
    ];

    autoTable(doc, {
      head: [headers],
      body: pdfData,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: "center",
        valign: "middle",
        overflow: "linebreak",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 7,
        fontStyle: "bold",
        minCellHeight: 25,
      },
      margin: { top: 40, bottom: 25, left: 10, right: 10 },
      showHead: "everyPage",
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 12,
          { align: "center" },
        );
      },
    });
    doc.save("Supply_GP_Expired_Statement.pdf");
  };

  return (
    <Box sx={{ p: 2, background: "#f5f5f5", borderRadius: "12px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Select Company"
            fullWidth
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <MenuItem value="all">All Companies</MenuItem>
            {uniqueCompanies.map((c, idx) => (
              <MenuItem key={idx} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Select Discom"
            fullWidth
            value={selectedDiscom}
            onChange={(e) => setSelectedDiscom(e.target.value)}
          >
            <MenuItem value="all">All Discoms</MenuItem>
            {uniqueDiscoms.map((d, idx) => (
              <MenuItem key={idx} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newVal) => setSelectedDate(newVal)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Search TN No, Rating, Phase"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={exportExcel}
          >
            Export Excel
          </Button>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={exportPDF}
          >
            Export PDF
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplyGPExpiredStatementFilter;
