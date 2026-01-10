import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import FailureAnalysisModal from "../../components/FailureAnalysisModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const FailureAnalysisList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFailureAnalysis, setSelectedFailureAnalysis] = useState(null);

  const { data: failureAnalyses, isLoading, isError } = useQuery({
    queryKey: ["failureAnalyses"],
    queryFn: () => api.get("/failure-analyses").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/failure-analyses/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Failure Analysis deleted successfully!", error: false});
      queryClient.invalidateQueries(["failureAnalyses"]);
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
    setSelectedFailureAnalysis(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedFailureAnalysis(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Failure Analysis List</h5>

          <div className="d-flex align-items-center">
            <Link to={"/add-FailureAnalysis"}>
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
                  <th>Sin No</th>
                  <th>Tfr. Sr. No</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Tn No.</th>
                  <th>Acos Name</th>
                  <th>Sub Division</th>
                  <th>Location Of Failure</th>
                  <th>Date Of Supply</th>
                  <th>Date Of Expiry</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="12">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="12">Error fetching data</td>
                  </tr>
                ) : failureAnalyses.length > 0 ? (
                  failureAnalyses.map((item, index) => {
                    const receipt = item.gpReceiptNote || {};
                    const failure = item.gpFailure || {};
                    const delivery =
                      receipt.deliveryChalan?.finalInspectionDetail
                        ?.deliverySchedule || {};
                    const material =
                      receipt.deliveryChalan?.materialDescription || {};

                    return (
                      <tr key={index}>
                        {/* Sin No */}
                        <td>{item.sinNo}</td>

                        {/* Tfr. Sr. No */}
                        <td>{receipt.trfSiNo || failure.trfSiNo}</td>

                        {/* Rating */}
                        <td>{receipt.rating || failure.rating}</td>

                        {/* Wound */}
                        <td>{delivery.wound}</td>

                        {/* Phase */}
                        <td>{material.phase || "N/A"}</td>

                        {/* Tn No */}
                        <td>{delivery.tnNumber}</td>

                        {/* Acos Name */}
                        <td>{item.acosName}</td>

                        {/* Sub Division */}
                        <td>{failure.subDivision}</td>

                        {/* Location of Failure → take first entry of array */}
                        <td>{failure.placeOfFailure || "N/A"}</td>

                        {/* Date of Supply (informationDate from failureData[0]) */}
                        <td>
                          {format(
                            new Date(
                              failure.dateOfInformation
                            ),
                            "dd MMM yyyy"
                          ) || "N/A"}
                        </td>

                        {/* Date of Expiry (failureDate from failureData[0]) */}
                        <td>
                          {format(
                            new Date(failure.dateOfFailure),
                            "dd MMM yyyy"
                          ) || "N/A"}
                        </td>

                        {/* Action */}
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
                    <td colSpan={12} className="text-center">
                      No Failure Analysis Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <FailureAnalysisModal
          open={openModal}
          handleClose={handleModalClose}
          failureAnalysisData={selectedFailureAnalysis}
        />
      }
    </>
  );
};

export default FailureAnalysisList;

