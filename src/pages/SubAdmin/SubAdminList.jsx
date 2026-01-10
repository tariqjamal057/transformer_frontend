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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";

const SubAdminList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [editedUserName, setEditedUserName] = useState("");
  const [editedPageAccess, setEditedPageAccess] = useState([]);
  const [editedLoginId, setEditedLoginId] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedRole, setEditedRole] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  const allAccessPages = [
    "Dashboard",
    "Orders",
    "Products",
    "Users",
    "Reports",
    "Settings",
  ];

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "User deleted successfully!", error: false});
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedUser) =>
      api.put(`/users/${selectedSubAdmin.id}`, updatedUser),
    onSuccess: () => {
      setAlertBox({open: true, msg: "User details updated successfully!", error: false});
      queryClient.invalidateQueries(["users"]);
      handleModalClose();
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Sub-admin?",
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
    setSelectedSubAdmin(item);
    setEditedUserName(item.name);
    setEditedPageAccess(item.accessPages || []);
    setEditedLoginId(item.loginId);
    setEditedNumber(item.number);
    setEditedRole(item.role);
    setEditedPassword(item.password);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSubAdmin(null);
    setEditedUserName("");
    setEditedPageAccess([]);
    setEditedLoginId("");
    setEditedNumber("");
    setEditedRole("");
    setEditedPassword("");
  };

  const handleSaveChanges = () => {
    const editData = {
      name: editedUserName,
      loginId: editedLoginId,
      number: editedNumber,
      role: editedRole,
      pages: editedPageAccess,
    };
    if (editedPassword) {
      editData.password = editedPassword;
    }
    updateMutation.mutate(editData);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">SubAdmin List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/signup"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add Users</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>Login Id</th>
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
                ) : users.length > 0 ? (
                  users.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>
                        <div className="fw-semibold">{item.name}</div>
                        <span className="text-muted">{item.number}</span>
                      </td>
                      <td>{item.role}</td>
                      <td>{item.loginId}</td>
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

      <Dialog open={editModalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Sub-Admin
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={editedUserName}
            onChange={(e) => setEditedUserName(e.target.value)}
          />

          <FormControl fullWidth className="mt-3">
            <InputLabel>Access Pages</InputLabel>
            <Select
              input={<OutlinedInput label="Page Access" />}
              multiple
              value={editedPageAccess}
              onChange={(e) => setEditedPageAccess(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {allAccessPages.map((page) => (
                <MenuItem key={page} value={page}>
                  <Checkbox checked={editedPageAccess.indexOf(page) > -1} />
                  <ListItemText primary={page} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="text"
            label="Login Id"
            margin="normal"
            value={editedLoginId}
            onChange={(e) => setEditedLoginId(e.target.value)}
          />

          <TextField
            fullWidth
            type="text"
            label="Contact no"
            margin="normal"
            value={editedNumber}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setEditedNumber(numericValue.slice(0, 10)); // Limit to 10 digits
            }}
          />

          <TextField
            fullWidth
            type="text"
            label="Qualification"
            margin="normal"
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
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

export default SubAdminList;

