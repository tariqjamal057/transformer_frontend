// FiltersComponent.jsx
import React, { useState, useEffect, useMemo } from "react";
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
import api from "../services/api";

const FiltersComponent = ({
  onFilteredData,
  data = [],
  text,
  onExportPDF = true,
  onExportExcel = true,
  sheetName = "FinalInspection",
  pdfTitle,
  dueDateofDeliveryIncluded = true,
  exportMode = "default",
}) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [filteredData, setFilteredData] = useState(data);

  // 🔹 Filtering logic
  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : []; // Defensive check

    if (selectedCompany !== "all") {
      result = result.filter((item) => {
        const company =
          item.companyName ||
          item.deliverySchedule?.supplyTender?.company?.name ||
          item.supplyTender?.company?.name;
        return company === selectedCompany;
      });
    }

    if (selectedDiscom !== "all") {
      result = result.filter((item) => {
        const discom =
          item.discom ||
          item.deliverySchedule?.supplyTender?.discom ||
          item.deliverySchedule?.supplyTender?.name ||
          item.supplyTender?.name;
        return discom === selectedDiscom;
      });
    }

    if (selectedRating !== "all") {
      result = result.filter(
        (item) => item.deliverySchedule?.rating === selectedRating,
      );
    }

    if (selectedPhase !== "all") {
      result = result.filter(
        (item) =>
          item.deliverySchedule?.phase?.toLowerCase() ===
          selectedPhase.toLowerCase(),
      );
    }

    if (selectedDate) {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      result = result.filter(
        (item) =>
          item.offerDate &&
          dayjs(item.offerDate).format("YYYY-MM-DD") === dateStr,
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.deliverySchedule?.tnNumber?.toLowerCase()?.includes(query) ||
          item.inspectionOfficers?.some((officer) =>
            officer.toLowerCase().includes(query),
          ),
      );
    }

    setFilteredData(result);
    onFilteredData(result);
  }, [
    data, // Keep data in dependency array
    selectedCompany,
    selectedDiscom,
    selectedRating,
    selectedPhase,
    searchQuery,
    selectedDate,
  ]);

  // 🔹 Unique dropdown values from ALL data
  const uniqueCompanies = useMemo(() => {
    const companies = data
      ?.map(
        (item) =>
          item.companyName ||
          item.deliverySchedule?.supplyTender?.company?.name ||
          item.supplyTender?.company?.name,
      )
      .filter((c) => c !== undefined && c !== null && c !== "");
    return [...new Set(companies)];
  }, [data]);

  const uniqueDiscoms = useMemo(() => {
    const discoms = data
      ?.map(
        (item) =>
          item.discom ||
          item.supplyTender?.name ||
          item.deliverySchedule?.supplyTender?.name,
      )
      .filter((d) => d !== undefined && d !== null && d !== "");
    return [...new Set(discoms)];
  }, [data]);

  const uniqueRatings = useMemo(() => {
    const ratings = data
      ?.map((item) => item.deliverySchedule?.rating)
      .filter((r) => r !== undefined && r !== null);
    return [...new Set(ratings)];
  }, [data]);

  const uniquePhases = useMemo(() => {
    const phases = data
      ?.map((item) => item.deliverySchedule?.phase)
      .filter((p) => p !== undefined && p !== null && p !== "");
    return [...new Set(phases)];
  }, [data]);

  // ✅ Export Excel (row-wise expansion like uploaded sample)
  const exportExcelForDI = () => {
    const normalize = (val) =>
      val === null || val === undefined ? "" : String(val).trim();

    let excelRows = [];

    filteredData.forEach((item, index) => {
      const baseDate =
        item.specialCase === "yes"
          ? item.inspectionDate
          : item.diDate || item.inspectionDate;

      const consignees = Array.isArray(item.consignees) ? item.consignees : [];

      const inspectors = Array.isArray(item.inspectionOfficers)
        ? item.inspectionOfficers
        : [];

      const rowCount = Math.max(consignees.length, inspectors.length, 1);

      for (let cIdx = 0; cIdx < rowCount; cIdx++) {
        const c = consignees[cIdx] || {};

        const getDueDateForConsignee = (consignee) => {
          const cName = consignee?.consigneeName || consignee?.consignee?.name;
          if (!baseDate || !cName) return "";

          const name = cName.toLowerCase();

          const days = name === "jhunjhunu" ? 7 : 12;

          return dayjs(baseDate).add(days, "day").format("DD MMM YYYY");
        };

        excelRows.push([
          normalize(cIdx === 0 ? index + 1 : ""),
          normalize(
            cIdx === 0 && item.offeredDate
              ? dayjs(item.offeredDate).format("DD MMM YYYY")
              : "",
          ),
          normalize(cIdx === 0 ? item.companyName : ""),
          normalize(cIdx === 0 ? item.discom : ""),
          normalize(cIdx === 0 ? item.deliverySchedule?.tnNumber : ""),
          normalize(
            cIdx === 0
              ? `${item.deliverySchedule?.rating || ""} KVA ${
                  item.deliverySchedule?.phase || ""
                }`
              : "",
          ),
          normalize(cIdx === 0 ? item.snNumber : ""),
          normalize(cIdx === 0 ? item.offeredQuantity : ""),

          // ✅ FIXED INSPECTOR LOGIC
          normalize(cIdx < inspectors.length ? inspectors[cIdx] : ""),

          normalize(
            cIdx === 0 && item.inspectionDate
              ? dayjs(item.inspectionDate).format("DD MMM YYYY")
              : "",
          ),
          normalize(cIdx === 0 ? item.inspectedQuantity : ""),
          normalize(cIdx === 0 ? item.diNo : ""),
          normalize(
            cIdx === 0 && item.diDate
              ? dayjs(item.diDate).format("DD MMM YYYY")
              : "",
          ),
          // ✅ CONDITIONAL COLUMN
          ...(dueDateofDeliveryIncluded
            ? [normalize(getDueDateForConsignee(c))]
            : []),
          normalize(c?.consigneeName || c?.consignee?.name),
          normalize(c?.subSnNumber),
          normalize(c?.quantity),
          normalize(c?.dispatch),
          normalize(c?.pending),
        ]);
      }
    });

    const excelHeaders = [
      "S.No",
      "Offered Date",
      "Firm Name",
      "Discom",
      "TN No.",
      "Material",
      "TFR Serial No",
      "Offered Qty",
      "Inspectors",
      "Inspection Date",
      "Inspected Qty",
      "DI No.",
      "DI Date",
      ...(dueDateofDeliveryIncluded ? ["Due Date of Delivery"] : []),
      "Consignee",
      "SR No.",
      "Qty",
      "Dispatch",
      "Pending",
    ];

    const hasDataInColumn = (colIndex) => {
      return excelRows.some((row) => row[colIndex] !== "");
    };

    const visibleHeaders = [];
    const visibleIndexes = [];

    excelHeaders.forEach((header, index) => {
      if (hasDataInColumn(index)) {
        visibleHeaders.push(header);
        visibleIndexes.push(index);
      }
    });

    const filteredRows = excelRows.map((row) =>
      visibleIndexes.map((i) => row[i]),
    );

    // ✅ Export to Excel
    const worksheetData = [visibleHeaders, ...filteredRows];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 30));
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
          (c) =>
            (c.consigneeName || c.consignee?.name)?.toLowerCase() ===
            "jhunjhunu",
        )
      ) {
        dueJhunjhunu = baseDate
          ? dayjs(baseDate).add(7, "day").format("DD MMM YYYY")
          : "";
      }
      if (
        item.consignees?.some(
          (c) =>
            (c.consigneeName || c.consignee?.name)?.toLowerCase() !==
            "jhunjhunu",
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
        item.consignees
          ?.map(
            (c) =>
              c.consignee?.consigneeName ||
              c.consignee?.name ||
              c?.consigneeName,
          )
          .join(", ") || "";
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
    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    const _sheetName = sheetName.slice(0, 30);
    XLSX.utils.book_append_sheet(wb, ws, _sheetName);

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  // ✅ Click handler decides which function to run
  const handleExcelExport = () => {
    if (exportMode === "di") {
      exportExcelForDI(filteredData);
    } else {
      exportExcel(filteredData);
    }
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4"); // Landscape A4

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ✅ Centered title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(pdfTitle, pageWidth / 2, 25, { align: "center" });

    // Step 1: Prepare data as array
    const pdfData = filteredData.map((item, index) => [
      index + 1, // S.No
      item.offeredDate ? dayjs(item.offeredDate).format("DD MMM YYYY") : "",
      item.companyName || "",
      item.discom || "",
      item.deliverySchedule?.tnNumber || "",
      `${item.deliverySchedule?.rating || ""} KVA ${
        item.deliverySchedule?.phase || ""
      }`,
      item.snNumber || "",
      item.offeredQuantity || 0,
      item.inspectionOfficers?.length ? item.inspectionOfficers.join(", ") : "",
      item.inspectionDate
        ? dayjs(item.inspectionDate).format("DD MMM YYYY")
        : "",
      item.inspectedQuantity,
    ]);

    // Column headers
    const headers = [
      "S.No",
      "Offered\nDate",
      "Firm Name",
      "Discom",
      "TN No.",
      "Material\nName",
      "Tfr.Serial\nNo.",
      "Offered\nQty",
      "Inspection\nOfficers",
      "Date Of\nInspection",
      "Inspected\nQty.",
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
      filteredColumnIndices.map((index) => row[index]),
    );

    // Custom column widths
    const getColumnStyles = () => {
      const styles = {};
      const baseWidths = {
        0: 35, // S.No
        1: 60, // Offered Date
        2: 100, // Firm Name
        3: 60, // Discom
        4: 60, // TN No.
        5: 80, // Material Name
        6: 70, // Tfr Serial No
        7: 50, // Offered Qty
        8: 120, // Inspection Officers
        9: 70, // Date Of Inspection
        10: 60, // Inspected Qty
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
          { align: "center" },
        );
      },
    });

    doc.save(`${sheetName}.pdf`);
  };

  // ✅ Export PDF - DI Received (Table Format with Row Expansion)
  const exportPDFForDiReceived = () => {
    const doc = new jsPDF("l", "pt", "a4"); // Landscape A4

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ✅ Centered title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(pdfTitle, pageWidth / 2, 25, { align: "center" });

    let pdfData = [];

    const normalize = (val) =>
      val === null || val === undefined ? "" : String(val).trim();

    filteredData.forEach((item, index) => {
      const baseDate =
        item.specialCase === "yes"
          ? item.inspectionDate
          : item.diDate || item.inspectionDate;

      const consignees = Array.isArray(item.consignees) ? item.consignees : [];

      const inspectors = Array.isArray(item.inspectionOfficers)
        ? item.inspectionOfficers
        : [];

      const rowCount = Math.max(consignees.length, inspectors.length, 1);

      for (let cIdx = 0; cIdx < rowCount; cIdx++) {
        const c = consignees[cIdx] || {};

        const getDueDateForConsignee = (consignee) => {
          const cName = consignee?.consigneeName || consignee?.consignee?.name;
          if (!baseDate || !cName) return "";

          const name = cName.toLowerCase();

          const days = name === "jhunjhunu" ? 7 : 12;

          return dayjs(baseDate).add(days, "day").format("DD MMM YYYY");
        };

        pdfData.push([
          normalize(cIdx === 0 ? index + 1 : ""),
          normalize(
            cIdx === 0 && item.offeredDate
              ? dayjs(item.offeredDate).format("DD MMM YYYY")
              : "",
          ),
          normalize(cIdx === 0 ? item.companyName : ""),
          normalize(cIdx === 0 ? item.discom : ""),
          normalize(cIdx === 0 ? item.deliverySchedule?.tnNumber : ""),
          normalize(
            cIdx === 0
              ? `${item.deliverySchedule?.rating || ""} KVA ${
                  item.deliverySchedule?.phase || ""
                }`
              : "",
          ),
          normalize(cIdx === 0 ? item.snNumber : ""),
          normalize(cIdx === 0 ? item.offeredQuantity : ""),

          // ✅ FIXED INSPECTOR LOGIC
          normalize(cIdx < inspectors.length ? inspectors[cIdx] : ""),

          normalize(
            cIdx === 0 && item.inspectionDate
              ? dayjs(item.inspectionDate).format("DD MMM YYYY")
              : "",
          ),
          normalize(cIdx === 0 ? item.inspectedQuantity : ""),
          normalize(cIdx === 0 ? item.diNo : ""),
          normalize(
            cIdx === 0 && item.diDate
              ? dayjs(item.diDate).format("DD MMM YYYY")
              : "",
          ),
          ...(dueDateofDeliveryIncluded
            ? [normalize(getDueDateForConsignee(c))]
            : []),
          normalize(c?.consigneeName || c?.consignee?.name),
          normalize(c?.subSnNumber),
          normalize(c?.quantity),
          normalize(c?.dispatch),
          normalize(c?.pending),
        ]);
      }
    });

    // Column headers
    const headers = [
      "S.No",
      "Offered\nDate",
      "Firm\nName",
      "Discom",
      "TN No.",
      "Material",
      "TFR\nSerial\nNo",
      "Offered\nQty",
      "Inspectors",
      "Inspection\nDate",
      "Inspected\nQty",
      "DI No.",
      "DI Date",
      ...(dueDateofDeliveryIncluded ? ["Due Date of Delivery"] : []),
      "Consignee",
      "SR No.",
      "Qty",
      "Dispatch",
      "Pending",
    ];

    const hasDataInColumn = (colIndex) => {
      return pdfData.some((row) => row[colIndex] !== "");
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
      filteredColumnIndices.map((index) => row[index]),
    );

    // Custom column widths - reduced to fit all 18 columns properly
    const getColumnStyles = () => {
      const styles = {};
      const baseWidths = {
        0: 26,
        1: 44,
        2: 56,
        3: 40,
        4: 40,
        5: 50,
        6: 46,
        7: 36,
        8: 58,
        9: 48,
        10: 40,
        11: 44,
        12: 44,
        13: 56, // Due Date
        14: 58, // Consignee
        15: 38,
        16: 30,
        17: 38,
        18: 38, // Pending
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

    // Small, equal gap on both sides
    const horizontalMargin = Math.max((pageWidth - totalTableWidth) / 2, 8);

    autoTable(doc, {
      head: [filteredHeaders],
      body: filteredBody,
      startY: 40,
      theme: "grid",
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        textColor: [0, 0, 0],
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [255, 255, 255], // White background
        textColor: [0, 0, 0], // Black text
        fontSize: 6,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        minCellHeight: 22,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      columnStyles: columnStyles,

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
          { align: "center" },
        );
      },
    });

    doc.save(`${sheetName}.pdf`);
  };

  // ✅ Click handler decides which function to run
  const handleExport = () => {
    if (exportMode === "di") {
      exportPDFForDiReceived(filteredData);
    } else {
      exportPDF(filteredData);
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
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleExcelExport}
            disabled={!onExportExcel}
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
            disabled={!onExportPDF}
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
