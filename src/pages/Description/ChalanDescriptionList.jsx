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

const ChalanDescriptionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [chalanDescription, setChalanDescription] = useState("");

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

  const getDummyChalanDescriptions = () => {
    return [
      {
        id: 1,
        description:
          "Delivery challan for 1000 kVA transformers including transport charges, handling, and on-site installation as per the approved purchase order and delivery schedule.",
      },
      {
        id: 2,
        description:
          "Challan for the supply of high-tension insulators, complete with packing, forwarding, insurance, and all required test certificates for the designated substation.",
      },
      {
        id: 3,
        description:
          "Material dispatch challan for 11kV outdoor vacuum circuit breakers, inclusive of installation accessories and detailed engineering drawings for commissioning.",
      },
      {
        id: 4,
        description:
          "Challan covering delivery of galvanized steel poles and cross-arms, bundled with all necessary hardware and fasteners for the rural electrification project.",
      },
      {
        id: 5,
        description:
          "Delivery challan for power cables and terminations, covering 3.5 core XLPE insulated aluminum cables with full compliance to IS standards and safety protocols.",
      },
    ];
  };

  const dummyData = getDummyChalanDescriptions();

  const handleEditClick = (item) => {
    setSelectedDescription(item);
    setChalanDescription(item.description);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedDescription(null);
    setChalanDescription("");
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Chalan Description updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Chalan Description List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-chalanDescription"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add Chalan Description
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
                  <th>CHALAN DESCRIPTION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => {
                    const shortDescription =
                      item.description.split(" ").slice(0, 8).join(" ") +
                      (item.description.split(" ").length > 8 ? " ..." : "");

                    return (
                      <tr key={index}>
                        <td># {index + 1}</td>
                        <td>{shortDescription}</td>
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
                    );
                  })
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
            fullWidth
            multiline
            rows={4}
            label="Description Of Chalan"
            value={chalanDescription}
            onChange={(e) => setChalanDescription(e.target.value)}
            margin="normal"
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

export default ChalanDescriptionList;
