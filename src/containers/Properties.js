import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl } from "react-bootstrap";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import { FaBeer, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { Button, Glyphicon } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const history = useHistory();
  const file = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState({
    type: '',
    text: ''
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");

  const [property, setProperty] = useState({
    title: "",
    type: "",
    country: "",
    city: "",
    price: 0,
    pictureUrl: ""
  });

  useEffect(() => {
    async function onLoad() {
      try {
        await loadProperties()
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, []);

  function createProperty(property) {
    return API.put("api", "/property", {
      body: property
    });
  }

  function validateForm() {
    if (Number.isInteger(property.price * 1)) {
      return true;
    }
    return false;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
      setProperty({ ...property, price: '' })
      return
    }
    handleClose()
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
        config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    if (!file.current) {
      alert('Please, select a picture for your property!');
      return
    }

    try {
      setIsLoading(true)
      const filename = file.current ? await s3Upload(file.current) : null
      property.pictureUrl = `https://${config.s3.BUCKET}.s3.us-east-2.amazonaws.com/public/${filename}`
      await createProperty(property);
      setIsLoading(false);
      setSuccessMessage({
        type: 'info',
        text: 'Property added successfully!'
      });
      await loadProperties()
    } catch (e) {
      setIsLoading(false);
    }
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function loadOwnerProperties() {
    return API.get("api", "/properties");
  }

  async function loadProperties() {
    const result = await loadOwnerProperties();
    setProperties(result.body)
  }

  return (
    <Container className="Properties">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Form inline>
            <FormControl type="text" style={{ width: '300px' }}
              placeholder="Search"
              className="mr-sm-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button variant="success" onClick={handleShow}>
              <FaPlusCircle />
            </Button>
          </Form>
          {successMessage.type && <div className="message">
            <br />
            <Alert variant={successMessage.type} onClose={() => setSuccessMessage({
              type: '',
              text: ''
            })} dismissible>
              {successMessage.text}
            </Alert>
          </div>}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>New Property</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Title"
                    value={property.title}
                    onChange={e => setProperty({ ...property, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Country"
                    value={property.country}
                    onChange={e => setProperty({ ...property, country: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    value={property.city}
                    onChange={e => setProperty({ ...property, city: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Price"
                    value={property.price}
                    onChange={e => setProperty({ ...property, price: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="file">
                  <FormControl onChange={handleFileChange} type="file" accept="image/x-png,image/gif,image/jpeg" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {isLoading && <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />} Save
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <br />
        </Col>
      </Row>
      <Row>
        {properties.filter(property => property.title.includes(search)).map((property, index) => <Col key={index} style={{ marginBottom: '1em' }}>
          <PropertyCard
            id={property.propertyId}
            title={property.title}
            price={property.price}
            pictureUrl={property.pictureUrl}
            setSuccessMessage={setSuccessMessage}
            loadProperties={loadProperties}
            owner={true}
          />
        </Col>)}
      </Row>
    </Container>
  );
}