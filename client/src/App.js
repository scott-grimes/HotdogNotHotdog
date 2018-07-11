import React, { Component } from 'react';
import MainImage from './components/MainImage';
import Results from './components/Results';
import Carousel from './components/Carousel';
import {
  convertToBase64,
  sendBase64ToServer,
  sendingPixelBlobToServer,
  imageToPixelBlob
} from "./scripts/api";
import "./App.css";
//import logo from './logo.svg';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      mainImage: '/images/hotdogImages/hotdog.png', randomImages: [], allowSelection: true, overlay: 'none' }; // can be 'none', 'ishotdog', 'notishotdog'
    this.fetchRandomImages = this.fetchRandomImages.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.predict = this.predict.bind(this);
    this.fetchRandomImages();
  }

  async predict(image) {
    //const hd64 = await convertToBase64(image.src);
    const time = Date.now();
    console.log('Predicting...')
    const pixelBlob = await imageToPixelBlob(image);
    console.log('in predict app',pixelBlob)
    const response = await sendingPixelBlobToServer(pixelBlob);
    let predictions = null;
    await response.json().then(res=>predictions=res)
    //const predictions = await sendBase64ToServer(hd64);
    const duration = Date.now() - time;
    console.log(predictions)
    console.log(`Prediction completed in ${Math.floor(duration)}ms`);
    /*
    let hotdogToken = 'Not Hotdog'
    hotdogToken = predictions[0].className.includes('hotdog') ? 'Maybe Hotdog' : hotdogToken;
    hotdogToken = predictions[0].probability > 0.9 ? 'Is Hotdog' : hotdogToken;
    let solution = 'Verdict: ';
    solution += hotdogToken;
    solution += '\n\nMachine Thinks this is...\n';
    for (let predict of predictions) {
      solution += predict.className + ' : ' + Math.floor(Math.round(predict.probability * 100)) + '%\n'
    }
    console.log(solution)
    return solution*/

    
  }

  

  fetchRandomImages() {

    return fetch('/random')
      .then(function (response) {
        return response.json();
      })
      .then(list => {
        this.setState({ randomImages: list });
      })
      .catch(err=>console.log(err));
    
  }


  selectImage(img) {
    if (!this.state.allowSelection) {
      return;
    }
    //console.log(img);
    this.setState({allowSelection: false, mainImage: img.src});
    // set state to locked

    // load image
    setTimeout(()=>this.setState({allowSelection: true}), 1000);
    // fetch thing
    // on promise resolve, trigger rerender
    this.predict(img);
  }

  render() {
    //console.log(this.state);
    return <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header> */}
      <MainImage mainImage={this.state.mainImage} />
      <Results />
      <Carousel selectImage={this.selectImage} fetchRandomImages={this.fetchRandomImages} randomImages={this.state.randomImages} />
    </div>;
  }
}

export default App;
