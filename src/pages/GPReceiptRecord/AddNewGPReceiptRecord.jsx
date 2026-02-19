import { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddNewGPReceiptRecord = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const [deliveredToAcos, setDeliveredToAcos] = useState("");
  const [recChallanItemNo, setRecChallanItemNo] = useState("");
  const [recChallanItemDate, setRecChallanItemDate] = useState(null);


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

  const { data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
  });

  const addNewGPReceiptRecordMutation = useMutation({
    mutationFn: (newRecord) => api.post("/new-gp-receipt-records", newRecord),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "New GP Receipt Record added successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["newGpReceiptRecords"]);
      navigate("/GPReceiptRecord-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  // update useEffect
  useEffect(() => {
    if (trfsiNo && rating) {
      const found = deliveryChallans?.find((ch) => {
        console.log("---------------- trfsiNo ", trfsiNo);
        console.log(ch.finalInspection);
        const hasTrfsi = ch.finalInspection.sealingDetails.some(
          (s) => String(s.trfSiNo) === String(trfsiNo),
        );
        const sameRating =
          String(ch.finalInspection.deliverySchedule.rating) === String(rating);
        return hasTrfsi && sameRating;
      });
      console.log("found ------------", found);
      if (found) {
        setSelectedChalan(found);

        const seal = found.finalInspection.sealingDetails.find(
          (s) => String(s.trfSiNo) === String(trfsiNo),
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
  }, [trfsiNo, rating, deliveryChallans]);

  const handleSubmit = () => {
    if (!selectedChalan) {
      setAlertBox({
        open: true,
        msg: "No matching record found. Please check TRFSI No and Rating.",
        error: true,
      });
      return;
    }

    const data = {
      accountReceiptNoteNo,
      accountReceiptNoteDate: dayjs(accountReceiptNoteDate).toISOString(),
      sinNo,
      consigneeName,
      discomReceiptNoteNo,
      discomReceiptNoteDate: dayjs(discomReceiptNoteDate).toISOString(),
      remarks,
      trfsiNo: String(trfsiNo),
      rating,
      deliveryChallanId: selectedChalan.id,
      sealNoTimeOfGPReceived,
      consigneeTFRSerialNo,
      originalTfrSrNo,
      oilLevel,
      hvBushing,
      lvBushing,
      htMetalParts,
      ltMetalParts,
      mAndpBox,
      mAndpBoxCover,
      mccb,
      icb,
      copperFlexibleCable,
      alWire,
      conservator,
      radiator,
      fuse,
      channel,
      core,
      polySealNo: String(polySealNo),
      deliveredToAcos,
      recChallanItemNo,
      recChallanItemDate: recChallanItemDate ? dayjs(recChallanItemDate).toISOString() : null,
    };
    addNewGPReceiptRecordMutation.mutate(data);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                format="DD/MM/YYYY"
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
                format="DD/MM/YYYY"
              />
            </Grid>

            {/* Delivered to ACOS */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Delivered to ACOS"
                variant="outlined"
                value={deliveredToAcos}
                onChange={(e) => setDeliveredToAcos(e.target.value)}
              />
            </Grid>

            {/* Rec. Challan Item No. */}
            <Grid item size={1}>
              <TextField
                fullWidth
                label="Rec. Challan Item No."
                variant="outlined"
                value={recChallanItemNo}
                onChange={(e) => setRecChallanItemNo(e.target.value)}
              />
            </Grid>

            {/* Rec. Challan Date */}
            <Grid item size={1}>
              <DatePicker
                label="Rec. Challan Date"
                value={recChallanItemDate}
                onChange={(newValue) => setRecChallanItemDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                format="DD/MM/YYYY"
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
                    value={selectedChalan?.materialDescription?.name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="TN Number"
                    value={
                      selectedChalan?.finalInspection?.deliverySchedule
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
                    label="Inspection Date"
                    value={dayjs(selectedChalan?.finalInspection?.inspectionDate).format("DD/MM/YYYY")}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item size={1}>
                  <TextField
                    label="Challan NO"
                    value={selectedChalan?.challanNo}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item size={1}>
                  <TextField
                    label="Challan Date"
                    value={dayjs(selectedChalan?.createdAt).format("DD/MM/YYYY")}
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
                    label="Sealing Details (Seal No Time Of New Supply)"
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
              disabled={
                addNewGPReceiptRecordMutation.isLoading || !selectedChalan
              }
            >
              {addNewGPReceiptRecordMutation.isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Submit Failure Info"
              )}
            </Button>
            {/* <Button
              variant="contained"
              color="primary"
              sx={{ px: 5, py: 1.5, borderRadius: 3, ml: 2 }}
              onClick={() => alert("Create Challan feature coming soon")}
            >
              Create Challan
            </Button> */}
          </Box>
        </Paper>
      </div>
    </LocalizationProvider>
  );
};

export default AddNewGPReceiptRecord;
