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

const MaterialDescriptionList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [phase, setPhase] = useState("")
  const [materialDescription, setMaterialDescription] = useState("");

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

  const getDummyMaterialDescriptions = () => {
    return [
      {
        materialName: "100 kVA Copper Distribution Transformer",
        phase: "100 KVA",
        rating: '100',
        description:
          "100 kVA, 11/0.433 kV, 3-Phase, Oil Cooled Distribution Transformer with Copper Winding, ONAN Cooling, complete with standard fittings and accessories suitable for outdoor installation as per IS 1180.",
      },
      {
        materialName: "200 kVA Copper Distribution Transformer",
        phase: "200 KVA",
        rating: "200",
        description:
          "200 kVA, 11/0.433 kV, 3-Phase, Copper Wound Distribution Transformer, ONAN Cooled, energy efficient level-2 with standard bushings, arcing horns, and lifting lugs as per latest IS standards.",
      },
      {
        materialName: "500 kVA Power Transformer with OLTC",
        phase: "500 KVA",
        rating: "500",
        description:
          "500 kVA, 33/11 kV, 3-Phase Power Transformer with On-Load Tap Changer (OLTC), Oil Natural Air Natural Cooling, suitable for grid substation applications, complete with conservator, radiators, and marshalling box.",
      },
      {
        materialName: "150 Amp Current Transformer (CT)",
        phase: "150 Amp",
        rating: "150",
        description:
          "150 Amp Current Transformer (CT), 11 kV Indoor Resin Cast Type, Class 1 accuracy, 5P10 protection class, suitable for metering and protection applications in medium voltage switchgear panels.",
      },
      {
        materialName: "11 kV Single Phase Potential Transformer (PT)",
        phase: "11 KV",
        rating: "11",
        description:
          "11 kV Single Phase Potential Transformer (PT), Oil Immersed Outdoor Type, with Class 0.5 accuracy for metering and protection, designed for long life and reliable voltage measurement in distribution networks.",
      },
    ];
  };

  const dummyData = getDummyMaterialDescriptions();

  const handleEditClick = (item) => {
    setSelectedDescription(item);
    setMaterialName(item.materialName);
    setPhase(item.phase)
    setMaterialDescription(item.description);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setMaterialName("");
    setPhase("")
    setSelectedDescription(null);
    setMaterialDescription("");
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Material Description updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Material Description List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-materialDescription"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">
                Add Material Description
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
                  <th>MATERIAL NAME</th>
                  <th>Rating</th>
                  <th>MATERIAL DESCRIPTION</th>
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
                        <td>{item.materialName}</td>
                        <td>{item.rating}</td>
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
            label="Material Name"
            fullWidth
            margin="normal"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            required
          />

          <TextField
            label="Phase"
            fullWidth
            margin="normal"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description Of Material"
            value={materialDescription}
            onChange={(e) => setMaterialDescription(e.target.value)}
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

export default MaterialDescriptionList;
