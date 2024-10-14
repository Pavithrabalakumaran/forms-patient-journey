import React, { useState, useEffect } from 'react';
import "./index.css";

const PatientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    age: '', // New field for Age
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    bloodGroup: '',
    motherName: '',
    fatherName: '',
    spouseName: '',
    pincode: '',
    city: '',
    state: '',
    medicalHistory: '',
  });

  const [patientId, setPatientId] = useState('');

  // Function to calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Adjust age if birth date hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age >= 0 ? age : '';
  };

  // useEffect to update age whenever dob changes
  useEffect(() => {
    const age = calculateAge(formData.dob);
    setFormData((prevData) => ({
      ...prevData,
      age: age !== '' ? age : '',
    }));
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const generatedId = `${formData.firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}@clinicname.com`;
    setPatientId(generatedId);

    console.log('Form submitted:', formData);
    console.log('Generated Patient ID:', generatedId);

    // Reset form (optional)
    // setFormData({
    //   firstName: '',
    //   lastName: '',
    //   dob: '',
    //   age: '',
    //   gender: '',
    //   contactNumber: '',
    //   email: '',
    //   address: '',
    //   bloodGroup: '',
    //   motherName: '',
    //   fatherName: '',
    //   spouseName: '',
    //   pincode: '',
    //   city: '',
    //   state: '',
    //   medicalHistory: '',
    // });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Patient Registration</h2>

      {/* Personal Information Section */}
      <fieldset>
        <legend>Patient Personal Information</legend>

        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Mother's Name:</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Father's Name:</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        /><br /><br />

        {/* New Age Field */}
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          readOnly
          style={{ borderColor: "#ffff"}}
        /><br /><br />

        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select><br /><br />

        <label>Spouse's Name:</label>
        <input
          type="text"
          name="spouseName"
          value={formData.spouseName}
          onChange={handleChange}
          required={formData.gender === 'female'} // Example condition, adjust as needed
        /><br /><br />

        <label>Blood Group:</label>
        <input
          type="text"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
        /><br /><br />
      </fieldset>

      {/* Communication Details Section */}
      <fieldset>
        <legend>Communication Details</legend>

        <label>Contact Number:</label>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Email Address:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Address (Optional):</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        /><br /><br />

        <label>Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        /><br /><br />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        /><br /><br />

        <label>State:</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        /><br /><br />
      </fieldset>

      {/* Medical Information Section */}
      <fieldset>
        <legend>Medical Information</legend>

        <label>Medical History:</label>
        <textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          placeholder="Previous medical conditions, allergies, current medications"
        ></textarea><br /><br />
      </fieldset>

      {/* Submit Button */}
      <button type="submit">Register Patient</button>

      {/* System Generated Info */}
      {patientId && <p>Patient ID: {patientId}</p>}
    </form>
  );
};

export default PatientRegistrationForm;
