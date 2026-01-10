import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const NewGPSummaryFilter = ({ onFilteredData, data }) => {
  // 🔹 Use arrays for multiple selections
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedDiscoms, setSelectedDiscoms] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [selectedWounds, setSelectedWounds] = useState([]);
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

  // 🔹 Unique dropdown values
  const uniqueCompanies = [...new Set(companies.map((item) => item.name))];
  const uniqueDiscoms = [...new Set(discoms.map((item) => item.name))];
  const uniqueRatings = [
    ...new Set(deliverySchedules.map((item) => item.rating)),
  ];
  const uniquePhases = [
    ...new Set(deliverySchedules.map((item) => item.phase)),
  ];
  const uniqueWounds = [
    ...new Set(deliverySchedules.map((item) => item.wound)),
  ];

  // 🔹 Filtering logic (handles multiple selections)
  useEffect(() => {
    let result = [...data];

    if (selectedCompanies.length > 0) {
      result = result.filter((item) =>
        selectedCompanies.includes(item.companyName)
      );
    }

    if (selectedDiscoms.length > 0) {
      result = result.filter((item) => selectedDiscoms.includes(item.discom));
    }

    if (selectedRatings.length > 0) {
      result = result.filter((item) =>
        selectedRatings.includes(item.deliverySchedule.rating)
      );
    }

    if (selectedPhases.length > 0) {
      result = result.filter((item) =>
        selectedPhases.includes(item.deliverySchedule.phase)
      );
    }

    if (selectedWounds.length > 0) {
      result = result.filter((item) =>
        selectedWounds.includes(item.deliverySchedule.wound)
      );
    }

    if (selectedDate) {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      result = result.filter((item) => item.offeredDate === dateStr);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter(
        (item) =>
          item.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.discom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.deliverySchedule.rating
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(result);
    onFilteredData(result);
  }, [
    data,
    onFilteredData,
    selectedCompanies,
    selectedDiscoms,
    selectedRatings,
    selectedPhases,
    selectedWounds,
    searchQuery,
    selectedDate,
  ]);

  // ✅ Export Excel
  const exportExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const excelData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      Firm: item.companyName,
      Discom: item.discom,
      "Tn No": item.deliverySchedule.tnNumber,
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



  // ✅ Export PDF 
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4"); // Landscape A4

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ✅ Centered title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("New GP Summary Report", pageWidth / 2, 25, { align: "center" });

    // Step 1: Prepare data as array
    const pdfData = filteredData.map((item, index) => [
      index + 1, // S.No
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

    // Column headers with line breaks
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

    // Filter out columns that have no data
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

    // Custom column widths for 15 columns in landscape
    const getColumnStyles = () => {
      const styles = {};
      const baseWidths = {
        0: 30, // S.No
        1: 65, // Firm
        2: 50, // Discom
        3: 40, // Rating
        4: 45, // Phase
        5: 45, // Wound
        6: 50, // Total Qty Supplied
        7: 55, // Total Qty Received
        8: 50, // Total Qty Inspected
        9: 50, // Total Qty Dispatched
        10: 45, // GP Tfr Balance
        11: 55, // Inspected Pending
        12: 45, // GP Receipt
        13: 45, // GP Dispatch
        14: 50, // GP Inspected
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
        // Add page numbers at the bottom
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

    doc.save("NewGPSummary_A4.pdf");
  };

  const handleResetFilters = () => {
    setSelectedCompanies([]);
    setSelectedDiscoms([]);
    setSelectedRatings([]);
    setSelectedPhases([]);
    setSelectedWounds([]);
    setSearchQuery("");
    setSelectedDate(null);
  };

  return (
    <Box sx={{ p: 2, background: "#f5f5f5", borderRadius: "12px" }}>
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 1, lg: 3, md: 3 }}
        sx={{ mb: 3, mt: 3 }}
        alignItems="center"
      >
        {/* Multi-Select Filters */}
        {[
          {
            label: "Select Company",
            value: selectedCompanies,
            setValue: setSelectedCompanies,
            options: uniqueCompanies,
          },
          {
            label: "Select Discom",
            value: selectedDiscoms,
            setValue: setSelectedDiscoms,
            options: uniqueDiscoms,
          },
          {
            label: "Select Rating",
            value: selectedRatings,
            setValue: setSelectedRatings,
            options: uniqueRatings,
          },
          {
            label: "Select Phase",
            value: selectedPhases,
            setValue: setSelectedPhases,
            options: uniquePhases,
          },
          {
            label: "Select Wound",
            value: selectedWounds,
            setValue: setSelectedWounds,
            options: uniqueWounds,
          },
        ].map((filter, idx) => (
          <Grid item size={1} key={idx}>
            <FormControl fullWidth>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                multiple
                value={filter.value}
                onChange={(e) => filter.setValue(e.target.value)}
                input={<OutlinedInput label={filter.label} />}
                renderValue={(selected) => selected.join(", ")}
              >
                {filter.options.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    <Checkbox checked={filter.value.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}

        {/* Search */}
        <Grid item size={1}>
          <TextField
            label="Search Firm/Discom/Rating"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>

        {/* Export Buttons */}
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
