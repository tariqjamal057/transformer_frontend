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
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";

const TnNumberList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTnNumber, setSelectedTnNumber] = useState(null);
  const [editedTnNumber, setEditedTnNumber] = useState("");
  const [editedRating, setEditedRating] = useState("");
  const [editedDiscom, setEditedDiscom] = useState("");

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

  const getDummyTnNumbers = () => {
    return [
      {
        tenderNo: "TN-001",
        rating: "100 KVA",
        discom: "AJMER DISCOM",
      },
      {
        tenderNo: "TN-002",
        rating: "250 KVA",
        discom: "JAIPUR DISCOM",
      },
      {
        tenderNo: "TN-003",
        rating: "500 KVA",
        discom: "JODHPUR DISCOM",
      },
      {
        tenderNo: "TN-004",
        rating: "200 KVA",
        discom: "JAIPUR DISCOM",
      },
    ];
  };

  const dummyData = getDummyTnNumbers();

  const handleEditClick = (item) => {
    setSelectedTnNumber(item);
    setEditedTnNumber(item.tenderNo);
    setEditedRating(item.rating);
    setEditedDiscom(item.discom);
    setEditModalOpen(true);
  };

  
  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedTnNumber(null);
    setEditedTnNumber("");
    setEditedRating("");
    setEditedDiscom("");
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Transformer details updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Transfomer Number List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-tnNumber"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add TN Number</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>TENDER NO</th>
                  <th>RATING</th>
                  <th>DISCOM</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr
                      key={index}
                    >
                      <td># {index + 1}</td>
                      <td>{item.tenderNo}</td>
                      <td>{item.rating}</td>
                      <td>{item.discom}</td>
                      <td>
                        <div className="d-flex gap-2 align-item-center justify-content-center">
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
          <TextField
            label="Tender No"
            fullWidth
            margin="normal"
            value={editedTnNumber}
            onChange={(e) => setEditedTnNumber(e.target.value)}
          />

          <TextField
            label="Rating"
            fullWidth
            margin="normal"
            value={editedRating}
            onChange={(e) => setEditedRating(e.target.value)}
          />

          <TextField
            label="Discom"
            fullWidth
            margin="normal"
            value={editedDiscom}
            onChange={(e) => setEditedDiscom(e.target.value)}
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

export default TnNumberList;