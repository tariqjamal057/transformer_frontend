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
import {
  companies,
  deliverySchedules,
  discoms,
} from "../pages/MisReports/MaterialOfferedButNominationPending";
import dayjs from "dayjs";

// ✅ Dummy Data (replace with props/imports in your real project)

const FiltersComponent = ({
  onFilteredData,
  data,
  text,
  onExportPDF = true,
  onExportExcel = true,
  sheetName = "FinalInspection",
  pdfTitle = "Final Inspection Report",
}) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
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

  // ✅ Export Excel (row-wise expansion like uploaded sample)
  const exportExcelForDI = () => {
    let excelData = [];

    filteredData.forEach((item, index) => {
      const baseDate =
        item.specialCase === "yes"
          ? item.inspectionDate
          : item.diDate || item.inspectionDate;

      let dueJhunjhunu = null;
      let dueOthers = null;

      if (
        item.consignees?.some(
          (c) => c.consignee?.name?.toLowerCase() === "jhunjhunu"
        )
      ) {
        dueJhunjhunu = baseDate
          ? dayjs(baseDate).add(7, "day").format("DD MMM YYYY")
          : "";
      }
      if (
        item.consignees?.some(
          (c) => c.consignee?.name?.toLowerCase() !== "jhunjhunu"
        )
      ) {
        dueOthers = baseDate
          ? dayjs(baseDate).add(12, "day").format("DD MMM YYYY")
          : "";
      }

      const dueDateMerged =
        dueJhunjhunu && dueOthers
          ? `${dueJhunjhunu}, ${dueOthers}`
          : dueJhunjhunu
          ? `${dueJhunjhunu}`
          : dueOthers
          ? `${dueOthers}`
          : "";

      // 👉 Build one row per consignee
      (item.consignees || []).forEach((c, cIdx) => {
        excelData.push({
          "S.No": cIdx === 0 ? index + 1 : "", // show Sr no only for first row
          "Firm Name": cIdx === 0 ? item.companyName : "",
          Discom: cIdx === 0 ? item.discom : "",
          "TN No.": cIdx === 0 ? item.deliverySchedule?.tnNumber : "",
          Material:
            cIdx === 0
              ? `${item.deliverySchedule?.rating || ""} KVA ${
                  item.deliverySchedule?.phase || ""
                }`
              : "",
          "Offered Date":
            cIdx === 0 && item.offeredDate
              ? dayjs(item.offeredDate).format("DD MMM YYYY")
              : "",
          "Inspection Date":
            cIdx === 0 && item.inspectionDate
              ? dayjs(item.inspectionDate).format("DD MMM YYYY")
              : "",
          "Inspected Qty": cIdx === 0 ? item.inspectedQuantity : "",
          "DI No.": cIdx === 0 ? item.diNo : "",
          "DI Date":
            cIdx === 0 && item.diDate
              ? dayjs(item.diDate).format("DD MMM YYYY")
              : "",
          "Due Date of Delivery": cIdx === 0 ? dueDateMerged : "",
          Inspector:
            item.inspectionOfficers && item.inspectionOfficers[cIdx]
              ? item.inspectionOfficers[cIdx]
              : "",

          Consignee: c.consignee?.name || "",
          "SR No.": c.subSnNumber || "",
          Qty: c.quantity || "",
          Dispatch: c.dispatch || "",
          Pending: c.pending || "",
        });
      });

      // 👉 Add blank row after each inspection block
      excelData.push({});
    });

    // ✅ Export to Excel
    const ws = XLSX.utils.json_to_sheet(excelData, { skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  // ✅ Export Excel (merged consignees in one row)
  const exportExcel = () => {
    const excelData = filteredData.map((item, index) => {
      const baseDate =
        item.specialCase === "yes"
          ? item.inspectionDate
          : item.diDate || item.inspectionDate;

      let dueJhunjhunu = null;
      let dueOthers = null;

      if (
        item.consignees?.some(
          (c) => c.consignee?.name?.toLowerCase() === "jhunjhunu"
        )
      ) {
        dueJhunjhunu = baseDate
          ? dayjs(baseDate).add(7, "day").format("DD MMM YYYY")
          : "";
      }
      if (
        item.consignees?.some(
          (c) => c.consignee?.name?.toLowerCase() !== "jhunjhunu"
        )
      ) {
        dueOthers = baseDate
          ? dayjs(baseDate).add(12, "day").format("DD MMM YYYY")
          : "";
      }

      const dueDateMerged =
        dueJhunjhunu && dueOthers
          ? `${dueJhunjhunu}, ${dueOthers}`
          : dueJhunjhunu
          ? `${dueJhunjhunu}`
          : dueOthers
          ? `${dueOthers}`
          : "";

      // 👉 Merge consignee details into one row
      const consigneeNames =
        item.consignees?.map((c) => c.consignee?.name).join(", ") || "";
      const srNumbers =
        item.consignees?.map((c) => c.subSnNumber).join(", ") || "";
      const qtys = item.consignees?.map((c) => c.quantity).join(", ") || "";
      const dispatches =
        item.consignees?.map((c) => c.dispatch).join(", ") || "";
      const pendings = item.consignees?.map((c) => c.pending).join(", ") || "";

      return {
        "S.No": index + 1,
        "Offered Date": item.offeredDate
          ? dayjs(item.offeredDate).format("DD MMM YYYY")
          : "",
        "Firm Name": item.companyName || "",
        Discom: item.discom || "",
        "TN No.": item.deliverySchedule?.tnNumber || "",
        "Material Name": `${item.deliverySchedule?.rating || ""} KVA ${
          item.deliverySchedule?.phase || ""
        }`,
        "Tfr. Serial No.": item.snNumber || "",
        "Offered Qty": item.offeredQuantity || "",
        "Inspection Officers": item.inspectionOfficers?.length
          ? item.inspectionOfficers.join(", ")
          : "",
        "Inspection Date": item.inspectionDate
          ? dayjs(item.inspectionDate).format("DD MMM YYYY")
          : "",
        "Inspected Qty": item.inspectedQuantity || "",
        "D.I. No": item.diNo || "",
        "D.I. Date": item.diDate
          ? dayjs(item.diDate).format("DD MMM YYYY")
          : "",
        "Due Date of Delivery": dueDateMerged,
        "Consignee Name": consigneeNames,
        "SR. NO. OF TFR.": srNumbers,
        Qty: qtys,
        Dispatch: dispatches,
        Pending: pendings,
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
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  // ✅ Click handler decides which function to run
  const handleExcelExport = () => {
    if (onExportExcel) {
      exportExcel(filteredData);
    } else {
      exportExcelForDI(filteredData);
    }
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text(pdfTitle, 14, 10);

    // Step 1: Prepare data with inspection officers
    const pdfData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Offered Date": item.offeredDate || "",
      "Firm Name": item.companyName || "",
      discom: item.discom || "",
      "TN No.": item.deliverySchedule?.tnNumber || "",
      "Material Name": `${item.deliverySchedule?.rating || ""} KVA ${
        item.deliverySchedule?.phase || ""
      }`,
      "Tfr.Serial No.": item.snNumber || "",
      "Offered Qty": item.offeredQuantity || "",
      "Inspection Officers": item.inspectionOfficers?.length
        ? item.inspectionOfficers.join(", ")
        : "",
      "Date Of Inspection": item.inspectionDate || "",
      "Inspected Qty.": item.inspectedQuantity || "",
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

  // ✅ Export PDF (row-wise expansion like Excel)
  const exportPDFForDiReceived = () => {
    const doc = new jsPDF("l", "pt", "a3"); // This line only!

    doc.setFontSize(11);
    doc.text("Final Inspection Report", 14, 10);

    let pdfData = [];

    filteredData.forEach((item, index) => {
      const baseDate =
        item.specialCase === "yes"
          ? item.inspectionDate
          : item.diDate || item.inspectionDate;

      let dueJhunjhunu = null;
      let dueOthers = null;

      if (
        item.consignees?.some(
          (c) => c.consignee?.name?.toLowerCase() === "jhunjhunu"
        )
      ) {
        dueJhunjhunu = baseDate
          ? dayjs(baseDate).add(7, "day").format("DD MMM YYYY")
          : "";
      }
      if (
        item.consignees?.some(
          (c) => c.consignee?.name?.toLowerCase() !== "jhunjhunu"
        )
      ) {
        dueOthers = baseDate
          ? dayjs(baseDate).add(12, "day").format("DD MMM YYYY")
          : "";
      }

      const dueDateMerged =
        dueJhunjhunu && dueOthers
          ? `${dueJhunjhunu}, ${dueOthers}`
          : dueJhunjhunu
          ? `${dueJhunjhunu}`
          : dueOthers
          ? `${dueOthers}`
          : "";

      // 👉 Build one row per consignee
      (item.consignees || [{}]).forEach((c, cIdx) => {
        pdfData.push({
          "S.No": cIdx === 0 ? index + 1 : "",
          "Offered Date":
            cIdx === 0 && item.offeredDate
              ? dayjs(item.offeredDate).format("DD MMM YYYY")
              : "",
          "Firm Name": cIdx === 0 ? item.companyName : "",
          Discom: cIdx === 0 ? item.discom : "",
          "TN No.": cIdx === 0 ? item.deliverySchedule?.tnNumber : "",
          Material:
            cIdx === 0
              ? `${item.deliverySchedule?.rating || ""} KVA ${
                  item.deliverySchedule?.phase || ""
                }`
              : "",
          "TFR Serail No": cIdx === 0 ? item.snNumber : "",
          "Offered Qty": cIdx === 0 ? item.offeredQuantity : "",
          Inspectors:
            item.inspectionOfficers && item.inspectionOfficers[cIdx]
              ? item.inspectionOfficers[cIdx]
              : "",
          "Inspection Date":
            cIdx === 0 && item.inspectionDate
              ? dayjs(item.inspectionDate).format("DD MMM YYYY")
              : "",
          "Inspected Qty": cIdx === 0 ? item.inspectedQuantity : "",
          "DI No.": cIdx === 0 ? item.diNo : "",
          "DI Date":
            cIdx === 0 && item.diDate
              ? dayjs(item.diDate).format("DD MMM YYYY")
              : "",
          "Due Date of Delivery": cIdx === 0 ? dueDateMerged : "",

          Consignee: c?.consignee?.name || "",
          "SR No.": c?.subSnNumber || "",
          Qty: c?.quantity || "",
          "Dispatch qty.": c?.dispatch || "",
          Pending: c?.pending || "",
        });
      });

      // 👉 Add blank row after each inspection block
      pdfData.push({});
    });

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
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 7,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 15, right: 15 },
    });

    // Step 5: Save
    doc.save("FinalInspection.pdf");
  };

  // ✅ Click handler decides which function to run
  const handleExport = () => {
    if (onExportPDF) {
      exportPDF(filteredData);
    } else {
      exportPDFForDiReceived(filteredData);
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
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleExcelExport}
          >
            Export Excel
          </Button>
        </Grid>

        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleExport}
          >
            Export PDF
          </Button>
        </Grid>
      </Grid>

      {/* Summary Boxes */}
      <Grid container spacing={5} sx={{ mt: 2, justifyContent: "center" }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: "#1976d2", borderRadius: "8px" }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Total Final Inspections
            </Typography>
            <Typography variant="h4" sx={{ color: "#fff" }}>
              {data.length}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: "#f57c00", borderRadius: "8px" }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {text}
            </Typography>
            <Typography variant="h4" sx={{ color: "#fff" }}>
              {filteredData.length}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiltersComponent;
