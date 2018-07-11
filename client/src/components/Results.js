import React, { Component } from 'react';
import './Results.css';

class Results extends Component {


  render() {
    if (!this.props.predictions.length) {
      return (<div className="Results">Thinking...</div>);
    }
   

    return (
      <div className="Results">
      
        {this.props.predictions.map((x, idx) => < div key={idx}>{x.className.toUpperCase()} {Math.floor(x.probability * 100) + '%'}</div>)}
      </div>);
  }
}

export default Results;
