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

export const getDummyConsigneeDetails = () => {
  return [
    {
      id: "1",
      name: "ABC Power Solutions Pvt. Ltd.",
      address:
        "Plot No. 45, Industrial Area, Sector 18, Gurugram, Haryana - 122015",
      gstNo: "06ABCDE1234F1Z5",
      phone: "9876543210",
      email: "contact@abcpower.com",
    },
    {
      id: "2",
      name: "XYZ Transformers Ltd.",
      address: "B-12, MIDC Industrial Estate, Pune, Maharashtra - 411019",
      gstNo: "27XYZAB6789C1Z3",
      phone: "9123456780",
      email: "sales@xyztransformers.com",
    },
    {
      id: "3",
      name: "GreenVolt Energy Systems",
      address: "123/4, Electronic City Phase 2, Bengaluru, Karnataka - 560100",
      gstNo: "29GVEPL2345D1Z7",
      phone: "9988776655",
      email: "info@greenvolt.com",
    },
    {
      id: "4",
      name: "PowerMax Electric Co.",
      address: "No. 89, GIDC Estate, Ahmedabad, Gujarat - 382445",
      gstNo: "24PMAXL4567E1Z9",
      phone: "9090909090",
      email: "support@powermax.com",
    },
    {
      id: "5",
      name: "Sunrise Electricals",
      address: "15, Salt Lake Sector V, Kolkata, West Bengal - 700091",
      gstNo: "19SREPL7890F1Z2",
      phone: "9876001234",
      email: "hello@sunriseelectricals.com",
    },
  ];
};

const ConsigneeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // or calculate based on data length

  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedConsignee, setSelectedConsignee] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

  const dummyData = getDummyConsigneeDetails();

  const handleEditClick = (item) => {
    setSelectedConsignee(item);
    setName(item.name);
    setAddress(item.address);
    setGstNo(item.gstNo);
    setEmail(item.email);
    setPhone(item.phone);
    setEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedConsignee(null);
    setName("");
    setAddress("");
    setGstNo("");
    setEmail("");
    setPhone("");
  };

  const handleSaveChanges = () => {
    // You can send API call here
    setAlertBox({
      open: true,
      msg: "Consignee details updated successfully!",
      error: false,
    });
    setEditModalOpen(false);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Consignee List</h5>
          <div className="ms-auto d-flex align-items-center">
            <Link to={"/add-consignee"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add Consignee</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>NO</th>
                  <th>NAME</th>
                  <th>ADDRESS</th>
                  <th>GST NO</th>
                  <th>EMAIL</th>
                  <th>PHONE NUMBER</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {dummyData.length > 0 ? (
                  dummyData.map((item, index) => (
                    <tr key={index}>
                      <td># {index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      <td>{item.gstNo}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
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
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <TextField
            label="GST No"
            fullWidth
            margin="normal"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            required
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Phone Number"
            type="text"
            inputMode="numeric"
            maxLength="10"
            className="form-control"
            margin="normal"
            required
            value={phone}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setPhone(numericValue.slice(0, 10)); // Limit to 10 digits
            }}
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

export default ConsigneeList;
