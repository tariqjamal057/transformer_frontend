import React from "react";

export default function PdfTemplate({ item }) {
  console.log("Item:", item);
  console.log("Final Inspection:", item?.finalInspection);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  // Find the specific consignee's info from the final inspection data
  const consigneeInfo = item?.finalInspection?.consignees?.find(
    (fic) => fic.consigneeId === item.consigneeId,
  );

  console.log("Consignee Info:", consigneeInfo);

  // Use the specific consignee's quantity if available, otherwise fallback to the total inspected quantity
  const consigneeQuantity =
    consigneeInfo?.quantity || item?.finalInspection?.inspectedQuantity || "N/A";


  // Map the dynamic 'item' prop to the formData structure
  const formData = {
    challanNo: item?.challanNo || "N/A",
    challanDate: formatDate(item?.challanCreatedAt),
    consigneeName: item?.supplyTender?.company?.name || "N/A",
    consigneeAddress: item?.supplyTender?.company?.address || "N/A",
    consigneeCity: "", // City is part of the address, kept for structure
    consigneePhone: `PHONE: ${item?.supplyTender?.company?.phone || "N/A"}`,
    consignorName: item?.consignorName || "N/A",
    consignorCompany: item?.consignee?.name || "N/A", // 'To' field seems to be the consignee
    consignorCity: item?.consignee?.address || "N/A",
    panNo: "N/A", // PAN No. not available in the data model
    gstNo: item?.consignorGST || "N/A",
    poNumber: item?.finalInspection?.deliverySchedule?.po || "N/A",
    poDate: formatDate(item?.finalInspection?.deliverySchedule?.poDate),
    lorryNo: item?.lorryNo || "N/A",
    driverName: item?.truckDriverName || "N/A",
    grNo: "", // GR No. not in model
    grDate: "", // GR Date not in model
    materialDesc: item?.materialDescription?.description || "N/A",
    bearingNo: `${item?.subSerialNumberFrom || "N/A"} to ${
      item?.subSerialNumberTo || "N/A"
    }`,
    quantity: `${consigneeQuantity} Nos.`,
    inspector: item?.finalInspection?.inspectionOfficers?.join(", ") || "N/A",
    inspectorTitle: "Assistant Engineer (O&M)", // Static data
    inspectorCompany: "Jodhpur Vidyut Vitran Nigam Limited", // Static data
    inspectorLocation: "Lohawat", // Static data
    asOnDate: formatDate(item?.finalInspection?.inspectionDate),
    diNo: item?.finalInspection?.diNo || "N/A",
    diDate: formatDate(item?.finalInspection?.diDate),
    receiptMaterialDesc: item?.materialDescription?.description || "N/A",
    receiptQuantity: `${consigneeQuantity} Nos.`,
  };

  return (
    <div className="w-100 bg-white">
      <style>{`
       @media print {
       body { margin: 0; background: white; }
       .print-page { margin: 0; }
      }

      .print-page {
       width: 210mm;
       min-height: 297mm;
       margin: 0;
       padding: 0;
       box-sizing: border-box;
      }
        
      .bottom-border {
        border-bottom: 2px solid #000;
      }
        
      .left-border {
        border-left: 2px solid #000;
      }
        
      .right-border {
        border-right: 2px solid #000;
      }
        
      .full-border {
        border: 2px solid #000;
      }
        
      @page {
        size: A4;
        margin: 0;
      }
    `}</style>

      {/* Delivery Challan Document */}
      <div className="print-page w-100 bg-white">
        {/* Row 1: DELIVERY CHALLAN heading in center */}
        <div className="text-center py-2 bottom-border">
          <h5 className="fw-bold mb-0">DELIVERY CHALLAN</h5>
        </div>

        {/* Row 2: No. and Date */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2 bottom-border">
          <div className="small-text">
            <span className="fw-semibold">No.</span> {formData.challanNo}
          </div>
          <div className="small-text">
            <span className="fw-semibold">Date:</span> {formData.challanDate}
          </div>
        </div>

        {/* Row 3: Consignee (left) and Consignor (right) */}
        <div className="row g-0 bottom-border">
          <div className="col-6 px-3 py-2">
            <div className="fw-bold small">{formData.consigneeName}</div>
            <div className="extra-small-text mt-1 lh-sm">
              {formData.consigneeAddress}
              <br />
              {formData.consigneeCity}
              <br />
              {formData.consigneePhone}
            </div>
          </div>
          <div className="col-6 px-3 py-2 left-border">
            <div className="fw-semibold extra-small-text mb-1">To,</div>
            <div className="extra-small-text lh-sm">
              {formData.consignorName}
              <br />
              {formData.consignorCompany}
              <br />
              {formData.consignorCity}
            </div>
          </div>
        </div>

        {/* Row 4: Material instruction (left) and PAN/GST (right) */}
        <div className="row g-0 bottom-border">
          <div className="col-6 px-3 py-2">
            <div className="extra-small-text">
              <span className="fw-semibold">
                Please receive the following material in good order and
                condition.
              </span>
            </div>
          </div>
          <div className="col-6 px-3 py-2 left-border">
            <div className="extra-small-text">
              <div className="mb-1">
                <span className="fw-semibold">PAN No.</span> {formData.panNo}
              </div>
              <div>
                <span className="fw-semibold">GST No.</span> {formData.gstNo}
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: PO Details spanning full width */}
        <div className="px-3 py-2 bottom-border">
          <div className="extra-small-text">
            <span className="fw-semibold">Against P.O.</span>{" "}
            {formData.poNumber} <span className="fw-semibold">Dated.</span>{" "}
            {formData.poDate}
          </div>
        </div>

        {/* Row 6: Lorry details (left) and GR details (right) */}
        <div className="row g-0 bottom-border">
          <div className="col-6 px-3 py-2">
            <div className="extra-small-text">
              <div className="mb-1">
                <span className="fw-semibold">Through Lorry No.</span>{" "}
                {formData.lorryNo}
              </div>
              <div>
                <span className="fw-semibold">Name of driver -</span>{" "}
                {formData.driverName}
              </div>
            </div>
          </div>
          <div className="col-6 px-3 py-2 left-border">
            <div className="extra-small-text">
              <div className="mb-1">
                <span className="fw-semibold">GR NO.</span> {formData.grNo}
              </div>
              <div>
                <span className="fw-semibold">Date</span> {formData.grDate}
              </div>
            </div>
          </div>
        </div>

        {/* Row 7: Material Description (left) and Quantity (right) */}
        <div className="row g-0 bottom-border">
          <div className="col-9 px-3 py-2">
            <div className="extra-small-text lh-sm mb-2">
              1. {formData.materialDesc}
            </div>
            <div className="extra-small-text mt-2">
              <span className="fw-semibold">BEARING SI. No.</span>{" "}
              {formData.bearingNo}
            </div>
          </div>
          <div className="col-3 px-3 py-2 left-border d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div className="fw-semibold">=</div>
              <div className="extra-small-text mt-2">{formData.quantity}</div>
            </div>
          </div>
        </div>

        {/* Row 8: Inspector details (left) and As On date + DI No (right) */}
        <div className="row g-0 bottom-border">
          <div className="col-8 px-3 py-2">
            <div className="extra-small-text">
              <div className="fw-semibold">INSPECTED BY:</div>
              <div className="mt-1 lh-sm">
                {formData.inspector}
                <br />
                {formData.inspectorTitle}
                <br />
                {formData.inspectorCompany}
                <br />
                {formData.inspectorLocation}
              </div>
            </div>
          </div>
          <div className="col-4 px-3 py-2 left-border">
            <div className="extra-small-text">
              <div className="mb-2">
                <span className="fw-semibold">As On:</span> {formData.asOnDate}
              </div>
              <div className="mb-1">
                <span className="fw-semibold">DI No.</span> {formData.diNo}
              </div>
              <div>
                <span className="fw-semibold">Dated.</span> {formData.diDate}
              </div>
            </div>
          </div>
        </div>

        {/* Row 9: Certificate Section */}
        <div className="px-3 py-2 border-top-0">
          <div className="text-end extra-small-text mb-2">
            <span className="fw-semibold">For {formData.consigneeName}</span>
          </div>

          <div className="text-center mb-2">
            <div
              className="fw-bold small d-inline-block pb-1"
              style={{ borderBottom: "2px solid #000" }}
            >
              CERTIFICATE OF RECEIPT OF MATERIAL
            </div>
          </div>

          <div className="extra-small-text lh-sm mb-2">
            <span className="fw-semibold">Date:</span> {formData.challanDate}
          </div>

          <div className="extra-small-text lh-sm mb-2">
            The material detailed below has been received against Challan No.{" "}
            <strong>{formData.challanNo}</strong> Dated.{" "}
            <strong>{formData.challanDate}</strong> pertaining to P.O. No.{" "}
            <strong>{formData.poNumber}</strong> Dated.{" "}
            <strong>{formData.poDate}</strong> and dispatched under GTR/RR No.
            by truck No. <strong>{formData.lorryNo}</strong> and has been
            entered in Store Inwards Register/COs-6 at
          </div>

          <div className="d-flex gap-3 mb-2 extra-small-text">
            <div>page No. _______</div>
            <div>item No. _______</div>
            <div>dated _______</div>
          </div>

          <div className="extra-small-text lh-sm mb-2">
            The Challan is verified subject to final checking & verification of
            material.
          </div>

          {/* Material Description and Quantity Table */}
          <div className="row g-0 border border-2 border-dark mb-3">
            <div className="col-9 p-2 extra-small-text lh-sm right-border">
              {formData.receiptMaterialDesc}
            </div>
            <div className="col-3 p-2 text-center">
              <div className="fw-semibold extra-small-text mb-1">QTY.</div>
              <div className="extra-small-text mt-3">
                {formData.receiptQuantity}
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-5 extra-small-text">
            <div className="text-end">
              {formData.consignorName}
              <br />
              {formData.consignorCompany}
              <br />
              {formData.consignorCity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
