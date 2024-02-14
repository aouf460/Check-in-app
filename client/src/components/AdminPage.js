import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VIP from '../assets/vip.png';
import Logo from '../assets/logo.png';
import Banner from '../assets/detbanner.png';
const AdminPage = () => {




  const [allGuests, setAllGuests] = useState([]);
  const [attendedGuests, setAttendedGuests] = useState([]);
  const [absentGuests, setAbsentGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [totalGuestsCount, setTotalGuestsCount] = useState(0);
  
    const [guestData, setGuestData] = useState({
      author: '',
      content: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [attendedGuestsCount, setAttendedGuestsCount] = useState(0);
  const fetchGuestData = () => {
    // Fetch all guests, attended guests, and absent guests
    axios
      .get('/api/guests')
      .then((response) => {
        setAllGuests(response.data);
        setTotalGuestsCount(response.data.length); // Set the total number of guests
      })
      .catch((error) => {
        console.error('Error fetching all guests:', error);
      });

    axios
      .get('/api/guests/attended')
      .then((response) => {
        setAttendedGuests(response.data);
        setAttendedGuestsCount(response.data.length); // Set the count of attended guests
      })
      .catch((error) => {
        console.error('Error fetching attended guests:', error);
      });

    axios
      .get('/api/guests/absent')
      .then((response) => {
        setAbsentGuests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching absent guests:', error);
      });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setGuestData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post('/api/guests', guestData)
      .then((response) => {
        setSuccessMessage('Guest created successfully.');
        setGuestData({
          fullname: '',
          firstname: '',
          lastname : '',
          salutation: '',
          organization: '',
          localinternational: '',
          status: 'absent',
          isVIP: false,
          isMainguest: false,
        });
      })
      .catch((error) => {
        console.error('Error creating new guest:', error);
        setErrorMessage('Error creating new guest. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
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

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter guests based on the search query for both name and table number
  const filteredGuests = (guests) => {
    return guests.filter((guest) => {
      const firstname = (guest.firstname || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      // Check if the search query matches either the guest name or the table number
      return firstname.startsWith(query);
    });
  };
  const filteredGuestscat = (guests) => {
    if (filter === 'attended') {
      return guests.filter((guest) => guest.status === 'attended');
    } else if (filter === 'absent') {
      return guests.filter((guest) => guest.status === 'absent');
    } else {
      return guests.filter((guest) => {
        const fullName = (guest.fullname || '').toLowerCase();
        const query = searchQuery.toLowerCase();

        // Check if the search query matches either the first name or the last name
        return (
          fullName.startsWith(query) ||
          (guest.firstname &&
            guest.firstname.toLowerCase().startsWith(query)) ||
          (guest.lastname && guest.lastname.toLowerCase().startsWith(query))
        );
      });
    }
  };
    const handleFilterChange = (filter) => {
      setFilter(filter);
    };
useEffect(() => {
  // Run the alert logic for specific ranges
  if (attendedGuestsCount === 300) {
    alert('300 guests checked-in');
  } else if (
    attendedGuestsCount > 300 &&
    attendedGuestsCount <= 600 &&
    attendedGuestsCount % 50 === 0
  ) {
    alert(`${attendedGuestsCount} guests checked-in`);
  } else if (
    attendedGuestsCount > 600 &&
    attendedGuestsCount <= 750 &&
    attendedGuestsCount % 30 === 0
  ) {
    alert(` ${attendedGuestsCount} guests checked-in`);
  }
}, [attendedGuestsCount]);
const absentGuestsCount = totalGuestsCount - attendedGuestsCount;
    
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // Replace 'yourSecretPassword' with the actual password you want to use
    if (password === 'DET@2024') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2 className='pb-3'>Admin Page</h2>
        <label>Admin Password:</label>
        <div className='input-group mb-3'>
          <input
            class='form-control me-2'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            placeholder='password'
          />
          <button class='btn btn-outline-success' onClick={handleLogin}>
            Login
          </button>
        </div>{' '}
      </div>
    );
  }

  return (
    <div>
      {/* <section>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-12 d-flex justify-content-center my-3'>
              <a href='#'>
                <img src={Logo} className='brand-logo' alt='DET Logo' />
              </a>
            </div>
          </div>
        </div>
      </section> */}
      <section>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 d-flex justify-content-center p-0'>
              <img src={Banner} />
            </div>
            <div className='col-md-12'>
              <h1 className='text-center'>Admin</h1>
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
            <div className='col-md-12 d-flex justify-content-between'>
              <h4 className='text-center'>
                Checked-in Guests: {attendedGuestsCount}
              </h4>
              <h4 className='text-center'>
                NOT Checked-in Guests:{absentGuestsCount}
              </h4>
            </div>
            <div className='col-md-12'>
              <button
                className='btn btn-outline-success'
                type='button'
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              <button
                className='btn btn-outline-info mx-3'
                type='button'
                onClick={() => handleFilterChange('attended')}
              >
                Checked-in
              </button>
              <button
                className='btn btn-outline-danger me-3'
                type='button'
                onClick={() => handleFilterChange('absent')}
              >
                NOT Checked-in
              </button>
              <button
                type='button'
                class='btn btn-primary me-2'
                data-bs-toggle='modal'
                data-bs-target='#staticBackdrop'
              >
                Create New Guest
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
                        Create New Guest
                      </h5>
                      <button
                        type='button'
                        class='btn-close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                      ></button>
                    </div>
                    <div class='modal-body'>
                      <form onSubmit={handleSubmit}>
                        <div>
                          <label htmlFor='exampleFormControlInput1'>
                            Guest First Name
                          </label>
                          <input
                            className='form-control'
                            id='exampleFormControlInput1'
                            placeholder='Name'
                            value={guestData.firstname}
                            onChange={(e) =>
                              setGuestData({
                                ...guestData,
                                firstname: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor='exampleFormControlInpu2'>
                            Guest Last Name
                          </label>
                          <input
                            className='form-control'
                            id='exampleFormControlInput2'
                            placeholder='Name'
                            value={guestData.lastname}
                            onChange={(e) =>
                              setGuestData({
                                ...guestData,
                                lastname: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor='exampleFormControlInput3'>
                            salutation
                          </label>
                          <input
                            className='form-control'
                            id='exampleFormControlInput3'
                            placeholder='Name'
                            value={guestData.salutation}
                            onChange={(e) =>
                              setGuestData({
                                ...guestData,
                                salutation: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor='exampleFormControlInput3'>
                            Title
                          </label>
                          <input
                            className='form-control'
                            id='exampleFormControlInput3'
                            placeholder='Name'
                            value={guestData.title}
                            onChange={(e) =>
                              setGuestData({
                                ...guestData,
                                title: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor='exampleFormControlInput6'>
                            FF/GC
                          </label>
                          <input
                            className='form-control'
                            id='exampleFormControlInput6'
                            placeholder='Name'
                            value={guestData.localinternational}
                            onChange={(e) =>
                              setGuestData({
                                ...guestData,
                                localinternational: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor='exampleFormControlInput4'>
                            Organization
                          </label>
                          <input
                            className='form-control'
                            id='exampleFormControlInput4'
                            placeholder='Name'
                            value={guestData.organization}
                            onChange={(e) =>
                              setGuestData({
                                ...guestData,
                                organization: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        {isLoading ? (
                          <p>Loading...</p>
                        ) : (
                          <>
                            {successMessage && (
                              <p className='success-message'>
                                {successMessage}
                              </p>
                            )}
                            {errorMessage && (
                              <p className='error-message'>{errorMessage}</p>
                            )}
                            <input
                              className='btn btn-primary mt-3'
                              type='submit'
                              value='Submit'
                            />{' '}
                          </>
                        )}
                      </form>
                    </div>
                    <div class='modal-footer'>
                      <button
                        type='button'
                        class='btn btn-primary'
                        data-bs-dismiss='modal'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-12'>
              <div className='table-responsive guest-list mt-2'>
                {filteredGuestscat(allGuests).length === 0 ? (
                  <p>No Records Found</p>
                ) : (
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>organization</th>
                        <th>FF/GC</th>
                        <th>status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuestscat(allGuests).map((guest) => (
                        <tr key={guest._id} className='t-row'>
                          <td>
                            {guest.firstname} {guest.lastname} {''}{' '}
                          </td>
                          <td>{guest.title}</td>
                          <td>{guest.organization}</td>
                          <td>{guest.localinternational}</td>
                          <td>{guest.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
