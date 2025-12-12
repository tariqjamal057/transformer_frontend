// FiltersComponent.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Modal,
} from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ⬅️ import as a function
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  companies,
  deliverySchedules,
  discoms,
} from "../pages/MisReports/MaterialOfferedButNominationPending";
import dayjs from "dayjs";

// ✅ Dummy Data (replace with props/imports in your real project)

const ProductionFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [filteredData, setFilteredData] = useState(data || []);

  // ✅ State for Modal & Summary Input
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [pdfSummary, setPdfSummary] = useState("");
  const [exportType, setExportType] = useState(null); // 'pdf' or 'excel'

  const handleGenerateExport = (type, withSummary = false) => {
    setExportType(type);
    if (withSummary) {
      setOpenSummaryModal(true);
    } else {
      type === "pdf" ? exportPDF() : exportExcel();
    }
  };

  // 🔹 Filtering logic
  useEffect(() => {
    let result = [...data];

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

    if (selectedPhase !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule.phase === selectedPhase
      );
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
          item.inspectionOfficers?.some((officer) =>
            officer.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredData(result);
    onFilteredData(result);
  }, [
    data,
    selectedCompany,
    selectedDiscom,
    selectedRating,
    selectedPhase,
    searchQuery,
    selectedDate,
  ]);

  // 🔹 Unique dropdown values from ALL data
  const uniqueCompanies = [...new Set(companies.map((item) => item.name))];
  const uniqueDiscoms = [...new Set(discoms.map((item) => item.name))];
  const uniqueRatings = [
    ...new Set(deliverySchedules.map((item) => item.rating)),
  ];
  const uniquePhases = [
    ...new Set(deliverySchedules.map((item) => item.phase)),
  ];

  // ✅ Export Excel (merged consignees in one row)
  const exportExcel = (withSummary = false) => {
    const wb = XLSX.utils.book_new();
    let ws;

    if (withSummary && pdfSummary.trim() !== "") {
      ws = XLSX.utils.aoa_to_sheet([[]]);
      XLSX.utils.sheet_add_aoa(ws, [[`Summary: ${pdfSummary}`]], {
        origin: "A1",
      });
    }

    const excelData = filteredData.map((item, index) => {
      return {
        "S.No": index + 1,
        "Firm Name": item.companyName || "",
        Discom: item.discom || "",
        "TN No.": item.deliverySchedule?.tnNumber || "",
        Rating: item.deliverySchedule?.rating || "",
        Phase: item.deliverySchedule?.phase || "",
        Wound: item.deliverySchedule?.wound || "Copper",
        Status: item.deliverySchedule?.status || "",
        "Schedule Date": item.deliverySchedule?.scheduleDate
          ? dayjs(item.deliverySchedule.scheduleDate).format("DD MMM YYYY")
          : "",
        "Total Order Qty": item.deliverySchedule?.totalOrderQuantity || "",
        "Qty Per Month In Schedule": item.quantityPerMonthInSchedule || "",
        "Total Supply Due In Current Month":
          item.totalSupplyDueInCurrentMonth || "",
        "Offered For Ins Total": item.offeredForInspectionTotal || "",
        "Final Ins. Total": item.finalInspectionTotal || "",
        "Actual Supplied Total": item.actualSuppliedTotal || "",
        "Balance Due To Be Ins. During Current Month":
          item.balanceDueToBeInspectedInCurrentMonth || "",
        "Balance Pending": item.balancePending || "",
        "Tfr Sr. No.": item.snNumber || "",
        "Planned For Month": item.plannedForMonth || "",
      };
    });

    // Step 2: Find non-empty columns
    const allKeys = Object.keys(excelData[0] || {});
    const nonEmptyKeys = allKeys.filter((key) =>
      excelData.some((row) => row[key] && row[key].toString().trim() !== "")
    );

    // Step 3: Keep only non-empty columns
    const cleanedData = excelData.map((row) => {
      const newRow = {};
      nonEmptyKeys.forEach((key) => {
        newRow[key] = row[key];
      });
      return newRow;
    });

    // Step 4: Export Excel
    if (ws) {
      XLSX.utils.sheet_add_json(ws, cleanedData, {
        origin: "A3",
        skipHeader: false,
      });
    } else {
      ws = XLSX.utils.json_to_sheet(cleanedData);
    }

    XLSX.utils.book_append_sheet(wb, ws, "FinalInspection");
    XLSX.writeFile(wb, "FinalInspectionMisReport.xlsx");
    setOpenSummaryModal(false);
    setPdfSummary("");
  };

  const exportPDF = (withSummary = false) => {
    const doc = new jsPDF("p", "pt", "a4"); // landscape mode for more width

    // Title
    doc.setFontSize(16);
    doc.text("Production Planning Report", 40, 40);

    // ✅ If summary added by user
    let tableStartY = 70; // default Y position for the table
    if (withSummary && pdfSummary.trim() !== "") {
      doc.setFontSize(11);

      // Wrap summary text properly for long lines
      const splitSummary = doc.splitTextToSize(pdfSummary, 1000); // wrap text width ~1000px
      doc.text(`Summary:`, 40, 70);
      doc.text(splitSummary, 110, 70); // start right after “Summary:”

      // Adjust Y start for table based on how long summary is
      tableStartY = 70 + splitSummary.length * 15;
    }

    // Step 1: Prepare data
    const pdfData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Firm Name": item.companyName || "",
      Discom: item.discom || "",
      "TN No.": item.deliverySchedule?.tnNumber || "",
      Rating: item.deliverySchedule?.rating || "",
      Phase: item.deliverySchedule?.phase || "",
      Wound: item.deliverySchedule?.wound || "Copper",
      Status: item.deliverySchedule?.status || "",
      "Schedule Date": item.deliverySchedule?.scheduleDate
        ? dayjs(item.deliverySchedule.scheduleDate).format("DD MMM YYYY")
        : "",
      "Total Order Qty": item.deliverySchedule?.totalOrderQuantity || "",
      "Qty/Month In Schedule": item.quantityPerMonthInSchedule || "",
      "Supply Due In Current(Month)": item.totalSupplyDueInCurrentMonth || "",
      "Offered Ins. Total": item.offeredForInspectionTotal || "",
      "Final Ins. Total": item.finalInspectionTotal || "",
      "Actual Supplied Total": item.actualSuppliedTotal || "",
      "Balance due to be Insp. Current month":
        item.balanceDueToBeInspectedInCurrentMonth || "",
      "Balance Pending": item.balancePending || "",
      "Tfr Sr. No.": item.snNumber || "",
      "Planned For Month": item.plannedForMonth || "",
    }));

    const head = [Object.keys(pdfData[0] || {})];
    const body = pdfData.map((row) => Object.values(row));

    // ✅ Step 2: Place table below summary dynamically
    autoTable(doc, {
      head,
      body,
      startY: tableStartY,
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 6,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // ✅ Step 3: Save and reset modal
    doc.save("ProductionPlanning.pdf");
    setOpenSummaryModal(false);
    setPdfSummary("");
  };

  const handleModalGenerate = () => {
    if (exportType === "pdf") {
      exportPDF(true);
    } else if (exportType === "excel") {
      exportExcel(true);
    }
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

        {/* Rating Dropdown */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Select Rating"
            fullWidth
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <MenuItem value="all">All Ratings</MenuItem>
            {uniqueRatings.map((r, idx) => (
              <MenuItem key={idx} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Phase Dropdown */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Select Phase"
            fullWidth
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            <MenuItem value="all">All Phases</MenuItem>
            {uniquePhases.map((p, idx) => (
              <MenuItem key={idx} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Offered Date"
              value={selectedDate}
              onChange={(newVal) => setSelectedDate(newVal)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Search */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Search TN No"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>

        {/* Export Buttons */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => handleGenerateExport("excel", true)}
          >
            Export Excel
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => handleGenerateExport("pdf", true)}
          >
            Export PDF
          </Button>
        </Grid>
      </Grid>

      {/* ✅ Summary Modal */}
      <Modal
        open={openSummaryModal}
        onClose={() => setOpenSummaryModal(false)}
        aria-labelledby="summary-modal-title"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              id="summary-modal-title"
              variant="h6"
              sx={{
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Add Summary for{"   "}
            </Typography>

            <Typography
              id="summary-modal-title"
              variant="h6"
              sx={{
                textTransform: "uppercase",
                textAlign: "center",
                fontWeight: "bold",
                mb: 2,
                ml: 1,
              }}
            >
              {"  "}{exportType}
            </Typography>
          </div>

          <TextField
            label="Enter Summary (optional)"
            multiline
            rows={3}
            fullWidth
            value={pdfSummary}
            onChange={(e) => setPdfSummary(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenSummaryModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleModalGenerate}
            >
              Generate {exportType}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductionFilter;
