// src/RealTimePage.js
import React, { useContext, useEffect } from 'react';
import { DataContext } from './DataContext';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const RealTimePage = () => {
    const { data, fetchData } = useContext(DataContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { bucket, measurement, field } = location.state;

    useEffect(() => {
        fetchData(bucket, measurement, field);
    }, [bucket, measurement, field, fetchData]);

    return (
        <Container>
            <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
            <Typography variant="h4">Real-Time Data</Typography>
            <Box>
                {data.map((item, index) => (
                    <Typography key={index} variant="body1">
                        Time: {item.time}, Value: {item.value}
                    </Typography>
                ))}
            </Box>
        </Container>
    );
};

export default RealTimePage;
