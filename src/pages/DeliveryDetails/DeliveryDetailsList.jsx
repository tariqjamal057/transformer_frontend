import { useContext, useEffect, useState } from "react";
import { Button, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import DeliveryDetailsBulkUploadModal from "../../components/DeliveryDetailsBulkUploadModal";
import DeliveryDetailsModal from "../../components/DeliveryDetailsModal";
import dayjs from "dayjs";

const compressSerials = (serials) => {
  if (!serials || !Array.isArray(serials) || serials.length === 0) return "";
  const nums = serials
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  if (nums.length === 0) return serials.join(", ");

  const parts = [];
  let start = nums[0];
  let end = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === end + 1) {
      end = nums[i];
    } else {
      parts.push(start === end ? `${start}` : `${start}-${end}`);
      start = nums[i];
      end = nums[i];
    }
  }
  parts.push(start === end ? `${start}` : `${start}-${end}`);
  return parts.join(", ");
};

const calculateSuppliedQuantity = (dc) => {
  if (!dc) return 0;
  let count = 0;

  // 1. New Transformers
  if (dc.selectedTransformers && Array.isArray(dc.selectedTransformers)) {
    count += dc.selectedTransformers.length;
  } else if (dc.subSerialNumberFrom && dc.subSerialNumberTo) {
    const start = parseInt(dc.subSerialNumberFrom, 10);
    const end = parseInt(dc.subSerialNumberTo, 10);
    if (!isNaN(start) && !isNaN(end)) count += end - start + 1;
  }

  // 2. Repaired Transformers
  if (dc.repairedSerialNumbers && Array.isArray(dc.repairedSerialNumbers)) {
    count += dc.repairedSerialNumbers.length;
  }

  // 3. Other Consignee Serial Numbers
  if (dc.otherConsigneeSerialNumbers) {
    const parts = dc.otherConsigneeSerialNumbers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    parts.forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) count += end - start + 1;
      } else {
        count += 1;
      }
    });
  }

  return count;
};

const DeliveryDetailsList = () => {
  const { userRole, setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeliveryDetail, setSelectedDeliveryDetail] = useState(null);

  const [selectedTnNumber, setSelectedTnNumber] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedConsignee, setSelectedConsignee] = useState("");

  const {
    data: deliveryDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deliveryDetails", currentPage, searchQuery],
    queryFn: () => {
      return api
        .get(`/delivery-details?page=${currentPage}&search=${searchQuery}`)
        .then((res) => res.data);
    },
  });

  const { data: finalInspections } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () =>
      api.get("/final-inspections?all=true").then((res) => res.data),
  });

  const tnNumbers = [
    ...new Set(
      finalInspections?.map((item) => item.deliverySchedule?.tnNumber),
    ),
  ].filter(Boolean);
  const ratings = [
    ...new Set(
      deliveryDetails?.items?.map(
        (item) =>
          item.deliveryChallan?.finalInspection?.deliverySchedule?.rating,
      ),
    ),
  ];
  const consignees = [
    ...new Set(
      deliveryDetails?.items?.map(
        (item) => item.deliveryChallan?.consignee?.name,
      ),
    ),
  ];

  const handleClearFilters = () => {
    setSelectedTnNumber("");
    setSelectedRating("");
    setSelectedConsignee("");
  };

  const filteredItems = deliveryDetails?.items?.filter((item) => {
    const tnMatch =
      !selectedTnNumber ||
      item.deliveryChallan?.finalInspection?.deliverySchedule?.tnNumber ===
        selectedTnNumber;
    const ratingMatch =
      !selectedRating ||
      item.deliveryChallan?.finalInspection?.deliverySchedule?.rating ===
        selectedRating;
    const consigneeMatch =
      !selectedConsignee ||
      item.deliveryChallan?.consignee?.name === selectedConsignee;
    return tnMatch && ratingMatch && consigneeMatch;
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return api.delete(`/delivery-details/${id}`);
    },
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

  const handleEditClick = (item) => {
    setSelectedDeliveryDetail(item);
    setOpenModal(true);
  };

  const handleAddClick = () => {
    setSelectedDeliveryDetail(null);
    setOpenModal(true);
  };

  const getOtherConsigneeDetails = (dc) => {
    if (!dc?.otherConsigneeSerialNumbers) return "-";

    const serials = dc.otherConsigneeSerialNumbers
      .split(",")
      .map((s) => s.trim());
    const consignees = dc.finalInspection?.consignees || [];

    const mapped = serials.map((serialRange) => {
      // Check if it's a range
      if (serialRange.includes("-")) {
        const [start] = serialRange.split("-").map(Number);
        // Find consignee for start (assuming range belongs to one)
        const consignee = consignees.find((c) => {
          // Check new range
          if (c.subSnNumber) {
            const parts = c.subSnNumber.split(" TO ");
            if (parts.length === 2) {
              const cStart = parseInt(parts[0], 10);
              const cEnd = parseInt(parts[1], 10);
              if (start >= cStart && start <= cEnd) return true;
            } else if (parseInt(c.subSnNumber, 10) === start) {
              return true;
            }
          }
          return false;
        });
        return consignee
          ? `${serialRange} (${consignee.consigneeName})`
          : serialRange;
      } else {
        const serial = Number(serialRange);
        const consignee = consignees.find((c) => {
          // Check new
          if (c.subSnNumber) {
            const parts = c.subSnNumber.split(" TO ");
            if (parts.length === 2) {
              const cStart = parseInt(parts[0], 10);
              const cEnd = parseInt(parts[1], 10);
              if (serial >= cStart && serial <= cEnd) return true;
            } else if (parseInt(c.subSnNumber, 10) === serial) {
              return true;
            }
          }
          // Check repaired
          if (c.repairedTransformerIds?.includes(String(serial))) return true;
          return false;
        });
        return consignee
          ? `${serialRange} (${consignee.consigneeName})`
          : serialRange;
      }
    });

    return mapped.join(", ");
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Delivery Details Of Transformers List</h5>
          {hasPermission("DeliveryDetailsCreate") && (
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
          )}
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <Grid container columns={{ xs: 1, sm: 2, md: 4 }} spacing={2}>
            <Grid item size={1}>
              <TextField
                select
                label="TN Number"
                value={selectedTnNumber}
                onChange={(e) => setSelectedTnNumber(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {tnNumbers.map((tn) => (
                  <MenuItem key={tn} value={tn}>
                    {tn}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item size={1}>
              <TextField
                select
                label="Rating"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {ratings.map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item size={1}>
              <TextField
                select
                label="Consignee"
                value={selectedConsignee}
                onChange={(e) => setSelectedConsignee(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {consignees.map((consignee) => (
                  <MenuItem key={consignee} value={consignee}>
                    {consignee}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item size={1}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                fullWidth
                sx={{ height: "100%" }}
              >
                Clear All
              </Button>
            </Grid>
          </Grid>
          {/* Table */}
          <div className="card shadow border-0 p-3 mt-4">
            <div className="table-responsive">
              <table className="table table-hover table-striped table-bordered align-middle text-nowrap">
                <thead className="table-primary text-white text-uppercase text-center">
                  <tr>
                    <th>Sr No</th>
                    <th>TN Number</th>
                    <th>Serial No</th>
                    <th>Selected Serial No</th>
                    <th>Selected Sub Serial No</th>
                    <th>Other Consignee Serial No</th>
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
                    <th>Action</th>
                    {/* <th>Material Description</th> */}
                  </tr>
                </thead>

                <tbody className="text-center align-middle">
                  {isLoading ? (
                    <tr>
                      <td colSpan="20">Loading...</td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan="20">Error fetching data</td>
                    </tr>
                  ) : filteredItems?.length > 0 ? (
                    filteredItems.map((item, index) => {
                      const dc = item.deliveryChallan;
                      return (
                        <tr key={item.id}>
                          <td>
                            #{" "}
                            {(deliveryDetails.currentPage - 1) * 10 + index + 1}
                          </td>

                          <td>
                            {dc?.finalInspection?.deliverySchedule?.tnNumber}
                          </td>

                          <td>
                            {dc?.finalInspection?.serialNumberFrom} TO{" "}
                            {dc?.finalInspection?.serialNumberTo}
                          </td>

                          {/* Selected Serial No */}
                          <td>
                            {compressSerials(dc.selectedTransformers) || "-"}
                          </td>

                          {/* Repaired Serial No */}
                          <td>
                            {compressSerials(dc.repairedSerialNumbers) || "-"}
                          </td>

                          {/* Other Consignee Serial No */}
                          <td>{getOtherConsigneeDetails(dc)}</td>

                          {/* PO Number / Date */}
                          <td>
                            <div className="fw-semibold">
                              {dc?.finalInspection?.deliverySchedule?.poDetails}
                            </div>
                            <div className="text-muted small">
                              {new Date(
                                dc.finalInspection?.deliverySchedule?.poDate,
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
                            {dayjs(item.receiptedChallanDate).format(
                              "YYYY-MM-DD",
                            )}
                          </td>

                          {/* Total Qty. */}
                          <td>{dc.finalInspection.inspectedQuantity}</td>

                          {/* G.P. Expiry Date */}
                          <td>
                            {dayjs(
                              dc?.finalInspection?.deliverySchedule
                                ?.deliveryScheduleDate,
                            )
                              .add(
                                dc?.finalInspection?.deliverySchedule
                                  ?.guaranteePeriodMonths,
                                "month",
                              )
                              .format("YYYY-MM-DD")}
                          </td>

                          {/* Transformer Info */}
                          <td className="text-start">
                            <div>
                              <strong>TN:</strong>{" "}
                              {dc?.finalInspection?.deliverySchedule?.tnNumber}
                            </div>
                            <div>
                              <strong>Serial No:</strong>{" "}
                              {dc?.finalInspection?.serialNumberFrom} TO{" "}
                              {dc?.finalInspection?.serialNumberTo}
                            </div>
                            <div>
                              <strong>DI No:</strong> {dc.finalInspection.diNo}
                            </div>
                            <div>
                              <strong>DI Date:</strong>{" "}
                              {new Date(
                                dc.finalInspection.diDate,
                              ).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Inspection Officers */}
                          <td>
                            <div className="d-flex flex-column gap-1">
                              {dc?.finalInspection?.inspectionOfficers?.map(
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
                          <td>
                            {new Date(
                              dc.finalInspection.inspectionDate,
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
                          {/* Action Buttons */}
                          <td>
                            <div className="d-flex gap-2 align-items-center justify-content-center">
                              <IconButton
                                color="secondary"
                                onClick={() => handleEditClick(item)}
                              >
                                <MdEdit />
                              </IconButton>
                              {userRole === "OWNER" && (
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteClick(item.id)}
                                >
                                  <MdDelete />
                                </IconButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="20" className="text-center">
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
        <DeliveryDetailsModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          deliveryDetailData={selectedDeliveryDetail}
        />
      </div>
    </>
  );
};
export default DeliveryDetailsList;
