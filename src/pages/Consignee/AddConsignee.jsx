import { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddConsignee = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const addConsigneeMutation = useMutation({
    mutationFn: (newConsignee) => api.post("/consignees", newConsignee),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Consignee added successfully!", error: false});
      queryClient.invalidateQueries(["consignees"]);
      navigate("/consignee-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addConsigneeMutation.mutate({
      name,
      address,
      gstNo,
      email,
      phone,
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Create Consignee
          </Typography>

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={1}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Address"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="GST No"
                fullWidth
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                required
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Phone Number"
                type="text"
                inputMode="numeric"
                maxLength="10"
                className="form-control"
                required
                value={phone}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setPhone(numericValue.slice(0, 10)); // Limit to 10 digits
                }}
              />
            </Grid>

            <Grid item size={2}>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{
                  margin: "auto",
                }}
                disabled={addConsigneeMutation.isLoading}
              >
                <FaCloudUploadAlt />
                {addConsigneeMutation.isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "PUBLISH AND VIEW"
                )}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
};

export default AddConsignee;
