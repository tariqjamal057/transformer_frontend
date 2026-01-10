import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { addMonths, format, isAfter } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import GPFailureInformationModal from "../../components/GPFailureInformationModal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const GPFailureInformationList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPFailure, setSelectedGPFailure] = useState(null);

  const { data: gpFailures, isLoading, isError } = useQuery({
    queryKey: ["gpFailures"],
    queryFn: () => api.get("/gp-failures").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/gp-failures/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "GP Failure Information deleted successfully!", error: false});
      queryClient.invalidateQueries(["gpFailures"]);
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
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

  const handleEditClick = (item) => {
    setSelectedGPFailure(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedGPFailure(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">G.P. Failure Information List</h5>

          <div className="d-flex align-items-center gap-2">
            <Link to={"/add-GPFailureInformation"}>
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
                  <th>TRF SI No</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Material Name</th>
                  <th>TN No</th>
                  <th>DI No / Date</th>
                  <th>Challan No / Date</th>
                  <th>Consignee Details</th>
                  <th>TRF Failure List</th>
                  <th>Guarantee Period</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="15">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="15">Error fetching data</td>
                  </tr>
                ) : gpFailures.length > 0 ? (
                  gpFailures.map((item, index) => {
                    const challanDate = new Date(
                      item.deliveryChalan.createdAt
                    );
                    const guaranteeMonths =
                      item.deliveryChalan.finalInspectionDetail
                        .deliverySchedule.guaranteePeriodMonths;

                    // Calculate expiry date
                    const expiryDate = addMonths(challanDate, guaranteeMonths);

                    // Guarantee status
                    const today = new Date();
                    const isUnderGuarantee = isAfter(expiryDate, today);

                    return (
                      <tr key={item.id}>
                        {/* Sr No */}
                        <td># {index + 1}</td>

                        {/* TRF SI No */}
                        <td>{item.trfSiNo}</td>

                        {/* Rating */}
                        <td>{item.rating}</td>

                        <td>{item.deliveryChalan?.finalInspectionDetail?.deliverySchedule?.wound}</td>

                        <td>{item.deliveryChalan?.finalInspectionDetail?.deliverySchedule?.phase}</td>

                        {/* Material Name */}
                        <td>
                          {
                            item.deliveryChalan.materialDescription
                              .materialName
                          }
                        </td>

                        {/* TN No */}
                        <td>
                          {
                            item.deliveryChalan.finalInspectionDetail
                              .deliverySchedule.tnNumber
                          }
                        </td>

                        {/* DI No / Date */}
                        <td>
                          <div>
                            {
                              item.deliveryChalan.finalInspectionDetail
                                .diNo
                            }
                          </div>
                          <div className="text-muted small">
                            {
                              item.deliveryChalan.finalInspectionDetail
                                .diDate
                            }
                          </div>
                        </td>

                        {/* Challan No / Date */}
                        <td>
                          <div>{item.deliveryChalan.challanNo}</div>
                          <div className="text-muted small">
                            {item.deliveryChalan.createdAt}
                          </div>
                        </td>

                        {/* Consignee Details */}
                        <td className="text-start">
                          <div>
                            <strong>Name:</strong>{" "}
                            {item.deliveryChalan.consigneeDetails.name}
                          </div>
                          <div>
                            <strong>Address:</strong>{" "}
                            {
                              item.deliveryChalan.consigneeDetails
                                .address
                            }
                          </div>
                          <div>
                            <strong>GST:</strong>{" "}
                            {item.deliveryChalan.consigneeDetails.gstNo}
                          </div>
                        </td>

                        {/* TRF Failure List */}
                        <td className="text-start">
                          
                            <div className="mb-1">
                              <strong>Place:</strong> {item.placeOfFailure} <br />
                              <strong>Failure Date:</strong>{" "}
                              {item.dateOfFailure} <br />
                              <strong>Info Date:</strong>{" "}
                              {item.dateOfInformation}
                              <hr className="my-1" />
                            </div>
                        
                        </td>

                        {/* Guarantee Period */}
                        <td>{guaranteeMonths} Months</td>

                        {/* Expiry Date */}
                        <td>{format(expiryDate, "yyyy-MM-dd")}</td>

                        {/* Guarantee Status */}
                        <td
                          style={{
                            color: isUnderGuarantee ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {isUnderGuarantee ? "Under Guarantee" : "Expired"}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <GPFailureInformationModal
          open={openModal}
          handleClose={handleModalClose}
          gpFailureData={selectedGPFailure}
        />
      }
    </>
  );
};

export default GPFailureInformationList;

