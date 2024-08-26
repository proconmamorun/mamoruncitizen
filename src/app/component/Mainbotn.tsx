"use client"
import React, { Component } from "react";

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
