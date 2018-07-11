import React, { Component } from 'react';
import './Results.css';

class Results extends Component {


  render() {
    if (!this.props.predictions.length) {
      return (<div><img alt="loading" src="/images/spinning.gif"></img></div>);
    }
    let color = 'RED';
    let verdict = 'NOT HOTDOG';
    if (this.props.predictions.map(x=>x.className).includes('hotdog')) {
      color = 'YELLOW';
      verdict = 'MAYBE HOTDOG';
    }
    if (this.props.predictions[0].className.includes('hotdog')) {
      color = 'GREEN';
      verdict = 'IS HOTDOG';
    }

    const verdictStyle = {
      'color': color,
      'fontWeight': 'bold'
    };

    return (<div>
      <div className="Results">
        <div style={verdictStyle}>{verdict}</div>
        {this.props.predictions.map((x, idx) => < div key={idx}>{x.className.toUpperCase()} {Math.floor(x.probability * 100) + '%'}</div>)}
      </div></div>);
  }
}

export default Results;
