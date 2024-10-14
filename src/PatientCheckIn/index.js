// src/PatientCheckIn.js
import React, { useState } from 'react';
import { appointments } from '../mockdata'; // Import appointments from mock data

const PatientCheckIn = ({ onCheckInSuccess }) => {
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [preferredDoctor, setPreferredDoctor] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setAppointment(null);

    // Check if all required fields are filled
    if (!patientName || !contactNumber || !preferredDoctor) {
      setError('Please fill in all required fields: Patient Name, Contact Number, and Preferred Doctor.');
      return;
    }

    // Search appointment by patient name, contact number, and preferred doctor
    let foundAppointment = appointments.find(
      (appt) =>
        appt.name.toLowerCase() === patientName.toLowerCase() &&
        appt.contact.toLowerCase() === contactNumber.toLowerCase() &&
        appt.doctor.toLowerCase() === preferredDoctor.toLowerCase()
    );

    if (!foundAppointment) {
      setError('No appointment found for the given details.');
    } else {
      setAppointment(foundAppointment);
    }
  };

  const handleCheckIn = () => {
    if (appointment.status === 'Checked-In') {
      setError('Patient is already checked in.');
      return;
    }

    // Update the appointment status locally
    const updatedAppointment = { ...appointment, status: 'Checked-In' };
    setAppointment(updatedAppointment);

    // Simulate backend update in a real app

    onCheckInSuccess(updatedAppointment);
    alert('Patient checked in successfully.');
  };

  return (
    <div style={styles.container}>
      <h2>Patient Check-In</h2>
      <div style={styles.formContainer}>
        <label>
          Patient Name:
          <input
            type="text"
            placeholder="Enter Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            style={styles.input}
          />
        </label>
        <br />
        <label>
          Contact Number:
          <input
            type="text"
            placeholder="Enter Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            style={styles.input}
          />
        </label>
        <br />
        <label>
          Preferred Doctor:
          <input
            type="text"
            placeholder="Enter Doctor's Name"
            value={preferredDoctor}
            onChange={(e) => setPreferredDoctor(e.target.value)}
            style={styles.input}
          />
        </label>
        <br />
        <button onClick={handleSearch} style={styles.button}>
          Search Appointment
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {appointment && (
        <div style={styles.appointmentContainer}>
          <h3>Appointment Details</h3>
          <p>
            <strong>Patient Name:</strong> {appointment.name}
          </p>
          <p>
            <strong>Doctor:</strong> {appointment.doctor}
          </p>
          <p>
            <strong>Appointment Time:</strong> {new Date(appointment.appointmentTime).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {appointment.status}
          </p>
          {appointment.status !== 'Checked-In' && (
            <button onClick={handleCheckIn} style={styles.button}>
              Check-In
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  formContainer: {
    marginBottom: '10px',
  },
  input: {
    padding: '8px',
    marginBottom: '10px',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '10px 16px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  error: {
    color: 'red',
  },
  appointmentContainer: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
  },
};

export default PatientCheckIn;
