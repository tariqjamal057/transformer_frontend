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

import {
  companies,
  deliverySchedules,
  discoms,
} from "../../pages/MisReports/MaterialOfferedButNominationPending";

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Final Inspection");
    XLSX.writeFile(workbook, "FinalInspection.xlsx");
  };

  // ✅ Export PDF (Compact A4 Layout)
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4"); // ⬅️ Landscape A4

    doc.setFontSize(11);
    doc.text("New GP Summary Report", 40, 30);

    const pdfData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      Firm: item.companyName || "",
      Discom: item.discom || "",
      Rating: item.deliverySchedule?.rating || "",
      Phase: item.deliverySchedule?.phase || "",
      Wound: item.deliverySchedule?.wound || "",
      "Total Qty Supplied (New) Till Date": item.totalSuppliedNewTillDate || "",
      "Total Qty Received Under G.P. Till Date":
        item.totalReceivedUnderGPTillDate || "",
      "Total Qty Inspected Till Date": item.totalInspectedTillDate || "",
      "Total Qty Dispatched Till Date": item.totalDispatchedTillDate || "",
      "GP Tfr. Balance Now": item.gpTierBalanceNow || "",
      "Inspected Pending To Be Delivered":
        item.inspectedPendingToBeDelivered || "",
      "GP Receipt In Month": item.gpReceiptInMonth || "",
      "GP Dispatch In Month": item.gpDispatchInMonth || "",
      "GP Inspected In Month": item.gpInspectedInMonth || "",
    }));

    const head = [Object.keys(pdfData[0] || {})];
    const body = pdfData.map((row) => Object.values(row));

    autoTable(doc, {
      head,
      body,
      startY: 45,
      styles: {
        fontSize: 5.5, // ⬅️ smaller text to fit all columns
        cellPadding: 1,
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 6,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 40, left: 15, right: 15 },
      tableWidth: "auto",
    });

    doc.save("NewGPSummary_A4.pdf");
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

        {/* Calendar */}
        <Grid item size={1}>
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
      </Grid>
    </Box>
  );
};

export default NewGPSummaryFilter;
