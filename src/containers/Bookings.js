import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import config from "../config";

import { Button, Glyphicon } from "react-bootstrap";
import { FaBeer, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'

import Alert from 'react-bootstrap/Alert'

import './Bookings.css'

export default function Bookings() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [show, setShow] = useState(false);

  function loadBookedDates() {
    return API.get("api", "/propertyUser");
  }

  useEffect(() => {
    async function onLoad() {
      try {
        const bookedDates = await loadBookedDates();
        setBookedDates(bookedDates.body)
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, []);

  function handleNewBooking() {
    history.push("/");
  }
  function deleteBookedDate(book) {
    return API.del("api", `/book`, {
      body: book
    });
  }
  async function handleDelete(propertyId, startDate) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }
    const result = await deleteBookedDate({
      "propertyId": propertyId,
      "startBookingDate": startDate
    });
    console.log('deleted')
    setShow(true)
    const bookedDates = await loadBookedDates();
    setBookedDates(bookedDates.body)
  }

  return (
    <Container className="Bookings">
      {show && <Alert variant="success" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Your booking has been deleted successfully</Alert.Heading>
      </Alert>}
      <h2 style={{ textAlign: 'center' }}>Bookings</h2>
      <hr />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Property</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th></th>
            <th className="actions">
              <Button variant="success" onClick={() => handleNewBooking()}>
                <FaPlusCircle />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookedDates.map((bookedDate, index) => <tr key={index}>
            <td>{bookedDate.propertyTitle}</td>
            <td>{bookedDate.startBookingDate}</td>
            <td>{bookedDate.endBookingDate}</td>  
            <td><Link to={`/properties/${bookedDate.propertyId}`} style={{color: 'blue'}}>View</Link></td>  
            <td className="actions">
              <Button variant="danger" onClick={e => handleDelete(bookedDate.propertyId, bookedDate.startBookingDate)}><FaTrashAlt /></Button>
            </td>
            </tr>
            )}
        </tbody>
      </Table>
    </Container>
  );
}
