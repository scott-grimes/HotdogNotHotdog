import React, { Component } from 'react';
import './MainImage.css';


class MainImage extends Component {

  
  
  render() {
    const style = {
      width: '100%',
      height: '300px',
      backgroundImage: `url(${this.props.mainImage})`,
      'backgroundRepeat': 'no-repeat',
      'backgroundSize': 'contain',
      'backgroundPosition': 'center'
    };
    
    return <div className="MainImage">
      <div style={style} className="MainImageInner">
        
      </div>
    </div>;
  }
}

export default MainImage;
