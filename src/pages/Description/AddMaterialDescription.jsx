import { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { MyContext } from "../../App";

const AddMaterialDescription = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const [materialDescription, setMaterialDescription] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [phase, setPhase] = useState("");
  const [rating, setRating] = useState("");
  const [wound, setWound] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      materialName,
      phase,
      materialDescription,
    };

    console.log("Description of Material", data);
  };

  return (
    <>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Basic Info
          </Typography>

          <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={1}>
              <TextField
                label="Material Name"
                fullWidth
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                required
              />
            </Grid>

            {/*<Grid item size={1}>
              <TextField
                label="Phase"
                fullWidth
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                required
              />
            </Grid> */}

            <Grid item size={1}>
              <TextField
                label="Rating"
                fullWidth
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="Wound"
                fullWidth
                value={wound}
                onChange={(e) => setWound(e.target.value)}
                required
              />
            </Grid>

            <Grid item size={2}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description Of Material"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                margin="normal"
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
              >
                <FaCloudUploadAlt />
                {isLoading ? (
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

export default AddMaterialDescription;
