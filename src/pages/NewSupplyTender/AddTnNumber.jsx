import { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { MyContext } from "../../App";

const AddTnNumber = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const [tnNumber, setTnNumber] = useState("");
  const [discom, setDiscom] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      tnNumber,
      discom,
    };

    console.log("Tranformer tn number", data);
  };

  return (
    <>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} gutterBottom>
            Basic Info
          </Typography>

          <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
            <Grid item size={1}>
              <TextField
                label="TN Number"
                fullWidth
                value={tnNumber}
                onChange={(e) => setTnNumber(e.target.value)}
              />
            </Grid>

            

            <Grid item size={1}>
              <TextField
                label="Discom"
                fullWidth
                value={discom}
                onChange={(e) => setDiscom(e.target.value)}
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

export default AddTnNumber;