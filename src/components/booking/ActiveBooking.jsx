/** @format */
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TiArrowBack } from 'react-icons/ti';
import moment from 'moment';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'; // Added Dialog components explicitly for clarity
import { FaArrowUp } from 'react-icons/fa6';
import { FaArrowDown } from 'react-icons/fa6';
import { FaMinus, FaPlus } from 'react-icons/fa'; // For expandable/collapsible icons

import {
  fetchActiveBookings,
  amendBooking,
  cancelBooking,
} from '../../slices/activeSlice';
import Header from '../Common/header';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

// Row Component for Each Booking
function Row({ row, isParent, isOpen, toggleGroup }) {
  const dispatch = useDispatch();
  const [openAmendModal, setOpenAmendModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const recurrenceId = row?.recurranceId ?? 0; // Default to 0 if null/undefined for recurring bookings

  const handleAmendSubmit = async (isAmendAll = false) => {
    if (!message.trim()) { // Check if message is empty for both individual and all amendments
      toast.error('Amendment message cannot be empty!');
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        amendBooking({
          bookingId: row.bookingId,
          message: message, // Always pass the user-entered message, whether individual or all amendments
          block: isAmendAll ? true : false, // Set to true for "SUBMIT ALL FUTURE BOOKINGS" or false for individual amend
          recurrenceId: recurrenceId, // Ensure recurrenceId is always defined for recurring bookings
        })
      ).unwrap();
      toast.success(isAmendAll ? 'All Amendments Submitted' : 'Amendment Request Submitted');
      setOpenAmendModal(false);
      setMessage('');
    } catch (error) {
      toast.error('Failed to amend booking.');
    }
    setLoading(false);
  };

  const handleCancelSubmit = async (isCancelAll = false) => {
    setLoading(true);
    try {
      await dispatch(
        cancelBooking({
          bookingId: row.bookingId,
          block: isCancelAll ? true : false, // Set to true for "Cancel This and Future Bookings" or false for individual cancel
          recurrenceId: recurrenceId, // Ensure recurrenceId is always defined for recurring bookings
        })
      ).unwrap();
      toast.success(isCancelAll ? 'All Bookings Cancelled' : 'Booking cancelled successfully!');
      setOpenCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel booking.');
    }
    setLoading(false);
  };

  return (
    <>
      <TableRow>
        {/* Expand/Collapse button only for parent rows */}
        <TableCell>
          {isParent && (
            <IconButton
              size='small'
              onClick={() => toggleGroup(row.passengerName)} // Group by passengerName
            >
              {isOpen ? <FaMinus /> : <FaPlus />} {/* Use FaMinus/FaPlus for expand/collapse icons */}
            </IconButton>
          )}
        </TableCell>

        {/* Conditional rendering for parent vs child rows */}
        {isParent ? (
          // Parent Row: Show passengerName on left, "Amend All" & "Cancel All" on right side
          <TableCell colSpan={6}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <span>{row.passengerName}</span> {/* Passenger name on left */}
              {recurrenceId !== null && recurrenceId !== 0 && ( // Show only for recurring bookings
                <Box display='flex' gap={1}> {/* Buttons on right side, aligned with Actions column */}
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      backgroundColor: '#0ea5e9', // Blue for Amend All
                      color: 'white',
                      padding: '6px 16px',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      textTransform: 'capitalize',
                      '&:hover': { backgroundColor: '#0284c7' },
                    }}
                    onClick={() => setOpenAmendModal(true)} // Open amend modal for parent row
                  >
                    Amend All
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      backgroundColor: '#dc2626', // Red for Cancel All
                      color: 'white',
                      padding: '6px 16px',
                      fontWeight: 'bold',
                      borderRadius: '6px',
                      textTransform: 'capitalize',
                      '&:hover': { backgroundColor: '#b91c1c' },
                    }}
                    onClick={() => setOpenCancelModal(true)} // Open cancel modal for parent row
                  >
                    Cancel All
                  </Button>
                </Box>
              )}
            </Box>
          </TableCell>
        ) : (
          // Child Rows: Show all details including passengerName, but no "Amend All" or "Cancel All" buttons directly
          <>
            <TableCell>{row.bookingId}</TableCell>
            <TableCell>{moment(row.dateTime).format('DD-MM-YYYY HH:mm')}</TableCell>
            <TableCell>{row.passengerName}</TableCell>
            <TableCell>{row.pickupAddress}</TableCell>
            <TableCell>{row.destinationAddress}</TableCell>
            <TableCell sx={{ padding: '8px', textAlign: 'center' }}>
              <Box display='flex' justifyContent='center' gap={1}>
                <Button
                  variant='contained'
                  size='small'
                  sx={{
                    backgroundColor: '#0ea5e9', // Slightly darker blue for Amend button
                    color: 'white',
                    padding: '6px 16px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    textTransform: 'capitalize',
                    '&:hover': { backgroundColor: '#0284c7' }, // Darker shade on hover
                  }}
                  onClick={() => setOpenAmendModal(true)}
                >
                  Amend
                </Button>

                <Button
                  variant='contained'
                  size='small'
                  sx={{
                    backgroundColor: '#dc2626', // Red color for Cancel button
                    color: 'white',
                    padding: '6px 16px',
                    fontWeight: 'bold',
                    borderRadius: '6px',
                    textTransform: 'capitalize',
                    '&:hover': { backgroundColor: '#b91c1c' }, // Darker red on hover
                  }}
                  onClick={() => setOpenCancelModal(true)}
                >
                  Cancel
                </Button>
              </Box>
            </TableCell>
          </>
        )}
      </TableRow>

      {/* Amend Booking Modal - New design based on image, different behavior for parent/child */}
      <Dialog
        open={openAmendModal}
        onClose={() => setOpenAmendModal(false)}
        maxWidth='sm'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '8px', // Rounded corners as per image
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#dc2626', // Red background for title
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '12px',
          }}
        >
          Amend Booking
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff' }}>
          <TextField
            label='Enter amendment message'
            variant='outlined'
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              marginTop: 2,
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px', backgroundColor: '#ffffff' }}>
          <Button
            onClick={() => setOpenAmendModal(false)}
            sx={{
              backgroundColor: '#dc2626', // Red for CANCEL
              color: 'white',
              padding: '8px 24px',
              fontWeight: 'bold',
              borderRadius: '8px',
              textTransform: 'uppercase',
              '&:hover': { backgroundColor: '#b91c1c' },
            }}
            disabled={loading}
          >
            CANCEL
          </Button>
          {isParent ? ( // Parent rows: Show "SUBMIT ALL FUTURE BOOKINGS" instead of "SUBMIT"
            <>
              <Button
                onClick={() => handleAmendSubmit(false)} // Individual submit (though typically not used for parent)
                sx={{
                  backgroundColor: 'gray',
                  color: 'white',
                  padding: '8px 24px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  display: 'none', // Hide this button for parent rows, as it’s not needed
                }}
                disabled={loading}
              >
                SUBMIT
              </Button>
              <Button
                onClick={() => {
                  if (window.confirm('Are you sure you want to submit all future bookings?')) {
                    handleAmendSubmit(true); // Set block = true for "SUBMIT ALL FUTURE BOOKINGS"
                  }
                }}
                sx={{
                  backgroundColor: '#0ea5e9', // Blue for SUBMIT ALL FUTURE BOOKINGS
                  color: 'white',
                  padding: '8px 24px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  '&:hover': { backgroundColor: '#0284c7' },
                }}
                disabled={loading}
              >
                SUBMIT ALL FUTURE BOOKINGS
              </Button>
            </>
          ) : ( // Child rows: Show only "SUBMIT"
            <Button
              onClick={() => handleAmendSubmit(false)} // Set block = false for individual amend
              sx={{
                backgroundColor: 'gray',
                color: 'white',
                padding: '8px 24px',
                fontWeight: 'bold',
                borderRadius: '8px',
                textTransform: 'uppercase',
                '&:hover': { backgroundColor: '#757575' },
              }}
              disabled={loading}
            >
              SUBMIT
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Cancel Booking Modal - Unchanged (keeping previous design as per your last request) */}
      
<Dialog
  open={openCancelModal}
  onClose={() => setOpenCancelModal(false)}
  maxWidth='sm'
  fullWidth
  sx={{
    '& .MuiDialog-paper': {
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: '#dc2626',
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      padding: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    Cancel Booking
    <IconButton onClick={() => setOpenCancelModal(false)} sx={{ color: 'white' }}>
      <span style={{ fontSize: '24px', lineHeight: '1' }}>×</span>
    </IconButton>
  </DialogTitle>
  <DialogContent sx={{ textAlign: 'center', padding: '24px', backgroundContent: '#f5f5f5' }}>
    <Box sx={{ color: '#d32f2f', mb: 2, display: 'flex', justifyContent: 'center' }}>
      <span style={{ fontSize: '16px' }}>⚠</span>
    </Box>
    <p>
      Are you sure you want to submit a cancellation request for: <strong>{row.passengerName || 'Unknown Passenger'}</strong>?
    </p>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', padding: '16px', backgroundColor: '#f5f5f5' }}>
    {isParent ? (
      // Parent rows: Only "Cancel This and Future Bookings" and Close
      <Button
        onClick={() => {
          if (window.confirm('Are you sure you want to cancel this and future bookings?')) {
            handleCancelSubmit(true); // Set block = true for "Cancel This and Future Bookings"
          }
        }}
        sx={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '8px 24px',
          fontWeight: 'bold',
          borderRadius: '8px',
          textTransform: 'capitalize',
          '&:hover': { backgroundColor: '#b91c1c' },
        }}
        disabled={loading}
      >
        Cancel This and Future Bookings
      </Button>
    ) : (
      // Child rows: "Cancel This Booking Only" with confirmation
      <Button
        onClick={() => {
          if (window.confirm('Are you sure you want to cancel this booking only?')) {
            handleCancelSubmit(false); // Set block = false for "Cancel This Booking Only"
          }
        }}
        sx={{
          backgroundColor: 'gray',
          color: 'white',
          padding: '8px 24px',
          fontWeight: 'bold',
          borderRadius: '8px',
          textTransform: 'capitalize',
          '&:hover': { backgroundColor: '#757575' },
        }}
        disabled={loading}
      >
        Cancel This Booking Only
      </Button>
    )}
  </DialogActions>
</Dialog>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
};

const ActiveBooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeBookings, loading } = useSelector(
    (state) => state.activebookings
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'bookingId',
    direction: 'desc',
  });
  const [openGroups, setOpenGroups] = useState({}); // State to track which groups are open/closed

  const handleSort = (key) => {
    let direction = 'desc'; // Default sorting direction

    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }

    setSortConfig({ key, direction });
  };

  // Filter bookings based on search term across multiple fields
  const filteredBookings = useMemo(() => {
    return activeBookings.filter((booking) => {
      const searchableFields = [
        'passengerName',
        'pickupAddress',
        'destinationAddress',
        'bookingId',
      ];
      return searchableFields.some((field) =>
        String(booking[field] || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [activeBookings, searchTerm]); // Recomputes only when searchTerm or activeBookings change

  const sortedBookings = useMemo(() => {
    if (!sortConfig.key) return filteredBookings;
    return [...filteredBookings].sort((a, b) => {
      const valA = a[sortConfig.key] || '';
      const valB = b[sortConfig.key] || '';

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortConfig]);

  // Debounce search input to avoid excessive re-renders while typing
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  // Fetch active bookings when component mounts
  useEffect(() => {
    dispatch(fetchActiveBookings());
  }, [dispatch]);

  // Group bookings by passengerName to get unique parent rows
  const groupedBookings = useMemo(() => {
    const groups = {};
    sortedBookings.forEach((booking) => {
      const key = booking.passengerName; // Group by passengerName
      if (key && !groups[key]) { // Ensure passengerName exists and avoid duplicates
        groups[key] = booking; // Store only the first booking (parent) for each passenger
      }
    });
    return groups;
  }, [sortedBookings]);

  // Pagination logic based on unique parent rows (grouped by passengerName), with fallback for empty data
  const totalFilteredBookings = Object.keys(groupedBookings).length || 0; // Count of unique parent rows, default to 0 if none
  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalFilteredBookings);
  const paginatedParentBookings = Object.values(groupedBookings).slice(startIndex, endIndex); // Slice for current page of parent rows

  // Group paginated parent bookings for rendering, including child rows
  const paginatedBookings = useMemo(() => {
    if (totalFilteredBookings === 0) return {}; // Return empty if no parent rows
    const finalGroups = {};
    paginatedParentBookings.forEach((parentBooking) => {
      const key = parentBooking.passengerName;
      finalGroups[key] = sortedBookings.filter(booking => booking.passengerName === key);
    });
    return finalGroups;
  }, [paginatedParentBookings, sortedBookings, totalFilteredBookings]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] })); // Toggle group expansion
  };

  // Reset page to 0 when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <div className='bg-white max-h-full overflow-auto'>
      <Header />
      <div className='bg-white pt-10 sm:mx-16 p-4 flex flex-col items-center min-h-[500px] sm:min-h-screen'>
        <div className='flex flex-col sm:flex-row sm:justify-center w-full mb-4 gap-3'>
          <button
            onClick={() => navigate('/')}
            className='px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition flex items-center justify-center'
          >
            <TiArrowBack className='mr-2' />
            <span className='font-medium'>Back</span>
          </button>

          <TextField
            label='Search...'
            variant='outlined'
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearchChange(e.target.value); // Trigger debounced search
            }}
            size='small'
            sx={{ width: '100%', maxWidth: '350px' }}
          />
        </div>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#545454' }}>
                  <TableCell />
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderBottom: 'none', // Removes white line under header
                    }}
                    onClick={() => handleSort('bookingId')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Booking ID
                      {sortConfig.key === 'bookingId' && (
                        <span style={{ marginLeft: '8px' }}>
                          {sortConfig.direction === 'asc' ? (
                            <FaArrowUp />
                          ) : (
                            <FaArrowDown />
                          )}
                        </span>
                      )}
                    </span>
                  </TableCell>

                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderBottom: 'none', // Removes white line under header
                    }}
                    onClick={() => handleSort('dateTime')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Date & Time{' '}
                      {sortConfig.key === 'dateTime' ? (
                        sortConfig.direction === 'asc' ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </TableCell>

                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderBottom: 'none', // Removes white line under header
                    }}
                    onClick={() => handleSort('passengerName')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Passenger{' '}
                      {sortConfig.key === 'passengerName' ? (
                        sortConfig.direction === 'asc' ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderBottom: 'none', // Removes white line under header
                    }}
                    onClick={() => handleSort('pickupAddress')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Pickup Address{' '}
                      {sortConfig.key === 'pickupAddress' ? (
                        sortConfig.direction === 'asc' ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderBottom: 'none', // Removes white line under header
                    }}
                    onClick={() => handleSort('destinationAddress')}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      Destination{' '}
                      {sortConfig.key === 'destinationAddress' ? (
                        sortConfig.direction === 'asc' ? (
                          <FaArrowUp />
                        ) : (
                          <FaArrowDown />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </TableCell>

                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.keys(paginatedBookings).length > 0 ? (
                  Object.keys(paginatedBookings).map((groupId) => {
                    const bookings = paginatedBookings[groupId];
                    const firstBooking = bookings[0];

                    return (
                      <React.Fragment key={groupId}>
                        <Row
                          row={firstBooking}
                          isParent={bookings.length > 1}
                          isOpen={!!openGroups[groupId]}
                          toggleGroup={toggleGroup}
                        />
                        {openGroups[groupId] &&
                          bookings.slice(1).map((booking) => (
                            <Row
                              key={booking.bookingId}
                              row={booking}
                            />
                          ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ textAlign: 'center' }}
                    >
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination Controls - Based on unique parent rows */}
        <div className='flex flex-col md:flex-row justify-between items-center mt-4 gap-2 w-full'>
          {/* Rows Per Page Selector */}
          <div className='flex items-center gap-2'>
            <label
              htmlFor='rowsPerPage'
              className='text-sm md:text-base text-black font-medium'
            >
              Rows:
            </label>
            <select
              id='rowsPerPage'
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className='px-2 py-1 text-sm border border-gray-300 bg-white text-black rounded-md focus:outline-none hover:bg-red-50'
            >
              <option value={20}>20</option>
              <option value={40}>40</option>
              <option value={80}>80</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          {/* Pagination Navigation */}
          <div className='flex items-center gap-2'>
            <button
              disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className={`px-3 py-1 text-sm md:text-base text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition ${
                page === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Prev
            </button>

            <p className='text-sm md:text-base'>
              {startIndex + 1} - {endIndex} of {totalFilteredBookings || 1} {/* Fallback to 1 if no bookings */}
            </p>

            <button
              disabled={endIndex >= totalFilteredBookings}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-1 text-sm md:text-base text-white bg-[#b91c1c] rounded-md hover:bg-red-700 transition ${
                endIndex >= totalFilteredBookings ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveBooking;