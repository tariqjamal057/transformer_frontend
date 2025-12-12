import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, InputAdornment } from "@mui/material";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// Dummy Damaged Transformer Data (replace with your actual data source)
const dummyDamagedTransformers = [
  {
    id: "1",
    snNumber: "4912 TO 5061",
    trfsiNo: 4912,
    inspectionDate: "2025-07-13",
    reasonOfDamaged: "Overheating",
    ctlReportNo: "CTL-001",
    ctlReportDate: "2025-07-15",
    liftingLetterNo: "LL-001",
    liftingLetterDate: "2025-07-16",
    liftingFromAcos: "ACOS-1",
  },
  {
    id: "2",
    snNumber: "5912 TO 6061",
    trfsiNo: 5912,
    inspectionDate: "2025-08-06",
    reasonOfDamaged: "Lightning Strike",
    ctlReportNo: "CTL-002",
    ctlReportDate: "2025-08-08",
    liftingLetterNo: "LL-002",
    liftingLetterDate: "2025-08-09",
    liftingFromAcos: "ACOS-2",
  },
  {
    id: "3",
    snNumber: "4917 TO 5096",
    trfsiNo: 4917,
    inspectionDate: "2025-09-16",
    reasonOfDamaged: "Vandalism",
    ctlReportNo: "CTL-003",
    ctlReportDate: "2025-09-18",
    liftingLetterNo: "LL-003",
    liftingLetterDate: "2025-09-19",
    liftingFromAcos: "ACOS-3",
  },
];

const DamagedTransformerList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(dummyDamagedTransformers);

  // Filter data based on search query
  useEffect(() => {
    const results = dummyDamagedTransformers.filter((item) =>
      item.snNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(results);
  }, [searchQuery]);

  return (
    <div className="right-content w-100">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3 card shadow border-0 w-100 flex-row p-4">
        <h5 className="mb-0">Damaged Transformer List</h5>

        <TextField
          variant="outlined"
          placeholder="Search by SN Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            width: { xs: "100%", sm: "300px" },
            marginLeft: "auto",
            backgroundColor: "#fff",
            borderRadius: 2,
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
          <Link to={"/damageTransformer"}>
            <Button className="btn-blue ms-3 ps-3 pe-3">Add</Button>
          </Link>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead className="table-primary text-white text-uppercase text-center">
              <tr>
                <th>SN Number</th>
                <th>TRFSI No</th>
                <th>Inspection Date</th>
                <th>Reason Of Damaged</th>
                <th>CTL Report No</th>
                <th>CTL Report Date</th>
                <th>Lifting Letter No</th>
                <th>Lifting Letter Date</th>
                <th>Lifting From Acos</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center align-middle">
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td>{row.snNumber}</td>
                  <td>{row.trfsiNo}</td>
                  <td>{dayjs(row.inspectionDate).format("YYYY-MM-DD")}</td>
                  <td>{row.reasonOfDamaged}</td>
                  <td>{row.ctlReportNo}</td>
                  <td>{dayjs(row.ctlReportDate).format("YYYY-MM-DD")}</td>
                  <td>{row.liftingLetterNo}</td>
                  <td>{dayjs(row.liftingLetterDate).format("YYYY-MM-DD")}</td>
                  <td>{row.liftingFromAcos}</td>
                  <td>
                    <div className="d-flex gap-2 align-items-center justify-content-center">
                      <button className="btn btn-sm btn-success">
                        <FaPencilAlt />
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DamagedTransformerList;
