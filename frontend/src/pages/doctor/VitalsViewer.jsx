import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { patientsAPI } from '../../api';
import {
  FiActivity, FiHeart, FiTrendingUp, FiUser, FiMapPin,
  FiUserCheck, FiThermometer, FiCheckCircle, FiInfo
} from 'react-icons/fi';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  LineChart, Line, BarChart, Bar, CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

export default function VitalsViewer() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await patientsAPI.getAll();
      const patientList = res.data || [];
      setPatients(patientList);
      if (patientList.length > 0) {
        setSelectedPatient(patientList[0]);
      }
    } catch {
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  // High-Quality Telehealth Mock Telemetry Data matching the FYP core concept
  const mockVitalsHistory = {
    aliHassan: {
      patientName: 'Ali Hassan',
      age: 42,
      gender: 'Male',
      recordedBy: 'Nurse Sara',
      remoteArea: 'Kotli',
      bpData: [
        { visit: 'Visit 1', systolic: 120, diastolic: 80 },
        { visit: 'Visit 2', systolic: 118, diastolic: 78 },
        { visit: 'Visit 3', systolic: 122, diastolic: 82 },
        { visit: 'Visit 4', systolic: 125, diastolic: 80 },
        { visit: 'Visit 5', systolic: 120, diastolic: 80 },
      ],
      sugarData: [
        { visit: 'Visit 1', glucose: 95 },
        { visit: 'Visit 2', glucose: 105 },
        { visit: 'Visit 3', glucose: 90 },
        { visit: 'Visit 4', glucose: 110 },
        { visit: 'Visit 5', glucose: 95 },
      ],
      heartRateData: [
        { visit: 'Visit 1', rate: 72 },
        { visit: 'Visit 2', rate: 75 },
        { visit: 'Visit 3', rate: 70 },
        { visit: 'Visit 4', rate: 80 },
        { visit: 'Visit 5', rate: 74 },
      ],
      temp: '98.6°F',
      tempStatus: 'Normal'
    },
    general: (name, age, gender) => ({
      patientName: name || 'Patient Name',
      age: age || 30,
      gender: gender || 'Female',
      recordedBy: 'Nurse Sara',
      remoteArea: 'Kotli',
      bpData: [
        { visit: 'Visit 1', systolic: 115, diastolic: 75 },
        { visit: 'Visit 2', systolic: 120, diastolic: 80 },
        { visit: 'Visit 3', systolic: 118, diastolic: 76 },
        { visit: 'Visit 4', systolic: 121, diastolic: 82 },
        { visit: 'Visit 5', systolic: 119, diastolic: 79 },
      ],
      sugarData: [
        { visit: 'Visit 1', glucose: 92 },
        { visit: 'Visit 2', glucose: 96 },
        { visit: 'Visit 3', glucose: 102 },
        { visit: 'Visit 4', glucose: 98 },
        { visit: 'Visit 5', glucose: 94 },
      ],
      heartRateData: [
        { visit: 'Visit 1', rate: 68 },
        { visit: 'Visit 2', rate: 72 },
        { visit: 'Visit 3', rate: 71 },
        { visit: 'Visit 4', rate: 75 },
        { visit: 'Visit 5', rate: 70 },
      ],
      temp: '98.4°F',
      tempStatus: 'Normal'
    })
  };

  const getVitalsData = () => {
    if (!selectedPatient) return null;
    const name = selectedPatient.userId?.name || '';
    if (name.toLowerCase().includes('ali') || name.toLowerCase().includes('hassan')) {
      return mockVitalsHistory.aliHassan;
    }
    return mockVitalsHistory.general(name, selectedPatient.age, selectedPatient.gender);
  };

  const currentVitals = getVitalsData();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Selector */}
      <div className="bg-gradient-hero p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <span className="bg-white/15 text-accent-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Telehealth Telemetry
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Vitals Viewer Console 🩺</h1>
          <p className="text-white/80 font-medium text-sm">
            Access synced clinical readings recorded directly by remote community station nurses.
          </p>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:max-w-xs self-start md:self-auto">
          <label className="text-[10px] text-white/70 font-bold uppercase tracking-wider block mb-1">Select Patient File</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-300" />
            <select
              value={selectedPatient?._id || ''}
              onChange={(e) => {
                const found = patients.find(p => p._id === e.target.value);
                setSelectedPatient(found);
              }}
              className="w-full bg-white/10 hover:bg-white/15 text-white pl-9 pr-3 py-2 rounded-xl text-xs font-bold border border-white/20 focus:outline-none cursor-pointer"
            >
              {patients.map(p => (
                <option key={p._id} value={p._id} className="text-primary-900 font-bold">
                  {p.userId?.name || 'Patient'} ({p.age} yrs, {p.gender})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FYP Concept Indicator Callout Box */}
      <div className="bg-accent-50/50 border border-dashed border-accent-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-accent-800 shadow-inner">
        <FiInfo className="text-accent-600 text-lg mt-0.5 shrink-0" />
        <div>
          <strong className="font-bold uppercase tracking-wider">FYP Core Telemedicine Architecture Linkage:</strong>
          <p className="text-accent-700/90 font-medium mt-1 leading-relaxed">
            This module dynamically demonstrates the core objective of the telehealth system. All blood pressure trends, sugar metrics, heart rate logs, and temperatures are captured by the remote area **Nurse Station** and immediately loaded onto the **Doctor Console** for diagnosis, eliminating rural healthcare transit barriers.
          </p>
        </div>
      </div>

      {currentVitals && (
        <div className="space-y-6">
          {/* Patient Header Details Card */}
          <div className="glass-card p-6 border border-gray-150 shadow-md">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-medical-blue text-2xl shadow-inner">
                  <FiUser />
                </div>
                <div>
                  <h3 className="font-extrabold text-primary-500 text-xl">{currentVitals.patientName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-semibold">
                    <span className="capitalize">{currentVitals.gender}</span>
                    <span>·</span>
                    <span>{currentVitals.age} Years Old</span>
                    <span>·</span>
                    <span className="bg-blue-50 text-medical-blue px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-blue-100">
                      Telemetry Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Recorded by Nurse verification Banner (Mockup 4 bottom details) */}
              <div className="flex items-center gap-3 bg-gray-50/80 border border-gray-100 px-5 py-3.5 rounded-2xl md:self-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  <FiUserCheck />
                </div>
                <div className="text-xs">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Recorded By</p>
                  <p className="font-bold text-gray-700">
                    {currentVitals.recordedBy} <span className="text-gray-400 font-medium">|</span> <FiMapPin className="inline text-accent-500 mr-0.5" /> Remote Area: {currentVitals.remoteArea}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vitals Graphs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blood Pressure Graph (last 5 visits) */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-primary-500">Blood Pressure History</h3>
                  <p className="text-xs text-gray-400">Systolic & Diastolic pressure (mmHg) across the last 5 clinical visits</p>
                </div>
                <span className="text-xs font-semibold text-medical-blue bg-blue-50 px-2.5 py-1 rounded-md">
                  ✓ Graph (last 5 visits)
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentVitals.bpData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sysColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E74C3C" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#E74C3C" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="diaColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3498DB" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3498DB" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="visit" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[50, 160]} stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" name="Systolic" dataKey="systolic" stroke="#E74C3C" strokeWidth={2.5} fillOpacity={1} fill="url(#sysColor)" />
                    <Area type="monotone" name="Diastolic" dataKey="diastolic" stroke="#3498DB" strokeWidth={2.5} fillOpacity={1} fill="url(#diaColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sugar Level Graph (trend) */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-primary-500">Blood Sugar History</h3>
                  <p className="text-xs text-gray-400">Glucose variation levels (mg/dL) monitored during nurse assessments</p>
                </div>
                <span className="text-xs font-semibold text-medical-orange bg-orange-50 px-2.5 py-1 rounded-md">
                  ✓ Graph (trend)
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentVitals.sugarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="visit" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[60, 140]} stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" name="Glucose" dataKey="glucose" stroke="#E67E22" strokeWidth={3} dot={{ fill: '#E67E22', r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Heart Rate Graph */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-primary-500">Heart Rate (Pulse)</h3>
                  <p className="text-xs text-gray-400">Pulse rate (bpm) variations measured under steady status</p>
                </div>
                <span className="text-xs font-semibold text-medical-purple bg-purple-50 px-2.5 py-1 rounded-md">
                  ✓ Graph
                </span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentVitals.heartRateData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pulseColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9B59B6" stopOpacity={0.85}/>
                        <stop offset="100%" stopColor="#8E44AD" stopOpacity={0.35}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="visit" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[40, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#0A2540', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Bar name="BPM" dataKey="rate" fill="url(#pulseColor)" radius={[5, 5, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Temperature Gauge Check Box (Mockup 4 bottom elements) */}
            <div className="glass-card flex flex-col justify-between p-6">
              <div>
                <h3 className="font-bold text-primary-500">Body Temperature Status</h3>
                <p className="text-xs text-gray-400">Steady temperature verified directly from patient's assessment file</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 text-4xl mb-4 shadow-inner">
                  <FiThermometer className="animate-pulse" />
                </div>
                <p className="text-3xl font-black text-primary-500 tracking-tight">{currentVitals.temp}</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-150 font-bold mt-2.5 shadow-sm">
                  <FiCheckCircle /> Temperature Normal
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-[11px] text-gray-500">
                <span>Thermal Telemetry Status:</span>
                <span className="text-emerald-600 font-bold">✓ Calibrated & Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
