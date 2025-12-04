import { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MyContext } from "../../App";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { format } from "date-fns";

const DeffermentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const tnNumbers = ["TN-001", "TN-002", "TN-003", "TN-004"];

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDefferment, setSelectedDefferment] = useState(null);
  const [editedTnDetail, setEditedTnDetail] = useState("");
  const [editedImposedLetter, setEditedImposedLetter] = useState("");
  const [editedImposedDate, setEditedImposedDate] = useState(null);
  const [editedLiftingLetter, setEditedLiftingLetter] = useState("");
  const [editedLiftingDate, setEditedLiftingDate] = useState(null);

  /*const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));*/

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getDummyDefermentDetails = () => {
    return [
      {
        tnNumber: "TN-001",
        imposedLetterNo: "ILN-001",
        imposedDate: "2025-09-10",
        liftingLetterNo: "LLN-101",
        liftingDate: "2025-10-15",
      },
      {
        tnNumber: "TN-002",
        imposedLetterNo: "ILN-002",
        imposedDate: "2025-08-05",
        liftingLetterNo: "LLN-102",
        liftingDate: "2025-09-10",
      },
      {
        tnNumber: "TN-003",
        imposedLetterNo: "ILN-003",
        imposedDate: "2025-07-22",
        liftingLetterNo: "LLN-103",
        liftingDate: "2025-08-25",
      },
      {
        tnNumber: "TN-004",
        imposedLetterNo: "ILN-004",
        imposedDate: "2025-06-18",
        liftingLetterNo: "LLN-104",
        liftingDate: "2025-07-20",
      },
    ];
  };

  const dummyData = getDummyDefermentDetails();

  const handleEditClick = (item) => {
    setSelectedDefferment(item);
    setEditedTnDetail(item.tnNumber);
    setEditedImposedLetter(item.imposedLetterNo);
    setEditedImposedDate(item.imposedDate);
    setEditedLiftingLetter(item.liftingLetterNo);
    setEditedLiftingDate(item.liftingDate);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditedTnDetail("");
    setEditedImposedLetter("");
    setEditedImposedDate(null);
    setEditedLiftingLetter("");
    setEditedLiftingDate(null);
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Transformer Defferment details details updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  const handleDeleteClick = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // await deleteCourse(courseId); // your delete API or logic
        Swal.fire(
          "Deleted!",
          "Transformer Defferment Details has been deleted.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Transfomer Defferment Details</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-deffermentDetails"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add Defferment Details
              </Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>TENDER NUMBER</th>
                  <th>IMPOSED LETTER NO</th>
                  <th>IMPOSED DATE</th>
                  <th>LIFTING LETTER NO</th>
                  <th>LIFTING DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.tnNumber}</td>
                      <td>{item.imposedLetterNo}</td>
                      <td>
                        {format(new Date(item.imposedDate), "do MMMM yyyy")}
                      </td>
                      <td>{item.liftingLetterNo}</td>
                      <td>
                        {format(new Date(item.liftingDate), "do MMMM yyyy")}
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaPencilAlt />
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(item.no);
                            }}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/*<ResponsivePagination
          page={currentPage}
          count={totalPages}
          onChange={(event, value) => setCurrentPage(value)}
        />*/}
      </div>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        fullWidth
        //fullScreen={fullScreen}
      >
        <DialogTitle className="d-flex justify-content-between align-items-center">
          Edit Details
          <IconButton onClick={handleModalClose}>
            <IoCloseSharp />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel>Tn Number</InputLabel>
            <Select
              value={editedTnDetail}
              label="Tn Number"
              onChange={(e) => {
                setEditedTnDetail(e.target.value);
              }}
            >
              {tnNumbers.map((i, idx) => (
                <MenuItem key={idx} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Imposed Letter No"
            fullWidth
            margin="normal"
            value={editedImposedLetter}
            onChange={(e) => setEditedImposedLetter(e.target.value)}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Imposed Date"
              value={dayjs(editedImposedDate)}
              onChange={(date) => setEditedImposedDate(date)}
              sx={{ mt: 2, width: "100%" }}
            />
          </LocalizationProvider>

          <TextField
            label="Lifting Letter No"
            fullWidth
            margin="normal"
            value={editedLiftingLetter}
            onChange={(e) => setEditedLiftingLetter(e.target.value)}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Lifting Date"
              value={dayjs(editedLiftingDate)}
              onChange={(date) => setEditedLiftingDate(date)}
              sx={{ mt: 2, width: "100%" }}
            />
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeffermentList;
