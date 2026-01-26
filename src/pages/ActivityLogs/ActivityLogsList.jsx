import { useContext, useEffect, useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog, // Added for modal
  DialogTitle, // Added for modal
  DialogContent, // Added for modal
  DialogActions, // Added for modal
  IconButton, // Added for modal close button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { MyContext } from "../../App";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { IoCloseSharp } from "react-icons/io5"; // New: IoCloseSharp import

const ActivityLogsList = () => {
  const { setProgress } = useContext(MyContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewData, setCurrentViewData] = useState(null);

  const {
    data: activityLogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "activityLogs",
      currentPage,
      filterType,
      filterStartDate,
      filterEndDate,
    ],
    queryFn: () => {
      let url = `/activity-logs?page=${currentPage}`;
      if (filterType) url += `&type=${filterType}`;
      if (filterStartDate) url += `&startDate=${filterStartDate.format("YYYY-MM-DD")}`;
      if (filterEndDate) url += `&endDate=${filterEndDate.format("YYYY-MM-DD")}`;
      return api.get(url).then((res) => res.data);
    },
    placeholderData: { items: [], totalPages: 1 },
  });

  useEffect(() => {
    setProgress(20);
    setProgress(100);
  }, []);

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  const formatValue = (key, value, indent = 0) => {
    const paddingLeft = 0; // Adjust padding for nested items

    if (value === null || value === undefined) {
      return key ? <div style={{ paddingLeft }}>{key}: <span style={{ color: 'gray' }}>N/A</span></div> : <span style={{ color: 'gray' }}>N/A</span>;
    }
    
    // Check if value is a valid ISO date string
    const dateValue = dayjs(value);
    // Check if it's a string that could be an ISO date and is valid
    if (typeof value === 'string' && dateValue.isValid() && value.includes('T') && value.includes('Z')) {
      return key ? <div style={{ paddingLeft }}>{key}: {dateValue.format('DD/MM/YYYY HH:mm:ss')}</div> : <div>{dateValue.format('DD/MM/YYYY HH:mm:ss')}</div>;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle nested objects
      const entries = Object.entries(value);
      if (entries.length === 0) return key ? <div style={{ paddingLeft }}>{key}: <span style={{ color: 'gray' }}>{"{}"}</span></div> : <span style={{ color: 'gray' }}>{"{}"}</span>;
      return (
        <div key={key} style={{ paddingLeft }}>
          {/* {key && <strong>{key}:</strong>} Only render key if it exists */}
          <ul style={{ listStyle: 'none', margin: 0, paddingLeft: '10px' }}>
            {entries.map(([subKey, subValue]) => (
              <li key={subKey}>{formatValue(subKey, subValue, indent + 1)}</li>
            ))}
          </ul>
        </div>
      );
    }
    if (Array.isArray(value)) {
      // Handle arrays
      if (value.length === 0) return key ? <div style={{ paddingLeft }}>{key}: <span style={{ color: 'gray' }}>[]</span></div> : <span style={{ color: 'gray' }}>[]</span>;
      return (
        <div key={key} style={{ paddingLeft }}>
          {key && <strong>{key}:</strong>} {/* Only render key if it exists */}
          <ul style={{ listStyle: 'none', margin: 0, paddingLeft: '10px' }}>
            {value.map((item, idx) => (
              <li key={idx}>
                {/* Here's the change: if item is object, pass null as key to formatValue */}
                {typeof item === 'object' ? formatValue(null, item, indent + 1) : String(item)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    // For primitive types (string, number, boolean)
    return key ? <div style={{ paddingLeft }}>{key}: {String(value)}</div> : <div>{String(value)}</div>;
  };

  const formatJsonData = (jsonData) => {
    if (!jsonData) return "-";
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (typeof data === 'object' && data !== null) {
        return Object.entries(data).map(([key, value]) => (
          <div key={key} >{formatValue(key, value)}</div>
        ));
      }
      return String(jsonData);
    } catch (e) {
      return String(jsonData); // Fallback for invalid JSON
    }
  };

  const renderChanges = (before, after, type) => {
    if (type === "CREATE") {
      return {
        before: "-",
        after: (
            <Button
                variant="outlined"
                size="small"
                onClick={() => {
                    setCurrentViewData(after); // 'after' is the raw JSON data here
                    setIsViewModalOpen(true);
                }}
            >
                View Data
            </Button>
        ),
      };
    } else if (type === "DELETE") {
      return {
        before: formatJsonData(before),
        after: <span style={{color: 'red'}}>Record Deleted</span>,
      };
    } else if (type === "UPDATE") {
      const beforeData = typeof before === 'string' && before ? JSON.parse(before) : before;
      const afterData = typeof after === 'string' && after ? JSON.parse(after) : after;
      
      const changes = { before: [], after: [] };

      if (!beforeData && !afterData) {
        return { before: "-", after: "-" };
      }

      const allKeys = new Set([...Object.keys(beforeData || {}), ...Object.keys(afterData || {})]);

      allKeys.forEach((key) => {
        const beforeValue = beforeData ? beforeData[key] : undefined;
        const afterValue = afterData ? afterData[key] : undefined;

        // Deep comparison for objects/arrays or stringify for comparison
        if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
          changes.before.push(
            <div key={`b-${key}`} style={{ color: 'red' }}>
              {formatValue(key, beforeValue)}
            </div>,
          );
          changes.after.push(
            <div key={`a-${key}`} style={{ color: 'green' }}>
              {formatValue(key, afterValue)}
            </div>,
          );
        }
      });
      return {
        before: changes.before.length > 0 ? <>{changes.before}</> : "-",
        after: changes.after.length > 0 ? <>{changes.after}</> : "-",
      };
    }
    return { before: formatJsonData(before), after: formatJsonData(after) };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
          <h5 className="mb-0">Activity Logs</h5>

          <div className="d-flex align-items-center gap-3 ms-auto">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={filterType}
                label="Action Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="CREATE">Create</MenuItem>
                <MenuItem value="UPDATE">Update</MenuItem>
                <MenuItem value="DELETE">Delete</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Start Date"
              value={filterStartDate}
              onChange={(date) => setFilterStartDate(date)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="End Date"
              value={filterEndDate}
              onChange={(date) => setFilterEndDate(date)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { size: "small" } }}
            />
          </div>
        </div>
        
        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive">
            <Table className="table table-bordered table-striped align-middle text-nowrap">
              <TableHead className="table-primary text-white text-uppercase text-center">
                <TableRow>
                  <TableCell>Sr No</TableCell>
                  <TableCell>Action Type</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Done By</TableCell>
                  <TableCell>Before</TableCell>
                  <TableCell>After</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-center">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" color="error">
                    Error fetching data.
                  </TableCell>
                </TableRow>
              ) : activityLogs?.items?.length > 0 ? (
                activityLogs.items.map((log, index) => {
                  const changes = renderChanges(
                    log.before,
                    log.after,
                    log.type,
                  );
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        # {(activityLogs.currentPage - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.modelName}</TableCell>
                      <TableCell>
                        <div>{log.doneByUser?.name || "N/A"}</div>
                        <div className="text-muted small">
                          ({log.doneByUser?.role || "N/A"})
                        </div>
                      </TableCell>
                      <TableCell>{changes.before}</TableCell>
                      <TableCell>{changes.after}</TableCell>
                      <TableCell>
                        {log.createdAt
                          ? dayjs(log.createdAt).format("DD/MM/YYYY HH:mm:ss")
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    {activityLogs?.totalPages > 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                    <ResponsivePagination
                                      current={currentPage}
                                      total={activityLogs.totalPages}
                                      onPageChange={handlePageChange}
                                    />
                                  </Box>
                                )}      </div>
                              <Dialog open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} fullWidth maxWidth="md">
                                <DialogTitle>
                                    Full Record Details
                                    <IconButton
                                        aria-label="close"
                                        onClick={() => setIsViewModalOpen(false)}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                    >
                                        <IoCloseSharp />
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent dividers>
                                    <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                        {currentViewData ? (
                                            formatJsonData(currentViewData)
                                        ) : (
                                            <Typography>No data to display.</Typography>
                                        )}
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                                </DialogActions>
                            </Dialog>
                            </LocalizationProvider>
                          );
                        };
                        
                        export default ActivityLogsList;