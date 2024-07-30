import mqtt from 'mqtt';

const connectToMqtt = (topic, onMessageCallback) => {
  const brokerUrl = 'ws://49.0.194.114:8083'; // Replace with your MQTT broker URL and correct WebSocket port
  const client = mqtt.connect(brokerUrl);

  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err);
      } else {
        console.log(`Subscribed to topic ${topic}`);
      }
    });
  });

  client.on('message', (topic, message) => {
    console.log('Message received:', message.toString()); // Debugging log
    onMessageCallback(message.toString());
  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });

  return client;
};

export default connectToMqtt;
