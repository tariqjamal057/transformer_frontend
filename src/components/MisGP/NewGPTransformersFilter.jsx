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
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);
import {
  companies,
  deliverySchedules,
  discoms,
} from "../../pages/MisReports/MaterialOfferedButNominationPending";

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

const NewGPTransformersFilter = ({ onFilteredData, data }) => {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDiscom, setSelectedDiscom] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.companyName?.toLowerCase().includes(lowercasedQuery) ||
          item.discom?.toLowerCase().includes(lowercasedQuery) ||
          item.deliverySchedule?.rating
            ?.toLowerCase()
            .includes(lowercasedQuery)
      );
    }

    setFilteredData(result);
    onFilteredData(result);
  }, [data, selectedCompany, selectedDiscom, searchQuery]);

  // 🔹 Unique dropdown values from ALL data
  const uniqueCompanies = [...new Set(companies.map((item) => item.name))];
  const uniqueDiscoms = [...new Set(discoms.map((item) => item.name))];

  // ---- 🔹 MIS COUNTERS ----
  // 1️⃣ Total Supplied (sum of offeredQuantity in filtered inspectionDetails)
  const totalSupplied = deliverySchedules
    .filter((item) => {
      return (
        (selectedCompany === "all" || item.companyName === selectedCompany) &&
        (selectedDiscom === "all" || item.discom === selectedDiscom)
      );
    })
    .reduce((sum, item) => sum + (parseInt(item.totalQuantity) || 0), 0);

  // 2️⃣ Total Received under G.P. (length of gpFailureDatas)
  const totalReceived = gpFailureDatas.filter((item) => {
    return (
      (selectedCompany === "all" || item.companyName === selectedCompany) &&
      (selectedDiscom === "all" || item.discom === selectedDiscom)
    );
  }).length;

  // 3️⃣ Total Inspected as on Date (repaired + has inspectionDate)
  const totalInspected = finalInspectionDetails
    .filter(
      (item) =>
        (selectedCompany === "all" || item.companyName === selectedCompany) &&
        (selectedDiscom === "all" || item.discom === selectedDiscom)
    )
    .reduce((sum, item) => {
      let count = 0;
      if (item.inspectionDate) {
        item.consignees?.forEach((c) => {
          c.subSealingStatements?.forEach((s) => {
            if (s.status === "repaired") count++;
          });
        });
      }
      return sum + count;
    }, 0);

  // 4️⃣ Total Dispatch as on Date (repaired + redispatched true)
  const totalDispatch = finalInspectionDetails
    .filter(
      (item) =>
        (selectedCompany === "all" || item.companyName === selectedCompany) &&
        (selectedDiscom === "all" || item.discom === selectedDiscom)
    )
    .reduce((sum, item) => {
      let count = 0;
      item.consignees?.forEach((c) => {
        c.subSealingStatements?.forEach((s) => {
          if (s.status === "repaired" && s.redispatched) count++;
        });
      });
      return sum + count;
    }, 0);

  // 5️⃣ Pending = Total Received - Total Dispatch
  const totalPending = totalReceived - totalDispatch;

  const cards = [
    { title: "Total Qty Supplied", value: totalSupplied, color: "#3498db" },
    {
      title: "Total Qty Received Under G.P.",
      value: totalReceived,
      color: "#27ae60",
    },
    {
      title: "Total Inspected As On Date",
      value: totalInspected,
      color: "#8e44ad",
    },
    {
      title: "Total Dispatch As On Date",
      value: totalDispatch,
      color: "#e67e22",
    },
    { title: "Total Pending", value: totalPending, color: "#c0392b" },
  ];

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
      excelData.some((row) => row[key] && row[key].toString().trim() !== "")
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

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    let title = "Information of new G.P. transformers";
    if (selectedCompany !== "all") {
      title += ` - Firm: ${selectedCompany}`;
    }
    if (selectedDiscom !== "all") {
      title += ` - Discom: ${selectedDiscom}`;
    }

    doc.text(title, 14, 10);

    // Step 1: Prepare data with inspection officers
    const pdfData = filteredData.map((item, index) => ({
      "S.No": index + 1,
      "Company Name": item.companyName,
      Discom: item.discom,
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
    const allKeys = Object.keys(pdfData[0] || {});
    const nonEmptyKeys = allKeys.filter((key) =>
      pdfData.some((row) => row[key] && row[key].toString().trim() !== "")
    );

    // Step 3: Create head & body dynamically
    const head = [nonEmptyKeys];
    const body = pdfData.map((row) => nonEmptyKeys.map((key) => row[key]));

    autoTable(doc, {
      head,
      body,
      startY: 20,
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 7,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Step 5: Save
    doc.save("Information of new G.P. transformers.pdf");
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
