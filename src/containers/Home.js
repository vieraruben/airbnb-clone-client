import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PageHeader, ListGroup, ListGroupItem, Badge } from "react-bootstrap";

import "./Home.css";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";

import PropertyCard from "../components/PropertyCard";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import NavDropdown from 'react-bootstrap/NavDropdown'

import Alert from 'react-bootstrap/Alert'


export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [noFound, setNoFound] = useState(false);

  const [show, setShow] = useState(true);

  const history = useHistory();


  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!isAuthenticated)
      history.push("/login");
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function searchProperties(params) {
    return API.get("api", `/search?country_city=${params}`);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!search) {
      setShow(true)
      setNoFound(true)
      return
    }

    setShow(false)
    setNoFound(false)
    const params = search.split(" ").reverse().join("_").toLowerCase();
    const result = await searchProperties(params);
    setProperties(result.body)
    if (result.body.length === 0) {
      setShow(true)
      setNoFound(true)
    }
  }

  return (
    <Container className="Home">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Form inline onSubmit={handleSearch}>
            <FormControl type="text"
              style={{ width: '300px' }}
              placeholder="Nashville Tennesse"
              className="mr-sm-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button type="submit" variant="outline-success">Search</Button>
          </Form>
          <br />
        </Col>
      </Row>

      {noFound && <Row className="justify-content-md-center">
        <Col>
          {show && <Alert variant="info" onClose={() => setShow(false)} dismissible>
            No property found!
          </Alert>}
        </Col>
      </Row>}

      <Row className="justify-content-md-center">
        {properties.map((property, index) => <Col key={index}>
          <PropertyCard
            id={property.propertyId}
            title={property.title}
            price={property.price}
            pictureUrl={property.pictureUrl}
          />
        </Col>)}
      </Row>
    </Container >
  );
}
