import React, { Component } from 'react';
import './Carousel.css';

class Carousel extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(e) {
    e.preventDefault();
    this.props.selectImage(e.target);
  }

  render() {
    console.log(this.props.randomImages, 'rendering caroslul');
    if (this.props.randomImages) {
      console.log('images yes');
      return <div className="Carousel">
        <div className="CarouselInner">
          <div className="ImageList">
            {this.props.randomImages.map((url, index) => {
              return <img key={index} src={url} onClick={this.handleSelect}></img>;
            })}</div>
          <p><a href="#" onClick={this.props.fetchRandomImages}>Random</a></p></div>
      </div>;
    }

    return (<div><p><a href="#" onClick={this.props.fetchRandomImages}>Random</a></p></div>);
  }
}

export default Carousel;
