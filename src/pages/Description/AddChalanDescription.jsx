import { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddChalanDescription = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [chalanDescription, setChalanDescription] = useState("");

  const addChalanDescriptionMutation = useMutation({
    mutationFn: (newDescription) =>
      api.post("/chalan-descriptions", newDescription),
    onSuccess: () => {
      setAlertBox({open: true, msg: "Chalan Description added successfully!", error: false});
      queryClient.invalidateQueries(["chalanDescriptions"]);
      navigate("/chalanDescription-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addChalanDescriptionMutation.mutate({ description: chalanDescription });
  };

  return (
    <>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Basic Info
          </Typography>

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description Of Chalan"
              value={chalanDescription}
              onChange={(e) => setChalanDescription(e.target.value)}
              margin="normal"
            />

            <Grid item size={2}>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{
                  margin: "auto",
                }}
                disabled={addChalanDescriptionMutation.isLoading}
              >
                <FaCloudUploadAlt />
                {addChalanDescriptionMutation.isLoading ? (
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

export default AddChalanDescription;