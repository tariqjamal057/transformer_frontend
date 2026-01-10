import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import NewGPInformationModal from "../../components/NewGPInformationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";

const NewGPInformationList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedNewGPInformation, setSelectedNewGPInformation] =
    useState(null);

  const { data: newGPInformations, isLoading, isError } = useQuery({
    queryKey: ["newGpInformations"],
    queryFn: () => api.get("/new-gp-informations").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/new-gp-informations/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "New GP Information deleted successfully!", error: false});
      queryClient.invalidateQueries(["newGpInformations"]);
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
    setSelectedNewGPInformation(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedNewGPInformation(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Information List</h5>

          <div className="d-flex align-items-center">
            <Link to={"/add-NewGPInformation"}>
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
                  <th>Challan Receipted Item No</th>
                  <th>Challan Receipted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {isLoading ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="4">Error fetching data</td>
                  </tr>
                ) : newGPInformations.length > 0 ? (
                  newGPInformations.map((item, index) => (
                    <tr key={item.id}>
                      {/* Sr No */}
                      <td># {index + 1}</td>

                      {/* Challan Receipted Item No */}
                      <td>{item.challanReceiptedItemNo}</td>

                      {/* Challan Receipted Date */}
                      <td>
                        {format(
                          new Date(item.challanReceiptedDate),
                          "dd MMM yyyy"
                        )}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No GP Information Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <NewGPInformationModal
          open={openModal}
          handleClose={handleModalClose}
          newGPInformation={selectedNewGPInformation}
        />
      }
    </>
  );
};

export default NewGPInformationList;

