import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid } from '@mui/material';
import { fetchTemperatureData, testInfluxConnection } from './jsxnotuse/influxClient';
import GaugeChart from './jsxnotuse/GaugeChart';
import LineChartComponent from './jsxnotuse/LineChartComponent';

const GaugePage = () => {
  const [temperature, setTemperature] = useState(25);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await testInfluxConnection();
        const data = await fetchTemperatureData();
        console.log('Fetched data from InfluxDB:', data); // Debugging log
        if (data.length > 0) {
          const latestTemperature = data[data.length - 1].temperature;
          console.log('Latest temperature:', latestTemperature); // Debugging log
          setTemperature(latestTemperature);
          setHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch data from InfluxDB', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
            }}
          >
            <Typography variant="h6">Realtime</Typography>
            <GaugeChart value={temperature} label="°C" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
            }}
          >
            <Typography variant="h6">History</Typography>
            <LineChartComponent data={history} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GaugePage;
