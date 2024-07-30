import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Grid, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { InfluxDB } from '@influxdata/influxdb-client';
import 'chart.js/auto';

const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
const org = '06157c6bc44c7163';
const bucket = 'Room2';
const url = 'http://49.0.194.114:8086';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

const fetchDataFromInfluxDB = async () => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "temp2")
      |> filter(fn: (r) => r._field == "value")
  `;
  console.log("Executing query:", query); // Debug query

  const data = [];
  await queryApi.queryRows(query, {
    next: (row, tableMeta) => {
      const o = tableMeta.toObject(row);
      console.log("Row Data:", o); // Debugging log
      data.push({
        time: new Date(o._time).toLocaleTimeString(),
        value: o._value,
      });
    },
    error: (error) => {
      console.error('Error while fetching data:', error);
      console.log('Finished ERROR');
    },
    complete: () => {
      console.log('Finished SUCCESS');
    },
  });
  console.log("Fetched Data:", data); // Debug fetched data
  return data;
};

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [refreshRate, setRefreshRate] = useState(5000);

  const handleRefresh = async () => {
    const influxData = await fetchDataFromInfluxDB();
    console.log("Fetched Data After Refresh:", influxData); // Debug fetched data after refresh
    setData(influxData);
  };

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate]);

  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        label: 'Value',
        data: data.map(d => d.value),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  console.log("Chart Data:", chartData); // Debug chart data

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
          text: 'Value',
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
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Realtime Data Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Select Refresh Rate</Typography>
            <FormControl fullWidth>
              <InputLabel id="refresh-rate-label">Refresh Rate</InputLabel>
              <Select
                labelId="refresh-rate-label"
                value={refreshRate}
                label="Refresh Rate"
                onChange={(e) => setRefreshRate(e.target.value)}
              >
                <MenuItem value={1000}>1 Second</MenuItem>
                <MenuItem value={5000}>5 Seconds</MenuItem>
                <MenuItem value={10000}>10 Seconds</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <div style={{ width: '100%', height: 400 }}>
              <Line data={chartData} options={options} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
