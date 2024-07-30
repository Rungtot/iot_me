import React, { useEffect, useState } from 'react';
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
  Fab,
  Collapse,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  ExpandLess,
  ExpandMore,
  Notifications as NotificationsIcon,
  Room as RoomIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import BuildingPlan from './BuildingPlan';
import { InfluxDB } from '@influxdata/influxdb-client';
import motoroff from './picture/motoroff.jpg';
import motoron from './picture/motoron.jpg';

import NewPage from './NewPage'

const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
const org = '06157c6bc44c7163';
const buckets = [
  { name: 'Room1', measurement: 'status_motor1_room1', field: 'value_boolean', timeMeasurement: 'Timer_motor1_on1.4', timeField: 'timemotor1room1', tempMeasurement: 'temp', tempField: 'value' },
  { name: 'Room2', measurement: 'status_motor1_room2', field: 'value_boolean', timeMeasurement: 'Timer_motor1_onroom2', timeField: 'timemotor1room2', tempMeasurement: 'temp2', tempField: 'value' },
  { name: 'Room3', measurement: 'status_motor1_room3', field: 'value_boolean', timeMeasurement: 'Timer_motor1_onroom3', timeField: 'timemotor1room3', tempMeasurement: 'temp3', tempField: 'value' },
];
const url = 'http://49.0.194.114:8086';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

const fetchMotorStatus = async (bucket, measurement, field) => {
  const query = `
        from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => r._field == "${field}")
        |> last()
    `;
  const data = await queryApi.collectRows(query);
  return data.length ? data[0]._value : null;
};

const fetchTimeString = async (bucket, measurement, field) => {
  const query = `
        from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => r._field == "${field}")
        |> last()
    `;
  const data = await queryApi.collectRows(query);
  return data.length ? data[0]._value : '00:00:00';
};

const fetchTemperature = async (bucket, measurement, field) => {
  const query = `
        from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => r._field == "${field}")
        |> last()
    `;
  const data = await queryApi.collectRows(query);
  return data.length ? data[0]._value : null;
};

const drawerWidth = 240;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPlanA, setOpenPlanA] = useState(false); // State for collapsing Plan A
  const [openPlanB, setOpenPlanB] = useState(false); // State for collapsing Plan B
  const navigate = useNavigate();
  const [motorStatuses, setMotorStatuses] = useState({});
  const [timeStrings, setTimeStrings] = useState({});
  const [temperatures, setTemperatures] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const statusPromises = buckets.map(bucket =>
        fetchMotorStatus(bucket.name, bucket.measurement, bucket.field)
      );
      const timePromises = buckets.map(bucket =>
        fetchTimeString(bucket.name, bucket.timeMeasurement, bucket.timeField)
      );
      const tempPromises = buckets.map(bucket =>
        fetchTemperature(bucket.name, bucket.tempMeasurement, bucket.tempField)
      );

      const statuses = await Promise.all(statusPromises);
      const times = await Promise.all(timePromises);
      const temps = await Promise.all(tempPromises);

      const statusObj = buckets.reduce((acc, bucket, index) => {
        acc[bucket.name] = statuses[index];
        return acc;
      }, {});

      const timeObj = buckets.reduce((acc, bucket, index) => {
        acc[bucket.name] = times[index];
        return acc;
      }, {});

      const tempObj = buckets.reduce((acc, bucket, index) => {
        acc[bucket.name] = temps[index];
        return acc;
      }, {});

      setMotorStatuses(statusObj);
      setTimeStrings(timeObj);
      setTemperatures(tempObj);
    };

    fetchData();

    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the time every second

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePlanAClick = () => {
    setOpenPlanA(!openPlanA); // Toggle collapse for Plan A
  };

  const handlePlanBClick = () => {
    setOpenPlanB(!openPlanB); // Toggle collapse for Plan B
  };

  const handleFabClick = () => {
    navigate('/gauge'); // Change to your desired route
  };

  const handleButtonClick = () => {
    navigate('/newpage'); // Change to your desired route
  };

  const handleFabClick1 = () => {
    window.location.href = 'http://49.0.194.114:4000/public-dashboards/630318dfd2754a388a5846e8607d96d0?orgId=1&refresh=5s&from=now-5m&to=now';
  };

  const handleFabClick2 = () => {
    window.location.href = 'http://49.0.194.114:4000/public-dashboards/54aa7e5072804eecb19a8ba18090dcd7?orgId=1&refresh=5s&from=now-5m&to=now';
  };

  const handleFabClick3 = () => {
    window.location.href = 'http://49.0.194.114:4000/public-dashboards/081644ba3b5d40c690c5d0b093c6f618?orgId=1&refresh=5s&from=now-5m&to=now';
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
                <RoomIcon color={motorStatuses.Room1 === 1 ? 'primary' : 'secondary'} />
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
    <>
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
            Dashboard
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12} position="relative">
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '70%' }}>
                <Typography variant="h6">Building Plan</Typography>
                <NewPage/>
              </Paper>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleButtonClick}
                  sx={{ width: '200px', height: '50px' }}
                >
                  Building Plan A
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>




      </Box>
    </>
  );
};

export default Dashboard;