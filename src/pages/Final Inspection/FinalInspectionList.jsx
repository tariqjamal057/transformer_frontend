import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import FinalInspectionModal from "../../components/FinalInspectionModal";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const FinalInspectionList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFinalInspection, setSelectedFinalInspection] = useState(null);

  const { data: finalInspections, isLoading, isError } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () => api.get("/final-inspections").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/final-inspections/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Final Inspection deleted successfully!", error: false});
      queryClient.invalidateQueries(["finalInspections"]);
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
    setSelectedFinalInspection(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedFinalInspection(null);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Final Inspection List</h5>

          <div className="d-flex align-items-center">
            <Link to={"/add-finalInspection"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Date of Offer</th>
                  <th>Offered Quantity</th>
                  <th>TN No.</th>
                  <th>Rating</th>
                  <th>Phase</th>
                  <th>Wound</th>
                  <th>Offered Sr. No.</th>
                  <th>Sub Sr. No.</th>
                  <th>Inspection Officers</th>
                  <th>Nomination Letter No</th>
                  <th>Nomination Date</th>
                  <th>Inspection Date</th>
                  <th>Inspected Quantity</th>
                  <th>Total</th>
                  <th>DI No & Date</th>
                  <th>Warranty Period</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="18">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="18">Error fetching data</td>
                  </tr>
                ) : finalInspections.length > 0 ? (
                  finalInspections.map((item, index) => (
                    <tr key={item.id}>
                      <td># {index + 1}</td>
                      <td>{format(new Date(item.offeredDate), "dd MMM yyyy")}</td>
                      <td>{item.offeredQuantity}</td>

                      <td>{item.deliverySchedule?.tnNumber}</td>
                      <td>{item.deliverySchedule?.rating}</td>
                      <td>{item.deliverySchedule?.phase}</td>
                      <td>{item.deliverySchedule?.wound}</td>
                      <td>
                        {item.serialNumberFrom} TO {item.serialNumberTo}
                      </td>
                      <td>
                        {item.consignees?.map((consignee, idx) => (
                          <div key={idx} className="mb-1">
                            {consignee.subSnNumber}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap justify-content-center gap-1">
                          {item.inspectionOfficers.map((officer, idx) => (
                            <span
                              key={idx}
                              className="badge bg-info text-white px-2 py-1"
                              style={{
                                fontSize: "0.75rem",
                                borderRadius: "10px",
                              }}
                            >
                              {officer}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{item.nominationLetterNo}</td>
                      <td>{format(new Date(item.nominationDate), "dd MMM yyyy")}</td>
                      <td>{format(new Date(item.inspectionDate), "dd MMM yyyy")}</td>
                      <td>{item.inspectedQuantity}</td>
                      <td>{item.total}</td>
                      <td>
                        <div className="fw-semibold">{item.diNo}</div>
                        <div className="text-muted small">{format(new Date(item.diDate), "dd MMM yyyy")}</div>
                      </td>
                      <td>
                        {item.deliverySchedule.guaranteePeriodMonths} Months
                      </td>

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
                  ))
                ) : (
                  <tr>
                    <td colSpan="18" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FinalInspectionModal
        open={openModal}
        handleClose={handleModalClose}
        inspectionData={selectedFinalInspection}
      />
    </>
  );
};

export default FinalInspectionList;

