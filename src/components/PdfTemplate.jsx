// PdfTemplate.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const PdfTemplate = ({ item }) => (
  <Box sx={{ p: 4, fontSize: "14px", lineHeight: 1.4 }}>
    {/* Heading */}
    <Typography variant="h5" gutterBottom align="center">
      Delivery Challan
    </Typography>

    {/* PO & Challan */}
    <Typography>
      <strong>PO No / Date:</strong>{" "}
      {item.finalInspectionDetail.deliverySchedule.poDetails} /{" "}
      {item.finalInspectionDetail.deliverySchedule.poDate}
    </Typography>
    <Typography>
      <strong>Challan No:</strong> {item.challanNo}
    </Typography>

    {/* Transformer Info */}
    <Typography mt={2}>
      <strong>Transformer:</strong>{" "}
      {item.finalInspectionDetail.deliverySchedule.tnNumber} –{" "}
      {item.finalInspectionDetail.snNumber}
    </Typography>
    <Typography>
      <strong>DI No / Date:</strong>{" "}
      {item.finalInspectionDetail.diNo} / {item.finalInspectionDetail.diDate}
    </Typography>

    {/* Inspection Info */}
    <Typography mt={2}>
      <strong>Inspection Officers:</strong>{" "}
      {item.finalInspectionDetail.inspectionOfficers.join(", ")}
    </Typography>
    <Typography>
      <strong>Inspection Date:</strong>{" "}
      {item.finalInspectionDetail.inspectionDate}
    </Typography>

    {/* Consignor Info */}
    <Typography mt={2}>
      <strong>Consignor:</strong> {item.consignorName}, {item.consignorAddress}{" "}
      (Ph: {item.consignorPhone}, GST: {item.consignorGST})
    </Typography>
    {item.consignorEmail && (
      <Typography>
        <strong>Email:</strong> {item.consignorEmail}
      </Typography>
    )}

    {/* Consignee Info */}
    <Typography mt={1}>
      <strong>Consignee:</strong> {item.consigneeDetails.name},{" "}
      {item.consigneeDetails.address} (GST: {item.consigneeDetails.gstNo})
    </Typography>

    {/* Material & Description */}
    <Typography mt={2}>
      <strong>Material:</strong> {item.materialDescription.description}
    </Typography>
    <Typography mt={1}>
      <strong>Description:</strong>{" "}
      {item.deliveryChallanDescription.description}
    </Typography>

    {/* Extra Info */}
    <Typography mt={2}>
      <strong>Lorry No:</strong> {item.lorryNo || "N/A"}
    </Typography>
    <Typography>
      <strong>Truck Driver:</strong> {item.truckDriverName || "N/A"}
    </Typography>

    <Typography mt={3} align="center" variant="body2">
      Generated on {item.createdAt}
    </Typography>
  </Box>
);

export default PdfTemplate;