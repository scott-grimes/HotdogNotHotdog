import React, { Component } from 'react';
import './MainImage.css';

class MainImage extends Component {

  constructor(props) {
    super(props);
  }
  
  render() {
    const style = {
      width: '100%',
      height: '300px',
      backgroundImage: `url(${this.props.mainImage})`,
      'backgroundRepeat': 'no-repeat',
      'backgroundSize': 'contain',
      'backgroundPosition': 'center'
    };
    
    return (
      <div className="MainImage">
        <div style={style} className="MainImageInner">
          <input id="file" className="inputfile" type="file" accept="image/*" capture="camera" />
          <label htmlFor="file">
          Upload
          </label>
        </div>
      </div>
    );
  }
}

export default MainImage;
