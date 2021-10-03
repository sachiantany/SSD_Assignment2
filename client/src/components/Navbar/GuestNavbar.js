
import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import './Header.css';
import Icon from "../../images/icon.svg"


const GuestNavBar = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();

    const events = window.gapi;
    const CLIENT_ID = "1011298100450-1rp5ul3t44qopnau7jvplvsh839qqqfj.apps.googleusercontent.com";
    const API_KEY = "AIzaSyDB4rEjetqXX195yC-msAAaiO8kayYTh4I";
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const handleClick = () => {
        events.load('client:auth2', () => {
            console.log('loaded client')

            events.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })

            events.client.load('calendar', 'v3', () => console.log('bam!'))

            events.auth2.getAuthInstance().signIn()
                .then(() => {

                    var event = {
                        'summary': 'Awesome Event!',
                        'location': '800 Howard St., San Francisco, CA 94103',
                        'description': 'Really great refreshments',
                        'start': {
                            'dateTime': '2020-06-28T09:00:00-07:00',
                            'timeZone': 'America/Los_Angeles'
                        },
                        'end': {
                            'dateTime': '2020-06-28T17:00:00-07:00',
                            'timeZone': 'America/Los_Angeles'
                        },
                        'recurrence': [
                            'RRULE:FREQ=DAILY;COUNT=2'
                        ],
                        'attendees': [
                            {'email': 'lpage@example.com'},
                            {'email': 'sbrin@example.com'}
                        ],
                        'reminders': {
                            'useDefault': false,
                            'overrides': [
                                {'method': 'email', 'minutes': 24 * 60},
                                {'method': 'popup', 'minutes': 10}
                            ]
                        }
                    }

                    var request = events.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                    })

                    request.execute(event => {
                        console.log(event)
                        window.open(event.htmlLink)
                    })


                    // get events
                    events.client.calendar.events.list({
                        'calendarId': 'primary',
                        'timeMin': (new Date()).toISOString(),
                        'showDeleted': false,
                        'singleEvents': true,
                        'maxResults': 10,
                        'orderBy': 'startTime'
                    }).then(response => {
                        const events = response.result.items
                        console.log('EVENTS: ', events)
                    })



                })
        })
    };

    const logout = () => {
      dispatch({ type: actionType.LOGOUT });
  
      history.push('/auth');
  
      setUser(null);
    };
  
    useEffect(() => {
      const token = user?.token;
  
      if (token) {
        const decodedToken = decode(token);
  
        if (decodedToken.exp * 1000 < new Date().getTime()) logout();
      }
  
      setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    return ( 
        <AppBar className={classes.appBar} position="static" color="inherit">
        <header>
        <div className="container2">
            <br/>
            <nav>
                <ul className="nav-list nav-list-mobile">
                    <li className="nav-item">
                        <div className="mobile-menu">
                            <span className="line line-top"/>
                            <span className="line line-bottom"/>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link nav-link-apple"/>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link nav-link-bag"/>
                    </li>
                   
                </ul>
                {/* <!-- /.nav-list nav-list-mobile -->  */}
                <ul className="nav-list nav-list-larger">
                    <li className="nav-item search-hiden">
                      
                        <input className="nav-link nav-link-searchbar" type="text" 
                            placeholder="&#xF002; Search apple.com" 
                            style={{fontFamily:"Arial, FontAwesome"}} />
                      
                    </li>
                    <li className="nav-item nav-item-hidden">
                        <img src={Icon} className="nav-link-apple" alt=""/>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link">News Feed</a>
                    </li>
                
                    <li className="nav-item">
                        <a href="/" className="nav-link">Friends</a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link">Events</a>
                    </li>
                    <li className="nav-item">
                        <a href="/" className="nav-link">Support</a>
                    </li>

                    <li className="nav-item">
                    </li>
                    <li className="nav-item">
                            {/* <a href="#" className="nav-link nav-link-bag"></a> */}
                        {user?.result ? (

                              <div className={classes.profile}>


                                  <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>

                                  <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography>

                                  <div className="events">
                                      {/*<Button  variant="contained" className={classes.event} color="primary" onClick={handleClick}>Add Event</Button>*/}
                                  </div>
                                <Button  variant="contained" className={classes.logout} color="primary" onClick={logout}>Logout</Button>
                            </div>

                            
                        ) : (
                             <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
                         )}
                    </li>
                  
                  
                </ul> 
                    
            </nav>

        </div>
    </header>
    </AppBar>
    )
};

 
export default GuestNavBar;










// import React, {Component}from "react"
// import Navlink from "./Navlink"
// import logo from "../../images/icons/app.svg"
// import search from "../../images/icons/search-icon-sm.png"
// import cart from "../../images/icons/cart-sm.png"
// import './Header.css'

// className GuestNavbar extends Component {
//     render() { 
//         return ( 
//             <div classNameName="nav-wrapper fixed-top">
//                 <div classNameName="container">
//                     <nav classNameName="navbar navbar-toggleable-sm navbar-expand-md">
//                         <button classNameName="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target=".navbar-collapse">
//                             ☰
//                         </button>
//                         <a classNameName="navbar-brand mx-auto" href="#top"><img src={logo}/></a>

//                         <div classNameName="navbar-collapse collapse">
//                             <ul classNameName="navbar-nav nav-justified w-100 nav-fill">

//                                 <Navlink linkUrl ="#top"linkName="Mac"/>
//                                 <Navlink linkUrl ="#top"linkName="iPhone"/>
//                                 <Navlink linkUrl ="#top"linkName="iPad"/>
//                                 <Navlink linkUrl ="#top"linkName="Watch"/>
//                                 <Navlink linkUrl ="#top"linkName="TV"/>
//                                 <Navlink linkUrl ="#top"linkName="Music"/>
//                                 <Navlink linkUrl ="#top"linkName="Support"/>
//                                 <Navlink linkUrl ="#top" Image = {<img src={search}/>}/>
//                                 <Navlink linkUrl ="#top" Image = {<img src={cart}/>}/>
                                
                
                             
//                             </ul>
//                         </div>
//                     </nav>
//                 </div>
// 	        </div>
//         );     
//     }
// }
 
// export default GuestNavbar;