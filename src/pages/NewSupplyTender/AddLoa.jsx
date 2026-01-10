import { useContext, useState } from "react";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddLoa = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tnId, setTnId] = useState("");
  const [loa, setLoa] = useState("");
  const [po, setPo] = useState("");

  const { data: tnNumbers } = useQuery({
    queryKey: ["tnNumbers"],
    queryFn: () => api.get("/tns").then((res) => res.data),
  });

  const addLoaMutation = useMutation({
    mutationFn: (newLoa) => api.post("/loas", newLoa),
    onSuccess: () => {
      setAlertBox({open: true, msg: "LOA and PO details added successfully!", error: false});
      queryClient.invalidateQueries(["loas"]);
      navigate("/loa-list");
    },
    onError: (error) => {
      setAlertBox({open: true, msg: error.message, error: true});
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addLoaMutation.mutate({
      tnId,
      loaNumber: loa,
      poNumber: po,
    });
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
              <FormControl fullWidth>
                <InputLabel>Tn Number</InputLabel>
                <Select
                  value={tnId}
                  label="Tn Number"
                  onChange={(e) => {
                    setTnId(e.target.value);
                  }}
                >
                  {tnNumbers?.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1}>
              <TextField
                label="LOA Details"
                fullWidth
                value={loa}
                onChange={(e) => setLoa(e.target.value)}
              />
            </Grid>

            <Grid item xs={1}>
              <TextField
                label="PO Details"
                fullWidth
                value={po}
                onChange={(e) => setPo(e.target.value)}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                type="submit"
                className="btn-blue btn-lg w-40 gap-2 mt-2 d-flex"
                style={{
                  margin: "auto",
                }}
                onClick={handleSubmit}
                disabled={addLoaMutation.isLoading}
              >
                <FaCloudUploadAlt />
                {addLoaMutation.isLoading ? (
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
