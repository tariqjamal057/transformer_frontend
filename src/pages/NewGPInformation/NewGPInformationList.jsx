import { useContext, useState } from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import { Link } from "react-router-dom";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination";
import EditNewGPInformationModal from "../../components/EditNewGPInformationModal";
import ViewNewGPInformationModal from "../../components/ViewNewGPInformationModal";
import NewGPInformationBulkUploadModal from "../../components/NewGPInformationBulkUploadModal";

const NewGPInformationList = () => {
  const { setAlertBox, hasPermission } = useContext(MyContext);
  const queryClient = useQueryClient();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: newGPInfoData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["newGpInformations", currentPage, searchQuery],
    queryFn: () =>
      api
        .get(`/new-gp-informations?page=${currentPage}&search=${searchQuery}`)
        .then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/new-gp-informations/${id}`),
    onSuccess: () => {
      setAlertBox({
        open: true,
        msg: "New GP Information deleted successfully!",
        error: false,
      });
      queryClient.invalidateQueries(["newGpInformations"]);
    },
    onError: (error) => {
      setAlertBox({ open: true, msg: error.message, error: true });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setOpenEditModal(true);
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
  };

  const handleModalClose = () => {
    setOpenEditModal(false);
    setOpenViewModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Information List</h5>
          <div className="d-flex align-items-center">
            <TextField
              variant="outlined"
              placeholder="Search Challan No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: "300px" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#f0883d" },
                  "&.Mui-focused fieldset": { borderColor: "#f0883d" },
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
            {hasPermission("newGPInformationCreate") && (
              <Button
                className="btn-blue ms-2"
                onClick={() => setOpenBulkUploadModal(true)}
              >
                Bulk Upload
              </Button>
            )}
            {hasPermission("newGPInformationCreate") && (
              <Link to={"/add-NewGPInformation"}>
                <Button className="btn-blue ms-2">Add</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Challan Receipted Item No</th>
                  <th>Challan Receipted Date</th>
                  <th>No. of Records</th>
                  {hasPermission("newGPInformationUpdate") && <th>Actions</th>}
                </tr>
              </thead>
              <tbody className="text-center">
                {isLoading ? (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="5">Error fetching data</td>
                  </tr>
                ) : newGPInfoData?.data.length > 0 ? (
                  newGPInfoData.data.map((item, index) => (
                    <tr key={item.id}>
                      <td>#{(currentPage - 1) * 10 + index + 1}</td>
                      <td>{item.challanReceiptedItemNo}</td>
                      <td>
                        {dayjs(item.challanReceiptedDate).format("DD-MM-YYYY")}
                      </td>
                      <td>{item.records?.length || 0}</td>
                      {hasPermission("newGPInformationUpdate") && (
                        <td>
                          <div className="d-flex gap-2 align-items-center justify-content-center">
                            {/* <button
                            className="btn btn-sm btn-info"
                            onClick={() => handleViewClick(item)}
                          >
                            <FaEye />
                          </button> */}
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleEditClick(item)}
                            >
                              <FaPencilAlt />
                            </button>
                            {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash />
                          </button> */}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No GP Information Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {newGPInfoData?.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={newGPInfoData.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {selectedItem && (
        <EditNewGPInformationModal
          open={openEditModal}
          handleClose={handleModalClose}
          newGPInformation={selectedItem}
        />
      )}
      {selectedItem && (
        <ViewNewGPInformationModal
          open={openViewModal}
          handleClose={handleModalClose}
          newGPInformation={selectedItem}
        />
      )}
      <NewGPInformationBulkUploadModal
        open={openBulkUploadModal}
        handleClose={() => setOpenBulkUploadModal(false)}
      />
    </>
  );
};

export default NewGPInformationList;
