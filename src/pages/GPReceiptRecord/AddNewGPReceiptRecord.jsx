import { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MyContext } from "../../App";
import { dummyDeliveryChalans } from "../GPFailure/AddGPFailure";

const AddNewGPReceiptRecord = () => {
  const context = useContext(MyContext);
  const { setIsHideSidebarAndHeader, setAlertBox, districts } = context;

  const [accountReceiptNoteNo, setAccountReceiptNoteNo] = useState("");
  const [accountReceiptNoteDate, setAccountReceiptNoteDate] = useState(null);
  const [sinNo, setSinNo] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [discomReceiptNoteNo, setDiscomReceiptNoteNo] = useState("");
  const [discomReceiptNoteDate, setDiscomReceiptNoteDate] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [trfsiNo, setTrfsiNo] = useState("");
  const [rating, setRating] = useState("");
  const [selectedChalan, setSelectedChalan] = useState(null);

  const [sealNoTimeOfGPReceived, setSealNoTimeOfGPReceived] = useState("");
  const [consigneeTFRSerialNo, setConsigneeTFRSerialNo] = useState("");
  const [originalTfrSrNo, setOriginalTfrSrNo] = useState("");

  //parts missing details state
  const [oilLevel, setOilLevel] = useState("");
  const [hvBushing, setHvBushing] = useState("");
  const [lvBushing, setLvBushing] = useState("");
  const [htMetalParts, setHtMetalParts] = useState("");
  const [ltMetalParts, setLtMetalParts] = useState("");
  const [mAndpBox, setMAndPBox] = useState("");
  const [mAndpBoxCover, setMAndPBoxCover] = useState("");
  const [mccb, setMCCB] = useState("");
  const [icb, setICB] = useState("");
  const [copperFlexibleCable, setCopperFlexibleCable] = useState("");
  const [alWire, setALWire] = useState("");
  const [conservator, setConservator] = useState("");
  const [radiator, setRadiator] = useState("");
  const [fuse, setFuse] = useState("");
  const [channel, setChannel] = useState("");
  const [core, setCore] = useState("");
  // extra state to store polySealNo
  const [polySealNo, setPolySealNo] = useState("");

  // update useEffect
  useEffect(() => {
    if (trfsiNo && rating) {
      const found = dummyDeliveryChalans.find((ch) => {
        const hasTrfsi = ch.finalInspectionDetail.shealingDetails.some(
          (s) => String(s.trfsiNo) === String(trfsiNo)
        );
        const sameRating =
          ch.finalInspectionDetail.deliverySchedule.rating
            .toLowerCase()
            .trim() === rating.toLowerCase().trim();

        return hasTrfsi && sameRating;
      });

      if (found) {
        setSelectedChalan(found);

        // 🔹 fetch polySealNo of entered TRFSI
        const seal = found.finalInspectionDetail.shealingDetails.find(
          (s) => String(s.trfsiNo) === String(trfsiNo)
        );
        setPolySealNo(seal?.polySealNo || "");
      } else {
        setSelectedChalan(null);
        setPolySealNo("");
      }
    } else {
      setSelectedChalan(null);
      setPolySealNo("");
    }
  }, [trfsiNo, rating]);

  const handleSubmit = () => {
    const data = {
      trfsiNo,
      rating,
      selectedChalan,
      polySealNo
    };
    if (data) {
      console.log("Submitted New G.P. Receipt Record: ", data);
      alert("Failure information stored successfully!");
    } else {
      alert("No matching record found.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="right-content w-100">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Add New G.P. Receipt Record
          </Typography>

          {/* Input Section */}
          <Grid container spacing={2} columns={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
            {/* Account Receipt Note No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Account Receipt Note No"
                variant="outlined"
                value={accountReceiptNoteNo}
                onChange={(e) => setAccountReceiptNoteNo(e.target.value)}
              />
            </Grid>

            {/* Account Receipt Note Date */}
            <Grid item size={1}>
              <DatePicker
                label="Account Receipt Note Date"
                value={accountReceiptNoteDate}
                onChange={(newValue) => setAccountReceiptNoteDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            {/* SIN No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="SIN No"
                variant="outlined"
                value={sinNo}
                onChange={(e) => setSinNo(e.target.value)}
              />
            </Grid>

            {/* Consignee Name */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Consignee Name"
                variant="outlined"
                value={consigneeName}
                onChange={(e) => setConsigneeName(e.target.value)}
              />
            </Grid>

            {/* Discom Receipt Note No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Discom Receipt Note No"
                variant="outlined"
                value={discomReceiptNoteNo}
                onChange={(e) => setDiscomReceiptNoteNo(e.target.value)}
              />
            </Grid>

            {/* Discom Receipt Note Date */}
            <Grid item size={1}>
              <DatePicker
                label="Discom Receipt Note Date"
                value={discomReceiptNoteDate}
                onChange={(newValue) => setDiscomReceiptNoteDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item size={1}>
              <TextField
                fullWidth
                label="TRFSI No"
                variant="outlined"
                value={trfsiNo}
                onChange={(e) => setTrfsiNo(e.target.value)}
              />
            </Grid>

            {/* Original Tfr. Sr. No. */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Original Tfr. Sr. No."
                variant="outlined"
                value={originalTfrSrNo}
                onChange={(e) => setOriginalTfrSrNo(e.target.value)}
              />
            </Grid>
            {/* Consignee TFR Serial No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Consignee TFR Serial No"
                variant="outlined"
                value={consigneeTFRSerialNo}
                onChange={(e) => setConsigneeTFRSerialNo(e.target.value)}
              />
            </Grid>

            {/* Rating */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Rating"
                variant="outlined"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </Grid>

            {selectedChalan && (
              <>
                <Grid item size={1}>
                  <TextField
                    label="Material Name"
                    value={selectedChalan?.materialDescription?.materialName}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="TN Number"
                    value={
                      selectedChalan?.finalInspectionDetail?.deliverySchedule
                        ?.tnNumber
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Phase"
                    value={selectedChalan?.materialDescription?.phase}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item size={1}>
                  <TextField
                    label="Date Of Supply"
                    value={selectedChalan?.createdAt}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item size={1}>
                  <TextField
                    label="Seal No Time Of New Supply"
                    value={polySealNo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </>
            )}

            {/* Seal No */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Seal No Time Of GP Received"
                variant="outlined"
                value={sealNoTimeOfGPReceived}
                onChange={(e) => setSealNoTimeOfGPReceived(e.target.value)}
              />
            </Grid>

            {/* Remarks */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Remarks"
                variant="outlined"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>
            

            <Grid item size={2} mt={3}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Parts Missing Details
              </Typography>
            </Grid>

            {/* Parts Missing Section */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Oil Level"
                value={oilLevel}
                onChange={(e) => setOilLevel(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="HV Bushing"
                value={hvBushing}
                onChange={(e) => setHvBushing(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="LV Bushing"
                value={lvBushing}
                onChange={(e) => setLvBushing(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="HT Metal Parts"
                value={htMetalParts}
                onChange={(e) => setHtMetalParts(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="LT Metal Parts"
                value={ltMetalParts}
                onChange={(e) => setLtMetalParts(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="M&P Box"
                value={mAndpBox}
                onChange={(e) => setMAndPBox(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="M&P Box Cover"
                value={mAndpBoxCover}
                onChange={(e) => setMAndPBoxCover(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="MCCB"
                value={mccb}
                onChange={(e) => setMCCB(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="ICB"
                value={icb}
                onChange={(e) => setICB(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Copper Flexible Cable"
                value={copperFlexibleCable}
                onChange={(e) => setCopperFlexibleCable(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="AL Wire"
                value={alWire}
                onChange={(e) => setALWire(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Conservator"
                value={conservator}
                onChange={(e) => setConservator(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Radiator"
                value={radiator}
                onChange={(e) => setRadiator(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Fuse"
                value={fuse}
                onChange={(e) => setFuse(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              />
            </Grid>
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Core"
                value={core}
                onChange={(e) => setCore(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ px: 5, py: 1.5, borderRadius: 3 }}
            >
              Submit Failure Info
            </Button>
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddNewGPReceiptRecord;