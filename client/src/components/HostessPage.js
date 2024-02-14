import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VIP from '../assets/vip.png';
import Logo from '../assets/logo.png';
import Banner from '../assets/detbanner.png';
function HostessPage() {
  const [guestList, setGuestList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchGuestData = () => {
    // Fetch the guest list from your backend
    axios.get('/api/guests/absent').then((response) => {
      setGuestList(response.data);
    });
  };

  useEffect(() => {
    // Initial fetch
    fetchGuestData();

    // Fetch data every 10 seconds
    const intervalId = setInterval(fetchGuestData, 10000);

    // Cleanup the interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const markAsAttended = (guestId) => {
    axios
      .put(`/api/guests/${guestId}`, {
        action: 'attended',
      })
      .then((response) => {
        console.log('Guest marked as attended:', response.data);
        setGuestList((prevGuestList) =>
          prevGuestList.filter((guest) => guest._id !== guestId)
        );
      })
      .catch((error) => {
        console.error('Error marking guest as attended:', error);
      });
  };

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the guestList based on the searchQuery
  const filteredGuestList = guestList.filter((guest) => {
         const fullName = (guest.fullname || '').toLowerCase();
         const query = searchQuery.toLowerCase();

         return (
           fullName.startsWith(query) ||
           (guest.firstname &&
             guest.firstname.toLowerCase().startsWith(query)) ||
           (guest.lastname && guest.lastname.toLowerCase().startsWith(query)) 
            || (guest.galaGuestFullName && guest.galaGuestFullName.toLowerCase().startsWith(query))
         );
  });

  const handleCheckIn = (guestId) => {
    // Perform the check-in logic here, e.g., make an API call to update the check-in status
    axios
      .put(`/api/guests/${guestId}`, {
        action: 'attended',
      })
      .then((response) => {
        setIsCheckedIn(true);
      })
      .catch((error) => {
        console.error('Error checking in guest:', error);
        // Handle the error if needed
      });
  };


  return (
    <div>
      {/* <section>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-12 d-flex justify-content-center my-3'>
              <a href='#'><img src={Logo} className='brand-logo' alt='DET Logo' /></a>
            </div>
          </div>
        </div>
      </section> */}
      <section>
        <div className='container-fluid'>
          <div className='row justify-content-center'>
            <div className='col-md-12 d-flex justify-content-center p-0'>
              <img src={Banner} />
            </div>
            {/* <div className='col-md-12 my-3'>
              <h1 className='text-center'>Guest List</h1>
            </div> */}
            <div className='col-md-12 my-3'>
              {/* <button
                type='button'
                class='btn btn-primary'
                data-bs-toggle='modal'
                data-bs-target='#staticBackdrop'
              >
                FAQ
              </button>

              <div
                class='modal fade'
                id='staticBackdrop'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                tabindex='-1'
                aria-labelledby='staticBackdropLabel'
                aria-hidden='true'
              >
                <div class='modal-dialog'>
                  <div class='modal-content'>
                    <div class='modal-header'>
                      <h5 class='modal-title' id='staticBackdropLabel'>
                        Modal title
                      </h5>
                      <button
                        type='button'
                        class='btn-close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                      ></button>
                    </div>
                    <div class='modal-body'>
                      <h2>1-CHECK-IN PRIORITY</h2>
                      <h3> 1. FIRST Priority: RSVP guests</h3>
                      <p>
                        1. Forum Main Guests with RSVP <br />
                        2. Forum Main Guests’
                        <br />
                        plus-one (TBC) with RSVP <br />
                        3. Helal’s Main Guests with RSVP
                        <br />
                        4. Helal’s Main Guests’ plus-one with RSVP
                      </p>
                      <h2> 2. 2nd Priority</h2>
                      <p>
                        1. Forum Main Guests without RSVP <br />
                        2. Forum Main Guests’ plus-ones without RSVP
                      </p>
                      <h2>
                        3. Check-in app will send pop-up to alert Check-in
                        Manager when checkin # reaches:
                      </h2>
                      <p>
                        1. 300
                        <br /> 2. Every 50 additional from 300-600
                        <br /> 3. Every 30 additional from 600 to 700
                        <br /> 4. Final Alert at 750
                        <br />
                      </p>
                      <h2> 4. Check-in Manager could</h2>
                      add Gala Guest to list at Check-in Manager’s discretion
                    </div>
                    <div class='modal-footer'>
                      <button
                        type='button'
                        class='btn btn-primary'
                        data-bs-dismiss='modal'
                      >
                        Understood
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className='col-md-12'>
              <div className='input-group mb-3'>
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Search'
                    aria-label='Search'
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className='input-group-append'>
                    <button className='btn btn-outline-success' type='button'>
                      Search
                    </button>
                  </div>
                </div>
              </div>
              {filteredGuestList.length === 0 ? (
                <p>No Records Found</p>
              ) : (
                <div className='table-responsive guest-list__75h'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>organization</th>
                        <th>FF/GC</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuestList.map((guest) => (
                        <tr key={guest._id} className='t-row'>
                          <td>
                            {guest.firstname} {guest.lastname}
                          </td>
                          <td>{guest.title}</td>
                          <td>{guest.organization}</td>
                          <td>{guest.localinternational}</td>
                          <td>
                            <button
                              type='button'
                              className='btn btn-outline-success'
                              onClick={() => markAsAttended(guest._id)}
                            >
                              Check in
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HostessPage;
