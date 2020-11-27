import React from "react";
import {  Link } from "react-router-dom";

export const IndexPage: React.FC = () => {
    return <>
        <h2>IndexPage</h2>
        <nav>
            <ul>
                <li><Link to="/gsac">Get device Serviceis &amp; Characteristics.</Link></li>
                <li><Link to="/cc">Control characteristics.</Link></li>
            </ul>
        </nav>
    </>;
};
