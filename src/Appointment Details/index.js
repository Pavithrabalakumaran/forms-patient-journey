import React, { useState } from 'react';

const AppointmentForm = ({ onSubmit }) => { // Add onSubmit prop
  const [formData, setFormData] = useState({
    preferredDoctor: '',
    reasonForVisit: '',
    appointmentDate: '',
    appointmentTime: '',
    alternativeDates: '',
    currentConditions: '',
    pastSurgeries: '',
    allergies: '',
    medications: '',
    modeOfAppointment: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.appointmentDate || !formData.reasonForVisit) {
      alert('Please fill in all the required fields.');
      return;
    }

    console.log('Form Submitted', formData);
    onSubmit(formData); // Call onSubmit with form data
    setSubmitted(true);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 10;
    const endHour = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      if (hour === 13 || hour === 17) continue; // Skip 1 PM - 2 PM and 5 PM - 5:30 PM

      slots.push(`${hour}:00`);
      slots.push(`${hour}:15`);
      slots.push(`${hour}:30`);
      slots.push(`${hour}:45`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div>
      <h2>Book an Appointment</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Appointment Details</legend>

            {/* Preferred Doctor Dropdown */}
            <label>Preferred Doctor (if applicable):</label>
            <select 
              name="preferredDoctor" 
              value={formData.preferredDoctor} 
              onChange={handleChange}
              required
            >
              <option value="">Select a doctor</option>
              <option value="Dr. Smith">Dr. Smith</option>
              <option value="Dr. Brown">Dr. Brown</option>
              <option value="Dr. Taylor">Dr. Taylor</option>
            </select>
            <br /><br />

            <label>Reason for Visit:</label>
            <textarea 
              name="reasonForVisit" 
              value={formData.reasonForVisit} 
              onChange={handleChange} 
              placeholder="Brief description of symptoms or concern" 
              required 
            />
            <br /><br />

            {/* Mode of Appointment Radio Buttons */}
            <label>Mode of Appointment:</label>
            <br />
            <input 
              type="radio" 
              name="modeOfAppointment" 
              value="online" 
              checked={formData.modeOfAppointment === 'online'}
              onChange={handleChange}
            /> Online Appointment
            <br />
            <input 
              type="radio" 
              name="modeOfAppointment" 
              value="walkin" 
              checked={formData.modeOfAppointment === 'walkin'}
              onChange={handleChange}
            /> Direct Walk-in
            <br /><br />

            {/* Only show time selection if Online Consultation is chosen */}
            {formData.modeOfAppointment === 'online' && (
              <>
                <label>Appointment Date:</label>
                <input 
                  type="date" 
                  name="appointmentDate" 
                  value={formData.appointmentDate} 
                  onChange={handleChange} 
                  required 
                />
                <br /><br />

                <label>Appointment Time:</label>
                <select 
                  name="appointmentTime" 
                  value={formData.appointmentTime} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>{slot}</option>
                  ))}
                </select>
                <br /><br />
              </>
            )}

            {formData.modeOfAppointment === 'walkin' && (
              <p>
                "Direct walk-ins may experience a waiting time, as scheduled appointments will be prioritized. The wait to see the doctor may range from 30 to 45 minutes."
              </p>
            )}

            <label>Preferred next Appointment Date/Time:</label>
            <textarea 
              name="alternativeDates" 
              value={formData.alternativeDates} 
              onChange={handleChange} 
              placeholder="Enter your availability (optional)" 
            />
            <br /><br />
          </fieldset>

          <fieldset>
            <legend>Medical History</legend>

            <label>Current Medical Conditions:</label>
            <textarea 
              name="currentConditions" 
              value={formData.currentConditions} 
              onChange={handleChange} 
              placeholder="Any current medical conditions" 
            />
            <br /><br />

            <label>Past Surgeries or Major Illnesses:</label>
            <textarea 
              name="pastSurgeries" 
              value={formData.pastSurgeries} 
              onChange={handleChange} 
              placeholder="Any past surgeries or major illnesses" 
            />
            <br /><br />

            <label>Allergies:</label>
            <input 
              type="text" 
              name="allergies" 
              value={formData.allergies} 
              onChange={handleChange} 
              placeholder="Any allergies" 
            />
            <br /><br />

            <label>Medications (including dosage):</label>
            <textarea 
              name="medications" 
              value={formData.medications} 
              onChange={handleChange} 
              placeholder="List of medications you're currently taking (include dosage)"
            />
            <br /><br />
          </fieldset>

          <button type="submit">Submit Appointment</button>
        </form>
      ) : (
        <p>Thank you! Your appointment request has been submitted.</p>
      )}
    </div>
  );
};

export default AppointmentForm;
