import React, { Component } from 'react';
import './Carousel.css';

class Carousel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="Carousel">
      <p>Image 1 Image 2 Image 3 Image 4 Image 5</p>
      <p>Random</p>
    </div>;
  }
}

export default Carousel;
