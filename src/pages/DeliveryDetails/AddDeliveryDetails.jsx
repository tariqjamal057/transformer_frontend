import { useContext, useState } from "react";
import { Box, CircularProgress, Stack } from "@mui/material";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const AddDeliveryDetails = () => {
  const { setAlertBox } = useContext(MyContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedChallanNo, setSelectedChallanNo] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [receiptedChallanNo, setReceiptedChallanNo] = useState("");
  const [receiptedChallanDate, setReceiptedChallanDate] = useState(null);

  const { data: deliveryChallans } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: () =>
      api.get("/delivery-challans?all=true").then((res) => res.data),
  });

  const availableChallans = deliveryChallans?.filter(
    (challan) => !challan.deliveryDetail,
  );

  const addDeliveryDetailsMutation = useMutation({
    mutationFn: (newDetails) => api.post("/delivery-details", newDetails),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "Delivery Details added successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["deliveryDetails"]);
      navigate("/deliveryDetails-list");
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleChallanChange = (event) => {
    const challanNo = event.target.value;
    setSelectedChallanNo(challanNo);

    // find the record
    const record = availableChallans.find(
      (item) => item.challanNo === challanNo,
    );
    setSelectedData(record || null);
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const missingFields = [];
    if (!selectedChallanNo) missingFields.push("Challan No");
    if (!receiptedChallanNo) missingFields.push("Receipt Challan No");
    if (!receiptedChallanDate) missingFields.push("Receipt Challan Date");

    if (missingFields.length > 0) {
      setAlertBox({
        open: true,
        msg: `Please fill required fields: ${missingFields.join(", ")}`,
        error: true,
      });
      return;
    }
    if (!selectedData) {
      setAlertBox({
        open: true,
        msg: "Please select a Challan Number first.",
        error: true,
      });
      return;
    }

    const data = {
      deliveryChalanId: selectedData.id,
      receiptedChallanNo,
      receiptedChallanDate: dayjs(receiptedChallanDate).toISOString(),
    };

    addDeliveryDetailsMutation.mutate(data);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="right-content w-100">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 3 }}
            >
              Add Delivery Details
            </Typography>

            <Stack spacing={2}>
              {/* DI Dropdown */}
              <TextField
                select
                label="Challan No"
                value={selectedChallanNo}
                onChange={handleChallanChange}
                fullWidth
                required
              >
                {availableChallans?.map((item) => (
                  <MenuItem key={item.id} value={item.challanNo}>
                    {item.challanNo}
                  </MenuItem>
                ))}
              </TextField>

              {/* Auto-Populated Fields */}
              {selectedData && (
                <>
                  <TextField
                    label="DI Date"
                    value={dayjs(selectedData.finalInspection.diDate).format(
                      "YYYY-MM-DD",
                    )}
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
                    value={dayjs(selectedData.createdAt).format("YYYY-MM-DD")}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Consignee Name"
                    value={selectedData.consignee.name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Total Quantity"
                    value={selectedData.finalInspection.inspectedQuantity}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Supplied Quantity"
                    value={selectedData.finalInspection.inspectedQuantity}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Transformer Serial No"
                    value={`${selectedData.finalInspection.serialNumberFrom} TO ${selectedData.finalInspection.serialNumberTo}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Selected Transformers (New)"
                    value={selectedData.selectedTransformers?.join(", ") || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Repaired Transformers"
                    value={selectedData.repairedSerialNumbers?.join(", ") || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="Other Consignee Serial Numbers"
                    value={selectedData.otherConsigneeSerialNumbers || "N/A"}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    label="GP Expiry Date"
                    value={dayjs(
                      selectedData.finalInspection.deliverySchedule
                        .deliveryScheduleDate,
                    )
                      .add(
                        selectedData.finalInspection.deliverySchedule
                          .guaranteePeriodMonths,
                        "month",
                      )
                      .format("YYYY-MM-DD")}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </>
              )}

              <TextField
                label="Receipt Challan No"
                value={receiptedChallanNo}
                fullWidth
                required
                onChange={(e) => setReceiptedChallanNo(e.target.value)}
              />

              <DatePicker
                label="Receipt Challan Date"
                //minDate={today}
                value={receiptedChallanDate}
                onChange={setReceiptedChallanDate}
                slotProps={{ textField: { fullWidth: true, required: true } }}
                format="DD/MM/YYYY"
              />

              <Button
                type="submit"
                onClick={handleSubmit}
                className="btn-blue btn-lg w-40 gap-2 mt-4 d-flex"
                style={{
                  margin: "auto",
                }}
                disabled={addDeliveryDetailsMutation.isLoading}
              >
                <FaCloudUploadAlt />
                {addDeliveryDetailsMutation.isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "PUBLISH AND VIEW"
                )}
              </Button>
            </Stack>
          </Paper>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default AddDeliveryDetails;
