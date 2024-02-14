const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase } = require('./db'); // Adjust the path as needed

// Call the function to connect to the database
connectToDatabase();

const app = express();
const port = process.env.PORT || 5000;

const guestSchema = new mongoose.Schema({
  title: String,
  firstname: String,
  lastname: String,
  country: String,
  localinternational: String,
  organization: String,
  tableNo: String,
  salutation: String,
  status: String,
  isVIP: Boolean,
});




const Guest = mongoose.model('Guest', guestSchema);

app.use(cors());
app.use(bodyParser.json());

// API Route to get all guests
app.get('/api/guests', async (req, res) => {
  try {
    // Find all guests using the Guest model
    const guests = await Guest.find();

    res.json(guests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API Route to get table numbers and their counts
app.get('/api/guests/table-counts', async (req, res) => {
  try {
    // Aggregate pipeline to group documents by tableNo and count occurrences
    const tableCounts = await Guest.aggregate([
      {
        $group: {
          _id: '$tableNo', // Group by tableNo field
          count: { $sum: 1 }, // Count occurrences of each tableNo
        },
      },
    ]);

    res.json(tableCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// API Route to Submit Testimonial
app.post('/api/guests', async (req, res) => {
  try {
    const {
      title,
      firstname,
      lastname,
      country,
      localinternational,
      organization,
      tableNo,
      
      fullname,
      salutation,
      status,
      isVIP,
      rsvp,
      isMainguest,
    } = req.body;

    // Create a new testimonial using the Testimonial model
    const newGuest = new Guest({
      fullname,
      firstname,
      lastname,
      salutation,
      organization,
      title,
      country,
      localinternational,
      tableNo,
      status : "attended",
      isVIP,
      isMainguest,
    });

    // Save the testimonial to the database
    await newGuest.save();

    res.status(201).json(newGuest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API Route to Get absent guests (Admin Page)
app.get('/api/guests/absent', async (req, res) => {
  try {
    // Find absent guests using the guest model
    const absentGuests = await Guest.find({ status: 'absent' });

    res.json(absentGuests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API Route to Get absent guests (Admin Page)
app.get('/api/guests/attended', async (req, res) => {
  try {
    // Find absent guests using the guest model
    const absentGuests = await Guest.find({ status: 'attended' });

    res.json(absentGuests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API Route to Approve or Reject guest (Admin Action)
app.put('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // Action can be 'approve' or 'reject'

    // Find the guest by ID using the guest model
    const guest = await Guest.findById(id);

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    if (action === 'attended') {
      guest.status = 'attended';
      // Add a property to mark the guest as checked-in
      guest.isCheckedIn = true;
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save the updated guest to the database
    await guest.save();

    res.json(guest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/guests/attended', async (req, res) => {
  try {
    // Find approved guests using the guest model
    const approvedGuests = await Guest.find({ status: 'attended' });

    res.json(approvedGuests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
