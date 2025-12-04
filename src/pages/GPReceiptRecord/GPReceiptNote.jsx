import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfTemplate from "../../components/PdfTemplate";
import { createRoot } from "react-dom/client";
import { MyContext } from "../../App";
import GPReceiptTemplate from "../../components/GPReceiptTemplate";

const GPReceiptNote = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPReceiptRecord, setSelectedGPReceiptRecord] = useState(null);

  // Dummy Data
  const dummyGPReceiptNotes = [
    {
      id: "1",
      selectDateFrom: "2025-07-23",
      selectDateTo: "2025-11-29",
      consigneeName: "ABC Power Supply Ltd.",
      accountReceiptNoteNo: "ARN-2025-001",
      accountReceiptNoteDate: "2025-08-10",
      acos: "AC-34",
      discomReceiptNoteNo: "DRN-9987",
      discomReceiptNoteDate: "2025-08-12",
      gpReceiptRecords: [
        {
          id: "1",
          accountReceiptNoteNo: "ARN-2025-001",
          accountReceiptNoteDate: "2025-08-10",
          sinNo: "SIN-5501",
          consigneeName: "ABC Power Supply Ltd.",
          discomReceiptNoteNo: "DRN-9987",
          discomReceiptNoteDate: "2025-08-12",
          remarks: "All items received in good condition.",
          trfsiNo: 4908,
          rating: "100",
          selectedChalan: "CH-1005",
          sealNoTimeOfGPReceived: "IAJ 5335 To IAJ 5336",
          consigneeTFRSerialNo: "TFR-9001",
          oilLevel: "OK",
          hvBushing: "Present",
          lvBushing: "Present",
          htMetalParts: "Complete",
          ltMetalParts: "Complete",
          mAndpBox: "Available",
          mAndpBoxCover: "Available",
          mccb: "Installed",
          icb: "Installed",
          copperFlexibleCable: "Available",
          alWire: "Available",
          conservator: "OK",
          radiator: "OK",
          fuse: "Provided",
          channel: "OK",
          core: "Good Condition",
          polySealNo: "IAJ 5301 To IAJ 5302",
          deliveryChalanDetails: {
            id: "1",
            finalInspectionDetail: {
              id: "1",
              deliverySchedule: {
                tnNumber: "TN-001",
                poDetails: "PO-12345",
                poDate: "2025-05-10",
                rating: "100",
                guaranteePeriodMonths: 1,
                description:
                  "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
              },
              offeredDate: "2025-07-12",
              offeredQuantity: 200,
              serialNumberFrom: 4907,
              serialNumberTo: 4911,
              snNumber: "4907 TO 4911",
              nominationLetterNo: "NL/2025/001",
              nominationDate: "2025-07-10",
              inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
              inspectionDate: "2025-07-13",
              inspectedQuantity: 100,
              total: 120,
              diNo: "DI/2025/1001",
              diDate: "2025-07-16",
              shealingDetails: [
                { trfsiNo: 4907, polySealNo: "IAJ 5301 To IAJ 5302" },
                { trfsiNo: 4908, polySealNo: "IAJ 5303 To IAJ 5304" },
                { trfsiNo: 4909, polySealNo: "IAJ 5305 To IAJ 5306" },
                { trfsiNo: 4910, polySealNo: "IAJ 5307 To IAJ 5308" },
                { trfsiNo: 4911, polySealNo: "IAJ 5309 To IAJ 5310" },
              ],
            },
            subSerialNumberFrom: 4907,
            subSerialNumberTo: 4909,
            challanNo: "CH-1001",
            createdAt: "2025-06-22",
            consignorName: "PowerTech Transformers Pvt. Ltd.",
            consignorPhone: "9876543210",
            consignorAddress: "Plot 12, Industrial Zone, Mumbai",
            consignorGST: "27AAACP1234F1Z5",
            consignorEmail: "powertech@gmail.com",
            consigneeDetails: {
              id: "2",
              name: "ABC Power Solutions Pvt. Ltd.",
              address:
                "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
              gstNo: "06ABCDE1234F1Z5",
            },
            lorryNo: "MH12AB1234",
            truckDriverName: "Ramesh Yadav",
            materialDescription: {
              materialName: "150 Amp Current Transformer (CT)",
              phase: "100 KVA",
              description:
                "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
            },
          },
        },
        {
          id: "2",
          accountReceiptNoteNo: "ARN-2025-002",
          accountReceiptNoteDate: "2025-08-15",
          sinNo: "SIN-5502",
          consigneeName: "ABC Power Supply Ltd.",
          discomReceiptNoteNo: "DRN-9988",
          discomReceiptNoteDate: "2025-08-17",
          remarks: "Minor scratches found on radiator, otherwise acceptable.",
          trfsiNo: 9003,
          rating: "150",
          selectedChalan: "CH-1005",
          sealNoTimeOfGPReceived: "IAJ 5339 To IAJ 5340",
          consigneeTFRSerialNo: "TFR-9003",
          oilLevel: "Slightly Low",
          hvBushing: "Present",
          lvBushing: "Present",
          htMetalParts: "Complete",
          ltMetalParts: "Complete",
          mAndpBox: "Available",
          mAndpBoxCover: "Available",
          mccb: "Installed",
          icb: "Installed",
          copperFlexibleCable: "Available",
          alWire: "Available",
          conservator: "OK",
          radiator: "Scratched",
          fuse: "Provided",
          channel: "OK",
          core: "Good Condition",
          polySealNo: "IAJ 5339 To IAJ 5340",
          deliveryChalanDetails: {
            id: "5",
            finalInspectionDetail: {
              id: "5",
              deliverySchedule: {
                tnNumber: "TN-005",
                poDetails: "PO-11122",
                poDate: "2025-07-01",
                rating: "150",
                guaranteePeriodMonths: 24,
                description:
                  "Challan for supply of resin cast current transformers suitable for medium voltage switchgear.",
              },
              offeredDate: "2025-08-12",
              offeredQuantity: 300,
              serialNumberFrom: 9001,
              serialNumberTo: 9004,
              snNumber: "9001 TO 9004",
              nominationLetterNo: "NL/2025/005",
              nominationDate: "2025-08-10",
              inspectionOfficers: ["Vikram Joshi", "Pooja Thakur"],
              inspectionDate: "2025-08-14",
              inspectedQuantity: 150,
              total: 155,
              diNo: "DI/2025/1005",
              diDate: "2025-08-16",
              shealingDetails: [
                { trfsiNo: 9001, polySealNo: "IAJ 5335 To IAJ 5336" },
                { trfsiNo: 9002, polySealNo: "IAJ 5337 To IAJ 5338" },
                { trfsiNo: 9003, polySealNo: "IAJ 5339 To IAJ 5340" },
                { trfsiNo: 9004, polySealNo: "IAJ 5341 To IAJ 5342" },
              ],
            },
            subSerialNumberFrom: 9001,
            subSerialNumberTo: 9003,
            challanNo: "CH-1005",
            createdAt: "2025-08-18",
            consignorName: "PowerTech Transformers Pvt. Ltd.",
            consignorPhone: "9876543210",
            consignorAddress: "Plot 12, Industrial Zone, Mumbai",
            consignorGST: "27AAACP1234F1Z5",
            consignorEmail: "powertech@gmail.com",
            consigneeDetails: {
              id: "2",
              name: "ABC Power Solutions Pvt. Ltd.",
              address:
                "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
              gstNo: "06ABCDE1234F1Z5",
            },
            lorryNo: "MH20JK7890",
            truckDriverName: "Naresh Pawar",
            materialDescription: {
              materialName: "150 Amp Resin Cast Current Transformer",
              description:
                "150 Amp, 11 kV resin cast CT, Class 1 accuracy, 5P10 protection class, used in medium voltage panels.",
            },
          },
        },
      ],
    },
    {
      id: "2",
      selectDateFrom: "2025-09-01",
      selectDateTo: "2025-12-31",
      consigneeName: "Western Power Supply Ltd.",
      accountReceiptNoteNo: "ARN-2025-010",
      accountReceiptNoteDate: "2025-09-05",
      acos: "AC-78",
      discomReceiptNoteNo: "DRN-9990",
      discomReceiptNoteDate: "2025-09-07",
      gpReceiptRecords: [
        {
          id: "3",
          accountReceiptNoteNo: "ARN-2025-010",
          accountReceiptNoteDate: "2025-09-05",
          sinNo: "SIN-5601",
          consigneeName: "Western Power Supply Ltd.",
          discomReceiptNoteNo: "DRN-9990",
          discomReceiptNoteDate: "2025-09-07",
          remarks: "Transformer oil leakage observed, replacement required.",
          trfsiNo: 9101,
          rating: "200",
          selectedChalan: "CH-2001",
          sealNoTimeOfGPReceived: "IAJ 5401 To IAJ 5402",
          consigneeTFRSerialNo: "TFR-9101",
          oilLevel: "Leaking",
          hvBushing: "Damaged",
          lvBushing: "Present",
          htMetalParts: "Incomplete",
          ltMetalParts: "Complete",
          mAndpBox: "Available",
          mAndpBoxCover: "Missing",
          mccb: "Not Installed",
          icb: "Installed",
          copperFlexibleCable: "Not Available",
          alWire: "Available",
          conservator: "Damaged",
          radiator: "Leaking",
          fuse: "Not Provided",
          channel: "Damaged",
          core: "Requires Repair",
          polySealNo: "IAJ 5401 To IAJ 5402",
          deliveryChalanDetails: {
            id: "10",
            finalInspectionDetail: {
              id: "10",
              deliverySchedule: {
                tnNumber: "TN-010",
                poDetails: "PO-22233",
                poDate: "2025-08-01",
                rating: "200",
                guaranteePeriodMonths: 12,
                description:
                  "Challan for supply of 200 kVA transformers with copper winding, outdoor type.",
              },
              offeredDate: "2025-09-02",
              offeredQuantity: 120,
              serialNumberFrom: 9100,
              serialNumberTo: 9102,
              snNumber: "9100 TO 9102",
              nominationLetterNo: "NL/2025/010",
              nominationDate: "2025-08-30",
              inspectionOfficers: ["Anil Sharma", "Kavita Mehta"],
              inspectionDate: "2025-09-04",
              inspectedQuantity: 100,
              total: 120,
              diNo: "DI/2025/1010",
              diDate: "2025-09-06",
              shealingDetails: [
                { trfsiNo: 9100, polySealNo: "IAJ 5401 To IAJ 5402" },
                { trfsiNo: 9101, polySealNo: "IAJ 5403 To IAJ 5404" },
                { trfsiNo: 9102, polySealNo: "IAJ 5405 To IAJ 5406" },
              ],
            },
            subSerialNumberFrom: 9100,
            subSerialNumberTo: 9102,
            challanNo: "CH-2001",
            createdAt: "2025-09-03",
            consignorName: "VoltSafe Industries",
            consignorPhone: "9090909090",
            consignorAddress: "MIDC Industrial Estate, Nagpur",
            consignorGST: "27VSIN1234P9K8",
            consignorEmail: "support@voltsafe.com",
            consigneeDetails: {
              id: "6",
              name: "Western Power Supply Ltd.",
              address: "Shivaji Nagar, Pune - 411005",
              gstNo: "27WPSL5678Q1R2",
            },
            lorryNo: "MH14XY4567",
            truckDriverName: "Suresh Patil",
            materialDescription: {
              materialName: "200 kVA Distribution Transformer",
              description:
                "200 kVA, 11/0.433 kV, 3-Phase, ONAN cooled distribution transformer with standard fittings and protections.",
            },
          },
        },
      ],
    },
  ];

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(100);
  }, []);

  const handleEditClick = (item) => {
    setSelectedGPReceiptRecord(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedGPReceiptRecord(null);
  };

  // Instant PDF Generator (Auto-fit to A4)
  const handleDownloadPDF = async (item) => {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.top = "-9999px";
    element.style.left = "-9999px";
    element.style.width = "1200px"; // render big so columns are visible
    document.body.appendChild(element);

    // Render component
    const root = createRoot(element);
    root.render(<GPReceiptTemplate item={item} />);

    // Wait for rendering
    setTimeout(async () => {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Get image properties
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      // 🔥 Auto-scale so it always fits inside A4
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;

      pdf.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);
      pdf.save(`GPReceipt-${item.id || "file"}.pdf`);

      root.unmount();
      document.body.removeChild(element);
    }, 500);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">G.P. Receipt Notes</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-GPReceiptNote"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Select Date (From → To)</th>
                  <th>Consignee Name</th>
                  <th>Account Receipt Note No / Date</th>
                  <th>ACOS</th>
                  <th>Discom Receipt Note No / Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {dummyGPReceiptNotes.length > 0 ? (
                  dummyGPReceiptNotes.map((note, index) => (
                    <tr key={note.id}>
                      {/* Sr No */}
                      <td># {index + 1}</td>

                      {/* Select Date Range */}
                      <td>
                        <div>{note.selectDateFrom}</div>
                        <div className="text-muted small">
                          to {note.selectDateTo}
                        </div>
                      </td>

                      {/* Consignee Name */}
                      <td>{note.consigneeName}</td>

                      {/* Account Receipt Note No / Date */}
                      <td>
                        <div>{note.accountReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {note.accountReceiptNoteDate}
                        </div>
                      </td>

                      {/* ACOS */}
                      <td>{note.acos}</td>

                      {/* Discom Receipt Note No / Date */}
                      <td>
                        <div>{note.discomReceiptNoteNo}</div>
                        <div className="text-muted small">
                          {note.discomReceiptNoteDate}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDownloadPDF(note)}
                          >
                            Download PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No GP Receipt Notes Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default GPReceiptNote;
