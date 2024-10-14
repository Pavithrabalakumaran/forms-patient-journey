export const appointments = [
    {
      id: '1',
      patientId: 'P001',
      name: 'John Doe',
      contact: 'john.doe@example.com',
      appointmentTime: '2024-04-28T10:00:00',
      status: 'Scheduled', // Possible statuses: Scheduled, Checked-In, Completed
      type: 'Initial',
    },
    {
      id: '2',
      patientId: 'P002',
      name: 'Jane Smith',
      contact: 'jane.smith@example.com',
      appointmentTime: '2024-04-28T11:00:00',
      status: 'Scheduled',
      type: 'Initial',
    },
    // Add more mock appointments as needed
  ];
  
  export const patients = [
    {
      patientId: 'P001',
      name: 'John Doe',
      medicalHistory: [
        {
          date: '2024-04-20',
          diagnosis: 'Common Cold',
          notes: 'Prescribed rest and fluids.',
          medications: ['Rest', 'Fluids'],
        },
      ],
    },
    {
      patientId: 'P002',
      name: 'Jane Smith',
      medicalHistory: [],
    },

  ];
  