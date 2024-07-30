import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Container, Typography, Grid } from '@mui/material';
import { InfluxDB } from '@influxdata/influxdb-client';

const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
const org = '06157c6bc44c7163';
const bucket = 'Room2';
const url = 'http://49.0.194.114:8086';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

const fetchDataFromInfluxDB = async () => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "temp2")
      |> filter(fn: (r) => r._field == "value")
  `;
  const data = [];
  await queryApi.queryRows(query, {
    next: (row, tableMeta) => {
      const o = tableMeta.toObject(row);
      data.push({
        time: new Date(o._time).toLocaleTimeString(),
        temp: o._value,
      });
    },
    error: (error) => {
      console.error(error);
      console.log('Finished ERROR');
    },
    complete: () => {
      console.log('Finished SUCCESS');
    },
  });
  return data;
};

const SimulatedGraph = () => {
  const [data, setData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

  const handleRefresh = async () => {
    const influxData = await fetchDataFromInfluxDB();
    setData(influxData);
    setLastRefresh(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h6">Realtime</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleRefresh} fullWidth>
            Refresh Data
          </Button>
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Last refreshed: {lastRefresh}
      </Typography>
      <div style={{ width: '100%', height: 400 }}>
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" />
        </LineChart>
      </div>
    </Container>
  );
};

export default SimulatedGraph;
