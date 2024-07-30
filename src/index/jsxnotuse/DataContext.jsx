// src/DataContext.js
import React, { createContext, useState } from 'react';
import { InfluxDB } from '@influxdata/influxdb-client';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const token = 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==';
    const org = '06157c6bc44c7163';
    const url = 'http://49.0.194.114:8086';
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

    const fetchData = async (bucket, measurement, field) => {
        const query = `
            from(bucket: "${bucket}")
            |> range(start: -1h)
            |> filter(fn: (r) => r._measurement == "${measurement}")
            |> filter(fn: (r) => r._field == "${field}")
            |> last()
        `;
        const result = await queryApi.collectRows(query);
        const formattedData = result.map(item => ({
            time: item._time,
            value: item._value
        }));
        setData(formattedData);
    };

    return (
        <DataContext.Provider value={{ data, fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext, DataProvider };
