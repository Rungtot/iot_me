const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const { InfluxDB, flux } = require('@influxdata/influxdb-client');

const app = express();
const port = 4052;

app.use(bodyParser.json());
app.use(cors());

const lineNotifyToken = 'K0JwjYZU3BcATbQ4qtXXLb4jkDkAJPBZgOYNDDeN11f';
let timeThreshold = null; // Default time threshold set to null
let exceedNotificationSent = false; // Status to track notification

const influxDB = new InfluxDB({
  url: 'http://49.0.194.114:8086', // URL ของ InfluxDB ของคุณ
  token: 'yMB7SHcZ2zPGUPK1fAOcRQIY3ZWMe_Ubj19vW_xc2SMVdIWVRiz9_EBN-ckcqECg_lO5XfNSQ4bewWnhAN0YDQ==' // ใส่ token ของ InfluxDB ของคุณ
});

const queryApi = influxDB.getQueryApi('06157c6bc44c7163'); // ใส่ชื่อองค์กรของคุณ

const sendLineNotification = async (message) => {
  try {
    const response = await axios.post('https://notify-api.line.me/api/notify', `message=${message}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineNotifyToken}`,
      },
    });

    if (response.data.status === 200) {
      console.log('Notification sent successfully!');
    } else {
      console.log(`Failed to send notification: ${response.data.message}`);
    }
  } catch (error) {
    console.error('Error sending LINE notification:', error);
  }
};

const checkTime = async () => {
  if (timeThreshold === null) {
    console.log('Time threshold is not set.');
    return;
  }

  const fluxQuery = flux`from(bucket: "Room3")
                         |> range(start: -1h)
                         |> filter(fn: (r) => r._measurement == "Timer_motor1_onroom3")
                         |> filter(fn: (r) => r._field == "hours")
                         |> last()`;
  try {
    const data = await queryApi.collectRows(fluxQuery);
    if (data.length > 0) {
      const value = parseFloat(data[0]._value);
      console.log(`Received time: ${value}`);

      if (value > timeThreshold) {
        if (!exceedNotificationSent) {
          const notifyMessage = `แจ้งเตือน!!!มอเตอร์ ทำงานถึงเวลาตามที่กำหนด: ${timeThreshold} ชั่วโมง`;
          sendLineNotification(notifyMessage);
          exceedNotificationSent = true;
        }
      } else {
        exceedNotificationSent = false; // Reset notification status if value is below threshold
      }
    }
  } catch (error) {
    console.error('Error querying InfluxDB:', error);
  }
};

app.post('/send-notification', async (req, res) => {
  const { message } = req.body;
  await sendLineNotification(message);
  res.json({ message: 'Notification request sent.' });
});

app.post('/set-threshold', (req, res) => {
  timeThreshold = req.body.threshold;
  res.json({ message: `Time threshold set to ${timeThreshold}` });
});

app.get('/get-threshold', (req, res) => {
  res.json({ threshold: timeThreshold });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  // เรียกใช้งานฟังก์ชันตรวจสอบเวลาทุก ๆ 10 วินาที
  setInterval(checkTime, 10000);
});
