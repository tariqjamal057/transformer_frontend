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

const NewGPSummaryFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [selectedWound, setSelectedWound] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueCompanies = useMemo(
    () => [...new Set(data.map((item) => item.companyName).filter(Boolean))],
    [data],
  );
  const uniqueDiscoms = useMemo(
    () => [...new Set(data.map((item) => item.discom).filter(Boolean))],
    [data],
  );
  const uniqueRatings = useMemo(
    () => [
      ...new Set(
        data.map((item) => item.deliverySchedule?.rating).filter(Boolean),
      ),
    ],
    [data],
  );
  const uniquePhases = useMemo(
    () => [
      ...new Set(
        data.map((item) => item.deliverySchedule?.phase).filter(Boolean),
      ),
    ],
    [data],
  );
  const uniqueWounds = useMemo(
    () => [
      ...new Set(
        data.map((item) => item.deliverySchedule?.wound).filter(Boolean),
      ),
    ],
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
    if (selectedRating !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule.rating === selectedRating,
      );
    }
    if (selectedPhase !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule.phase === selectedPhase,
      );
    }
    if (selectedWound !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule.wound === selectedWound,
      );
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.companyName?.toLowerCase().includes(lowercasedQuery) ||
          item.discom?.toLowerCase().includes(lowercasedQuery),
      );
    }

    onFilteredData(result);
  }, [
    data,
    selectedCompany,
    selectedDiscom,
    selectedRating,
    selectedPhase,
    selectedWound,
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
      Firm: item.companyName,
      Discom: item.discom,
      Rating: item.deliverySchedule.rating,
      Phase: item.deliverySchedule.phase,
      Wound: item.deliverySchedule.wound,
      "Total Qty Supplied (New) Till Date": item.totalSuppliedNewTillDate,
      "Total Qty Received Under G.P. Till Date":
        item.totalReceivedUnderGPTillDate,
      "Total Qty Inspected Till Date": item.totalInspectedTillDate,
      "Total Qty Dispatched Till Date": item.totalDispatchedTillDate,
      "GP Tfr. Balance Now": item.gpTierBalanceNow,
      "Inspected Pending To Be Delivered": item.inspectedPendingToBeDelivered,
      "GP Receipt In Month": item.gpReceiptInMonth,
      "GP Dispatch In Month": item.gpDispatchInMonth,
      "GP Inspected In Month": item.gpInspectedInMonth,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "New GP Summary");
    XLSX.writeFile(workbook, `NewGPSummary.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(
      "New GP Summary Report",
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
      item.deliverySchedule?.rating || "",
      item.deliverySchedule?.phase || "",
      item.deliverySchedule?.wound || "",
      item.totalSuppliedNewTillDate ?? 0,
      item.totalReceivedUnderGPTillDate ?? 0,
      item.totalInspectedTillDate ?? 0,
      item.totalDispatchedTillDate ?? 0,
      item.gpTierBalanceNow ?? 0,
      item.inspectedPendingToBeDelivered ?? 0,
      item.gpReceiptInMonth ?? 0,
      item.gpDispatchInMonth ?? 0,
      item.gpInspectedInMonth ?? 0,
    ]);

    const headers = [
      "S.No",
      "Firm",
      "Discom",
      "Rating",
      "Phase",
      "Wound",
      "Total Qty\nSupplied\n(New) Till\nDate",
      "Total Qty\nReceived\nUnder G.P.\nTill Date",
      "Total Qty\nInspected\nTill Date",
      "Total Qty\nDispatched\nTill Date",
      "GP Tfr.\nBalance\nNow",
      "Inspected\nPending To\nBe Delivered",
      "GP Receipt\nIn Month",
      "GP Dispatch\nIn Month",
      "GP Inspected\nIn Month",
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
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 12,
          { align: "center" },
        );
      },
    });

    doc.save("NewGPSummary.pdf");
  };

  const handleResetFilters = () => {
    setSelectedCompany("all");
    setSelectedDiscom("all");
    setSelectedRating("all");
    setSelectedPhase("all");
    setSelectedWound("all");
    setSearchQuery("");
  };

  return (
    <Box sx={{ p: 2, background: "#f5f5f5", borderRadius: "12px" }}>
      <Grid
        spacing={2}
        columns={{ xs: 1, sm: 1, lg: 3, md: 3 }}
        sx={{ mb: 3, mt: 3 }}
        alignItems="center"
      >
        {[
          {
            label: "Select Company",
            value: selectedCompany,
            setValue: setSelectedCompany,
            options: uniqueCompanies,
          },
          {
            label: "Select Discom",
            value: selectedDiscom,
            setValue: setSelectedDiscom,
            options: uniqueDiscoms,
          },
          {
            label: "Select Rating",
            value: selectedRating,
            setValue: setSelectedRating,
            options: uniqueRatings,
          },
          {
            label: "Select Phase",
            value: selectedPhase,
            setValue: setSelectedPhase,
            options: uniquePhases,
          },
          {
            label: "Select Wound",
            value: selectedWound,
            setValue: setSelectedWound,
            options: uniqueWounds,
          },
        ].map((filter, idx) => (
          <Grid item size={1} key={idx}>
            <FormControl fullWidth>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filter.value}
                onChange={(e) => filter.setValue(e.target.value)}
                label={filter.label}
              >
                <MenuItem value="all">All</MenuItem>
                {filter.options.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
        <Grid item size={1}>
          <TextField
            label="Search"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item size={1}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={exportExcel}
          >
            Export Excel
          </Button>
        </Grid>
        <Grid item size={1}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={exportPDF}
          >
            Export PDF
          </Button>
        </Grid>
        <Grid item size={1}>
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

export default NewGPSummaryFilter;
