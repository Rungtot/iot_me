import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Collapse,
  TextField
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon,
  Room as RoomIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const AlarmSettingsroom2 = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPlanA, setOpenPlanA] = useState(false);
  const [openPlanB, setOpenPlanB] = useState(false);
  const [threshold, setThreshold] = useState(null);
  const [currentThreshold, setCurrentThreshold] = useState(null);
  const [timeThreshold, setTimeThreshold] = useState(null);
  const [currentTimeThreshold, setCurrentTimeThreshold] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current temperature threshold from the server when the component loads
    fetch('http://localhost:4001/get-threshold')
      .then(response => response.json())
      .then(data => {
        setCurrentThreshold(data.threshold);
      })
      .catch(error => {
        console.error('Error fetching threshold:', error);
      });

    // Fetch the current time threshold from the server when the component loads
    fetch('http://localhost:4051/get-threshold')
      .then(response => response.json())
      .then(data => {
        setCurrentTimeThreshold(data.threshold);
      })
      .catch(error => {
        console.error('Error fetching time threshold:', error);
      });

    // Update real-time clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePlanAClick = () => {
    setOpenPlanA(!openPlanA);
  };

  const handlePlanBClick = () => {
    setOpenPlanB(!openPlanB);
  };

  const handleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };

  const handleTimeThresholdChange = (event) => {
    setTimeThreshold(event.target.value);
  };

  const handleSaveSettings = () => {
    console.log('Saving settings with threshold:', threshold);
    fetch('http://localhost:4001/set-threshold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threshold }),
    })
      .then(response => response.json())
      .then(data => {
        setCurrentThreshold(threshold); // Update the current threshold state
      })
      .catch(error => {
        console.error('Error setting threshold:', error);
      });
  };

  const handleSaveTimeSettings = () => {
    console.log('Saving settings with time threshold:', timeThreshold);
    fetch('http://localhost:4051/set-threshold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threshold: timeThreshold }),
    })
      .then(response => response.json())
      .then(data => {
        setCurrentTimeThreshold(timeThreshold); // Update the current time threshold state
      })
      .catch(error => {
        console.error('Error setting time threshold:', error);
      });
  };

  const sendLineNotification = (message) => {
    console.log('Sending notification with message:', message);
    fetch('http://localhost:4001/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Notification sent:', data.message);
      })
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  };

  const handleTestAlarm = () => {
    const testMessage = `ทดสอบการแจ้งเตือน: การตั้งค่าอุณหภูมิ.`;
    sendLineNotification(testMessage);
  };

  const handleTestTimeAlarm = () => {
    const testMessage = `ทดสอบการแจ้งเตือน: การตั้งค่าเวลาการทำงานมอเตอร์.`;
    sendLineNotification(testMessage);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    const [day, month, yearAndTime] = formattedDate.split('/');
    const [year, time] = yearAndTime.split(', ');
    const buddhistYear = (parseInt(year) + 543).toString();
    return `${day}/${month}/${buddhistYear} ${time}`;
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button onClick={handlePlanAClick}>
          <ListItemText primary="Dashboard" />
          {openPlanA ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openPlanA} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/Dashboard">
              <ListItemIcon>
                <RoomIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText primary="factory1" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={handlePlanBClick}>
          <ListItemText primary="Alarm" />
          {openPlanB ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openPlanB} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/alarm-setting-room1">
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary="Room 1" />
            </ListItem>
            <ListItem button component={Link} to="/alarm-setting-room2">
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary="Room 2" />
            </ListItem>
            <ListItem button component={Link} to="/alarm-setting-room3">
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary="Room 3" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to="/login">
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Alarm Settings Room 2
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6" noWrap>
            {formatDate(currentTime)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
        }}
      >
        <Toolbar />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Temp Alarm Settings
                </Typography>
                <TextField
                  label="Temperature Threshold (°C)"
                  value={threshold !== null ? threshold : ''}
                  onChange={handleThresholdChange}
                  margin="normal"
                  fullWidth
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleTestAlarm}
                  >
                    Test Alarm
                  </Button>
                </Box>
                {currentThreshold !== null && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Current Temperature Threshold:</Typography>
                    <Typography variant="body1">{currentThreshold}°C</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Time Alarm Settings
                </Typography>
                <TextField
                  label="Time Threshold (hours)"
                  value={timeThreshold !== null ? timeThreshold : ''}
                  onChange={handleTimeThresholdChange}
                  margin="normal"
                  fullWidth
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveTimeSettings}
                  >
                    Save Time Settings
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleTestTimeAlarm}
                  >
                    Test Time Alarm
                  </Button>
                </Box>
                {currentTimeThreshold !== null && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Current Time Threshold:</Typography>
                    <Typography variant="body1">{currentTimeThreshold} hours</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default AlarmSettingsroom2;
