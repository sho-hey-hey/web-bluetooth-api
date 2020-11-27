import { IndexPage } from "components/IndexPage";
import { ControlCharacteristicPage } from "components/ControlCharacteristicPage";
import { GetServicesAndCharacteristicsPage } from "components/GetServicesAndCharacteristicsPage";
import React from "react";
import {  BrowserRouter as Router,  Switch,  Route } from "react-router-dom";

export const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/cc" component={ControlCharacteristicPage} />
                <Route path="/gsac" component={GetServicesAndCharacteristicsPage} />
                <Route path="/" component={IndexPage} />
            </Switch>
        </Router>
    );
};
