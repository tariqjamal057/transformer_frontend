import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ⬅️ import as a function
import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

export const gpFailureDatas = [
  {
    id: "1",
    trfSiNo: 4907,
    rating: "100",
    companyName: "Kalpana Industries",
    discom: "Ajmer",
    createdAt: "2025-08-30",
  },
  {
    id: "2",
    trfSiNo: 4908,
    rating: "100",
    companyName: "Kalpana Industries",
    discom: "Ajmer",
    createdAt: "2025-08-05",
  },
  {
    id: "3",
    trfSiNo: 4909,
    rating: "100",
    companyName: "Kalpana Industries",
    discom: "Jaipur",
    createdAt: "2025-07-28",
  },
  {
    id: "4",
    trfSiNo: 4910,
    rating: "100",
    companyName: "Kalpana Industries",
    discom: "Jaipur",
    createdAt: "2025-07-18",
  },
  {
    id: "5",
    trfSiNo: 4911,
    rating: "100",
    companyName: "Kalpana Industries",
    discom: "Jodhpur",
    createdAt: "2025-07-15",
  },
  {
    id: "6",
    trfSiNo: 4912,
    rating: "100",
    companyName: "Yash Granties",
    discom: "Ajmer",
    createdAt: "2025-06-15",
  },
  {
    id: "7",
    trfSiNo: 4913,
    rating: "100",
    companyName: "Yash Granties",
    discom: "Jaipur",
    createdAt: "2025-06-12",
  },
  {
    id: "8",
    trfSiNo: 4914,
    rating: "100",
    companyName: "Kalpana Granties",
    discom: "Jodhpur",
    createdAt: "2025-06-10",
  },
];

export const finalInspectionDetails = [
  {
    id: "1",
    offeredDate: "2025-07-12",
    offeredQuantity: 150,
    serialNumberFrom: 4912,
    serialNumberTo: 5061,
    snNumber: "4912 TO 5061",
    nominationLetterNo: "NL/2025/001",
    nominationDate: "2025-07-10",
    inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
    inspectionDate: "2025-07-13",
    inspectedQuantity: 150,
    total: 150,
    diNo: "DI/2025/1001",
    diDate: "2025-07-16",
    consignees: [
      {
        consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
        quantity: 50,
        dispatch: 0,
        pending: 50,
        subSnNumber: "4912 TO 4961",
        subSealingStatements: [
          {
            trfsiNo: 4912,
            polySealNo: "IAJ 5301 To IAJ 5302",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 4913,
            polySealNo: "IAJ 5303 To IAJ 5304",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 4914,
            polySealNo: "IAJ 5305 To IAJ 5306",
            status: "active",
          },
          {
            trfsiNo: 4915,
            polySealNo: "IAJ 5307 To IAJ 5308",
            status: "active",
          },
          {
            trfsiNo: 4916,
            polySealNo: "IAJ 5309 To IAJ 5310",
            status: "repaired",
            redispatched: false,
          },
        ],
      },
      {
        consignee: { id: "2", name: "XYZ Transformers Ltd." },
        quantity: 50,
        dispatch: 0,
        pending: 50,
        subSnNumber: "4962 TO 5011",
        subSealingStatements: [
          {
            trfsiNo: 4962,
            polySealNo: "IAJ 5311 To IAJ 5312",
            status: "active",
          },
          {
            trfsiNo: 4963,
            polySealNo: "IAJ 5313 To IAJ 5314",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 4964,
            polySealNo: "IAJ 5315 To IAJ 5316",
            status: "repaired",
            redispatched: false,
          },
          {
            trfsiNo: 4965,
            polySealNo: "IAJ 5317 To IAJ 5318",
            status: "active",
          },
          {
            trfsiNo: 4966,
            polySealNo: "IAJ 5319 To IAJ 5320",
            status: "active",
          },
        ],
      },
      {
        consignee: { id: "3", name: "GreenVolt Energy Systems" },
        quantity: 50,
        dispatch: 0,
        pending: 50,
        subSnNumber: "5012 TO 5061",
        subSealingStatements: [
          {
            trfsiNo: 5012,
            polySealNo: "IAJ 5321 To IAJ 5322",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 5013,
            polySealNo: "IAJ 5323 To IAJ 5324",
            status: "repaired",
            redispatched: false,
          },
          {
            trfsiNo: 5014,
            polySealNo: "IAJ 5325 To IAJ 5326",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 5015,
            polySealNo: "IAJ 5327 To IAJ 5328",
            status: "active",
          },
          {
            trfsiNo: 5016,
            polySealNo: "IAJ 5329 To IAJ 5330",
            status: "active",
          },
        ],
      },
    ],
    companyName: "Kalpana Industries",
    discom: "Ajmer",
    createdAt: "2025-07-01",
  },
  {
    id: "2",
    offeredDate: "2025-08-05",
    offeredQuantity: 150,
    serialNumberFrom: 4912,
    serialNumberTo: 5061,
    snNumber: "4912 TO 5061",
    nominationLetterNo: "NL/2025/002",
    nominationDate: "2025-08-03",
    inspectionOfficers: ["Amit Verma", "Priya Singh"],
    inspectionDate: "2025-08-06",
    inspectedQuantity: 150,
    total: 150,
    diNo: "DI/2025/1002",
    diDate: "2025-08-08",
    consignees: [
      {
        consignee: { id: "2", name: "XYZ Transformers Ltd." },
        quantity: 70,
        dispatch: 0,
        pending: 70,
        subSnNumber: "4912 TO 4981",
        subSealingStatements: [
          {
            trfsiNo: 4912,
            polySealNo: "IAJ 5331 To IAJ 5332",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 4913,
            polySealNo: "IAJ 5333 To IAJ 5334",
            status: "repaired",
            redispatched: false,
          },
          {
            trfsiNo: 4914,
            polySealNo: "IAJ 5335 To IAJ 5336",
            status: "active",
          },
          {
            trfsiNo: 4915,
            polySealNo: "IAJ 5337 To IAJ 5338",
            status: "active",
          },
          {
            trfsiNo: 4916,
            polySealNo: "IAJ 5339 To IAJ 5340",
            status: "repaired",
            redispatched: true,
          },
        ],
      },
      {
        consignee: { id: "3", name: "GreenVolt Energy Systems" },
        quantity: 80,
        dispatch: 0,
        pending: 80,
        subSnNumber: "4982 TO 5061",
        subSealingStatements: [
          {
            trfsiNo: 4982,
            polySealNo: "IAJ 5341 To IAJ 5342",
            status: "active",
          },
          {
            trfsiNo: 4983,
            polySealNo: "IAJ 5343 To IAJ 5344",
            status: "repaired",
            redispatched: false,
          },
          {
            trfsiNo: 4984,
            polySealNo: "IAJ 5345 To IAJ 5346",
            status: "repaired",
            redispatched: true,
          },
          {
            trfsiNo: 4985,
            polySealNo: "IAJ 5347 To IAJ 5348",
            status: "active",
          },
          {
            trfsiNo: 4986,
            polySealNo: "IAJ 5349 To IAJ 5350",
            status: "active",
          },
        ],
      },
    ],
    companyName: "Yash Granties",
    discom: "Jaipur",
    createdAt: "2025-06-15",
  },
];

const NewGPTransformersFilter = ({ data = [], onFilteredData, cards = [] }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  // 🔹 Unique dropdown values from ALL data
  const uniqueCompanies = useMemo(
    () => [...new Set(data.map((item) => item.companyName).filter(Boolean))],
    [data],
  );
  const uniqueDiscoms = useMemo(
    () => [...new Set(data.map((item) => item.discom).filter(Boolean))],
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
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.deliverySchedule?.tnNumber?.toLowerCase().includes(query) ||
          item.companyName?.toLowerCase().includes(query) ||
          item.discom?.toLowerCase().includes(query) ||
          String(item.deliverySchedule?.rating).toLowerCase().includes(query),
      );
    }

    setFilteredData(result);
    if (onFilteredData) onFilteredData(result);
  }, [data, selectedCompany, selectedDiscom, searchQuery, onFilteredData]);

  const exportExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    // Build dynamic sheet name
    let sheetName = "Information of new G.P. transformers";
    if (selectedCompany !== "all") {
      sheetName += ` - Firm: ${selectedCompany}`;
    }
    if (selectedDiscom !== "all") {
      sheetName += ` - Discom: ${selectedDiscom}`;
    }

    // Step 1: Prepare data same as PDF
    const excelData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Company Name": item.companyName,
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
      "Total Qty Pending Including Inspected":
        item.totalPendingIncludingInspected,
      "Inspected But Not Dispatched": item.inspectedButNotDispatched,
    }));

    // Step 2: Find non-empty columns
    const allKeys = Object.keys(excelData[0] || {});
    const nonEmptyKeys = allKeys.filter((key) =>
      excelData.some((row) => row[key] && row[key].toString().trim() !== ""),
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
    const _sheetName = sheetName.slice(0, 30);
    XLSX.utils.book_append_sheet(workbook, worksheet, _sheetName);

    // Step 6: Save Excel file
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  // ✅ Export PDF (LANDSCAPE) - Table Format with Black Borders
  const exportPDF = () => {
    // ✅ Landscape A4
    const doc = new jsPDF("l", "pt", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let title = "Information of new G.P. transformers";
    if (selectedCompany !== "all") {
      title += ` - Firm: ${selectedCompany}`;
    }
    if (selectedDiscom !== "all") {
      title += ` - Discom: ${selectedDiscom}`;
    }

    // ✅ Centered title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(title, pageWidth / 2, 25, { align: "center" });

    // Step 1: Prepare data with proper structure
    const pdfData = filteredData.map((item, index) => [
      index + 1, // S.No
      item.companyName || "",
      item.deliverySchedule?.tnNumber || "",
      item.discom || "",
      item.deliverySchedule?.rating || "",
      item.deliverySchedule?.phase || "",
      item.deliverySchedule?.wound || "",
      item.totalSuppliedNewTillDate ?? 0,
      item.totalReceivedUnderGPTillDate ?? 0,
      item.totalInspectedTillDate ?? 0,
      item.totalDispatchedTillDate ?? 0,
      item.totalPendingIncludingInspected ?? 0,
      item.inspectedButNotDispatched ?? 0,
    ]);

    // Column headers with line breaks for better fit
    const headers = [
      "S.No",
      "Company\nName",
      "Tn No",
      "Discom",
      "Rating",
      "Phase",
      "Wound",
      "Total Qty\nSupplied\n(New) Till\nDate",
      "Total Qty\nReceived\nUnder G.P.\nTill Date",
      "Total Qty\nInspected\nTill Date",
      "Total Qty\nDispatched\nTill Date",
      "Total Qty\nPending\nIncluding\nInspected",
      "Inspected\nBut Not\nDispatched",
    ];

    // Filter out columns that have no data (all empty/null/undefined)
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

    // Create filtered headers and data
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

    // Custom column widths - adjusted for 13 columns in landscape
    const getColumnStyles = () => {
      const styles = {};
      const baseWidths = {
        0: 35, // S.No
        1: 80, // Company Name
        2: 50, // Tn No
        3: 55, // Discom
        4: 45, // Rating
        5: 50, // Phase
        6: 50, // Wound
        7: 55, // Total Qty Supplied
        8: 60, // Total Qty Received
        9: 55, // Total Qty Inspected
        10: 55, // Total Qty Dispatched
        11: 60, // Total Qty Pending
        12: 55, // Inspected But Not Dispatched
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
          { align: "center" },
        );
      },
    });

    // Step 5: Save
    doc.save("Information_of_new_GP_transformers.pdf");
  };

  const handleResetFilters = () => {
    setSelectedCompany("all");
    setSelectedDiscom("all");
    setSearchQuery("");
  };

  return (
    <Box sx={{ p: 2, background: "#f5f5f5", borderRadius: "12px" }}>
      <Grid container spacing={2} alignItems="center" mb={3}>
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

        {/* Search */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Search by Firm, Discom, Rating"
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

        <Grid item xs={12} md={3}>
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

      {/* 🔹 MIS CARDS */}
      <Grid container spacing={2} mb={3}>
        {cards.map((c, idx) => (
          <Grid item xs={12} md={2.4} key={idx}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: c.color,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "white" }}
              >
                {c.title}
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mt: 1, color: "white" }}
              >
                {c.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Buttons */}
      <Box display="flex" justifyContent="center" gap={3}>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 5, py: 1.5, borderRadius: 3 }}
          onClick={() => (window.location.href = "/new-gp-summary")}
        >
          View Summary
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ px: 5, py: 1.5, borderRadius: 3 }}
          onClick={() => (window.location.href = "/new-gp-expired-statement")}
        >
          Supply G.P. Expiry Statement
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ px: 5, py: 1.5, borderRadius: 3 }}
          onClick={() => (window.location.href = "/gp-extended-warranty")}
        >
          G.P. Extended Warranty Information
        </Button>
      </Box>
    </Box>
  );
};

export default NewGPTransformersFilter;
