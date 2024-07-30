import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './index/Dashboard';
import Login from './index/Login';
import GaugePage from './index/GaugePage';
import NewPage from './index/NewPage';
import SimulatedGraph from './index/SimulatedGraph';
import NewGraphPage from './index/jsxnotuse/NewGraphPage';
import RealtimeGauge from './index/jsxnotuse/RealtimeGauge';
import Dashboard2 from './index2/Dashboard'
import AlarmSettingsroom1 from './index/alarm/Alarmroom1';
import AlarmSettingsroom2 from './index/alarm/Alarmroom2';
import AlarmSettingsroom3 from './index/alarm/Alarmroom3';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gauge" element={<GaugePage />} />
        <Route path="/newpage" element={<NewPage />} />
        <Route path="/simulatedgraph" element={<SimulatedGraph />} />
        <Route path="/simulatedgraph2" element={<NewGraphPage />} />
        <Route path="/simulatedgraph3" element={<RealtimeGauge />} />
        <Route path="/simulatedgraph4" element={<Dashboard2 />} />
        <Route path="/alarm-setting-room1" element={<AlarmSettingsroom1 />} />
        <Route path="/alarm-setting-room2" element={<AlarmSettingsroom2 />} />
        <Route path="/alarm-setting-room3" element={<AlarmSettingsroom3 />} />
      </Routes>
    </Router>
  );
}

export default App;
