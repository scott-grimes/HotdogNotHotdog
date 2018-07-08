import React, { Component } from 'react';
import './MainImage.css';

class MainImage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      width: '600px',
      height: '600px',
      backgroundImage: `url(${this.props.mainImage})`,
      'backgroundRepeat': 'no-repeat',
      'backgroundSize': 'contain',
      'backgroundPosition': 'center'
    };
    
    return (
      <div className="MainImage">
        <div style={style}>
          <input className="inputfile" type="file" accept="image/*" capture="camera" />
          <label className="inputfile" htmlFor="file">
          Upload
          </label>
        </div>
      </div>
    );
  }
}

export default MainImage;
