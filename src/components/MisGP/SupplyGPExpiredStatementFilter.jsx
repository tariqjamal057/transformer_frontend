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
import {
  companies,
  deliverySchedules,
  discoms,
} from "../../pages/MisReports/MaterialOfferedButNominationPending";

// ✅ Dummy Data (replace with props/imports in your real project)

const SupplyGPExpiredStatementFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [filteredData, setFilteredData] = useState(data || []);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Final Inspection");

    // Step 6: Save Excel file
    XLSX.writeFile(workbook, "FinalInspection.xlsx");
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Final Inspection Report", 14, 10);

    // Step 1: Prepare data with inspection officers
    const pdfData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Tn No": item.deliverySchedule.tnNumber,
      Rating: item.deliverySchedule.rating,
      Phase: item.deliverySchedule.phase,
      Wound: item.deliverySchedule.wound,
      "G.P. Tiers received up to date": item.totalReceivedUnderGPTillDate,
      "Qty Balance": item.qtyBalance,
      "Last GP Supply Expiry Date": item.lastGPSupplyExpiryDate,
    }));

    // Step 2: Find non-empty columns
    const allKeys = Object.keys(pdfData[0] || {});
    const nonEmptyKeys = allKeys.filter((key) =>
      pdfData.some((row) => row[key] && row[key].toString().trim() !== "")
    );

    // Step 3: Create head & body dynamically
    const head = [nonEmptyKeys];
    const body = pdfData.map((row) => nonEmptyKeys.map((key) => row[key]));

    // Step 4: Generate table
    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185] }, // blue header
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Step 5: Save
    doc.save("FinalInspection.pdf");
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
