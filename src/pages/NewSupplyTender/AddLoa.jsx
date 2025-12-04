import { useContext, useState } from "react";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { MyContext } from "../../App";

const AddLoa = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const tnNumbers = ["TN-001", "TN-002", "TN-003", "Tn_004"];

  const [tnDetail, setTnDetail] = useState("");
  const [loa, setLoa] = useState("");
  const [po, setPo] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      tnDetail,
      loa,
      po,
    };

    console.log("Tranformer loa and po details", data);
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
              <FormControl fullWidth>
                <InputLabel>Tn Number</InputLabel>
                <Select
                  value={tnDetail}
                  label="Tn Number"
                  onChange={(e) => {
                    setTnDetail(e.target.value);
                  }}
                >
                  {tnNumbers.map((i, idx) => (
                    <MenuItem key={idx} value={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item size={1}>
              <TextField
                label="LOA Details"
                fullWidth
                value={loa}
                onChange={(e) => setLoa(e.target.value)}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                label="PO Details"
                fullWidth
                value={po}
                onChange={(e) => setPo(e.target.value)}
              />
            </Grid>

            <Grid item size={2}>
              <Button
                type="submit"
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{
                  margin: "auto",
                }}
                onClick={handleSubmit}
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

export default AddLoa;
