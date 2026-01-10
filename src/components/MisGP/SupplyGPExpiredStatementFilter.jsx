// FiltersComponent.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ⬅️ import as a function
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

// ✅ Dummy Data (replace with props/imports in your real project)

const SupplyGPExpiredStatementFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [filteredData, setFilteredData] = useState(data || []);

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: () => api.get("/companies").then((res) => res.data.data),
  });

  const { data: deliverySchedules } = useQuery({
    queryKey: ["deliverySchedules"],
    queryFn: () => api.get("/delivery-schedules").then((res) => res.data.data),
  });

  const discoms = [
    { name: "Ajmer" },
    { name: "Jaipur" },
    { name: "Jodhpur" },
  ];

  // 🔹 Filtering logic
  useEffect(() => {
    let result = [...data];

    if (selectedCompany !== "all") {
      result = result.filter((item) => item.companyName === selectedCompany);
    }

    if (selectedDiscom !== "all") {
      result = result.filter((item) => item.discom === selectedDiscom);
    }

    if (selectedDate) {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      result = result.filter((item) => item.offeredDate === dateStr);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (item) =>
          item.deliverySchedule.tnNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.deliverySchedule.rating
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.deliverySchedule.phase?.toLowerCase()
      );
    }

    setFilteredData(result);
    onFilteredData(result);
  }, [data, selectedCompany, selectedDiscom, searchQuery, selectedDate]);

  // 🔹 Unique dropdown values from ALL data
  const uniqueCompanies = [...new Set(companies.map((item) => item.name))];
  const uniqueDiscoms = [...new Set(discoms.map((item) => item.name))];

  const exportExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    // Step 1: Prepare data same as PDF
    const excelData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      FirmName: item.companyName,
      "Tn No": item.deliverySchedule.tnNumber,
      Rating: item.deliverySchedule.rating,
      Phase: item.deliverySchedule.phase,
      Wound: item.deliverySchedule.wound,
      "G.P. Tiers received up to date": item.totalReceivedUnderGPTillDate,
      "Qty Balance": item.qtyBalance,
      "Last GP Supply Expiry Date": item.lastGPSupplyExpiryDate,
    }));

    // Step 2: Find non-empty columns
    const allKeys = Object.keys(excelData[0] || {});
    const nonEmptyKeys = allKeys.filter((key) =>
      excelData.some((row) => row[key] && row[key].toString().trim() !== "")
    );

    // Step 3: Filter data to only include non-empty columns
    const filteredExcelData = excelData.map((row) => {
      const newRow = {};
      nonEmptyKeys.forEach((key) => {
        newRow[key] = row[key];
      });
      return newRow;
    });

    // Step 4: Convert JSON to sheet
    const worksheet = XLSX.utils.json_to_sheet(filteredExcelData);

    // Step 5: Create workbook & append worksheet
    const workbook = XLSX.utils.book_new();
    const sheetName = "Supply G.P. Expired Statement";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Step 6: Save Excel file
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  // ✅ Export PDF 
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4"); // Landscape A4

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ✅ Centered title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Supply G.P. Expired Statement", pageWidth / 2, 25, {
      align: "center",
    });

    // Step 1: Prepare data as array
    const pdfData = filteredData.map((item, index) => [
      index + 1, // S.No
      item.companyName || "",
      item.deliverySchedule?.tnNumber || "",
      item.deliverySchedule?.rating || "",
      item.deliverySchedule?.phase || "",
      item.deliverySchedule?.wound || "",
      item.totalReceivedUnderGPTillDate ?? 0,
      item.qtyBalance ?? 0,
      item.lastGPSupplyExpiryDate || "",
    ]);

    // Column headers
    const headers = [
      "S.No",
      "Firm Name",
      "Tn No",
      "Rating",
      "Phase",
      "Wound",
      "G.P. Tiers\nreceived up\nto date",
      "Qty\nBalance",
      "Last GP Supply\nExpiry Date",
    ];

    // Filter out columns with no data
    const hasDataInColumn = (colIndex) => {
      return pdfData.some((row) => {
        const value = row[colIndex];
        return (
          value !== null &&
          value !== undefined &&
          value.toString().trim() !== ""
        );
      });
    };

    const filteredHeaders = [];
    const filteredColumnIndices = [];

    headers.forEach((header, index) => {
      if (hasDataInColumn(index)) {
        filteredHeaders.push(header);
        filteredColumnIndices.push(index);
      }
    });

    const filteredBody = pdfData.map((row) =>
      filteredColumnIndices.map((index) => row[index])
    );

    // Custom column widths
    const getColumnStyles = () => {
      const styles = {};
      const baseWidths = {
        0: 40, // S.No
        1: 120, // Firm Name
        2: 70, // Tn No
        3: 60, // Rating
        4: 80, // Phase
        5: 70, // Wound
        6: 80, // GP Tiers received
        7: 70, // Qty Balance
        8: 100, // Last GP Supply Expiry Date
      };

      let totalTableWidth = 0;

      filteredColumnIndices.forEach((originalIndex, newIndex) => {
        const width = baseWidths[originalIndex];
        styles[newIndex] = { cellWidth: width };
        totalTableWidth += width;
      });

      return { styles, totalTableWidth };
    };

    const { styles: columnStyles, totalTableWidth } = getColumnStyles();

    const horizontalMargin = Math.max((pageWidth - totalTableWidth) / 2, 10);

    autoTable(doc, {
      head: [filteredHeaders],
      body: filteredBody,
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

      columnStyles,

      margin: {
        top: 40,
        bottom: 25,
        left: horizontalMargin,
        right: horizontalMargin,
      },

      tableWidth: totalTableWidth,
      showHead: "everyPage",
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 12,
          { align: "center" }
        );
      },
    });

    doc.save("Supply_GP_Expired_Statement.pdf");
  };

  return (
    <Box sx={{ p: 2, background: "#f5f5f5", borderRadius: "12px" }}>
      <Grid container spacing={2} alignItems="center">
        {/* Company Dropdown */}
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

        {/* Discom Dropdown */}
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

        {/* Calendar */}
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

        {/* Search */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Search TN No, Rating, Phase"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>

        {/* Export Buttons */}
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
