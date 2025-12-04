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

const LoaList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const tnNumbers = ["TN-001", "TN-002", "TN-003", "TN-004"];

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLoa, setSelectedLoa] = useState(null);
  const [editedTnDetail, setEditedTnDetail] = useState("");
  const [editedLoa, setEditedLoa] = useState("");
  const [editedPo, setEditedPo] = useState("");

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

  const getDummyLOAandPODetails = () => {
    return [
      {
        tnNumber: "TN-001",
        loaNumber: "LOA-2025-001",
        loaDate: "2025-06-12",
        poNumber: "PO-2025-078",
        poDate: "2025-07-01",
      },
      {
        tnNumber: "TN-002",
        loaNumber: "LOA-2025-045",
        loaDate: "2025-05-20",
        poNumber: "PO-2025-089",
        poDate: "2025-06-10",
      },
      {
        tnNumber: "TN-001",
        loaNumber: "LOA-2025-112",
        loaDate: "2025-04-15",
        poNumber: "PO-2025-150",
        poDate: "2025-05-05",
      },
      {
        tnNumber: "TN-002",
        loaNumber: "LOA-2025-078",
        loaDate: "2025-06-01",
        poNumber: "PO-2025-199",
        poDate: "2025-06-25",
      },
    ];
  };

  const dummyData = getDummyLOAandPODetails();

  const handleEditClick = (item) => {
    setSelectedLoa(item);
    setEditedTnDetail(item.tnNumber);
    setEditedLoa(item.loaNumber);
    setEditedPo(item.poNumber);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setEditedTnDetail("");
    setSelectedLoa(null);
    setEditedLoa("");
    setEditedPo("");
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "LOA and PO details updated successfully!",
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
          "Transformer LOA and PO Details has been deleted.",
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
          <h5 className="mb-0">Transfomer LOA and PO Details</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-loa"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add LOA & PO Details
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
                  <th>LOA DETAILS</th>
                  <th>PO DETAILS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.tnNumber}</td>
                      <td>{item.loaNumber}</td>
                      <td>{item.poNumber}</td>
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
            label="LOA Details"
            fullWidth
            margin="normal"
            value={editedLoa}
            onChange={(e) => setEditedLoa(e.target.value)}
          />

          <TextField
            label="PO Details"
            fullWidth
            margin="normal"
            value={editedPo}
            onChange={(e) => setEditedPo(e.target.value)}
          />
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

export default LoaList;
