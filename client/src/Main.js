import React from 'react';
import Simulator from './Simulator';
import Login from './Login';
import { Switch,Route } from 'react-router-dom';

const Main = () => (
    <main>
        <Switch>
            <Route path="/simulator" component={Simulator}/>
            <Route path='/' component={Login} />
        </Switch>
    </main>
);

export default Main