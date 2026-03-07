// FiltersComponent.jsx
import React, { useState, useEffect, useMemo } from "react";
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
import dayjs from "dayjs";

const ProductionFilter = ({
  data = [],
  onFilteredData,
  selectedDate,
  setSelectedDate,
}) => {
  // ✅ State for Modal & Summary Input
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [pdfSummary, setPdfSummary] = useState("");
  const [exportType, setExportType] = useState(null); // 'pdf' or 'excel'

  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredData, setFilteredData] = useState(data);

  // 🔹 Filtering logic
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
        (item) => item.deliverySchedule?.rating === selectedRating,
      );
    }
    if (selectedPhase !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule?.phase === selectedPhase,
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.deliverySchedule?.tnNumber?.toLowerCase().includes(query),
      );
    }

    setFilteredData(result);
    if (onFilteredData) onFilteredData(result);
  }, [
    data,
    selectedCompany,
    selectedDiscom,
    selectedRating,
    selectedPhase,
    searchQuery,
    onFilteredData,
  ]);

  const handleGenerateExport = (type, withSummary = false) => {
    setExportType(type);
    if (withSummary) {
      setOpenSummaryModal(true);
    } else {
      type === "pdf" ? exportPDF() : exportExcel();
    }
  };

  // 🔹 Unique dropdown values from ALL data
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

  // ✅ Export Excel (row-wise expansion like requested)
  const exportExcel = (withSummary = false) => {
    const wb = XLSX.utils.book_new();
    let ws;

    const normalize = (val) =>
      val === null || val === undefined ? "" : String(val).trim();

    let excelRows = [];

    filteredData.forEach((item, index) => {
      const schedules = Array.isArray(item.quantityPerMonthInSchedule)
        ? item.quantityPerMonthInSchedule
        : [];
      const rowCount = Math.max(schedules.length, 1);

      for (let sIdx = 0; sIdx < rowCount; sIdx++) {
        const s = schedules[sIdx] || {};
        const scheduleStr = s.schedule ? `${s.schedule}: ${s.quantity}` : "";

        excelRows.push([
          normalize(sIdx === 0 ? index + 1 : ""),
          normalize(sIdx === 0 ? item.companyName : ""),
          normalize(sIdx === 0 ? item.discom : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.tnNumber : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.rating : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.phase : ""),
          normalize(sIdx === 0 ? (item.deliverySchedule?.wound || "Copper") : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.status : ""),
          normalize(
            sIdx === 0 && item.deliverySchedule?.scheduleDate
              ? dayjs(item.deliverySchedule.scheduleDate).format("DD MMM YYYY")
              : "",
          ),
          normalize(sIdx === 0 ? item.deliverySchedule?.totalOrderQuantity : ""),
          normalize(scheduleStr),
          normalize(sIdx === 0 ? item.totalSupplyDueInCurrentMonth : ""),
          normalize(sIdx === 0 ? item.offeredForInspectionTotal : ""),
          normalize(sIdx === 0 ? item.finalInspectionTotal : ""),
          normalize(sIdx === 0 ? item.actualSuppliedTotal : ""),
          normalize(sIdx === 0 ? item.balanceDueToBeInspectedInCurrentMonth : ""),
          normalize(sIdx === 0 ? item.balancePending : ""),
          normalize(sIdx === 0 ? "" : ""), // item.snNumber
          normalize(sIdx === 0 ? item.plannedForMonth : ""),
        ]);
      }
    });

    const excelHeaders = [
      "S.No",
      "Firm Name",
      "Discom",
      "TN No.",
      "Rating",
      "Phase",
      "Wound",
      "Status",
      "Schedule Date",
      "Total Order Qty",
      "Qty Per Month In Schedule",
      "Total Supply Due In Current Month",
      "Offered For Ins Total",
      "Final Ins. Total",
      "Actual Supplied Total",
      "Balance Due To Be Ins. During Current Month",
      "Balance Pending",
      "Tfr Sr. No.",
      "Planned For Month",
    ];

    const worksheetData = [excelHeaders, ...excelRows];

    if (withSummary && pdfSummary.trim() !== "") {
      ws = XLSX.utils.aoa_to_sheet([[`Summary: ${pdfSummary}`], []]);
      XLSX.utils.sheet_add_aoa(ws, worksheetData, { origin: "A3" });
    } else {
      ws = XLSX.utils.aoa_to_sheet(worksheetData);
    }

    XLSX.utils.book_append_sheet(wb, ws, "ProductionPlanning");
    XLSX.writeFile(wb, "ProductionPlanningMisReport.xlsx");
    setOpenSummaryModal(false);
    setPdfSummary("");
  };

  const exportPDF = (withSummary = false) => {
    // Use landscape orientation to fit all columns
    const doc = new jsPDF("l", "pt", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Production Planning Report", pageWidth / 2, 30, {
      align: "center",
    });

    let tableStartY = 50;
    if (withSummary && pdfSummary.trim() !== "") {
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      const summaryText = `Summary: ${pdfSummary}`;
      const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 80);
      doc.text(splitSummary, 40, 50);
      tableStartY = 50 + splitSummary.length * 12 + 10;
    }

    const normalize = (val) =>
      val === null || val === undefined ? "" : String(val).trim();

    let pdfRows = [];
    filteredData.forEach((item, index) => {
      const schedules = Array.isArray(item.quantityPerMonthInSchedule)
        ? item.quantityPerMonthInSchedule
        : [];
      const rowCount = Math.max(schedules.length, 1);

      for (let sIdx = 0; sIdx < rowCount; sIdx++) {
        const s = schedules[sIdx] || {};
        const scheduleStr = s.schedule ? `${s.schedule}: ${s.quantity}` : "";

        pdfRows.push([
          normalize(sIdx === 0 ? index + 1 : ""),
          normalize(sIdx === 0 ? item.companyName : ""),
          normalize(sIdx === 0 ? item.discom : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.tnNumber : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.rating : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.phase : ""),
          normalize(sIdx === 0 ? (item.deliverySchedule?.wound || "Copper") : ""),
          normalize(sIdx === 0 ? item.deliverySchedule?.status : ""),
          normalize(
            sIdx === 0 && item.deliverySchedule?.scheduleDate
              ? dayjs(item.deliverySchedule.scheduleDate).format("DD MMM YYYY")
              : "",
          ),
          normalize(sIdx === 0 ? item.deliverySchedule?.totalOrderQuantity : ""),
          normalize(scheduleStr),
          normalize(sIdx === 0 ? item.totalSupplyDueInCurrentMonth : ""),
          normalize(sIdx === 0 ? item.offeredForInspectionTotal : ""),
          normalize(sIdx === 0 ? item.finalInspectionTotal : ""),
          normalize(sIdx === 0 ? item.actualSuppliedTotal : ""),
          normalize(sIdx === 0 ? item.balanceDueToBeInspectedInCurrentMonth : ""),
          normalize(sIdx === 0 ? item.balancePending : ""),
          normalize(sIdx === 0 ? "" : ""), //item.snNumber
          normalize(sIdx === 0 ? item.plannedForMonth : ""),
        ]);
      }
    });

    const headers = [
      "S.No",
      "Firm Name",
      "Discom",
      "TN No.",
      "Rating",
      "Phase",
      "Wound",
      "Status",
      "Schedule Date",
      "Total\nOrder\nQty",
      "Qty Per\nMonth In\nSchedule",
      "Total\nSupply\nDue In\nCurr.\nMonth",
      "Off.\nFor Ins\nTotal",
      "Final\nIns.\nTotal",
      "Act.\nSupp.\nTotal",
      "Bal.\nDue Ins.\nCurr.\nMonth",
      "Bal.\nPend.",
      "Tfr Sr.\nNo.",
      "Plan\nFor\nMonth",
    ];

    const columnStyles = {
      0: { cellWidth: 25 }, // S.No
      1: { cellWidth: 60 }, // Firm Name
      2: { cellWidth: 35 }, // Discom
      3: { cellWidth: 35 }, // TN No.
      4: { cellWidth: 30 }, // Rating
      5: { cellWidth: 45 }, // Phase
      6: { cellWidth: 35 }, // Wound
      7: { cellWidth: 40 }, // Status
      8: { cellWidth: 50 }, // Schedule Date
      9: { cellWidth: 30 }, // Total Order Qty
      10: { cellWidth: 80 }, // Qty Per Month (Increased for readability)
      11: { cellWidth: 35 }, // Supply Due
      12: { cellWidth: 30 }, // Offered Ins
      13: { cellWidth: 30 }, // Final Ins
      14: { cellWidth: 30 }, // Actual Supplied
      15: { cellWidth: 35 }, // Balance Due Ins
      16: { cellWidth: 30 }, // Balance Pending
      17: { cellWidth: 50 }, // Tfr Sr. No.
      18: { cellWidth: 35 }, // Planned For Month
    };

    autoTable(doc, {
      head: [headers],
      body: pdfRows,
      startY: tableStartY,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 6,
        fontStyle: "bold",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: "center",
        valign: "middle",
        minCellHeight: 25,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      columnStyles: columnStyles,
      margin: { top: 40, right: 15, bottom: 30, left: 15 },
      didDrawPage: function (data) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 15,
          { align: "center" },
        );
      },
    });

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
              format="DD/MM/YYYY"
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
              {"  "}
              {exportType}
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
