import { useContext, useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";

const TnNumberList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTnNumber, setSelectedTnNumber] = useState(null);
  const [editedTnNumber, setEditedTnNumber] = useState("");
  const [editedRating, setEditedRating] = useState("");
  const [editedDiscom, setEditedDiscom] = useState("");

  const { data: tnNumbers, isLoading, isError } = useQuery({
    queryKey: ["tnNumbers"],
    queryFn: () => api.get("/tns").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tns/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "TN Number deleted successfully!", error: false});
      queryClient.invalidateQueries(["tnNumbers"]);
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedTnNumber) =>
      api.put(`/tns/${selectedTnNumber.id}`, updatedTnNumber),
    onSuccess: () => {
      setAlertBox({open: true, msg: "TN Number updated successfully!", error: false});
      queryClient.invalidateQueries(["tnNumbers"]);
      handleModalClose();
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
    setSelectedTnNumber(item);
    setEditedTnNumber(item.name);
    setEditedRating(item.rating);
    setEditedDiscom(item.discom);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedTnNumber(null);
    setEditedTnNumber("");
    setEditedRating("");
    setEditedDiscom("");
  };

  const handleSaveChanges = () => {
    updateMutation.mutate({
      name: editedTnNumber,
      rating: editedRating,
      discom: editedDiscom,
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Transfomer Number List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-tnNumber"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add TN Number</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>TENDER NO</th>
                  <th>RATING</th>
                  <th>DISCOM</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="5">Error fetching data</td>
                  </tr>
                ) : tnNumbers?.length > 0 ? (
                  tnNumbers.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.rating}</td>
                      <td>{item.discom}</td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
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
                    <td colSpan="5" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        fullWidth
      >
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Details
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Tender No"
            fullWidth
            margin="normal"
            value={editedTnNumber}
            onChange={(e) => setEditedTnNumber(e.target.value)}
          />

          <TextField
            label="Rating"
            fullWidth
            margin="normal"
            value={editedRating}
            onChange={(e) => setEditedRating(e.target.value)}
          />

          <TextField
            label="Discom"
            fullWidth
            margin="normal"
            value={editedDiscom}
            onChange={(e) => setEditedDiscom(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TnNumberList;