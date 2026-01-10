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
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";

const LoaList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLoa, setSelectedLoa] = useState(null);
  const [editedTnDetail, setEditedTnDetail] = useState("");
  const [editedLoa, setEditedLoa] = useState("");
  const [editedPo, setEditedPo] = useState("");

  const { data: loas, isLoading, isError } = useQuery({
    queryKey: ["loas"],
    queryFn: () => api.get("/loas").then((res) => res.data),
  });

  const { data: tnNumbers } = useQuery({
    queryKey: ["tnNumbers"],
    queryFn: () => api.get("/tns").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/loas/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "LOA and PO details deleted successfully!", error: false});
      queryClient.invalidateQueries(["loas"]);
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedLoa) =>
      api.put(`/loas/${selectedLoa.id}`, updatedLoa),
    onSuccess: () => {
      setAlertBox({open: true, msg: "LOA and PO details updated successfully!", error: false});
      queryClient.invalidateQueries(["loas"]);
      handleModalClose();
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this details?",
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
    setSelectedLoa(item);
    setEditedTnDetail(item.tnId);
    setEditedLoa(item.loaNumber);
    setEditedPo(item.poNumber);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditedTnDetail("");
    setSelectedLoa(null);
    setEditedLoa("");
    setEditedPo("");
  };

  const handleSaveChanges = () => {
    updateMutation.mutate({
      tnId: editedTnDetail,
      loaNumber: editedLoa,
      poNumber: editedPo,
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Transfomer LOA and PO Details</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-loa"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add LOA & PO Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>TENDER NUMBER</th>
                  <th>LOA DETAILS</th>
                  <th>PO DETAILS</th>
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
                ) : loas.length > 0 ? (
                  loas.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.tn.name}</td>
                      <td>{item.loaNumber}</td>
                      <td>{item.poNumber}</td>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(item.id);
                            }}
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
          <FormControl fullWidth>
            <InputLabel>Tn Number</InputLabel>
            <Select
              value={editedTnDetail}
              label="Tn Number"
              onChange={(e) => {
                setEditedTnDetail(e.target.value);
              }}
            >
              {tnNumbers?.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="LOA Details"
            fullWidth
            margin="normal"
            value={editedLoa}
            onChange={(e) => setEditedLoa(e.target.value)}
          />

          <TextField
            label="PO Details"
            fullWidth
            margin="normal"
            value={editedPo}
            onChange={(e) => setEditedPo(e.target.value)}
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

export default LoaList;

