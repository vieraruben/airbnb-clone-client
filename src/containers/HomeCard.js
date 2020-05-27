import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import Carousel from './Carousel'
import { Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from '@material-ui/core/Container';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function HomeCard({ items, height }) {
  const classes = useStyles();

  return (
    <Container maxWidth="xl">
      <Card className={classes.root}>
        <Carousel items={items} height={height} />
        <CardHeader
          component={Link} to={`/properties/Kaizen`}
          avatar={
            <div className="avatar"></div>
          }
          action={
            <div><StarIcon fontSize='small' />5.55</div>
          }
          title="SUPERSHOT-$4000"
          subheader="Entire Appartment Entire"
        />
      </Card>
    </Container>
  );
}