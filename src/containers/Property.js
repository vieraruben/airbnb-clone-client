import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl } from "react-bootstrap";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { FaBeer, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { Button, Glyphicon } from "react-bootstrap";
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from 'react-bootstrap/Spinner'

import './Property.css'

export default function Property() {
  const history = useHistory();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [properties, setProperties] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);

  const [property, setProperty] = useState({
    title: "",
    type: "",
    country: "",
    city: "",
    price: 0
  });

  function loadBookedDates() {
    return API.get("api", `/propertyDates?propertyId=${id}`);
  }

  useEffect(() => {
    function loadOwnerProperties() {
      return API.get("api", `/properties?propertyId=${id}`);
    }

    async function onLoad() {
      try {
        const poperty = await loadOwnerProperties();
        const bookedDates = await loadBookedDates();

        setProperty(poperty.body[0])
        setBookedDates(bookedDates.body)
        console.log('properties ' + JSON.stringify(poperty.body[0]))
        console.log('bookedDates ' + JSON.stringify(bookedDates))
        // const { content, attachment } = properties;

        // if (attachment) {
        //   property.attachmentURL = await Storage.vault.get(attachment);
        // }
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, []);

  function bookProperty(book) {
    return API.put("api", "/book", {
      body: book
    });
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setIsLoading(true)
      const result = await bookProperty({
        startBookingDate: startDate,
        endBookingDate: endDate,
        propertyId: property.propertyId,
        propertyTitle: property.title
      })
      const bookedDates = await loadBookedDates();
      setBookedDates(bookedDates.body)
      setIsLoading(false)
    } catch (e) {
      onError(e);
    }
  }

  function getDate(date) {
    return new Date(date)
  }

  return (
    <Container className="Property">
      <form className="booking_form" style={{ textAlign: 'center' }} onSubmit={handleSubmit}>
        <Row className="justify-content-md-center">
          <Col xs={12}>
            {!property.pictureUrl && <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />}
            {property.pictureUrl && <Image style={{ width: '350px' }}
              src={property.pictureUrl}
              alt="First slide"
              rounded
            />}
          </Col>
          <Col sm={12}>
            <h5>Title: {property.title}</h5>
            <h5>City: {property.city}</h5>
            <h5>Country: {property.country}</h5>
            <h5>Price: {property.price}</h5>
          </Col>
          <Col sm={12}>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
            />
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
            />
          </Col>
        </Row>
        <br />
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button variant="outline-success" type="submit">{isLoading && <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />}BOOK</Button>
          </Col>
        </Row>
      </form>
      <br />
      <h2 style={{ textAlign: 'center' }}>Booked Dates</h2>
      <hr />
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Table>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {bookedDates.map((date, index) => {
                if (date) {
                  return <tr key={index}>
                    <td>{date.startBookingDate}</td>
                    <td>{date.endBookingDate}</td>
                  </tr>
                }
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}