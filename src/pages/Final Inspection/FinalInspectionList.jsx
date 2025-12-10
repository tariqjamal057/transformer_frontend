import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import SearchIcon from "@mui/icons-material/Search";
import FinalInspectionModal from "../../components/FinalInspectionModal";
import { format } from "date-fns";

const FinalInspectionList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []); // Fetch products when page or category changes

  const [openModal, setOpenModal] = useState(false);
  const [selectedFinalInspection, setSelectedFinalInspection] = useState(null);

  const handleEditClick = (item) => {
    setSelectedFinalInspection(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedFinalInspection(null);
  };

  const getDummyFinalInspectionDetails = () => {
    return [
      {
        id: "1",
        deliverySchedule: {
          tnNumber: "TN-001",
          rating: "100",
          wound: "Aluminium",
          phase: "100 KVA",
          guaranteePeriodMonths: 24,
        },
        offeredDate: "2025-07-12",
        offeredQuantity: 150,
        serialNumberFrom: 4912,
        serialNumberTo: 5061,
        snNumber: "4912 TO 5061",
        nominationLetterNo: "NL/2025/001",
        nominationDate: "2025-07-10",
        inspectionOfficers: ["Ravi Kumar", "Sunita Sharma"],
        inspectionDate: "2025-07-13",
        inspectedQuantity: 150,
        total: 150,
        diNo: "DI/2025/1001",
        diDate: "2025-07-16",
        consignees: [
          {
            consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
            quantity: 50,
            dispatch: 0,
            pending: 50,
            subSnNumber: "4912 TO 4961",
          },
          {
            consignee: { id: "2", name: "XYZ Transformers Ltd." },
            quantity: 50,
            dispatch: 0,
            pending: 50,
            subSnNumber: "4962 TO 5011",
          },
          {
            consignee: { id: "3", name: "GreenVolt Energy Systems" },
            quantity: 50,
            dispatch: 0,
            pending: 50,
            subSnNumber: "5012 TO 5061",
          },
        ],
        shealingDetails: [
          { trfsiNo: 4912, polySealNo: "IAJ 5301 To IAJ 5302" },
          { trfsiNo: 4913, polySealNo: "IAJ 5303 To IAJ 5304" },
          { trfsiNo: 4914, polySealNo: "IAJ 5305 To IAJ 5306" },
          { trfsiNo: 4915, polySealNo: "IAJ 5307 To IAJ 5308" },
          { trfsiNo: 4916, polySealNo: "IAJ 5309 To IAJ 5310" },
        ],
      },
      {
        id: "2",
        deliverySchedule: {
          tnNumber: "TN-002",
          rating: "50",
          wound: "Aluminium",
          phase: "50 KVA",
          guaranteePeriodMonths: 18,
        },
        offeredDate: "2025-08-05",
        offeredQuantity: 150,
        serialNumberFrom: 4912,
        serialNumberTo: 5061,
        snNumber: "4912 TO 5061",
        nominationLetterNo: "NL/2025/002",
        nominationDate: "2025-08-03",
        inspectionOfficers: ["Amit Verma", "Priya Singh"],
        inspectionDate: "2025-08-06",
        inspectedQuantity: 150,
        total: 150,
        diNo: "DI/2025/1002",
        diDate: "2025-08-08",
        consignees: [
          {
            consignee: { id: "2", name: "XYZ Transformers Ltd." },
            quantity: 70,
            dispatch: 0,
            pending: 70,
            subSnNumber: "4912 TO 4981",
          },
          {
            consignee: { id: "3", name: "GreenVolt Energy Systems" },
            quantity: 80,
            dispatch: 0,
            pending: 80,
            subSnNumber: "4982 TO 5061",
          },
        ],
        shealingDetails: [
          { trfsiNo: 4912, polySealNo: "IAJ 5311 To IAJ 5312" },
          { trfsiNo: 4913, polySealNo: "IAJ 5313 To IAJ 5314" },
          { trfsiNo: 4914, polySealNo: "IAJ 5315 To IAJ 5316" },
          { trfsiNo: 4915, polySealNo: "IAJ 5317 To IAJ 5318" },
          { trfsiNo: 4916, polySealNo: "IAJ 5319 To IAJ 5320" },
        ],
      },
      {
        id: "3",
        deliverySchedule: {
          tnNumber: "TN-003",
          rating: "150",
          wound: "Copper",
          phase: "150 KVA",
          guaranteePeriodMonths: 12,
        },
        offeredDate: "2025-09-15",
        offeredQuantity: 180,
        serialNumberFrom: 4917,
        serialNumberTo: 5096,
        snNumber: "4917 TO 5096",
        nominationLetterNo: "NL/2025/003",
        nominationDate: "2025-09-12",
        inspectionOfficers: ["Rajesh Gupta", "Meena Kapoor"],
        inspectionDate: "2025-09-16",
        inspectedQuantity: 180,
        total: 180,
        diNo: "DI/2025/1003",
        diDate: "2025-09-18",
        consignees: [
          {
            consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
            quantity: 100,
            dispatch: 0,
            pending: 100,
            subSnNumber: "4917 TO 5016",
          },
          {
            consignee: { id: "2", name: "XYZ Transformers Ltd." },
            quantity: 80,
            dispatch: 0,
            pending: 80,
            subSnNumber: "5017 TO 5096",
          },
        ],
        shealingDetails: [
          { trfsiNo: 4917, polySealNo: "IAJ 5321 To IAJ 5322" },
          { trfsiNo: 4918, polySealNo: "IAJ 5323 To IAJ 5324" },
          { trfsiNo: 4919, polySealNo: "IAJ 5325 To IAJ 5326" },
          { trfsiNo: 4920, polySealNo: "IAJ 5327 To IAJ 5328" },
          { trfsiNo: 4921, polySealNo: "IAJ 5329 To IAJ 5330" },
        ],
      },
      {
        id: "4",
        deliverySchedule: {
          tnNumber: "TN-004",
          rating: "200",
          wound: "Copper",
          phase: "200 KVA",
          guaranteePeriodMonths: 36,
        },
        offeredDate: "2025-10-20",
        offeredQuantity: 220,
        serialNumberFrom: 4922,
        serialNumberTo: 5141,
        snNumber: "4922 TO 5141",
        nominationLetterNo: "NL/2025/004",
        nominationDate: "2025-10-18",
        inspectionOfficers: ["Vikas Sharma", "Neha Yadav"],
        inspectionDate: "2025-10-21",
        inspectedQuantity: 220,
        total: 220,
        diNo: "DI/2025/1004",
        diDate: "2025-10-23",
        consignees: [
          {
            consignee: { id: "3", name: "GreenVolt Energy Systems" },
            quantity: 120,
            dispatch: 0,
            pending: 120,
            subSnNumber: "4922 TO 5041",
          },
          {
            consignee: { id: "1", name: "ABC Power Solutions Pvt. Ltd." },
            quantity: 100,
            dispatch: 0,
            pending: 100,
            subSnNumber: "5042 TO 5141",
          },
        ],
        shealingDetails: [
          { trfsiNo: 4922, polySealNo: "IAJ 5331 To IAJ 5332" },
          { trfsiNo: 4923, polySealNo: "IAJ 5333 To IAJ 5334" },
          { trfsiNo: 4924, polySealNo: "IAJ 5335 To IAJ 5336" },
          { trfsiNo: 4925, polySealNo: "IAJ 5337 To IAJ 5338" },
          { trfsiNo: 4926, polySealNo: "IAJ 5339 To IAJ 5340" },
        ],
      },
    ];
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState(
    getDummyFinalInspectionDetails()
  );

  useEffect(() => {
    const results = getDummyFinalInspectionDetails().filter((item) => {
      const tnMatch = item.deliverySchedule?.tnNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

      const ratingMatch = item.deliverySchedule?.rating
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const officerMatch = item.inspectionOfficers?.some((officer) =>
        officer.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return tnMatch || ratingMatch || officerMatch;
    });

    setFilteredSchedules(results);
  }, [searchQuery]);

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Final Inspection List</h5>

          <TextField
            variant="outlined"
            placeholder="Search Tn Number, Rating and Officers...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              width: { xs: "100%", sm: "300px" },
              marginLeft: "auto",
              backgroundColor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ccc",
                },
                "&:hover fieldset": {
                  borderColor: "#f0883d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#f0883d",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#f0883d" }} />
                </InputAdornment>
              ),
            }}
          />

          <div className="d-flex align-items-center">
            <Link to={"/add-finalInspection"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Date of Offer</th>
                  <th>Offered Quantity</th>
                  <th>TN No.</th>
                  <th>Rating</th>
                  <th>Phase</th>
                  <th>Wound</th>
                  <th>Offered Sr. No.</th>
                  <th>Sub Sr. No.</th>
                  <th>Inspection Officers</th>
                  <th>Nomination Letter No</th>
                  <th>Nomination Date</th>
                  <th>Inspection Date</th>
                  <th>Inspected Quantity</th>
                  <th>Total</th>
                  <th>DI No & Date</th>
                  <th>Warranty Period</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((item, index) => (
                    <tr key={item.id}>
                      <td># {index + 1}</td>
                      <td>{format(new Date(item.offeredDate), "dd MMM yyyy")}</td>
                      <td>{item.offeredQuantity}</td>

                      <td>{item.deliverySchedule?.tnNumber}</td>
                      <td>{item.deliverySchedule?.rating}</td>
                      <td>{item.deliverySchedule?.phase}</td>
                      <td>{item.deliverySchedule?.wound}</td>
                      <td>
                        {item.serialNumberFrom} TO {item.serialNumberTo}
                      </td>
                      <td>
                        {item.consignees?.map((consignee, idx) => (
                          <div key={idx} className="mb-1">
                            {consignee.subSnNumber}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap justify-content-center gap-1">
                          {item.inspectionOfficers.map((officer, idx) => (
                            <span
                              key={idx}
                              className="badge bg-info text-white px-2 py-1"
                              style={{
                                fontSize: "0.75rem",
                                borderRadius: "10px",
                              }}
                            >
                              {officer}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{item.nominationLetterNo}</td>
                      <td>{format(new Date(item.nominationDate), "dd MMM yyyy")}</td>
                      <td>{format(new Date(item.inspectionDate), "dd MMM yyyy")}</td>
                      <td>{item.inspectedQuantity}</td>
                      <td>{item.total}</td>
                      <td>
                        <div className="fw-semibold">{item.diNo}</div>
                        <div className="text-muted small">{format(new Date(item.diDate), "dd MMM yyyy")}</div>
                      </td>
                      <td>
                        {item.deliverySchedule.guaranteePeriodMonths} Months
                      </td>

                      <td>
                        <div className="d-flex gap-2 align-items-center justify-content-center">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaPencilAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="17" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FinalInspectionModal
        open={openModal}
        handleClose={handleModalClose}
        inspectionData={selectedFinalInspection}
      />
    </>
  );
};

export default FinalInspectionList;
