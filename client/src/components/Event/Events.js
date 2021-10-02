import React, { useState } from 'react';
import DateMomentUtil from "@date-io/moment";
import {DateTimePicker,MuiPickersUtilsProvider} from "@material-ui/pickers";
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/EventOutlined';
import useStyles from '../Auth/styles';
import Input from '../Auth/Input';

const initialState = {summary: '', description: ''};

const Event = () => {
    const events = window.gapi;
    const CLIENT_ID = "1011298100450-1rp5ul3t44qopnau7jvplvsh839qqqfj.apps.googleusercontent.com";
    const API_KEY = "AIzaSyDB4rEjetqXX195yC-msAAaiO8kayYTh4I";
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const [form, setForm] = useState(initialState);
    const [startDate, handleStartDateChange] = useState(new Date());
    const [endDate, handleEndDateChange] = useState(new Date());
    const classes = useStyles();

    const handleClick = (e) => {
        e.preventDefault();

        events.load('client:auth2', () => {
            console.log('loaded client');

            events.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            events.client.load('calendar', 'v3', () => console.log('Calender Started'))

            events.auth2.getAuthInstance().signIn()
                .then(() => {
                    const event = {
                        'summary':form.summary,
                        'description': form.description,
                        'start': {
                            'dateTime': startDate,
                            'timeZone': 'America/Los_Angeles'
                        },
                        'end': {
                            'dateTime': endDate,
                            'timeZone': 'America/Los_Angeles'
                        }
                    }

                    const request = events.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                    });

                    request.execute(event => {
                        console.log(event)
                        window.open(event.htmlLink)
                    });


                    // get events
                    events.client.calendar.events.list({
                        'calendarId': 'primary',
                        'timeMin': (new Date()).toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'maxResults': 10,
                        'orderBy': 'startTime'
                    }).then(response => {
                        const events = response.result.items;
                    })



                })
        })
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">Add Events</Typography>
                <form className={classes.form} onSubmit={handleClick}>
                    <Grid container spacing={2}>
                        <Input name="summary" label="Summary" handleChange={handleChange} type="text"/>
                        <Input name="description" label="Description" handleChange={handleChange} type="text"/>
                        <MuiPickersUtilsProvider utils={DateMomentUtil}>
                            <DateTimePicker
                                label="Start Date & Time"
                                inputVariant="outlined"
                                value={startDate}
                                className={classes.startDate}
                                onChange={handleStartDateChange}
                            />
                            <DateTimePicker
                                label="End Date & Time"
                                inputVariant="outlined"
                                value={endDate}
                                className={classes.endDate}
                                onChange={handleEndDateChange}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Button  variant="contained" className={classes.event} color="primary" onClick={handleClick}>Add Event</Button>

                </form>
            </Paper>
        </Container>
    );
};

export default Event;
