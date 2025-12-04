import { useContext, useEffect, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { MyContext } from "../../App";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import NewGPInformationModal from "../../components/NewGPInformationModal";

const NewGPInformationList = () => {
  const { setProgress, setAlertBox, setIsHideSidebarAndHeader } =
    useContext(MyContext);

  const [openModal, setOpenModal] = useState(false);
  const [selectedNewGPInformation, setSelectedNewGPInformation] =
    useState(null);

  // Dummy Data
  const newGPInformations = [
    {
      id: "1",
      challanReceiptedItemNo: "CRI-001",
      challanReceiptedDate: "2025-08-18",
      sealingStatements: [
        {
          challanNo: "CH-1001",
          consigneeName: "GreenVolt Energy Systems",
          createdAt: "2025-06-22",
          inspectionDate: "2025-08-09",
          isMatched: true,
          polycarbonatesealno: "IAJ 6605 To IAJ 6606",
          rating: "100",
          receivedfromacos: "ABC Power Supply Ltd.",
          trfsino: 4908,
        },
        {
          challanNo: "CH-1002",
          consigneeName: "XYZ Electricals Ltd.",
          createdAt: "2025-07-28",
          inspectionDate: "2025-08-06",
          isMatched: true,
          polycarbonatesealno: "IAJ 7339 To IAJ 7340",
          rating: "50",
          receivedfromacos: "Western Power Supply Ltd.",
          trfsino: 9003,
        },
      ],
    },
    {
      id: "2",
      challanReceiptedItemNo: "CRI-002",
      challanReceiptedDate: "2025-09-05",
      sealingStatements: [
        {
          challanNo: "CH-1003",
          consigneeName: "Delta Transformers Pvt. Ltd.",
          createdAt: "2025-08-12",
          inspectionDate: "2025-08-20",
          isMatched: true,
          polycarbonatesealno: "IAJ 7401 To IAJ 7402",
          rating: "200",
          receivedfromacos: "North Grid Corp.",
          trfsino: 9201,
        },
        {
          challanNo: "CH-1004",
          consigneeName: "Shakti Power Solutions",
          createdAt: "2025-08-15",
          inspectionDate: "2025-08-22",
          isMatched: true,
          polycarbonatesealno: "IAJ 7403 To IAJ 7404",
          rating: "150",
          receivedfromacos: "East State Power Supply",
          trfsino: 9202,
        },
      ],
    },
    {
      id: "3",
      challanReceiptedItemNo: "CRI-003",
      challanReceiptedDate: "2025-09-08",
      sealingStatements: [
        {
          challanNo: "CH-1005",
          consigneeName: "BrightVolt Electric Ltd.",
          createdAt: "2025-08-25",
          inspectionDate: "2025-09-01",
          isMatched: true,
          polycarbonatesealno: "IAJ 7501 To IAJ 7502",
          rating: "75",
          receivedfromacos: "Southern Electricity Board",
          trfsino: 9301,
        },
        {
          challanNo: "CH-1006",
          consigneeName: "ElectroWorks Industries",
          createdAt: "2025-08-28",
          inspectionDate: "2025-09-02",
          isMatched: true,
          polycarbonatesealno: "IAJ 7503 To IAJ 7504",
          rating: "125",
          receivedfromacos: "Central Power Corporation",
          trfsino: 9302,
        },
      ],
    },
    {
      id: "4",
      challanReceiptedItemNo: "CRI-004",
      challanReceiptedDate: "2025-09-09",
      sealingStatements: [
        {
          challanNo: "CH-1007",
          consigneeName: "NextGen Transformers",
          createdAt: "2025-08-30",
          inspectionDate: "2025-09-05",
          isMatched: true,
          polycarbonatesealno: "IAJ 7601 To IAJ 7602",
          rating: "300",
          receivedfromacos: "Eastern Energy Ltd.",
          trfsino: 9401,
        },
        {
          challanNo: "CH-1008",
          consigneeName: "VoltGuard Pvt. Ltd.",
          createdAt: "2025-09-01",
          inspectionDate: "2025-09-06",
          isMatched: true,
          polycarbonatesealno: "IAJ 7603 To IAJ 7604",
          rating: "400",
          receivedfromacos: "Western State Grid",
          trfsino: 9402,
        },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNewGPInformations, setFilteredNewGPInformations] = useState(
    newGPInformations
  );

  useEffect(() => {
    const results = newGPInformations.filter((item) => {
      const query = searchQuery.toLowerCase();

      const challanNoMatch = item.challanReceiptedItemNo
        ?.toLowerCase()
        .includes(query);

      const challanDateMatch = item.challanReceiptedDate
        ?.toString()
        .toLowerCase()
        .includes(query);

      const receivedFromAcosMatch = item.sealingStatements.some((statement) =>
        statement.receivedfromacos?.toLowerCase().includes(query)
      );

      return challanNoMatch || challanDateMatch || receivedFromAcosMatch;
    });

    setFilteredNewGPInformations(results);
  }, [searchQuery]);

  useEffect(() => {
    setIsHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    setProgress(100);
  }, []);

  const handleEditClick = (item) => {
    setSelectedNewGPInformation(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedNewGPInformation(null);
  };

  return (
    <>
      <div className="right-content w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">New G.P. Information List</h5>

          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search...."
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
            <Link to={"/add-NewGPInformation"}>
              <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-nowrap">
              <thead className="table-primary text-white text-uppercase text-center">
                <tr>
                  <th>Sr No</th>
                  <th>Challan Receipted Item No</th>
                  <th>Challan Receipted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-center align-middle">
                {filteredNewGPInformations.length > 0 ? (
                  filteredNewGPInformations.map((item, index) => (
                    <tr key={item.id}>
                      {/* Sr No */}
                      <td># {index + 1}</td>

                      {/* Challan Receipted Item No */}
                      <td>{item.challanReceiptedItemNo}</td>

                      {/* Challan Receipted Date */}
                      <td>
                        {format(
                          new Date(item.challanReceiptedDate),
                          "dd MMM yyyy"
                        )}
                      </td>

                      {/* Actions */}
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
                    <td colSpan="4" className="text-center">
                      No GP Information Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        <NewGPInformationModal
          open={openModal}
          handleClose={handleModalClose}
          newGPInformation={selectedNewGPInformation}
        />
      }
    </>
  );
};

export default NewGPInformationList;
