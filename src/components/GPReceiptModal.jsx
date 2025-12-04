import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { dummyDeliveryChalans } from "../pages/GPFailure/AddGPFailure";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const GPReceiptModal = ({ open, handleClose, gpReceiptData }) => {
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
      polySealNo,
    };
    if (data) {
      console.log("Submitted New G.P. Receipt Record: ", data);
      alert("Failure information stored successfully!");
      handleClose()
    } else {
      alert("No matching record found.");
    }
  };

  // Load initial data if editing
  useEffect(() => {
    if (gpReceiptData) {
      setAccountReceiptNoteNo(gpReceiptData.accountReceiptNoteNo);
      setAccountReceiptNoteDate(
        gpReceiptData.accountReceiptNoteDate
          ? dayjs(gpReceiptData.accountReceiptNoteDate)
          : null
      );
      setSinNo(gpReceiptData.sinNo);
      setConsigneeName(gpReceiptData.consigneeName);
      setDiscomReceiptNoteNo(gpReceiptData.discomReceiptNoteNo);
      setDiscomReceiptNoteDate(
        gpReceiptData.discomReceiptNoteDate
          ? dayjs(gpReceiptData.discomReceiptNoteDate)
          : null
      );
      setRemarks(gpReceiptData.remarks);
      setTrfsiNo(gpReceiptData.trfsiNo || "");
      setRating(gpReceiptData.rating || "");
      setPolySealNo(gpReceiptData.polySealNo || "");
      setSealNoTimeOfGPReceived(gpReceiptData.sealNoTimeOfGPReceived || "");
      setConsigneeTFRSerialNo(gpReceiptData.consigneeTFRSerialNo || "");

      // ✅ Parts missing details
      setOilLevel(gpReceiptData.oilLevel || "");
      setHvBushing(gpReceiptData.hvBushing || "");
      setLvBushing(gpReceiptData.lvBushing || "");
      setHtMetalParts(gpReceiptData.htMetalParts || "");
      setLtMetalParts(gpReceiptData.ltMetalParts || "");
      setMAndPBox(gpReceiptData.mAndpBox || "");
      setMAndPBoxCover(gpReceiptData.mAndpBoxCover || "");
      setMCCB(gpReceiptData.mccb || "");
      setICB(gpReceiptData.icb || "");
      setCopperFlexibleCable(gpReceiptData.copperFlexibleCable || "");
      setALWire(gpReceiptData.alWire || "");
      setConservator(gpReceiptData.conservator || "");
      setRadiator(gpReceiptData.radiator || "");
      setFuse(gpReceiptData.fuse || "");
      setChannel(gpReceiptData.channel || "");
      setCore(gpReceiptData.core || "");
    }
  }, [gpReceiptData]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Edit G.P. Receipt Details
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Box mt={2}>
            <TextField
              fullWidth
              label="Account Receipt Note No"
              variant="outlined"
              margin="normal"
              value={accountReceiptNoteNo}
              onChange={(e) => setAccountReceiptNoteNo(e.target.value)}
            />

            {/* Account Receipt Note Date */}

            <DatePicker
              label="Account Receipt Note Date"
              value={accountReceiptNoteDate}
              margin="normal"
              sx={{ mt: 2, mb: 1 }}
              onChange={setAccountReceiptNoteDate}
              slotProps={{ textField: { fullWidth: true } }}
            />

            {/* SIN No */}

            <TextField
              fullWidth
              label="SIN No"
              margin="normal"
              variant="outlined"
              value={sinNo}
              onChange={(e) => setSinNo(e.target.value)}
            />

            {/* Consignee Name */}

            <TextField
              fullWidth
              label="Consignee Name"
              variant="outlined"
              margin="normal"
              value={consigneeName}
              onChange={(e) => setConsigneeName(e.target.value)}
            />

            {/* Discom Receipt Note No */}

            <TextField
              fullWidth
              label="Discom Receipt Note No"
              variant="outlined"
              margin="normal"
              value={discomReceiptNoteNo}
              onChange={(e) => setDiscomReceiptNoteNo(e.target.value)}
            />

            {/* Discom Receipt Note Date */}

            <DatePicker
              label="Discom Receipt Note Date"
              value={discomReceiptNoteDate}
              sx={{ mt: 2, mb: 1 }}
              margin="normal"
              onChange={setDiscomReceiptNoteDate}
              slotProps={{ textField: { fullWidth: true } }}
            />

            {/* Remarks */}

            <TextField
              fullWidth
              label="Remarks"
              variant="outlined"
              margin="normal"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <TextField
              fullWidth
              label="TRFSI No"
              variant="outlined"
              margin="normal"
              value={trfsiNo}
              onChange={(e) => setTrfsiNo(e.target.value)}
            />

            {/* Rating */}

            <TextField
              fullWidth
              label="Rating"
              margin="normal"
              variant="outlined"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />

            {selectedChalan && (
              <>
                <TextField
                  label="Material Name"
                  value={selectedChalan?.materialDescription?.materialName}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="TN Number"
                  value={
                    selectedChalan?.finalInspectionDetail?.deliverySchedule
                      ?.tnNumber
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Phase"
                  value={selectedChalan?.materialDescription?.phase}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Date Of Supply"
                  value={selectedChalan?.createdAt}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Seal No Time Of New Supply"
                  value={polySealNo}
                  fullWidth
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Seal No Time Of GP Received"
              variant="outlined"
              margin="normal"
              value={sealNoTimeOfGPReceived}
              onChange={(e) => setSealNoTimeOfGPReceived(e.target.value)}
            />

            {/* Consignee TFR Serial No */}

            <TextField
              fullWidth
              label="Consignee TFR Serial No"
              variant="outlined"
              margin="normal"
              value={consigneeTFRSerialNo}
              onChange={(e) => setConsigneeTFRSerialNo(e.target.value)}
            />

            <Grid item size={2} mt={2}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Parts Missing Details
              </Typography>
            </Grid>

            {/* Parts Missing Section */}

            <TextField
              fullWidth
              label="Oil Level"
              margin="normal"
              value={oilLevel}
              onChange={(e) => setOilLevel(e.target.value)}
            />

            <TextField
              fullWidth
              label="HV Bushing"
              margin="normal"
              value={hvBushing}
              onChange={(e) => setHvBushing(e.target.value)}
            />

            <TextField
              fullWidth
              label="LV Bushing"
              margin="normal"
              value={lvBushing}
              onChange={(e) => setLvBushing(e.target.value)}
            />

            <TextField
              fullWidth
              label="HT Metal Parts"
              margin="normal"
              value={htMetalParts}
              onChange={(e) => setHtMetalParts(e.target.value)}
            />

            <TextField
              fullWidth
              label="LT Metal Parts"
              margin="normal"
              value={ltMetalParts}
              onChange={(e) => setLtMetalParts(e.target.value)}
            />

            <TextField
              fullWidth
              label="M&P Box"
              margin="normal"
              value={mAndpBox}
              onChange={(e) => setMAndPBox(e.target.value)}
            />

            <TextField
              fullWidth
              label="M&P Box Cover"
              margin="normal"
              value={mAndpBoxCover}
              onChange={(e) => setMAndPBoxCover(e.target.value)}
            />

            <TextField
              fullWidth
              label="MCCB"
              margin="normal"
              value={mccb}
              onChange={(e) => setMCCB(e.target.value)}
            />

            <TextField
              fullWidth
              label="ICB"
              margin="normal"
              value={icb}
              onChange={(e) => setICB(e.target.value)}
            />

            <TextField
              fullWidth
              label="Copper Flexible Cable"
              margin="normal"
              value={copperFlexibleCable}
              onChange={(e) => setCopperFlexibleCable(e.target.value)}
            />

            <TextField
              fullWidth
              label="AL Wire"
              margin="normal"
              value={alWire}
              onChange={(e) => setALWire(e.target.value)}
            />

            <TextField
              fullWidth
              label="Conservator"
              margin="normal"
              value={conservator}
              onChange={(e) => setConservator(e.target.value)}
            />

            <TextField
              fullWidth
              label="Radiator"
              margin="normal"
              value={radiator}
              onChange={(e) => setRadiator(e.target.value)}
            />

            <TextField
              fullWidth
              label="Fuse"
              margin="normal"
              value={fuse}
              onChange={(e) => setFuse(e.target.value)}
            />

            <TextField
              fullWidth
              label="Channel"
              margin="normal"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            />

            <TextField
              fullWidth
              label="Core"
              margin="normal"
              value={core}
              onChange={(e) => setCore(e.target.value)}
            />

            <Box mt={4} textAlign="center">
              <Button variant="contained" size="large" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default GPReceiptModal;
