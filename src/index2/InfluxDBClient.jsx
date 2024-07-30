import { InfluxDB } from '@influxdata/influxdb-client';

const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
const org = '06157c6bc44c7163';
const bucket = 'Room2';
const url = 'http://49.0.194.114:8086';

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

export const fetchDataFromInfluxDB = async (query) => {
  const data = [];
  await queryApi.queryRows(query, {
    next: (row, tableMeta) => {
      const o = tableMeta.toObject(row);
      data.push(o);
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
