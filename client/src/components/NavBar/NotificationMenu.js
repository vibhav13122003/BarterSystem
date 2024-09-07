import * as React from 'react';
import { Box, Divider, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSocket } from '../../utils/SocketContext';

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]); // State to store notifications

  const user = useSelector(state => state.user.user); // Get user data from Redux
  const open = Boolean(anchorEl);
  const socket = useSocket(); // Access socket instance from context

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (socket && user) {
      // Register the user with their user_id to the socket
      socket.emit('register', user._id); // Send the user ID to the server

      // Listen for new bid notifications
      socket.on('newBid', (bid) => {
        console.log('Received new bid notification:', bid);
        setNotifications((prev) => [...prev, bid]);
      });

      return () => {
        socket.off('newBid');
      };
    }
  }, [socket, user]);

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Notifications">
          <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
            <div style={{ position: 'relative' }}>
              {notifications.length > 0 && (
                <div style={{
                  marginLeft: '80%',
                  position: 'absolute',
                  color: 'white',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  fontSize: '12px',
                  paddingInline: '.5vh',
                  paddingBlock: '.3vh'
                }}>
                  {notifications.length}
                </div>
              )}
              <NotificationsIcon style={{ color: "white", marginTop: '0vh', marginLeft: '2vh' }} />
            </div>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 80,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={index}>
              <MenuItem style={{ width: '450px' }}>
                <p style={{ fontSize: 11 }}>
                  New bid placed on product: {notification.product_id} <br />
                  Bid Amount: {notification.bid.worth} <br />
                  Bidder Email: {notification.bid.email}
                </p>
              </MenuItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
