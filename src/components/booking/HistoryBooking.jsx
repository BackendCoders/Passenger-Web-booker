/** @format */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import Header from "../Common/header"; // ✅ Keeping the same Header
import { TiArrowBack } from "react-icons/ti";
import { fetchWebBookings } from "../../service/operations/getwebbooking"; // ✅ Import Redux action

// ✅ MUI Imports
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  CircularProgress,
  TablePagination,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// ✅ Collapsible Row Component
function Row({ row }) {
  const [open, setOpen] = useState(false);

  const getStatusText = () => {
    switch (row.status) {
      case 0:
        return "Processed";
      case 1:
        return "Accepted";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = () => {
    switch (row.status) {
      case 0:
        return "green";
      case 1:
        return "blue";
      case 2:
        return "red";
      default:
        return "black";
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "1px solid #ddd" } }}>
        <TableCell sx={{ padding: "12px" }}>
          {row.status === 2 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>
          {row.passengerName}
        </TableCell>
        <TableCell sx={{ padding: "12px" }}>{row.pickupAddress}</TableCell>
        <TableCell sx={{ padding: "12px" }}>{row.destinationAddress}</TableCell>
        <TableCell sx={{ padding: "12px" }}>{row.phoneNumber}</TableCell>
        <TableCell sx={{ padding: "12px" }}>{row.email}</TableCell>
        <TableCell sx={{ fontWeight: "bold", padding: "12px", color: getStatusColor() }}>
          {getStatusText()}
        </TableCell>
      </TableRow>

      {row.status === 2 && (
        <TableRow>
          <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 2, backgroundColor: "#fff5f5", padding: 2, borderRadius: "5px" }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#dc2626", fontWeight: "bold" }}>
                  Rejected Reason
                </Typography>
                <Typography variant="body1">{row.rejectedReason}</Typography>
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      "&:hover": { backgroundColor: "#b91c1c" },
                    }}
                  >
                    Re-Booking
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#b91c1c",
                      color: "white",
                      "&:hover": { backgroundColor: "#7f1d1d" },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    passengerName: PropTypes.string.isRequired,
    pickupAddress: PropTypes.string.isRequired,
    destinationAddress: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    rejectedReason: PropTypes.string,
  }).isRequired,
};

// ✅ Main Component
const HistoryBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch bookings from Redux
  const { webBookings, loading, error } = useSelector((state) => state.webbookings);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchWebBookings());
  }, [dispatch]);

  // ✅ Sort bookings: Processed (0) first, then Accepted (1), then Rejected (2)
  const sortedBookings = [...webBookings].sort((a, b) => a.status - b.status);

  // ✅ Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Handle Page Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // ✅ Handle Rows per Page Change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Header />
      <div className="bg-white pt-10 p-4 flex flex-col items-center min-h-[500px] sm:min-h-screen">
        {/* ✅ Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex-shrink-0 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition flex items-center justify-center mb-4"
        >
          <TiArrowBack className="mr-2" />
          <span className="font-medium">Back</span>
        </button>

        {/* ✅ Loading & Error Handling */}
        {loading && <CircularProgress />}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {/* ✅ Table Content */}
        {sortedBookings.length > 0 ? (
          <TableContainer component={Paper} sx={{ backgroundColor: "white" }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#dc2626" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} />
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Passenger</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pickup Address</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Destination</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                  <Row key={booking.id} row={booking} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          !loading && <Typography>No data available in booking history.</Typography>
        )}

        {/* ✅ Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default HistoryBooking;
