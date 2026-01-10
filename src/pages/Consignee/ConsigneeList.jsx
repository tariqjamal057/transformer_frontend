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

const ConsigneeList = () => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedConsignee, setSelectedConsignee] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { data: consignees, isLoading, isError } = useQuery({
    queryKey: ["consignees"],
    queryFn: () => api.get("/consignees").then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/consignees/${id}`),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Consignee deleted successfully!", error: false});
      queryClient.invalidateQueries(["consignees"]);
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedConsignee) =>
      api.put(`/consignees/${selectedConsignee.id}`, updatedConsignee),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Consignee updated successfully!", error: false});
      queryClient.invalidateQueries(["consignees"]);
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
    setSelectedConsignee(item);
    setName(item.name);
    setAddress(item.address);
    setGstNo(item.gstNo);
    setEmail(item.email);
    setPhone(item.phone);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedConsignee(null);
    setName("");
    setAddress("");
    setGstNo("");
    setEmail("");
    setPhone("");
  };

  const handleSaveChanges = () => {
    updateMutation.mutate({ name, address, gstNo, email, phone });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Consignee List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-consignee"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add Consignee</Button>
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
                  <th>ADDRESS</th>
                  <th>GST NO</th>
                  <th>EMAIL</th>
                  <th>PHONE NUMBER</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="7">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="7">Error fetching data</td>
                  </tr>
                ) : consignees.length > 0 ? (
                  consignees.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      <td>{item.gstNo}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
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
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <TextField
            label="GST No"
            fullWidth
            margin="normal"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            required
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Phone Number"
            type="text"
            inputMode="numeric"
            maxLength="10"
            className="form-control"
            margin="normal"
            required
            value={phone}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setPhone(numericValue.slice(0, 10)); // Limit to 10 digits
            }}
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

export default ConsigneeList;

