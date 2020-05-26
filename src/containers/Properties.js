import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { useParams, useHistory } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl } from "react-bootstrap";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FaBeer, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { Button, Glyphicon } from "react-bootstrap";
import Form from 'react-bootstrap/Form'

import Modal from 'react-bootstrap/Modal'
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
  const history = useHistory();
  const file = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);

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

  async function handleSubmit(event) {
    event.preventDefault();
    // if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
    //   alert(
    //     `Please pick a file smaller than ${
    //       config.MAX_ATTACHMENT_SIZE / 1000000
    //     } MB.`
    //   );
    //   return;
    // }
    // if (!file.current)
    //   console.log('theres no file ' + JSON.stringify(file.current));
    try {
      setIsLoading(true);
      // const attachment = file.current ? await s3Upload(file.current) : null;
      // console.log('attachment ' + attachment)
      // property.attachment = attachment;
      if(!property.pictureUrl)
        property.pictureUrl = "https://mattamyhomes.com/~/media/images/mattamywebsite/corp/home/heroslideshow/usa/orlando/orl_geohero_02_1600x800.jpg"
      await createProperty(property);
      setIsLoading(false);
      history.push("/");
    } catch (e) {
      console.log('i am here')
      // onError(e);
      setIsLoading(false);
    }
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function createProperty(property) {
    return API.put("api", "/property", {
      body: property
    });
  }



  useEffect(() => {
    function loadOwnerProperties() {
      return API.get("api", "/properties");
    }
    async function onLoad() {
      try {
        const result = await loadOwnerProperties();
        setProperties(result.body)
        console.log('properties ' + JSON.stringify(result.body))
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
                <Form.Group controlId="pictureUrl">
                  <Form.Label>Picture Url</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://mattamyhomes.com/~/media/images/mattamywebsite/corp/home/heroslideshow/usa/orlando/orl_geohero_02_1600x800.jpg"
                    value={property.pictureUrl}
                    onChange={e => setProperty({ ...property, pictureUrl: e.target.value })}
                  />
                </Form.Group>
                {/* <Form.Group controlId="file">
                  <FormControl onChange={handleFileChange} type="file" />
                </Form.Group> */}
                <Button variant="primary" type="submit">
                  Save
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
        {properties.filter(property => property.title.includes(search)).map((property, index) => <Col key={index}>
          <PropertyCard
            id={property.propertyId}
            title={property.title}
            price={property.price}
            pictureUrl={property.pictureUrl}
            owner={true}
          />
        </Col>)}
      </Row>
    </Container>
  );
}