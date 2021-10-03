import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import GuestNavBar from './components/Navbar/GuestNavbar';
import Auth from './components/Auth/Auth';
import Event from './components/Event/Events';

const App = () => (
  <BrowserRouter>
    <GuestNavBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/auth" exact component={Auth} />
          <Route path="/events" exact component={Event} />
      </Switch>
  </BrowserRouter>
);

export default App;