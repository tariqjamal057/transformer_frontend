import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Checkbox } from "@mui/material";
import * as XLSX from "xlsx";
import GenerateModal from "../../components/GenerateModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from "@mui/material";

const AddOfferLetterAndSealingStatement = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();



  const [selectedRecords, setSelectedRecords] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [inspectionFilter, setInspectionFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  // values: "all" | "withoutInspection" | "inspectedNotDispatched"

  const { data: gpReceiptRecords } = useQuery({
    queryKey: ["newGpReceiptRecords"],
    queryFn: () => api.get("/new-gp-receipt-records").then((res) => res.data),
  });

  const { data: finalInspectionDetails } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () => api.get("/final-inspections").then((res) => res.data),
  });
  
  const addOfferLetterAndSealingStatementMutation = useMutation({
    mutationFn: (newData) => api.post("/offer-letter-and-sealing-statements", newData),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Offer Letter and Sealing Statement added successfully!", error: false});
      queryClient.invalidateQueries(["offerLetterAndSealingStatements"]);
      // navigate("/offer-letter-and-sealing-statement-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const filteredRecords = useMemo(() => {
    if(!gpReceiptRecords || !finalInspectionDetails) return [];
    const validTrfsiNos = finalInspectionDetails.flatMap(
      (f) => f.shealingDetails?.map((s) => Number(s.trfsiNo)) || []
    );

    return gpReceiptRecords.filter((rec) => {
      // 1. Must match TRFSI number
      if (!validTrfsiNos.includes(Number(rec.trfsiNo))) return false;

      // 2. Date range filter (createdAt)
      if (startDate && new Date(rec.createdAt) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(rec.createdAt) > new Date(endDate)) {
        return false;
      }

      // 3. Inspection/dispatch filter
      const relatedInspection = finalInspectionDetails.find((f) =>
        f.shealingDetails?.some(
          (s) => Number(s.trfsiNo) === Number(rec.trfsiNo)
        )
      );

      if (inspectionFilter === "withoutInspection") {
        if (relatedInspection?.inspectionDate) return false;
        const sealing = relatedInspection?.shealingDetails?.find(
          (s) => Number(s.trfsiNo) === Number(rec.trfsiNo)
        );
        if (sealing?.dispatch) return false;
      }

      if (inspectionFilter === "inspectedNotDispatched") {
        if (!relatedInspection?.inspectionDate) return false;
        const sealing = relatedInspection?.shealingDetails?.find(
          (s) => Number(s.trfsiNo) === Number(rec.trfsiNo)
        );
        if (!sealing?.dispatch) return false;
      }

      return true;
    });
  }, [
    gpReceiptRecords,
    finalInspectionDetails,
    startDate,
    endDate,
    inspectionFilter,
  ]);

  // ✅ Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // ✅ Save button click → open modal
  const handleSave = () => {
    if (selectedRecords.length > 0) {
      setShowModal(true);
    }
  };

  // ✅ Generate Sealing Statement Excel
  const generateSealingStatement = () => {
    let excelData = [];

    selectedRecords.forEach((id, index) => {
      const gpRecord = gpReceiptRecords.find((rec) => rec.id === id);
      if (!gpRecord) return;

      // find matching inspection by TRFSI
      const inspection = finalInspectionDetails.find((f) =>
        f.shealingDetails?.some(
          (s) => Number(s.trfsiNo) === Number(gpRecord.trfsiNo)
        )
      );

      const sealingDetail = inspection?.shealingDetails?.find(
        (s) => Number(s.trfsiNo) === Number(gpRecord.trfsiNo)
      );

      excelData.push({
        "Sr#": index + 1,
        "TrfsiNo": gpRecord.trfsiNo,
        "Rating": inspection?.deliverySchedule?.rating,
        "PolyCarbonateSealNo": sealingDetail?.polySealNo ,
        "ReceivedFromACOS": gpRecord.consigneeName,
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData, { skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SealingStatement");
    XLSX.writeFile(wb, "SealingStatement.xlsx");
    
    addOfferLetterAndSealingStatementMutation.mutate({sealingStatements: excelData});

    setShowModal(false);
  };

  // ✅ Generate Offer Letter Excel (placeholder)
  const generateOfferLetter = () => {
    let excelData = [];

    selectedRecords.forEach((id, index) => {
      const gpRecord = gpReceiptRecords.find((rec) => rec.id === id);
      if (!gpRecord) return;

      const make = gpRecord.deliveryChalan?.consignorName?.split(' ')[0] || "K.I."; // Assuming K.I. is short for Kalpana Industries or similar
      const yearOfMfg = gpRecord.deliveryChalan?.createdAt ? new Date(gpRecord.deliveryChalan.createdAt).getFullYear() : "N/A";

      excelData.push({
        "Sr. #": index + 1,
        "JOB No.": gpRecord.trfsiNo,
        "Make": make,
        "Ratings": gpRecord.rating,
        "TFR Sr.No.": gpRecord.trfsiNo,
        "Year of Mfg.": yearOfMfg,
      });
    });

    const ws = XLSX.utils.json_to_sheet(excelData, { skipHeader: false });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OfferLetter");
    XLSX.writeFile(wb, "OfferLetter.xlsx");
    addOfferLetterAndSealingStatementMutation.mutate({offerLetters: excelData});
    setShowModal(false);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Receipt Record List</h5>
        </div>

        <div className="card shadow border-0 p-3 mb-3">
          <div className="row g-3 align-items-end">
            {/* Date Range */}
            <div className="col-md-3">
              <label className="form-label fw-bold">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Inspection Filter */}
            <div className="col-md-3">
              <label className="form-label fw-bold">Filter by Inspection</label>
              <select
                className="form-select"
                value={inspectionFilter}
                onChange={(e) => setInspectionFilter(e.target.value)}
              >
                <option value="all">All GP Receipt Notes</option>
                <option value="withoutInspection">Without Inspection</option>
                <option value="inspectedNotDispatched">
                  Inspected but Not Dispatched
                </option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="col-md-3">
              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setInspectionFilter("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Select</th>
                  <th>Sr No</th>
                  <th>Account Receipt Note No / Date</th>
                  <th>SIN No</th>
                  <th>Consignee Name</th>
                  <th>Discom Receipt Note No / Date</th>
                  <th>TRF SI No</th>
                  <th>Rating</th>
                  <th>Poly Seal No</th>
                  <th>Consignee TFR Serial No</th>
                  <th>Parts Condition</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id}>
                      {/* ✅ Checkbox */}
                      <td>
                        <Checkbox
                          checked={selectedRecords.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          color="primary"
                        />
                      </td>

                      {/* Sr No */}
                      <td># {index + 1}</td>

                      {/* Account Receipt Note No / Date */}
                      <td>
                        <div>{item.accountReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {item.accountReceiptNoteDate}
                        </div>
                      </td>

                      {/* SIN No */}
                      <td>{item.sinNo}</td>

                      {/* Consignee Name */}
                      <td>{item.consigneeName}</td>

                      {/* Discom Receipt Note No / Date */}
                      <td>
                        <div>{item.discomReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {item.discomReceiptNoteDate}
                        </div>
                      </td>

                      {/* TRF SI No */}
                      <td>{item.trfsiNo}</td>

                      {/* Rating */}
                      <td>{item.rating}</td>

                      {/* Poly Seal No */}
                      <td>{item.polySealNo}</td>

                      {/* Consignee TFR Serial No */}
                      <td>{item.consigneeTFRSerialNo}</td>

                      {/* Parts Condition */}
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

                      {/* Remarks */}
                      <td className="text-start">{item.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="text-center">
                      No GP Receipt Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Save Button */}
        <div className="text-end mt-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            disabled={selectedRecords.length === 0}
          >
            Save & Generate
          </button>
        </div>

        {/* MUI Modal */}
        <GenerateModal
          open={showModal}
          onClose={() => setShowModal(false)}
          generateSealingStatement={generateSealingStatement}
          generateOfferLetter={generateOfferLetter}
        />
      </div>
    </>
  );
};

export default AddOfferLetterAndSealingStatement;
