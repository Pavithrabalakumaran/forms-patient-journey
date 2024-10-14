import React, { useState } from 'react';
import PatientCheckIn from './PatientCheckIn';
import ConsultationForm from './ConsultationForm';
import PatientRegistrationForm from './PatientJourney';
import AppointmentForm from './Appointment Details';
import PrescriptionView from './prescriptionview';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import './App.css';

const App = () => {
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null); // State to hold appointment form data

  const handleCheckInSuccess = (appointment) => {
    setCurrentAppointment(appointment);
  };

  const handleConsultationComplete = () => {
    setCurrentAppointment(null);
  };

  const handleAppointmentSubmit = (data) => {
    setAppointmentDetails(data); // Store appointment form data
    console.log('Appointment Form Data:', data); // Log appointment data
  };

  const mockAppointment = {
    name: 'John Doe',
    // Add other relevant appointment details if necessary
  };

  const handleComplete = () => {
    console.log('Form submission complete.');
  };

  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <h2>Patient Visit and Consultation</h2>

        {/* Patient Registration Form First */}
        <PatientRegistrationForm />

      

        {/* Render AppointmentForm directly if needed */}
        <AppointmentForm onSubmit={handleAppointmentSubmit} />

          {/* Conditional rendering for Check-In and Consultation */}
          {!currentAppointment ? (
          <PatientCheckIn onCheckInSuccess={handleCheckInSuccess} />
        ) : (
          <ConsultationForm
            appointment={currentAppointment}
            onComplete={handleConsultationComplete}
          />
        )}
        
        {/* Consultation form for mock appointment, if needed */}
        <ConsultationForm appointment={mockAppointment} onComplete={handleComplete} />
        
        {/* Define routes below */}
        <Routes>
          <Route path="/prescription/:token" element={<PrescriptionView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const styles = {
  appContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
};

export default App;
