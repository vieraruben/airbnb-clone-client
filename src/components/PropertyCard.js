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

export default function PropertyCard({ id, title, price, pictureUrl, owner = false }) {
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
      history.push("/");
    } catch (e) {
      onError(e);
      // setIsDeleting(false);
    }
  }

  return <Card style={{ width: '11rem' }} className="PropertyCard">
    <Link to={`/properties/${id}`}>
      <Card.Img variant="top" src={pictureUrl} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          <Badge variant="secondary">${price}</Badge>
          {owner && <Button variant="danger" style={{marginLeft: '30%'}} onClick={handleDelete}><FaTrashAlt /></Button>}
        </Card.Text>
      </Card.Body>
    </Link>
  </Card>
}