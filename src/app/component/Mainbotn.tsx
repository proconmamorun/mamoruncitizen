"use client"
import React, { Component } from "react";
import './Mainbotn.css';

interface MainbotnProps {
  name: string;
}

export class Mainbotn extends Component<MainbotnProps> {
  render(): React.ReactNode {
    return (
      <button className="mainbotn-button">
        {this.props.name}
      </button>
    );
  }
}
