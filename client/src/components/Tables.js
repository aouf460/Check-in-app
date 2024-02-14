import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableCounts = () => {
  const [tableCounts, setTableCounts] = useState([]);

  useEffect(() => {
    fetchAttendedGuests();
  }, []);

  const fetchAttendedGuests = async () => {
    try {
      const response = await axios.get(
        '/api/guests/attended'
      );
      const attendedGuests = response.data;

      // Count occurrences of each table number
      const tableCountsMap = {};
      attendedGuests.forEach((guest) => {
        const { tableNo } = guest;
        tableCountsMap[tableNo] = (tableCountsMap[tableNo] || 0) + 1;
      });

      // Convert map to array of objects for easier rendering
      const tableCountsArray = Object.entries(tableCountsMap).map(
        ([tableNo, count]) => ({
          tableNo,
          count,
        })
      );

      setTableCounts(tableCountsArray);
    } catch (error) {
      console.error('Error fetching attended guests:', error);
    }
  };

  return (
    <div>
      <h2>Table Counts</h2>
      <table>
        <thead>
          <tr>
            <th>Table Number</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {tableCounts.map(({ tableNo, count }) => (
            <tr key={tableNo}>
              <td>{tableNo}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCounts;
