import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GPExtendedWarrantyFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueCompanies = useMemo(
    () => [...new Set(data.map((item) => item.companyName).filter(Boolean))],
    [data]
  );
  const uniqueDiscoms = useMemo(
    () => [...new Set(data.map((item) => item.discom).filter(Boolean))],
    [data]
  );
  const uniqueRatings = useMemo(
    () => [
      ...new Set(
        data.map((item) => item.deliverySchedule?.rating).filter(Boolean)
      ),
    ],
    [data]
  );

  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : [];

    if (selectedCompany !== "all") {
      result = result.filter((item) => item.companyName === selectedCompany);
    }
    if (selectedDiscom !== "all") {
      result = result.filter((item) => item.discom === selectedDiscom);
    }
    if (selectedRating !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule.rating === selectedRating
      );
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.tfrSrNo?.toLowerCase().includes(lowercasedQuery) ||
          item.deliverySchedule?.tnNumber?.toLowerCase().includes(lowercasedQuery)
      );
    }

    onFilteredData(result);
  }, [
    data,
    selectedCompany,
    selectedDiscom,
    selectedRating,
    searchQuery,
    onFilteredData,
  ]);

  const exportExcel = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const excelData = data.map((item, index) => ({
      "S.No": index + 1,
      "Tfr Sr No.": item.tfrSrNo,
      "TN NO.": item.deliverySchedule.tnNumber,
      Rating: item.deliverySchedule.rating,
      Phase: item.deliverySchedule.phase,
      Wound: item.deliverySchedule.wound,
      "GP Expiry Date As Per Original Supply": new Date(
        item.gpExpiryDateAsPerOriginalSupply
      ).toLocaleDateString(),
      "Remaining Original Gurantee Period": `${item.remainingOriginalGuranteePeriod} Months`,
      "Transformers Not In Services": `${item.tranformersNotInService} Months`,
      Total: `${
        item.remainingOriginalGuranteePeriod + item.tranformersNotInService
      } Months`,
      "Extended Warranty": `${item.extendedWarranty} Months`,
      "Final GP Expiry Date": `${Math.max(
        item.remainingOriginalGuranteePeriod + item.tranformersNotInService,
        item.extendedWarranty
      )} Months`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "GPExtendedWarranty"
    );
    XLSX.writeFile(workbook, `GPExtendedWarranty.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(
      "G.P. Extended Warranty Information",
      doc.internal.pageSize.getWidth() / 2,
      25,
      {
        align: "center",
      }
    );

    const pdfData = data.map((item, index) => [
      index + 1,
      item.tfrSrNo,
      item.deliverySchedule.tnNumber,
      item.deliverySchedule.rating,
      item.deliverySchedule.phase,
      item.deliverySchedule.wound,
      new Date(item.gpExpiryDateAsPerOriginalSupply).toLocaleDateString(),
      `${item.remainingOriginalGuranteePeriod} Months`,
      `${item.tranformersNotInService} Months`,
      `${
        item.remainingOriginalGuranteePeriod + item.tranformersNotInService
      } Months`,
      `${item.extendedWarranty} Months`,
      `${Math.max(
        item.remainingOriginalGuranteePeriod + item.tranformersNotInService,
        item.extendedWarranty
      )} Months`,
    ]);

    const headers = [
      "S.No.", "Tfr Sr No.", "TN NO.", "Rating", "Phase", "Wound",
      "GP Expiry Date", "Remaining Gurantee", "Not In Services",
      "Total", "Extended Warranty", "Final GP Expiry",
    ];

    autoTable(doc, {
      head: [headers],
      body: pdfData,
      startY: 40,
      theme: "grid",
    });

    doc.save("GPExtendedWarranty.pdf");
  };

  const handleResetFilters = () => {
    setSelectedCompany("all");
    setSelectedDiscom("all");
    setSelectedRating("all");
    setSearchQuery("");
  };

  return (
    <Box sx={{ p: 2, background: "#f5f5f5", borderRadius: "12px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Select Company</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              label="Select Company"
            >
              <MenuItem value="all">All Companies</MenuItem>
              {uniqueCompanies.map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Select Discom</InputLabel>
            <Select
              value={selectedDiscom}
              onChange={(e) => setSelectedDiscom(e.target.value)}
              label="Select Discom"
            >
              <MenuItem value="all">All Discom</MenuItem>
              {uniqueDiscoms.map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Select Rating</InputLabel>
            <Select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              label="Select Rating"
            >
              <MenuItem value="all">All Rating</MenuItem>
              {uniqueRatings.map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search Tfr/TN No"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={exportExcel}
          >
            Export Excel
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={exportPDF}
          >
            Export PDF
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleResetFilters}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GPExtendedWarrantyFilter;