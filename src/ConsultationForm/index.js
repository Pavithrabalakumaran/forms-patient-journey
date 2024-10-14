// src/ConsultationForm.js
import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ConsultationForm = ({ appointment, onComplete }) => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      diagnosis: '',
      notes: '',
      prescriptions: [{ medicationName: '', dosageInstructions: '', duration: '' }],
      labTests: [{ testName: '', testInstructions: '', labResultsUrl: '' }],
      followUpDate: new Date(),
    },
  });

  const { fields: prescriptionFields, append: appendPrescription, remove: removePrescription } = useFieldArray({
    control,
    name: 'prescriptions',
  });

  const { fields: labTestFields, append: appendLabTest, remove: removeLabTest } = useFieldArray({
    control,
    name: 'labTests',
  });

  const [optOutMonitoring, setOptOutMonitoring] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const onSubmit = (data) => {
    // Prepare the data to be displayed
    const processedData = {
      ...data,
      labTests: optOutMonitoring ? [] : data.labTests.filter(test => test.testName.trim() !== ''),
    };

    // Set the submitted data to state for display
    setSubmittedData(processedData);

    // Reset the form
    reset();
    setFollowUp(false);
    setOptOutMonitoring(false);

    // Notify parent component if necessary
    if (onComplete) onComplete();
  };

  return (
    <div style={styles.container}>
      <h2>Consultation for {appointment.name}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Diagnosis */}
        <div style={styles.formGroup}>
          <label htmlFor="diagnosis">Diagnosis:</label>
          <textarea
            id="diagnosis"
            {...register('diagnosis', { required: true })}
            style={styles.textarea}
            placeholder="Enter diagnosis details"
          ></textarea>
          {errors.diagnosis && <span style={styles.error}>This field is required</span>}
        </div>

        {/* Notes */}
        <div style={styles.formGroup}>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            {...register('notes')}
            style={styles.textarea}
            placeholder="Enter additional notes"
          ></textarea>
        </div>

        {/* Prescribed Medications */}
        <div style={styles.formGroup}>
          <label>Prescribed Medications:</label>
          {prescriptionFields.map((item, index) => (
            <div key={item.id} style={styles.dynamicField}>
              <input
                {...register(`prescriptions.${index}.medicationName`, { required: true })}
                placeholder="Medication Name"
                style={styles.input}
              />
              <input
                {...register(`prescriptions.${index}.dosageInstructions`, { required: true })}
                placeholder="Dosage Instructions"
                style={styles.input}
              />
              <input
                {...register(`prescriptions.${index}.duration`, { required: true })}
                placeholder="Duration"
                style={styles.input}
              />
              <button type="button" onClick={() => removePrescription(index)} style={styles.removeButton}>
                Remove
              </button>
              {errors.prescriptions?.[index] && (
                <span style={styles.error}>All fields are required</span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPrescription({ medicationName: '', dosageInstructions: '', duration: '' })}
            style={styles.addButton}
          >
            Add Medication
          </button>
        </div>

        {/* Lab Test Orders */}
        <div style={styles.formGroup}>
          <label>Lab Test Orders:</label>
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              checked={optOutMonitoring}
              onChange={() => setOptOutMonitoring(!optOutMonitoring)}
            />
            <span>If the patient doesn’t want to get tested in the hospital, test progress will not be monitored.</span>
          </div>
          {!optOutMonitoring && (
            <>
              {labTestFields.map((item, index) => (
                <div key={item.id} style={styles.dynamicField}>
                  <input
                    {...register(`labTests.${index}.testName`, { required: true })}
                    placeholder="Test Name"
                    style={styles.input}
                  />
                  <input
                    {...register(`labTests.${index}.testInstructions`, { required: true })}
                    placeholder="Test Instructions"
                    style={styles.input}
                  />
                  <input
                    {...register(`labTests.${index}.labResultsUrl`)}
                    placeholder="Lab Results URL"
                    style={styles.input}
                  />
                  <button type="button" onClick={() => removeLabTest(index)} style={styles.removeButton}>
                    Remove
                  </button>
                  {errors.labTests?.[index] && (
                    <span style={styles.error}>Test Name and Instructions are required</span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendLabTest({ testName: '', testInstructions: '', labResultsUrl: '' })}
                style={styles.addButton}
              >
                Add Lab Test
              </button>
            </>
          )}
        </div>

        {/* Schedule Follow-Up Appointment */}
        <div style={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={followUp}
              onChange={() => setFollowUp(!followUp)}
            />
            Schedule Follow-Up Appointment
          </label>
          {followUp && (
            <div style={styles.datePicker}>
              <Controller
                control={control}
                name="followUpDate"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    dateFormat="Pp"
                    placeholderText="Select follow-up date and time"
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" style={styles.submitButton}>
          Save Consultation
        </button>
      </form>

      {/* Display Submitted Data */}
      {submittedData && (
        <div style={styles.submittedData}>
          <h3>Submitted Consultation Details</h3>
          <p><strong>Diagnosis:</strong> {submittedData.diagnosis}</p>
          <p><strong>Notes:</strong> {submittedData.notes}</p>

          <h4>Prescribed Medications:</h4>
          <ul>
            {submittedData.prescriptions.map((med, idx) => (
              <li key={idx}>
                <strong>Medication Name:</strong> {med.medicationName} | <strong>Dosage Instructions:</strong> {med.dosageInstructions} | <strong>Duration:</strong> {med.duration}
              </li>
            ))}
          </ul>

          {!optOutMonitoring && submittedData.labTests.length > 0 && (
            <>
              <h4>Lab Test Orders:</h4>
              <ul>
                {submittedData.labTests.map((test, idx) => (
                  <li key={idx}>
                    <strong>Test Name:</strong> {test.testName} | <strong>Test Instructions:</strong> {test.testInstructions} | <strong>Lab Results URL:</strong> {test.labResultsUrl || 'N/A'}
                  </li>
                ))}
              </ul>
            </>
          )}

          {submittedData.followUpDate && (
            <p><strong>Follow-Up Appointment:</strong> {new Date(submittedData.followUpDate).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Inline styles for simplicity; consider using CSS or styled-components for larger projects
const styles = {
  container: {
    border: '1px solid #ccc',
    padding: '20px',
    borderRadius: '5px',
    maxWidth: '800px',
    margin: '20px auto',
    backgroundColor: '#f9f9f9',
  },
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '30%',
    padding: '8px',
    fontSize: '16px',
    marginRight: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
  },
  addButton: {
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
  removeButton: {
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    marginLeft: '10px',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  dynamicField: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  datePicker: {
    marginTop: '10px',
  },
  submittedData: {
    marginTop: '30px',
    padding: '20px',
    border: '1px solid #4CAF50',
    borderRadius: '5px',
    backgroundColor: '#e6ffed',
  },
};

export default ConsultationForm;
