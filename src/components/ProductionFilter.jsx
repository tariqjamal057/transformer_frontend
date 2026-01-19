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
      excelData.some((row) => row[key] && row[key].toString().trim() !== ""),
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
    // Use landscape orientation to fit all columns like the uploaded PDF
    const doc = new jsPDF("l", "pt", "a4"); // 'l' = landscape mode

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Production Planning Report", pageWidth / 2, 30, {
      align: "center",
    });

    // Handle Summary if present
    let tableStartY = 50;
    if (withSummary && pdfSummary.trim() !== "") {
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");

      const summaryText = `Summary: ${pdfSummary}`;
      const splitSummary = doc.splitTextToSize(summaryText, pageWidth - 80);
      doc.text(splitSummary, 40, 50);

      tableStartY = 50 + splitSummary.length * 12 + 10;
    }

    // Prepare data matching the uploaded PDF structure
    const pdfData = filteredData.map((item, index) => [
      index + 1, // S.No
      item.companyName || "",
      item.discom || "",
      item.deliverySchedule?.tnNumber || "",
      item.deliverySchedule?.rating || "",
      item.deliverySchedule?.phase || "",
      item.deliverySchedule?.wound || "Copper",
      item.deliverySchedule?.status || "",
      item.deliverySchedule?.scheduleDate
        ? dayjs(item.deliverySchedule.scheduleDate).format("DD MMM YYYY")
        : "",
      item.deliverySchedule?.totalOrderQuantity || "",
      item.quantityPerMonthInSchedule || "",
      item.totalSupplyDueInCurrentMonth || "",
      item.offeredForInspectionTotal || "",
      item.finalInspectionTotal || "",
      item.actualSuppliedTotal || "",
      item.balanceDueToBeInspectedInCurrentMonth || "",
      item.balancePending || "",
      item.snNumber || "",
      item.plannedForMonth || "",
    ]);

    // Column headers matching the uploaded PDF exactly
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
      "Qty\nPer\nMonth\nIn\nSchedule",
      "Total\nSupply\nDue In\nCurrent\nMonth",
      "Offered\nFor Ins\nTotal",
      "Final\nIns.\nTotal",
      "Actual\nSupplied\nTotal",
      "Balance\nDue To Be\nIns.\nDuring\nCurrent\nMonth",
      "Balance\nPending",
      "Tfr Sr. No.",
      "Planned\nFor\nMonth",
    ];

    // Custom column widths to match the uploaded PDF layout
    const columnStyles = {
      0: { cellWidth: 30 }, // S.No
      1: { cellWidth: 65 }, // Firm Name
      2: { cellWidth: 40 }, // Discom
      3: { cellWidth: 40 }, // TN No.
      4: { cellWidth: 35 }, // Rating
      5: { cellWidth: 50 }, // Phase
      6: { cellWidth: 40 }, // Wound
      7: { cellWidth: 45 }, // Status
      8: { cellWidth: 55 }, // Schedule Date
      9: { cellWidth: 35 }, // Total Order Qty
      10: { cellWidth: 35 }, // Qty Per Month
      11: { cellWidth: 40 }, // Supply Due
      12: { cellWidth: 35 }, // Offered Ins
      13: { cellWidth: 35 }, // Final Ins
      14: { cellWidth: 35 }, // Actual Supplied
      15: { cellWidth: 40 }, // Balance Due Ins
      16: { cellWidth: 35 }, // Balance Pending
      17: { cellWidth: 55 }, // Tfr Sr. No.
      18: { cellWidth: 40 }, // Planned For Month
    };

    autoTable(doc, {
      head: [headers],
      body: pdfData,
      startY: tableStartY,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 7,
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
      alternateRowStyles: {
        fillColor: [255, 255, 255], // No alternating colors like the uploaded PDF
      },
      margin: { top: 40, right: 20, bottom: 30, left: 20 },
      didDrawPage: function (data) {
        // Add page numbers at the bottom
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${
            doc.internal.getCurrentPageInfo().pageNumber
          } of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 15,
          { align: "center" },
        );
      },
    });

    // Save the PDF
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
