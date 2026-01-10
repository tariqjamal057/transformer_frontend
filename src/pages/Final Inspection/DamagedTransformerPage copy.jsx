import React, { useState } from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export default function DamagedTransformerPage() {
  const queryClient = useQueryClient();

  const { data: finalInspectionList = [] } = useQuery({
    queryKey: ["finalInspections"],
    queryFn: () => api.get("/final-inspections").then((res) => res.data),
  });

  const [selectedSN, setSelectedSN] = useState("");
  const [selectedTRFSI, setSelectedTRFSI] = useState([]);
  const [damagedTransformerList, setDamagedTransformerList] = useState([]);

  const selectedInspection =
    finalInspectionList.find((item) => item.snNumber === selectedSN) || null;

  const handleTRFSIChange = (trfsiNo) => {
    setSelectedTRFSI((prev) =>
      prev.includes(trfsiNo)
        ? prev.filter((no) => no !== trfsiNo)
        : [...prev, trfsiNo]
    );
  };

  const { mutate: addDamagedTransformers } = useMutation({
    mutationFn: (data) => api.post("/damaged-transformers", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["damagedTransformers"]);
      alert(`Damaged Transformers Added successfully!`);
      setDamagedTransformerList([]);
      setSelectedTRFSI([]);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = () => {
    addDamagedTransformers({
      snNumber: selectedSN,
      trfsiNumbers: selectedTRFSI,
    });
  };

  return (
    <div className="right-content w-100">
      <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Damaged Transformer Selection
          </Typography>

          {/* SN Number Dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select SN Number</InputLabel>
            <Select
              value={selectedSN}
              onChange={(e) => setSelectedSN(e.target.value)}
              label="Select SN Number"
            >
              {finalInspectionList.map((item) => (
                <MenuItem key={item.id} value={item.snNumber}>
                  {item.snNumber}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* TRFSI Number List */}
          {selectedInspection && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Damaged TRFSI Numbers:
              </Typography>
              <Grid container spacing={2}>
                {selectedInspection.shealingDetails.map((detail) => (
                  <Grid item xs={12} sm={6} md={3} key={detail.trfsiNo}>
                    <Card
                      sx={{
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: selectedTRFSI.includes(detail.trfsiNo)
                          ? "2px solid #1976d2"
                          : "1px solid #ccc",
                        borderRadius: 2,
                        backgroundColor: selectedTRFSI.includes(detail.trfsiNo)
                          ? "#e3f2fd"
                          : "white",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                      onClick={() => handleTRFSIChange(detail.trfsiNo)}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          TRFSI No: {detail.trfsiNo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {detail.polySealNo}
                        </Typography>
                      </CardContent>
                      <Checkbox
                        checked={selectedTRFSI.includes(detail.trfsiNo)}
                        onChange={() => handleTRFSIChange(detail.trfsiNo)}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Submit Button */}
              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={selectedTRFSI.length === 0}
                  sx={{
                    px: 5,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Submit Damaged List
                </Button>
              </Box>
            </>
          )}

          {/* Damaged Transformer List */}
          {damagedTransformerList.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Damaged Transformers:
              </Typography>
              <Typography>{damagedTransformerList.join(", ")}</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
}
