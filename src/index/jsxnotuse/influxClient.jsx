// influxClient.js
import { InfluxDB } from '@influxdata/influxdb-client';

const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
const org = '06157c6bc44c7163';
const bucket = 'Room2';
const url = 'http://49.0.194.114:8086';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export const fetchTemperatureData = async () => {
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
        temperature: o._value,
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
  return data;
};

export const testInfluxConnection = async () => {
  try {
    await fetchTemperatureData();
    console.log('InfluxDB connection successful');
  } catch (error) {
    console.error('Failed to connect to InfluxDB', error);
    throw error;
  }
};
