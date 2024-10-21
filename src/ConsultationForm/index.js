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
      testType: '',
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

  // Define test prices
  const testPrices = {
    'H1bc': 300,
    'Glucose': 150,
    'Blood Sugar Level': 200,
    'Kidney Test': 500,
    'Liver Function Test': 600,
  };

  const [selectedTest, setSelectedTest] = useState('');
  const [testCost, setTestCost] = useState(0);

  const onTestChange = (e) => {
    const selected = e.target.value;
    setSelectedTest(selected);
    setTestCost(testPrices[selected] || 0);
  };

  const consultationFee = 500;
  const totalCost = consultationFee + testCost;

  const onSubmit = (data) => {
    // Prepare the data to be displayed
    const processedData = {
      ...data,
      labTests: optOutMonitoring ? [] : data.labTests.filter(test => test.testName.trim() !== ''),
    };

    setSubmittedData(processedData);
    reset();
    setFollowUp(false);
    setOptOutMonitoring(false);

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

        {/* Billing Section */}
        <div style={styles.formGroup}>
          <label>Billing & Payment</label>
          <div>
            <p>Consultation Fee: ₹{consultationFee}</p>
            <label>Lab Test:</label>
            <select value={selectedTest} onChange={onTestChange} style={styles.select}>
              <option value="">Select a Test</option>
              {Object.keys(testPrices).map((test, idx) => (
                <option key={idx} value={test}>
                  {test} - ₹{testPrices[test]}
                </option>
              ))}
            </select>
            {selectedTest && <p>Test Charge: ₹{testCost}</p>}
            <h4>Total Cost: ₹{totalCost}</h4>
          </div>
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
            <p>
              <strong>Follow-Up Appointment:</strong> {submittedData.followUpDate.toLocaleString()}
            </p>
          )}

          <h4>Billing Summary:</h4>
          <p>Consultation Fee: ₹{consultationFee}</p>
          {selectedTest && <p>Lab Test ({selectedTest}): ₹{testCost}</p>}
          <p><strong>Total Cost: ₹{totalCost}</strong></p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '8px',
    margin: '5px',
    width: 'calc(100% - 20px)',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    padding: '10px',
    width: '100%',
    height: '80px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  dynamicField: {
    display: 'flex',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  addButton: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  select: {
    padding: '8px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#008CBA',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  datePicker: {
    marginTop: '10px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
  submittedData: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
  },
  checkboxGroup: {
    marginBottom: '10px',
  },
};

export default ConsultationForm;
