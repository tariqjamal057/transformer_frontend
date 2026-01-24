import { useContext, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import FailureAnalysisModal from "../../components/FailureAnalysisModal";
import FailureAnalysisBulkUploadModal from "../../components/FailureAnalysisBulkUploadModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import dayjs from "dayjs";

const FailureAnalysisList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);
  const [selectedFailureAnalysis, setSelectedFailureAnalysis] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: failureAnalysesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["failureAnalyses", currentPage, searchQuery],
    queryFn: () =>
      api
        .get(`/failure-analyses?page=${currentPage}&search=${searchQuery}`)
        .then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/failure-analyses/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Failure Analysis deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["failureAnalyses"]);
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
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginLeft: "auto",
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#f0883d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f0883d",
                },
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
          {hasPermission("FailureAnalysisCreate") && (
            <div className="d-flex align-items-center">
              <Button
                className="btn-blue ms-3 ps-3 pe-3"
                onClick={() => setOpenBulkUploadModal(true)}
              >
                Bulk Upload
              </Button>
              <Link to={"/add-FailureAnalysis"}>
                <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
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
                  {hasPermission("FailureAnalysisUpdate") && <th>Action</th>}
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="13">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="13">Error fetching data</td>
                  </tr>
                ) : failureAnalysesData?.data.length > 0 ? (
                  failureAnalysesData.data.map((item, index) => {
                    const newGPReceiptRecord = item.newGPReceiptRecord || {};
                    const gpFailure = item.gpFailure || {};
                    const deliverySchedule =
                      newGPReceiptRecord.deliveryChallan?.finalInspection
                        ?.deliverySchedule || {};
                    const materialDescription =
                      newGPReceiptRecord.deliveryChallan?.materialDescription ||
                      {};
                    const failureDetails = gpFailure.failureDetails?.[0] || {};

                    return (
                      <tr key={item.id}>
                        <td>#{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{newGPReceiptRecord.sinNo}</td>
                        <td>{newGPReceiptRecord.trfsiNo}</td>
                        <td>{newGPReceiptRecord.rating}</td>
                        <td>{deliverySchedule.wound}</td>
                        <td>{materialDescription.phase}</td>
                        <td>{deliverySchedule.tnNumber}</td>
                        <td>{item.acosName}</td>
                        <td>{gpFailure.subDivision}</td>
                        <td>{failureDetails.place}</td>
                        <td>
                          {failureDetails.informationDate
                            ? dayjs(failureDetails.informationDate).format(
                                "DD-MM-YYYY",
                              )
                            : "N/A"}
                        </td>
                        <td>
                          {failureDetails.failureDate
                            ? dayjs(failureDetails.failureDate).format(
                                "DD-MM-YYYY",
                              )
                            : "N/A"}
                        </td>
                        {hasPermission("FailureAnalysisUpdate") && (
                          <td>
                            <div className="d-flex gap-2 align-items-center justify-content-center">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleEditClick(item)}
                              >
                                <FaPencilAlt />
                              </button>
                              {/* <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FaTrash />
                            </button> */}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">
                      No Failure Analysis Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {failureAnalysesData?.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={failureAnalysesData.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {selectedFailureAnalysis && (
        <FailureAnalysisModal
          open={openModal}
          handleClose={handleModalClose}
          failureAnalysisData={selectedFailureAnalysis}
        />
      )}
      <FailureAnalysisBulkUploadModal
        open={openBulkUploadModal}
        handleClose={() => setOpenBulkUploadModal(false)}
      />
    </>
  );
};

export default FailureAnalysisList;
