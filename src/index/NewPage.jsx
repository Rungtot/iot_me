import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Fab, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { InfluxDB } from '@influxdata/influxdb-client';
import motoroff from './picture/motoroff.jpg';
import motoron from './picture/motoron.jpg';

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

const NewPage = () => {
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

    const handleBackClick = () => {
        navigate('/dashboard');
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

    return (
        <div style={{ height: "100vh", overflow: "hidden", display: "flex", justifyContent: 'center' }}>
            <AppBar position="fixed" sx={{ height: 40, justifyContent: 'center' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        Building Plan A
                    </Typography>
                    <Typography variant="h6" className="digital-font" sx={{ marginLeft: 'auto', marginRight: 2 }}>
                        {formatDate(currentTime)}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar sx={{ height: 40 }} />
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="http://www.coldplan.co.uk/wp-content/uploads/2018/06/d1-1.png" alt="Building Plan" style={{ height: '100%', justifyContent: 'center' }} />
                <Fab
                    color="primary"
                    aria-label="sensor"
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '20%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                    }}
                    onClick={handleFabClick1}
                >
                    <Typography variant="h6" className="digital-font" sx={{ color: 'white' }}>
                        {temperatures.Room1}°C
                    </Typography>
                </Fab>
                <Fab
                    color="primary"
                    aria-label="sensor"
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '45%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                    }}
                    onClick={handleFabClick2}
                >
                    <Typography variant="h6" className="digital-font" sx={{ color: 'white' }}>
                        {temperatures.Room2}°C
                    </Typography>
                </Fab>
                <Fab
                    color="primary"
                    aria-label="sensor"
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '72%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                    }}
                    onClick={handleFabClick3}
                >
                    <Typography variant="h6" className="digital-font" sx={{ color: 'white' }}>
                        {temperatures.Room3}°C
                    </Typography>
                </Fab>
                {/* Room1 */}
                <Box sx={{ position: 'absolute', top: '50%', left: '28%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                        src={motorStatuses.Room1 === 1 ? motoron : motoroff} 
                        alt="Motor Status Room1" 
                        style={{ width: 60, height: 60 }} 
                    />
                </Box>
                <Box sx={{ position: 'absolute', top: '60%', left: '20%', padding: 2, backgroundColor: 'white', border: '1px solid black', borderRadius: 4 }}>
                    <Typography variant="h6" className="digital-font" sx={{ color: 'black' }}>
                        {timeStrings.Room1}
                    </Typography>
                </Box>
                {/* Room2 */}
                <Box sx={{ position: 'absolute', top: '50%', left: '36%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                        src={motorStatuses.Room2 === 1 ? motoron : motoroff} 
                        alt="Motor Status Room2" 
                        style={{ width: 60, height: 60 }} 
                    />
                </Box>
                <Box sx={{ position: 'absolute', top: '60%', left: '45%', padding: 2, backgroundColor: 'white', border: '1px solid black', borderRadius: 4 }}>
                    <Typography variant="h6" className="digital-font" sx={{ color: 'black' }}>
                        {timeStrings.Room2}
                    </Typography>
                </Box>
                {/* Room3 */}
                <Box sx={{ position: 'absolute', top: '50%', left: '86%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                        src={motorStatuses.Room3 === 1 ? motoron : motoroff} 
                        alt="Motor Status Room3" 
                        style={{ width: 60, height: 60 }} 
                    />
                </Box>
                <Box sx={{ position: 'absolute', top: '60%', left: '85%', padding: 2, backgroundColor: 'white', border: '1px solid black', borderRadius: 4 }}>
                    <Typography variant="h6" className="digital-font" sx={{ color: 'black' }}>
                        {timeStrings.Room3}
                    </Typography>
                </Box>
            </Box>
        </div>
    );
};

export default NewPage;
