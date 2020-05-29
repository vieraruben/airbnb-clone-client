import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { useParams, useHistory, Link } from "react-router-dom";
import { Button, Glyphicon } from "react-bootstrap";
import "./PropertyCard.css";
import Badge from 'react-bootstrap/Badge'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

import { FaBeer, FaTrashAlt } from 'react-icons/fa';

import Carousel from 'react-bootstrap/Carousel'

export default function PropertyCard({ id, title, price, pictureUrl, setSuccessMessage, loadProperties, owner = false }) {
  const history = useHistory();

  function deleteProperty() {
    return API.del("api", `/property?propertyId=${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProperty();

      setSuccessMessage({
        type: 'info',
        text: `Property ${title} removed successfully!`
      })
      await loadProperties()
      history.push("/properties");
    } catch (e) {
      onError(e);
    }
  }

  return <Card style={{ width: '11rem' }} className="PropertyCard">
    <Link to={`/properties/${id}`}>
      <Card.Img variant="top" src={pictureUrl} style={{height: '150px'}}/>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Container>
          <Row>
            <Col>
              <Card.Text>
                <Badge variant="secondary">${price}</Badge>
              </Card.Text>
            </Col>
            <Col>
              {owner && <Button variant="danger" style={{ marginLeft: '30%' }} onClick={handleDelete}><FaTrashAlt /></Button>}
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Link>
  </Card>
}
