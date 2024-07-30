import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { InfluxDB } from '@influxdata/influxdb-client';
import { Container, Typography } from '@mui/material';

const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
const org = '06157c6bc44c7163';
const bucket = 'Room2';
const url = 'http://49.0.194.114:8086';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

const fetchLatestTemperature = async () => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -5m)
      |> filter(fn: (r) => r._measurement == "temp2")
      |> filter(fn: (r) => r._field == "value")
      |> last()
  `;
  const data = [];
  await queryApi.queryRows(query, {
    next: (row, tableMeta) => {
      const o = tableMeta.toObject(row);
      data.push(o._value);
    },
    error: (error) => {
      console.error(error);
      console.log('Finished ERROR');
    },
    complete: () => {
      console.log('Finished SUCCESS');
    },
  });
  return data[0];
};

const RealtimeGauge = () => {
  const [temperature, setTemperature] = useState(0);

  const updateTemperature = async () => {
    const latestTemp = await fetchLatestTemperature();
    setTemperature(latestTemp);
  };

  useEffect(() => {
    updateTemperature();
    const intervalId = setInterval(updateTemperature, 5000); // Update every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h6">Realtime Temperature Gauge</Typography>
      <GaugeChart
        id="gauge-chart"
        nrOfLevels={20}
        percent={temperature / 100} // Assuming temperature ranges from 0 to 100
        textColor="#000000"
        formatTextValue={(value) => `${temperature}°C`}
      />
    </Container>
  );
};

export default RealtimeGauge;
