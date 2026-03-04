import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { MyContext } from "../App";

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

const DeliveryDetailsModal = ({ open, handleClose, deliveryDetailData }) => {
  const { setAlertBox } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [selectedChallanId, setSelectedChallanId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [receiptedChallanNo, setReceiptedChallanNo] = useState("");
  const [receiptedChallanDate, setReceiptedChallanDate] = useState(null);

  const { data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
  });

  const availableChallans = deliveryChallans?.filter(
    (challan) => !challan.deliveryDetail || challan.id === deliveryDetailData?.deliveryChalanId
  );

  useEffect(() => {
    if (deliveryDetailData) {
      setSelectedChallanId(deliveryDetailData.deliveryChalanId || "");
      setReceiptedChallanNo(deliveryDetailData.receiptedChallanNo || "");
      setReceiptedChallanDate(deliveryDetailData.receiptedChallanDate ? dayjs(deliveryDetailData.receiptedChallanDate) : null);
      
      if (deliveryChallans) {
        const record = deliveryChallans.find(c => c.id === deliveryDetailData.deliveryChalanId);
        setSelectedData(record || null);
      }
    } else {
      setSelectedChallanId("");
      setReceiptedChallanNo("");
      setReceiptedChallanDate(null);
      setSelectedData(null);
    }
  }, [deliveryDetailData, deliveryChallans]);

  const handleChallanChange = (event) => {
    const challanId = event.target.value;
    setSelectedChallanId(challanId);

    const record = deliveryChallans.find((item) => item.id === challanId);
    setSelectedData(record || null);
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      if (deliveryDetailData) {
        return api.put(`/delivery-details/${deliveryDetailData.id}`, data);
      }
      return api.post(`/delivery-details`, data);
    },
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: `Delivery Details ${deliveryDetailData ? "updated" : "added"} successfully!`,
        error: false,
      });
      queryClient.invalidateQueries(["deliveryDetails"]);
      handleClose();
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.response?.data?.error || error.message, error: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedChallanId || !receiptedChallanNo || !receiptedChallanDate) {
      setAlertBox({
        open: true,
        msg: "Please fill all required fields",
        error: true,
      });
      return;
    }

    const data = {
      deliveryChalanId: selectedChallanId,
      receiptedChallanNo,
      receiptedChallanDate: receiptedChallanDate.toISOString(),
    };

    mutation.mutate(data);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            {deliveryDetailData ? "Edit" : "Add"} Delivery Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              label="Challan No"
              value={selectedChallanId}
              onChange={handleChallanChange}
              fullWidth
              required
            >
              {availableChallans?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.challanNo}
                </MenuItem>
              ))}
            </TextField>

            {selectedData && (
              <>
                <TextField
                  label="DI Date"
                  value={dayjs(selectedData.finalInspection?.diDate).format("DD/MM/YYYY")}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Challan No"
                  value={selectedData.challanNo}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Challan Date"
                  value={dayjs(selectedData.createdAt).format("DD/MM/YYYY")}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Consignee Name"
                  value={selectedData.consignee?.name || ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Total Quantity"
                  value={selectedData.finalInspection?.inspectedQuantity}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Supplied Quantity"
                  value={selectedData.finalInspection?.inspectedQuantity}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Transformer Serial No"
                  value={selectedData.finalInspection ? `${selectedData.finalInspection.serialNumberFrom} TO ${selectedData.finalInspection.serialNumberTo}` : ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Serial No"
                  value={selectedData.selectedTransformers?.join(", ") || "N/A"}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Sub Serial No"
                  value={selectedData.repairedSerialNumbers?.join(", ") || "N/A"}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Other Consignee Serial No"
                  value={selectedData.otherConsigneeSerialNumbers || "N/A"}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="GP Expiry Date"
                  value={
                    selectedData.finalInspection?.deliverySchedule
                      ? dayjs(
                          selectedData.finalInspection.deliverySchedule
                            .deliveryScheduleDate
                        )
                          .add(
                            selectedData.finalInspection.deliverySchedule
                              .guaranteePeriodMonths,
                            "month"
                          )
                          .format("DD/MM/YYYY")
                      : ""
                  }
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </>
            )}

            <TextField
              label="Receipted Challan No"
              value={receiptedChallanNo}
              fullWidth
              required
              onChange={(e) => setReceiptedChallanNo(e.target.value)}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Receipted Challan Date"
                value={receiptedChallanDate}
                onChange={(newValue) => setReceiptedChallanDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </LocalizationProvider>

            <Box mt={2} textAlign="center">
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={mutation.isLoading}
                fullWidth
              >
                {mutation.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  deliveryDetailData ? "Update" : "Add"
                )}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeliveryDetailsModal;
