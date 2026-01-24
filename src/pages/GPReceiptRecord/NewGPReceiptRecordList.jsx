import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GPReceiptModal from "../../components/GPReceiptModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import GPReceiptBulkUploadModal from "../../components/GPReceiptBulkUploadModal";

const NewGPReceiptRecordList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPReceiptRecord, setSelectedGPReceiptRecord] = useState(null);
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: gpReceiptRecords,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["newGpReceiptRecords", currentPage, searchQuery],
    queryFn: () =>
      api
        .get(
          `/new-gp-receipt-records?page=${currentPage}&search=${searchQuery}`,
        )
        .then((res) => res.data),
  });

  const handleEditClick = (item) => {
    setSelectedGPReceiptRecord(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedGPReceiptRecord(null);
  };

  // ✅ Excel Export Function
  const handleExportExcel = () => {
    const records = gpReceiptRecords?.items || [];
    if (!records || records.length === 0) {
      setAlertBox({
        open: true,
        msg: "No data to export!",
        error: true,
      });
      return;
    }
    // Prepare data for Excel
    const excelData = records.map((item, index) => ({
      "Sr No": index + 1,
      "Account Receipt Note No": item.accountReceiptNoteNo,
      "Account Receipt Note Date": item.accountReceiptNoteDate,
      "SIN No": item.sinNo,
      "Consignee Name": item.consigneeName,
      "Discom Receipt Note No": item.discomReceiptNoteNo,
      "Discom Receipt Note Date": item.discomReceiptNoteDate,
      "TRF SI No": item.trfsiNo,
      "Original Tfr. Sr. No.": item.originalTfrSrNo,
      Rating: item.rating,
      Wound:
        item.deliveryChallan?.finalInspection?.deliverySchedule?.wound || "",
      Phase:
        item.deliveryChallan?.finalInspection?.deliverySchedule?.phase || "",
      "Poly Seal No": item.polySealNo,
      "Discom Tfr. Sr. No.": item.consigneeTFRSerialNo,
      "Seal No Time Of G.P. Received": item.sealNoTimeOfGPReceived,
      "Date Of Supply": item.deliveryChallan?.createdAt,
      "Oil Level": item.oilLevel,
      "HV Bushing": item.hvBushing,
      "LV Bushing": item.lvBushing,
      Radiator: item.radiator,
      Core: item.core,
      Remarks: item.remarks,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GP Receipt Records");
    XLSX.writeFile(workbook, "GP_Receipt_Records.xlsx");
    setAlertBox({
      open: true,
      msg: "Excel exported successfully!",
      error: false,
    });
  };

  // ✅ Print Function
  const handlePrint = () => {
    const records = gpReceiptRecords?.items || [];
    if (!records || records.length === 0) {
      setAlertBox({
        open: true,
        msg: "No data to print!",
        error: true,
      });
      return;
    }
    // Landscape orientation for A4
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth(); // ~842pt
    const pageHeight = doc.internal.pageSize.getHeight(); // ~595pt
    // Centered title
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("New G.P. Receipt Record List", pageWidth / 2, 20, {
      align: "center",
    });
    // Column headers with line breaks for better fit
    const head = [
      [
        "Sr\nNo",
        "Account\nReceipt\nNote No",
        "Date",
        "SIN\nNo",
        "Consignee",
        "Discom\nReceipt\nNote No",
        "Date",
        "TRF\nSI No",
        "Original\nTfr. Sr.\nNo.",
        "Discom\nTfr. Sr.\nNo.",
        "Rating",
        "Wound",
        "Phase",
        "Poly\nSeal\nNo",
        "Seal No\n(Received)",
        "Date Of\nSupply",
        "Remarks",
      ],
    ];
    const body = records.map((item, index) => [
      index + 1,
      item.accountReceiptNoteNo || "",
      item.accountReceiptNoteDate || "",
      item.sinNo || "",
      item.consigneeName || "",
      item.discomReceiptNoteNo || "",
      item.discomReceiptNoteDate || "",
      item.trfsiNo || "",
      item.originalTfrSrNo || "",
      item.consigneeTFRSerialNo || "",
      item.rating || "",
      item.deliveryChallan?.finalInspection?.deliverySchedule?.wound || "",
      item.deliveryChallan?.finalInspection?.deliverySchedule?.phase || "",
      item.polySealNo || "",
      item.sealNoTimeOfGPReceived || "",
      item.deliveryChallan?.createdAt || "",
      item.remarks || "",
    ]);
    // Adjusted column widths to fit all 17 columns in landscape A4 (~842pt width)
    // Total available width: ~842 - 30 (margins) = ~812pt
    const columnStyles = {
      0: { cellWidth: 28 }, // Sr No
      1: { cellWidth: 52 }, // Account Receipt Note No
      2: { cellWidth: 42 }, // Date
      3: { cellWidth: 38 }, // SIN No
      4: { cellWidth: 55 }, // Consignee
      5: { cellWidth: 52 }, // Discom Receipt Note No
      6: { cellWidth: 42 }, // Date
      7: { cellWidth: 38 }, // TRF SI No
      8: { cellWidth: 50 }, // Original Tfr. Sr. No.
      9: { cellWidth: 50 }, // Discom Tfr. Sr. No.
      10: { cellWidth: 35 }, // Rating
      11: { cellWidth: 40 }, // Wound
      12: { cellWidth: 40 }, // Phase
      13: { cellWidth: 38 }, // Poly Seal No
      14: { cellWidth: 45 }, // Seal No (Received)
      15: { cellWidth: 45 }, // Date Of Supply
      16: { cellWidth: 52 }, // Remarks
    };
    const totalTableWidth = Object.values(columnStyles).reduce(
      (sum, col) => sum + (col.cellWidth || 0),
      0,
    );
    const horizontalMargin = Math.max((pageWidth - totalTableWidth) / 2, 10);
    autoTable(doc, {
      head,
      body,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 6.5,
        cellPadding: 1.5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        valign: "middle",
        halign: "center",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 6.5,
        fontStyle: "bold",
        minCellHeight: 22,
      },
      columnStyles,
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      // ✅ PERFECT CENTERING
      margin: {
        top: 30,
        bottom: 25,
        left: horizontalMargin,
        right: horizontalMargin,
      },
      tableWidth: totalTableWidth,
      showHead: "everyPage",
    });
    // Open print dialog
    doc.autoPrint();
    doc.output("dataurlnewwindow");
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Receipt Record List</h5>

          <div className="d-flex align-items-center gap-2">
            <TextField
              variant="outlined"
              placeholder="Search ...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "300px" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#f0883d" },
                  "&.Mui-focused fieldset": { borderColor: "#f0883d" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#f0883d" }} />
                  </InputAdornment>
                ),
              }}
            />
            {hasPermission("GPReceiptRecordCreate") && (
              <Button
                className="btn-blue ms-3 ps-3 pe-3"
                onClick={() => setOpenBulkUploadModal(true)}
              >
                Bulk Upload
              </Button>
            )}
            {hasPermission("GPReceiptRecordCreate") && (
              <Link to={"/add-newGPReceiptRecord"}>
                <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
              </Link>
            )}
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleExportExcel}
            >
              Excel Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Account Receipt Note No</th>
                  <th>Account Receipt Note Date</th>
                  <th>SIN No</th>
                  <th>Consignee Name</th>
                  <th>Discom Receipt Note No</th>
                  <th>Discom Receipt Note Date</th>
                  <th>TRF SI No</th>
                  <th>Original Tfr. Sr. No.</th>
                  <th>Discom Tfr. Sr. No.</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Poly Seal No</th>
                  <th>Seal No Time Of G.P. Received</th>
                  <th>Date Of Supply</th>
                  <th>Parts Condition</th>
                  <th>Remarks</th>
                  {hasPermission("GPReceiptRecordUpdate") && (
                    <th className="action-col">Action</th>
                  )}
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="19">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="19">Error fetching data</td>
                  </tr>
                ) : gpReceiptRecords?.items?.length > 0 ? (
                  gpReceiptRecords.items.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.accountReceiptNoteNo}</td>
                      <td>{item.accountReceiptNoteDate}</td>
                      <td>{item.sinNo}</td>
                      <td>{item.consigneeName}</td>
                      <td>{item.discomReceiptNoteNo}</td>
                      <td>{item.discomReceiptNoteDate}</td>
                      <td>{item.trfsiNo}</td>
                      <td>{item.originalTfrSrNo}</td>
                      <td>{item.consigneeTFRSerialNo}</td>
                      <td>{item.rating}</td>
                      <td>
                        {
                          item.deliveryChallan?.finalInspection
                            ?.deliverySchedule?.wound
                        }
                      </td>
                      <td>
                        {
                          item.deliveryChallan?.finalInspection
                            ?.deliverySchedule?.phase
                        }
                      </td>
                      <td>{item.polySealNo}</td>
                      <td>{item.sealNoTimeOfGPReceived}</td>
                      <td>{item.deliveryChallan.createdAt}</td>
                      <td className="text-start small">
                        <div>
                          <strong>Oil Level:</strong> {item.oilLevel}
                        </div>
                        <div>
                          <strong>HV Bushing:</strong> {item.hvBushing}
                        </div>
                        <div>
                          <strong>LV Bushing:</strong> {item.lvBushing}
                        </div>
                        <div>
                          <strong>Radiator:</strong> {item.radiator}
                        </div>
                        <div>
                          <strong>Core:</strong> {item.core}
                        </div>
                      </td>
                      <td className="text-start">{item.remarks}</td>
                      {hasPermission("GPReceiptRecordUpdate") && (
                        <td className="action-col">
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="19" className="text-center">
                      No GP Receipt Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {gpReceiptRecords?.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={gpReceiptRecords.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <GPReceiptModal
        open={openModal}
        handleClose={handleModalClose}
        gpReceiptData={selectedGPReceiptRecord}
      />

      <GPReceiptBulkUploadModal
        open={openBulkUploadModal}
        handleClose={() => setOpenBulkUploadModal(false)}
      />
    </>
  );
};

export default NewGPReceiptRecordList;
