import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Header extends Component {
  render() {
    return (
      <h1 id="title">
        { this.props.children }
      </h1>
    );
  }
}