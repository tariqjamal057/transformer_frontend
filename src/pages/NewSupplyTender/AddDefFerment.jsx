import { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { MyContext } from "../../App";

const AddDeffermentDetails = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const today = new Date();

  const tnNumbers = ["TN-001", "TN-002", "TN-003", "Tn_004"];

  const [tnDetail, setTnDetail] = useState("");
  const [imposedLetter, setImposedLetter] = useState("");
  const [imposedDate, setImposedDate] = useState(null);
  const [liftingLetter, setLiftingLetter] = useState("");
  const [liftingDate, setLiftingDate] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      tnDetail,
      imposedLetter,
      imposedDate: dayjs(imposedDate).format("YYYY-MM-DD"),
      liftingLetter,
      liftingDate: dayjs(liftingDate).format("YYYY-MM-DD"),
    };

    console.log("Tranformer Defferment Details", data);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  label="Imposed Letter No"
                  fullWidth
                  value={imposedLetter}
                  onChange={(e) => setImposedLetter(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Imposed Date"
                  minDate={today}
                  value={imposedDate}
                  onChange={setImposedDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item size={1}>
                <TextField
                  label="Lifting Letter No"
                  fullWidth
                  value={liftingLetter}
                  onChange={(e) => setLiftingLetter(e.target.value)}
                />
              </Grid>

              <Grid item size={1}>
                <DatePicker
                  label="Lifting Date"
                  minDate={today}
                  value={liftingDate}
                  onChange={setLiftingDate}
                  slotProps={{ textField: { fullWidth: true } }}
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
      </LocalizationProvider>
    </>
  );
};

export default AddDeffermentDetails;