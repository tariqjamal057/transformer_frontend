import React from "react";

const GPReceiptTemplate = ({ item }) => {
  return (
    <div className="my-3 p-2" style={{  fontSize: "12px", width: "100%"  }}>
      {/* Header */}
      <div className="text-center">
        <h5 className="fw-bold">YASH GRANITES</h5>
        <p className="mb-0">F-18 INDUSTRIAL AREA</p>
        <p className="mb-0">JHUNJHUNU</p>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div>
          <p className="mb-1">
            <strong>RECEIPTED CHALAN NO</strong>: {item.gpReceiptRecords?.[0]?.selectedChalan || "-"}
          </p>
          <p className="mb-1">Received following damaged distribution transformers from</p>
          <p className="mb-1">The Assistant Controller Of Stores</p>
          <p className="mb-1">Jaipur Vidyut Vitran Nigam Limited</p>
          <p className="mb-1">{item.consigneeName}</p>
        </div>
        <div className="text-end">
          <p>
            <strong>DATED ➝ {item.accountReceiptNoteDate}</strong>
          </p>
        </div>
      </div>

      <p className="mt-3">
        Vide Gate Pass No: <strong>{item.accountReceiptNoteNo}</strong> Date:{" "}
        <strong>{item.accountReceiptNoteDate}</strong> & T.P. Note No:{" "}
        <strong>{item.discomReceiptNoteNo}</strong> Date:{" "}
        <strong>{item.discomReceiptNoteDate}</strong>
      </p>

      <p className="fw-bold">
        RECEIPT IS SUBJECT TO THE SHORTAGES AS MENTIONED AGAINST EACH TRANSFORMER
      </p>

      {/* Table */}
      <div className="table-responsive" style= {{ overflowX: "auto" }}>
        <table className="table table-bordered table-sm" style={{ minWidth: "1500px", fontSize: "12px" }}>
          <thead className="table-light text-center">
            <tr>
              <th>SL NO</th>
              <th>TRF NO</th>
              <th>KVA</th>
              <th>WO</th>
              <th>UN</th>
              <th>SP/TP</th>
              <th>TN NO</th>
              <th>NEW GP</th>
              <th>OIL LEVEL</th>
              <th>HV BUSHING</th>
              <th>LV BUSHING</th>
              <th>HT METAL PARTS</th>
              <th>LT METAL PARTS</th>
              <th>M&P BOX</th>
              <th>M&P BOX COVER</th>
              <th>MCCB</th>
              <th>ICB</th>
              <th>COPPER FLEXIBLE CABLE</th>
              <th>AL WIRE</th>
              <th>CONSERVATOR</th>
              <th>RADIATOR</th>
              <th>FUSE</th>
              <th>CHANNEL</th>
              <th>CORE</th>
              <th>POLY SEAL NO</th>
              <th>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {item.gpReceiptRecords?.map((rec, idx) => (
              <tr key={rec.id}>
                <td>{idx + 1}</td>
                <td>{rec.trfsiNo}</td>
                <td>{rec.rating}</td>
                <td>AL</td>
                <td>SP</td>
                <td>{rec.deliveryChalanDetails?.finalInspectionDetail?.deliverySchedule?.tnNumber || "-"}</td>
                <td>{rec.selectedChalan}</td>
                <td>{rec.oilLevel}</td>
                <td>{rec.hvBushing}</td>
                <td>{rec.lvBushing}</td>
                <td>{rec.htMetalParts}</td>
                <td>{rec.ltMetalParts}</td>
                <td>{rec.mAndpBox}</td>
                <td>{rec.mAndpBoxCover}</td>
                <td>{rec.mccb}</td>
                <td>{rec.icb}</td>
                <td>{rec.copperFlexibleCable}</td>
                <td>{rec.alWire}</td>
                <td>{rec.conservator}</td>
                <td>{rec.radiator}</td>
                <td>{rec.fuse}</td>
                <td>{rec.channel}</td>
                <td>{rec.core}</td>
                <td>{rec.polySealNo}</td>
                <td>{rec.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Totals (just example, you can calculate dynamically if needed) */}
      <div className="mt-4 d-flex justify-content-end">
        <div className="text-end">
          <p className="mb-1">05 KVA SP - 04 NOS</p>
          <p className="mb-1">10 KVA SP - 00 NOS</p>
          <p className="mb-1">16 KVA SP - 01 NOS</p>
          <p className="mb-1">25 KVA SP - 01 NOS</p>
          <p className="mb-1 fw-bold">TOTAL - {item.gpReceiptRecords?.length || 0} NOS</p>
        </div>
      </div>

      {/* Signature */}
      <div className="text-end mt-4">
        <p>FOR YASH GRANITES</p>
        <p className="fw-bold">[Signature]</p>
      </div>
    </div>
  );
};


export default GPReceiptTemplate;
