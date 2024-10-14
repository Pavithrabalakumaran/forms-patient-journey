// src/PrescriptionView.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PrescriptionView = () => {
  const { token } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`/api/prescription/${token}`);
        setConsultation(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [token]);

  if (loading) {
    return <div>Loading consultation details...</div>;
  }

  if (error || !consultation) {
    return <div>Unable to fetch consultation details. Please check your URL.</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Consultation Details</h2>

      <section style={styles.section}>
        <h3>Diagnosis</h3>
        <p>{consultation.diagnosis}</p>
      </section>

      <section style={styles.section}>
        <h3>Notes</h3>
        <p>{consultation.notes}</p>
      </section>

      <section style={styles.section}>
        <h3>Prescribed Medications</h3>
        {consultation.prescriptions.length > 0 ? (
          <ul>
            {consultation.prescriptions.map((med, index) => (
              <li key={index}>
                <strong>{med.medicationName}</strong>: {med.dosageInstructions} for {med.duration}
              </li>
            ))}
          </ul>
        ) : (
          <p>No medications prescribed.</p>
        )}
      </section>

      {consultation.labTests.length > 0 && (
        <section style={styles.section}>
          <h3>Lab Test Orders</h3>
          <ul>
            {consultation.labTests.map((test, index) => (
              <li key={index}>
                <strong>{test.testName}</strong>: {test.testInstructions}
                {test.labResultsUrl && (
                  <div>
                    <a href={test.labResultsUrl} target="_blank" rel="noopener noreferrer">
                      View Lab Results
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '20px',
  },
};

export default PrescriptionView;
