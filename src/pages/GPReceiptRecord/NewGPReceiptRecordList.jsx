import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import GPReceiptModal from "../../components/GPReceiptModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const NewGPReceiptRecordList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedGPReceiptRecord, setSelectedGPReceiptRecord] = useState(null);

  const { data: gpReceiptRecords, isLoading, isError } = useQuery({
    queryKey: ["newGpReceiptRecords"],
    queryFn: () => api.get("/new-gp-receipt-records").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/new-gp-receipt-records/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "New GP Receipt Record deleted successfully!", error: false});
      queryClient.invalidateQueries(["newGpReceiptRecords"]);
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
    setSelectedGPReceiptRecord(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedGPReceiptRecord(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Receipt Record List</h5>

          <div className="d-flex align-items-center">
            <Link to={"/add-newGPReceiptRecord"}>
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
                  <th>Account Receipt Note No</th>
                  <th>Account Receipt Note Date</th>
                  <th>SIN No</th>
                  <th>Consignee Name</th>
                  <th>Discom Receipt Note No</th>
                  <th>Discom Receipt Note Date</th>
                  <th>TRF SI No</th>
                  <th>Original Tfr. Sr. No.</th>
                  <th>Discom Tfr. Sr. No.</th>
                  <th>Rating</th>
                  <th>Wound</th>
                  <th>Phase</th>
                  <th>Poly Seal No</th>
                  <th>Seal No Time Of G.P. Received</th>
                  <th>Date Of Supply</th>
                  <th>Parts Condition</th>
                  <th>Remarks</th>
                  <th className="action-col">Action</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="19">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="19">Error fetching data</td>
                  </tr>
                ) : gpReceiptRecords.length > 0 ? (
                  gpReceiptRecords.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.accountReceiptNoteNo}</td>
                      <td>{item.accountReceiptNoteDate}</td>
                      <td>{item.sinNo}</td>
                      <td>{item.consigneeName}</td>
                      <td>{item.discomReceiptNoteNo}</td>
                      <td>{item.discomReceiptNoteDate}</td>
                      <td>{item.trfsiNo}</td>
                      <td>{item.originalTfrSrNo}</td>
                      <td>{item.consigneeTFRSerialNo}</td>
                      <td>{item.rating}</td>
                      <td>
                        {
                          item.deliveryChalan?.finalInspectionDetail
                            ?.deliverySchedule?.wound
                        }
                      </td>
                      <td>
                        {
                          item.deliveryChalan?.finalInspectionDetail
                            ?.deliverySchedule?.phase
                        }
                      </td>
                      <td>{item.polySealNo}</td>
                      <td>{item.sealNoTimeOfGPReceived}</td>
                      <td>{item.deliveryChalan.createdAt}</td>
                      <td className="text-start small">
                        <div>
                          <strong>Oil Level:</strong> {item.oilLevel}
                        </div>
                        <div>
                          <strong>HV Bushing:</strong> {item.hvBushing}
                        </div>
                        <div>
                          <strong>LV Bushing:</strong> {item.lvBushing}
                        </div>
                        <div>
                          <strong>Radiator:</strong> {item.radiator}
                        </div>
                        <div>
                          <strong>Core:</strong> {item.core}
                        </div>
                      </td>
                      <td className="text-start">{item.remarks}</td>
                      <td className="action-col">
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
                    <td colSpan="19" className="text-center">
                      No GP Receipt Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <GPReceiptModal
          open={openModal}
          handleClose={handleModalClose}
          gpReceiptData={selectedGPReceiptRecord}
        />
      }
    </>
  );
};

export default NewGPReceiptRecordList;
