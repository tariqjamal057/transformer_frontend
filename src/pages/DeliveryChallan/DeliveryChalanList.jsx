import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaFileDownload,
  FaPencilAlt,
  FaPrint,
  FaTrash,
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PdfTemplate from "../../components/PdfTemplate";
import { createRoot } from "react-dom/client"; // Add this at the top
import SearchIcon from "@mui/icons-material/Search";
import DeliveryChalanModal from "../../components/DeliveryChalanModal";
import DetailsModal from "../../components/DetailsModal";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import DeliveryChalanBulkUploadModal from "../../components/DeliveryChalanBulkUploadModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const DeliveryChalanList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDeliveryChalan, setSelectedDeliveryChalan] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedChalanDetails, setSelectedChalanDetails] = useState(null);
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: deliveryChallans,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deliveryChallans", currentPage, searchQuery],
    queryFn: () =>
      api
        .get(`/delivery-challans?page=${currentPage}&search=${searchQuery}`)
        .then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/delivery-challans/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Delivery Challan deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["deliveryChallans"]);
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEditClick = (item) => {
    setSelectedDeliveryChalan(item);
    setIsPreview(false);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedDeliveryChalan(null);
  };

  const handleViewClick = (item) => {
    setSelectedChalanDetails(item);
    setOpenDetailsModal(true);
  };

  const handleDetailsModalClose = () => {
    setOpenDetailsModal(false);
    setSelectedChalanDetails(null);
  };

  // Instant PDF Generator
  const generatePDF = async (item) => {
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.top = "-9999px";
    element.style.left = "-9999px";
    document.body.appendChild(element);

    // Create root and render the component
    const root = createRoot(element);
    root.render(
      <div style={{ width: "800px" }}>
        <PdfTemplate item={item} />
      </div>,
    );

    // Wait for rendering to finish
    setTimeout(async () => {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Challan-${item.challanNo}.pdf`);

      root.unmount();
      document.body.removeChild(element);
    }, 300);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Delivery Challan List</h5>

          <div className="d-flex align-items-center">
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
            {hasPermission("DeliveryChallanCreate") && (
              <>
                <Button
                  className="btn-blue ms-3 ps-3 pe-3"
                  onClick={() => setOpenBulkUploadModal(true)}
                >
                  Bulk Upload
                </Button>
                <Link to={"/add-deliveryChalan"}>
                  <Button className="btn-blue ms-3 ps-3 pe-3">
                    Create New Delivery Challan
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>PO Number / Date</th>
                  <th>Challan No</th>
                  <th>Transformer Info</th>
                  <th>Serial No</th>
                  <th>Sub Serial No</th>
                  <th>Inspection Officers</th>
                  <th>Inspection Date</th>
                  <th>Consignor Details</th>
                  <th>Consignee Details</th>
                  <th>Material & Chalan Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="11">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="11">Error fetching data</td>
                  </tr>
                ) : deliveryChallans?.items?.length > 0 ? (
                  deliveryChallans.items.map((item, index) => (
                    <tr key={item.id}>
                      {/* Sr No */}
                      <td>
                        # {(deliveryChallans.currentPage - 1) * 10 + index + 1}
                      </td>

                      {/* PO Number / Date */}
                      <td>
                        <div className="fw-semibold">
                          {item.finalInspection?.deliverySchedule?.poDetails}
                        </div>
                        <div className="text-muted small">
                          {item.finalInspection?.deliverySchedule?.poDate}
                        </div>
                      </td>

                      {/* Challan No */}
                      <td>{item.challanNo}</td>

                      {/* Transformer Info */}
                      <td className="text-start">
                        <div>
                          <strong>TN:</strong>{" "}
                          {item.finalInspection?.deliverySchedule?.tnNumber}
                        </div>
                        <div>
                          <strong>Serial No:</strong>{" "}
                          {item.finalInspection.serialNumberFrom} - {item.finalInspection.serialNumberTo}
                        </div>
                        <div>
                          <strong>DI No:</strong> {item.finalInspection.diNo}
                        </div>
                        <div>
                          <strong>DI Date:</strong>{" "}
                          {item.finalInspection.diDate}
                        </div>
                      </td>

                      {/* Serial No */}
                      <td>
                        {item.finalInspection?.consignees?.find(c => c.consigneeId === item.consigneeId)?.subSnNumber || 'N/A'}
                      </td>

                      {/* Sub Serial No */}
                      <td>
                        {(item.finalInspection?.consignees?.find(c => c.consigneeId === item.consigneeId)?.repairedTransformerIds || []).join(', ') || ''}
                      </td>

                      {/* Inspection Officers */}
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {item.finalInspection.inspectionOfficers.map(
                            (officer, idx) => (
                              <span
                                key={`${item.id}-${idx}`}
                                className="badge bg-info text-white px-2 py-1"
                                style={{
                                  fontSize: "0.75rem",
                                  borderRadius: "10px",
                                }}
                              >
                                {officer}
                              </span>
                            ),
                          )}
                        </div>
                      </td>

                      {/* Inspection Date */}
                      <td>{item.finalInspection.inspectionDate}</td>

                      {/* Consignor Details */}
                      <td className="text-start">
                        <div>
                          <strong>Name:</strong> {item.consignorName}
                        </div>
                        <div>
                          <strong>Phone:</strong> {item.consignorPhone}
                        </div>
                        <div>
                          <strong>Address:</strong> {item.consignorAddress}
                        </div>
                        <div>
                          <strong>GST:</strong> {item.consignorGST}
                        </div>
                      </td>

                      {/* Consignee Details */}
                      <td className="text-start">
                        <div>
                          <strong>Name:</strong> {item.consignee.name}
                        </div>
                        <div>
                          <strong>Address:</strong> {item.consignee.address}
                        </div>
                        <div>
                          <strong>GST:</strong> {item.consignee.gstNo}
                        </div>
                      </td>

                      {/* Material & Challan Description */}
                      <td className="text-start">
                        <div>
                          {item.materialDescription.description
                            .split(" ")
                            .slice(0, 12)
                            .join(" ")}
                        </div>
                        <div className="text-muted small mt-1">
                          {item.finalInspection.deliverySchedule?.chalanDescription
                            .split(" ")
                            .slice(0, 10)
                            .join(" ")}
                          ...
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          {/* <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewClick(item)}
                          >
                            <FaEye />
                          </button> */}
                          {hasPermission("DeliveryChallanUpdate") && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                          )}
                          <Tooltip title="Download pdf" placement="top">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => generatePDF(item)}
                            >
                              <FaFileDownload />
                            </button>
                          </Tooltip>
                          {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {deliveryChallans?.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={deliveryChallans.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {
        <DeliveryChalanModal
          open={openModal}
          handleClose={handleModalClose}
          deliveryChalanData={selectedDeliveryChalan}
          previewOnly={isPreview}
          onPrint={() => generatePDF(selectedDeliveryChalan)}
        />
      }
      {
        <DetailsModal
          open={openDetailsModal}
          handleClose={handleDetailsModalClose}
          title="Delivery Challan Details"
          details={selectedChalanDetails}
        />
      }
      <DeliveryChalanBulkUploadModal
        open={openBulkUploadModal}
        handleClose={() => setOpenBulkUploadModal(false)}
      />
    </>
  );
};

export default DeliveryChalanList;
