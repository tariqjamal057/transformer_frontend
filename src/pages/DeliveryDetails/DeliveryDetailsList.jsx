import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import DeliveryDetailsBulkUploadModal from "../../components/DeliveryDetailsBulkUploadModal";
import dayjs from "dayjs";

const DeliveryDetailsList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);

  const {
    data: deliveryDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deliveryDetails", currentPage, searchQuery],
    queryFn: () =>
      api
        .get(`/delivery-details?page=${currentPage}&search=${searchQuery}`)
        .then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/delivery-details/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Delivery Details deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["deliveryDetails"]);
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this delivery details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Delivery Details Of Transformers List</h5>
          <div className="ms-auto d-flex align-items-center">
            {/* <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setCurrentPage={setCurrentPage}
            /> */}
            <Button
              className="btn-blue ms-3 ps-3 pe-3"
              onClick={() => setOpenBulkUploadModal(true)}
            >
              Bulk Upload
            </Button>
            <Link to={"/add-deliveryDetails"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add New Delivery Detail
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>TN Number</th>
                  <th>Serial No</th>
                  <th>PO Number / Date</th>
                  <th>Challan No</th>
                  <th>Challan Date</th>
                  <th>Receipted Challan No</th>
                  <th>Receipted Challan Date</th>
                  <th>Total Qty.</th>
                  <th>G.P. Expiry Date</th>
                  <th>Transformer Info</th>
                  <th>Inspection Officers</th>
                  <th>Inspection Date</th>
                  <th>Consignor Details</th>
                  <th>Consignee Details</th>
                  <th>Material Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="17">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="17">Error fetching data</td>
                  </tr>
                ) : deliveryDetails?.items?.length > 0 ? (
                  deliveryDetails.items.map((item, index) => {
                    const dc = item.deliveryChallan;
                    return (
                      <tr key={item.id}>
                        <td>
                          # {(deliveryDetails.currentPage - 1) * 10 + index + 1}
                        </td>

                        <td>{dc.finalInspection.deliverySchedule.tnNumber}</td>

                        <td>
                          {dc.finalInspection.serialNumberFrom} TO{" "}
                          {dc.finalInspection.serialNumberTo}
                        </td>

                        {/* PO Number / Date */}
                        <td>
                          <div className="fw-semibold">
                            {dc.finalInspection.deliverySchedule.poDetails}
                          </div>
                          <div className="text-muted small">
                            {new Date(
                              dc.finalInspection.deliverySchedule.poDate
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Challan No */}
                        <td>{dc.challanNo}</td>

                        {/* Challan Date */}
                        <td>{new Date(dc.createdAt).toLocaleDateString()}</td>

                        {/* Receipted Challan No */}
                        <td>{item.receiptedChallanNo}</td>

                        {/* Receipted Challan Date */}
                        <td>
                          {new Date(
                            item.receiptedChallanDate
                          ).toLocaleDateString()}
                        </td>

                        {/* Total Qty. */}
                        <td>{dc.finalInspection.inspectedQuantity}</td>

                        {/* G.P. Expiry Date */}
                        <td>
                          {dayjs(
                            dc.finalInspection.deliverySchedule
                              .deliveryScheduleDate
                          )
                            .add(
                              dc.finalInspection.deliverySchedule
                                .guaranteePeriodMonths,
                              "month"
                            )
                            .format("YYYY-MM-DD")}
                        </td>

                        {/* Transformer Info */}
                        <td className="text-start">
                          <div>
                            <strong>TN:</strong>{" "}
                            {dc.finalInspection.deliverySchedule.tnNumber}
                          </div>
                          <div>
                            <strong>Serial No:</strong>{" "}
                            {dc.finalInspection.serialNumberFrom} TO{" "}
                            {dc.finalInspection.serialNumberTo}
                          </div>
                          <div>
                            <strong>DI No:</strong> {dc.finalInspection.diNo}
                          </div>
                          <div>
                            <strong>DI Date:</strong>{" "}
                            {new Date(
                              dc.finalInspection.diDate
                            ).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Inspection Officers */}
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {dc.finalInspection.inspectionOfficers.map(
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
                              )
                            )}
                          </div>
                        </td>

                        {/* Inspection Date */}
                        <td>
                          {new Date(
                            dc.finalInspection.inspectionDate
                          ).toLocaleDateString()}
                        </td>

                        {/* Consignor Details */}
                        <td className="text-start">
                          <div>
                            <strong>Name:</strong> {dc.consignorName}
                          </div>
                          <div>
                            <strong>Phone:</strong> {dc.consignorPhone}
                          </div>
                          <div>
                            <strong>Address:</strong> {dc.consignorAddress}
                          </div>
                          <div>
                            <strong>GST:</strong> {dc.consignorGST}
                          </div>
                        </td>

                        {/* Consignee Details */}
                        <td className="text-start">
                          <div>
                            <strong>Name:</strong> {dc.consignee.name}
                          </div>
                          <div>
                            <strong>Address:</strong> {dc.consignee.address}
                          </div>
                          <div>
                            <strong>GST:</strong> {dc.consignee.gstNo}
                          </div>
                        </td>

                        {/* Material Description */}
                        <td className="text-start">
                          <div>{dc.materialDescription?.description}</div>
                        </td>

                        {/* Action Buttons */}
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item.id);
                              }}
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="17" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {deliveryDetails?.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={deliveryDetails.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      <DeliveryDetailsBulkUploadModal
        open={openBulkUploadModal}
        handleClose={() => setOpenBulkUploadModal(false)}
      />
    </>
  );
};

export default DeliveryDetailsList;
