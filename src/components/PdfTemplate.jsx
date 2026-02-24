import React from "react";

export default function PdfTemplate({ item }) {
  console.log("Item:", item);
  console.log("Final Inspection:", item?.finalInspection);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const getDisplayedSerials = (item) => {
    let parts = [];

    // 1. New Transformers
    if (item.selectedTransformers && item.selectedTransformers.length > 0) {
      const nums = item.selectedTransformers
        .map((n) => parseInt(n, 10))
        .sort((a, b) => a - b);
      let ranges = [];
      if (nums.length > 0) {
        let start = nums[0];
        let end = nums[0];
        for (let i = 1; i < nums.length; i++) {
          if (nums[i] === end + 1) {
            end = nums[i];
          } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = nums[i];
            end = nums[i];
          }
        }
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        parts.push(ranges.join(", "));
      } else {
        parts.push(item.selectedTransformers.join(", "));
      }
    } else if (item.subSerialNumberFrom && item.subSerialNumberTo) {
      parts.push(`${item.subSerialNumberFrom}-${item.subSerialNumberTo}`);
    }

    // 2. Repaired Transformers
    if (item.repairedSerialNumbers && item.repairedSerialNumbers.length > 0) {
      parts.push(item.repairedSerialNumbers.join(", "));
    }

    // 3. Other Consignee Serials
    if (item.otherConsigneeSerialNumbers) {
      const expanded = [];
      const segments = item.otherConsigneeSerialNumbers.split(",");
      segments.forEach((segment) => {
        const s = segment.trim();
        if (s.includes("-")) {
          const [start, end] = s.split("-").map((n) => parseInt(n, 10));
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) {
              expanded.push(i);
            }
          } else {
            expanded.push(s);
          }
        } else {
          expanded.push(s);
        }
      });
      parts.push(expanded.join(", "));
    }

    // Fallback to old logic if no specific data found
    if (parts.length === 0) {
      const fi = item.finalInspection;
      const consignee = fi?.consignees?.find(
        (c) => c.consigneeId === item.consigneeId,
      );

      if (consignee) {
        if (consignee.subSnNumber) {
          parts.push(consignee.subSnNumber.replace(/ TO /g, "-"));
        }
        if (
          consignee.repairedTransformerIds &&
          consignee.repairedTransformerIds.length > 0
        ) {
          parts.push(...consignee.repairedTransformerIds);
        }
      }
    }

    return parts.filter(Boolean).join(", ") || "N/A";
  };

  // Find the specific consignee's info from the final inspection data
  const consigneeInfo = item?.finalInspection?.consignees?.find(
    (fic) => fic.consigneeId === item.consigneeId,
  );

  console.log("Consignee Info:", consigneeInfo);

  const getQuantity = (item) => {
    let count = 0;
    let hasData = false;

    // New Transformers
    if (item.selectedTransformers && item.selectedTransformers.length > 0) {
      count += item.selectedTransformers.length;
      hasData = true;
    } else if (item.subSerialNumberFrom && item.subSerialNumberTo) {
      count +=
        parseInt(item.subSerialNumberTo) -
        parseInt(item.subSerialNumberFrom) +
        1;
      hasData = true;
    }

    // Repaired Transformers
    if (item.repairedSerialNumbers && item.repairedSerialNumbers.length > 0) {
      count += item.repairedSerialNumbers.length;
      hasData = true;
    }

    // Other Consignee Serials
    if (item.otherConsigneeSerialNumbers) {
      const others = item.otherConsigneeSerialNumbers.split(",");
      others.forEach((s) => {
        s = s.trim();
        if (s.includes("-")) {
          const [start, end] = s.split("-").map((n) => parseInt(n, 10));
          if (!isNaN(start) && !isNaN(end)) {
            count += end - start + 1;
          }
        } else if (s) {
          count += 1;
        }
      });
      hasData = true;
    }

    if (!hasData) {
      return (
        consigneeInfo?.quantity ||
        item?.finalInspection?.inspectedQuantity ||
        "N/A"
      );
    }

    return count;
  };
  console.log("item ", item)
  console.log("Get Quantity:", getQuantity(item))
  // Map the dynamic 'item' prop to the formData structure
  const formData = {
    challanNo: item?.challanNo || "N/A",
    challanDate: formatDate(item?.challanCreatedAt),
    consigneeName: item?.supplyTender?.company?.name || "N/A",
    consigneeAddress: item?.supplyTender?.company?.address || "N/A",
    companyImage: item?.supplyTender?.company?.logo
      ? `${import.meta.env.VITE_IMAGE_BASE_URL}${item.supplyTender.company.logo.replace(/\\/g, "/")}`
      : null,
    consigneePhone: `PHONE: ${item?.supplyTender?.company?.phone || "N/A"}`,
    consignorName: item?.consignorName || "N/A",
    consignorCompany: item?.consignee?.name || "N/A", // 'To' field seems to be the consignee
    consignorCity: item?.consignee?.address || "N/A",
    consignorPhone: item?.consignee?.phone || "",
    panNo: "N/A", // PAN No. not available in the data model
    gstNo: item?.consignorGST || "N/A",
    poNumber: item?.finalInspection?.deliverySchedule?.po || "N/A",
    poDate: formatDate(item?.finalInspection?.deliverySchedule?.poDate),
    lorryNo: item?.lorryNo || "N/A",
    driverName: item?.truckDriverName || "N/A",
    grNo: "", // GR No. not in model
    grDate: "", // GR Date not in model
    materialDesc: item?.materialDescription?.description || "N/A",
    bearingNo: getDisplayedSerials(item),
    quantity: `${getQuantity(item)} Nos.`,
    inspector: item?.finalInspection?.inspectionOfficers || [],
    inspectorTitle: "Assistant Engineer (O&M)", // Static data
    inspectorCompany: item?.supplyTender?.company?.name || "N/A",
    inspectorLocation: item?.supplyTender?.company?.address || "N/A",
    asOnDate: formatDate(item?.finalInspection?.inspectionDate),
    diNo: item?.finalInspection?.diNo || "N/A",
    diDate: formatDate(item?.finalInspection?.diDate),
    receiptMaterialDesc: item?.materialDescription?.description || "N/A",
    receiptQuantity: `${getQuantity(item)} Nos.`,
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
            <div className="d-flex items-start">
              <div style={{ width: "70%" }}>
                <div className="fw-bold small">{formData.consigneeName}</div>
                <div className="extra-small-text mt-1 lh-sm">
                  {formData.consigneeAddress}
                  <br />
                  {formData.consigneePhone}
                </div>
              </div>
              <div
                style={{ width: "30%" }}
                className="d-flex justify-content-center align-items-center"
              >
                {formData.companyImage && (
                  <img
                    src={formData.companyImage}
                    alt="logo"
                    style={{ width: "100%", height: "50px" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-6 px-3 py-2 left-border">
            <div className="fw-semibold extra-small-text mb-1">To,</div>
            <div className="extra-small-text lh-sm">
              {formData.consignorCompany}
              <br />
              {formData.consignorCity}
              <br />
              {formData.consignorPhone}
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
                {formData.inspector.map((officer, index) => (
                  <React.Fragment key={index}>
                    {officer}
                    <br />
                  </React.Fragment>
                ))}
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
            <span className="fw-semibold">For {formData.consignorCompany}</span>
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
              {formData.consigneeName}
              <br />
              {formData.consigneeAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
