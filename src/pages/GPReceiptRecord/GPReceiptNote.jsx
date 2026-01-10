import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfTemplate from "../../components/PdfTemplate";
import { createRoot } from "react-dom/client";
import { MyContext } from "../../App";
import GPReceiptTemplate from "../../components/GPReceiptTemplate";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

const GPReceiptNote = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPReceiptRecord, setSelectedGPReceiptRecord] = useState(null);

  const { data: gpReceiptNotes, isLoading } = useQuery({
    queryKey: ["gpReceiptNotes"],
    queryFn: () => api.get("/gp-receipt-notes").then((res) => res.data.data),
  });

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
                {isLoading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : gpReceiptNotes.length > 0 ? (
                  gpReceiptNotes.map((note, index) => (
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
