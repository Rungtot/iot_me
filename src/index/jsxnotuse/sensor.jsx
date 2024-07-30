import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';

const drawerWidth = 240;

const Sensor = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/sensor">
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Sensor" />
        </ListItem>
        <ListItem button component={Link} to="/Login">
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
            Sensor
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
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">Sensor</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Typography variant="body1">Temperature</Typography>
                <Typography variant="h4">+19.4 °C</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body1">Humidity</Typography>
                <Typography variant="h4">53.5%</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <BatteryFullIcon sx={{ fontSize: 50 }} />
                <Typography variant="body1">Battery</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <SignalCellular4BarIcon sx={{ fontSize: 50 }} />
                <Typography variant="body1">Signal Quality</Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Information</Typography>
              <Typography variant="body2">
                Sensor: 80000178 <br />
                Settings: +3 °C...+25 °C, 30%...60%, 20 min <br />
                Location: SensGuard Monitoring System Demo <br />
                Collector: SensGuard TCP/IP Data Gateway (050006647) <br />
                Object: Pipe monitoring
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Notification history</Typography>
              <table>
                <thead>
                  <tr>
                    <th>Serial number</th>
                    <th>Date</th>
                    <th>Value</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>08000178</td>
                    <td>2018-09-24 07:05:00</td>
                    <td>+19.4 °C, 53.5%</td>
                    <td>Error (Temperature is outside of range and persisted longer than the specified time period).</td>
                  </tr>
                  <tr>
                    <td>08000178</td>
                    <td>2018-09-24 07:00:00</td>
                    <td>+19.4 °C, 53.5%</td>
                    <td>Error (Temperature is outside of range and persisted longer than the specified time period).</td>
                  </tr>
                  {/* Add more rows as needed */}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Sensor;
