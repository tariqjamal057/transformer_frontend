import { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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

const MaterialDescriptionList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [phase, setPhase] = useState("")
  const [materialDescription, setMaterialDescription] = useState("");

  const { data: materialDescriptions, isLoading, isError } = useQuery({
    queryKey: ["materialDescriptions"],
    queryFn: () => api.get("/material-descriptions").then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/material-descriptions/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Material Description deleted successfully!", error: false});
      queryClient.invalidateQueries(["materialDescriptions"]);
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedDescription) =>
      api.put(
        `/material-descriptions/${selectedDescription.id}`,
        updatedDescription
      ),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Material Description updated successfully!", error: false});
      queryClient.invalidateQueries(["materialDescriptions"]);
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
    setSelectedDescription(item);
    setMaterialName(item.name);
    setPhase(item.phase)
    setMaterialDescription(item.description);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setMaterialName("");
    setPhase("")
    setSelectedDescription(null);
    setMaterialDescription("");
  };

  const handleSaveChanges = () => {
    updateMutation.mutate({
      materialName,
      phase,
      description: materialDescription,
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Material Description List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-materialDescription"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add Material Description
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
                  <th>MATERIAL NAME</th>
                  <th>Phase</th>
                  <th>MATERIAL DESCRIPTION</th>
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
                ) : materialDescriptions.length > 0 ? (
                  materialDescriptions.map((item, index) => {
                    const shortDescription =
                      item.description.split(" ").slice(0, 8).join(" ") +
                      (item.description.split(" ").length > 8 ? " ..." : "");

                    return (
                      <tr key={index}>
                        <td># {index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.phase}</td>
                        <td>{shortDescription}</td>
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
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
            label="Material Name"
            fullWidth
            margin="normal"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            required
          />

          <TextField
            label="Phase"
            fullWidth
            margin="normal"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description Of Material"
            value={materialDescription}
            onChange={(e) => setMaterialDescription(e.target.value)}
            margin="normal"
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

export default MaterialDescriptionList;

