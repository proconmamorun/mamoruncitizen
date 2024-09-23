"use client"
import React from "react";
import './Footer.css';

export class Footer extends React.Component{


    render(): React.ReactNode {
        return(
            <div className="Footer">
                <img className="Footer-button" src="./images/map.png"/>
                <img className="Footer-button" src="./images/photo.png"/>
                <img className="Footer-button" src="./images/search.png"/>
                <img className="Footer-button" src="./images/sensors.png"/>
            </div>
        );
    }
}