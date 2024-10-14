// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await axios.get('/api/consultations'); // You need to create this endpoint
        setConsultations(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  if (loading) {
    return <div>Loading consultations...</div>;
  }

  if (error) {
    return <div>Error fetching consultations. Please try again later.</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Staff Dashboard</h2>
      {consultations.length === 0 ? (
        <p>No consultations available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Diagnosis</th>
              <th>Prescriptions</th>
              <th>Lab Tests</th>
              <th>Secure URL</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((consultation) => (
              <tr key={consultation.recordId}>
                <td>{consultation.patientId}</td>
                <td>{consultation.diagnosis}</td>
                <td>
                  <ul>
                    {consultation.prescriptions.map((med, index) => (
                      <li key={index}>{med.medicationName}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {consultation.labTests.map((test, index) => (
                      <li key={index}>{test.testName}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <a href={consultation.secureUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
                <td>{new Date(consultation.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default Dashboard;
