import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import GaugeChart from 'react-gauge-chart';
import { Line } from 'react-chartjs-2';
import { fetchDataFromInfluxDB } from './InfluxDBClient';

const Dashboard2 = () => {
  const [temperature, setTemperature] = useState(0);
  const [history, setHistory] = useState([]);

  const fetchLatestTemperature = async () => {
    const query = `
      from(bucket: "Room2")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "temp2")
        |> filter(fn: (r) => r._field == "value")
        |> last()
    `;
    try {
      const data = await fetchDataFromInfluxDB(query);
      console.log('Latest Temperature Data:', data); // Add logging
      if (data.length > 0) {
        setTemperature(data[0]._value);
      }
    } catch (error) {
      console.error('Error fetching latest temperature:', error);
    }
  };

  const fetchTemperatureHistory = async () => {
    const query = `
      from(bucket: "Room2")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "temp2")
        |> filter(fn: (r) => r._field == "value")
    `;
    try {
      const data = await fetchDataFromInfluxDB(query);
      console.log('Temperature History Data:', data); // Add logging
      if (data.length > 0) {
        setHistory(data.map(d => ({
          time: new Date(d._time).toLocaleTimeString(),
          temp: d._value,
        })));
      }
    } catch (error) {
      console.error('Error fetching temperature history:', error);
    }
  };

  useEffect(() => {
    fetchLatestTemperature();
    fetchTemperatureHistory();
    const intervalId = setInterval(() => {
      fetchLatestTemperature();
      fetchTemperatureHistory();
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: history.map(d => d.time),
    datasets: [
      {
        label: 'Temperature',
        data: history.map(d => d.temp),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature',
        },
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Realtime Data Dashboard
      </Typography>
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
            <Typography variant="h6">Realtime Temperature</Typography>
            <GaugeChart
              id="gauge-chart"
              nrOfLevels={20}
              percent={temperature / 100}
              textColor="#FFFFFF"
              formatTextValue={(value) => `${temperature}°C`}
            />
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
            <Typography variant="h6">Temperature History</Typography>
            {history.length > 0 ? (
              <div style={{ width: '100%', height: 200 }}>
                <Line data={chartData} options={options} />
              </div>
            ) : (
              <Typography variant="body1">No data available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard2;
