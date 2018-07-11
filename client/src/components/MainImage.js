import React, { Component } from 'react';
import './MainImage.css';


class MainImage extends Component {

  constructor(props) {
    super(props);
    this.uploadHandler = this.uploadHandler.bind(this);
    console.log(props);
  }

  uploadHandler() {
    const uploadedFile = document.getElementById('file').files[0];
    var reader = new FileReader();
    const self = this;
    reader.onloadend = function () {
      
      self.props.selectImage(reader.result);
      //processFile(reader.result, file.type);
    };

    reader.onerror = function () {
      console.log('There was an error reading the file!');
    };

    reader.readAsDataURL(uploadedFile);
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
    
    return <div className="MainImage">
      <div style={style} className="MainImageInner">
        <input onChange={this.uploadHandler} id="file" className="inputfile" type="file" accept="image/*" capture="camera" />
        <label class="uploadButton" htmlFor="file">
            Upload &#128228;
        </label>
      </div>
    </div>;
  }
}

export default MainImage;
