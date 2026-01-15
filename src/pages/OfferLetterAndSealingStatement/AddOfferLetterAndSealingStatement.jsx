import { useContext, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MyContext } from "../../App";
import GenerateModal from "../../components/GenerateModal";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import dayjs from "dayjs";

const AddOfferLetterAndSealingStatement = () => {
  const { setAlertBox } = useContext(MyContext);

  const [selectedRecords, setSelectedRecords] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [inspectionFilter, setInspectionFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  // Fetch all necessary data
  const { data: newGPReceiptRecords, isLoading: isLoadingGP } = useQuery({
    queryKey: ["newGPReceiptRecordsForAll"],
    queryFn: () =>
      api.get("/new-gp-receipt-records?all=true").then((res) => res.data),
  });

  const { data: finalInspections, isLoading: isLoadingFI } = useQuery({
    queryKey: ["finalInspectionsAll"],
    queryFn: () =>
      api.get("/final-inspections?all=true").then((res) => res.data),
  });

  const filteredRecords = useMemo(() => {
    if (!newGPReceiptRecords || !finalInspections) return [];

    const validTrfsiNos = finalInspections.flatMap(
      (f) => f.sealingDetails?.map((s) => Number(s.trfSiNo)) || [] // Corrected from trfsiNo to trfSiNo
    );

    return newGPReceiptRecords.filter((rec) => {
      // 1. Must have a matching TRFSI in final inspections
      if (!validTrfsiNos.includes(Number(rec.trfsiNo))) return false;

      // 2. Date range filter (createdAt)
      if (startDate && dayjs(rec.createdAt).isBefore(dayjs(startDate))) {
        return false;
      }
      if (endDate && dayjs(rec.createdAt).isAfter(dayjs(endDate))) {
        return false;
      }

      // 3. Inspection/dispatch filter
      const relatedInspection = finalInspections.find((f) =>
        f.sealingDetails?.some((s) => Number(s.trfSiNo) === Number(rec.trfsiNo))
      );

      if (inspectionFilter === "withoutInspection") {
        if (relatedInspection?.inspectionDate) return false; // Must NOT have an inspection date
      }
      if (inspectionFilter === "inspectedNotDispatched") {
        if (!relatedInspection?.inspectionDate) return false; // Must have an inspection date
        // Note: The concept of 'dispatch' is not clearly defined in the current schema.
        // This part of the filter might not work as expected without a 'dispatch' status.
      }
      return true;
    });
  }, [
    newGPReceiptRecords,
    finalInspections,
    startDate,
    endDate,
    inspectionFilter,
  ]);

  const handleCheckboxChange = (id) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const generateSealingStatement = () => {
    let excelData = [];
    selectedRecords.forEach((id, index) => {
      const gpRecord = newGPReceiptRecords.find((rec) => rec.id === id);
      if (!gpRecord) return;

      const inspection = finalInspections.find((f) =>
        f.sealingDetails?.some(
          (s) => Number(s.trfSiNo) === Number(gpRecord.trfsiNo)
        )
      );
      const sealingDetail = inspection?.sealingDetails?.find(
        (s) => Number(s.trfSiNo) === Number(gpRecord.trfsiNo)
      );

      excelData.push({
        "Sr#": index + 1,
        TrfsiNo: gpRecord.trfsiNo,
        Rating: inspection?.deliverySchedule?.rating,
        PolyCarbonateSealNo: sealingDetail?.polySealNo,
        ReceivedFromACOS: gpRecord.consigneeName,
      });
    });
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SealingStatement");
    XLSX.writeFile(wb, "SealingStatement.xlsx");
    setShowModal(false);
  };

  const generateOfferLetter = () => {
    let excelData = [];
    selectedRecords.forEach((id, index) => {
      const gpRecord = newGPReceiptRecords.find((rec) => rec.id === id);
      if (!gpRecord) return;
      const make =
        gpRecord.deliveryChallan?.consignorName?.split(" ")[0] || "N/A";
      const yearOfMfg = gpRecord.deliveryChallan?.createdAt
        ? dayjs(gpRecord.deliveryChallan.createdAt).year()
        : "N/A";

      excelData.push({
        "Sr. #": index + 1,
        "JOB No.": gpRecord.trfsiNo,
        Make: make,
        Ratings: gpRecord.rating,
        "TFR Sr.No.": gpRecord.trfsiNo,
        "Year of Mfg.": yearOfMfg,
      });
    });
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OfferLetter");
    XLSX.writeFile(wb, "OfferLetter.xlsx");
    setShowModal(false);
  };

  const isLoading = isLoadingGP || isLoadingFI;

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Offer Letter & Sealing Statement</h5>
        </div>
        <div className="card shadow border-0 p-3 mb-3">
          <div className="row g-3 align-items-end">
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
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Select</th>
                  <th>Sr No</th>
                  <th>Account Receipt Note No / Date</th>
                  <th>SIN No</th>
                  <th>TRF SI No</th>
                  <th>Rating</th>
                  <th>Parts Condition</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan={7}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <Checkbox
                          checked={selectedRecords.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      <td># {index + 1}</td>
                      <td>
                        <div>{item.accountReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {dayjs(item.accountReceiptNoteDate).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      </td>
                      <td>{item.sinNo}</td>
                      <td>{item.trfsiNo}</td>
                      <td>{item.rating}</td>
                      <td className="text-start small">
                        <div>
                          <strong>Oil:</strong> {item.oilLevel}
                        </div>
                        <div>
                          <strong>HV:</strong> {item.hvBushing}
                        </div>
                        <div>
                          <strong>LV:</strong> {item.lvBushing}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No GP Receipt Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-end mt-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            disabled={selectedRecords.length === 0}
          >
            Save & Generate
          </button>
        </div>
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
