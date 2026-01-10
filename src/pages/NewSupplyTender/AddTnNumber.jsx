import { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddTnNumber = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tnNumber, setTnNumber] = useState("");
  const [rating, setRating] = useState("");
  const [discom, setDiscom] = useState("");

  const addTnNumberMutation = useMutation({
    mutationFn: (newTnNumber) => api.post("/tns", newTnNumber),
    onSuccess: () => {
      setAlertBox({open: true, msg: "TN Number added successfully!", error: false});
      queryClient.invalidateQueries(["tnNumbers"]);
      navigate("/tnNumber-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTnNumberMutation.mutate({ name: tnNumber, rating, discom });
  };

  return (
    <>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Basic Info
          </Typography>

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <Grid item xs={1}>
              <TextField
                label="TN Number"
                fullWidth
                value={tnNumber}
                onChange={(e) => setTnNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={1}>
              <TextField
                label="Rating"
                fullWidth
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Grid>

            <Grid item xs={1}>
              <TextField
                label="Discom"
                fullWidth
                value={discom}
                onChange={(e) => setDiscom(e.target.value)}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{
                  margin: "auto",
                }}
                disabled={addTnNumberMutation.isLoading}
              >
                <FaCloudUploadAlt />
                {addTnNumberMutation.isLoading ? (
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

export default AddTnNumber;