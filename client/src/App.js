import React, { Component } from 'react';
import MainImage from './components/MainImage';
import Results from './components/Results';
import Carousel from './components/Carousel';
import {
  
  imageToPixelBlob
} from "./scripts/api";
import "./App.css";

import Brain from "./tfClient";
//import logo from './logo.svg';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      mainImage: '/images/hotdogImages/hotdog.png', 
      randomImages: [], 
      allowSelection: true, 
      title: 'Processing...',
      predictions:[],
      lastRandomFetch: 0,
      predictingNow: false
     }; // can be 'none', 'ishotdog', 'notishotdog'
    this.fetchRandomImages = this.fetchRandomImages.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.predict = this.predict.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this)
    
  }

  componentDidMount(){
    this.fetchRandomImages();
    this.loadBrain();
  }

  async loadBrain(){
    this.brain = new Brain();
    await this.brain.loadModel("mobilenet");
    await this.predict(this.state.mainImage);
  }

  uploadHandler() {
    const uploadedFile = document.getElementById('file').files[0];
    var reader = new FileReader();
    const self = this;
    reader.onloadend = function () {

      self.selectImage(reader.result);
      //processFile(reader.result, file.type);
    };

    reader.onerror = function () {
      console.log('There was an error reading the file!');
    };

    reader.readAsDataURL(uploadedFile);
  }

  //given an img element, predict what the image is
  async predict(imgsrc) {
    if(this.state.predictingNow){
      return;
    }
    const self = this;
    this.setState({predictions: [],
      title:'Processing...',
    'predictingNow':true }
      )

    const img = document.createElement("IMG");
    img.onload = async function(){
      try{
        const pixelBlob = await imageToPixelBlob(this);
      
        const response = await self.brain.predictFromPixelBlob(pixelBlob);
        
        self.setState({ predictions: response }); 

        let verdict = 'NOT HOTDOG';
        if (response.map(x => x.className).includes('hotdog')) {
        
          verdict = 'MAYBE HOTDOG';
        }
        if (response[0].className.includes('hotdog')) {

          verdict = 'IS HOTDOG';
        }

        self.setState({title:verdict, 'predictingNow':false})
        
      }catch(err){
        console.log(err)
        self.setState({'predictingNow': false })
      }
      
    }
    img.src = imgsrc;

  }

  fetchRandomImages() {
    const now = Date.now();
    if(now<this.state.lastRandomFetch+2000) return;
    this.setState({lastRandomFetch: now});
    return fetch('/random')
      .then(function (response) {
        return response.json();
      })
      .then(list => {
        this.setState({ randomImages: list });
      })
      .catch(err=>console.log(err));
    
  }


  selectImage(imgsrc) {
    if (!this.state.allowSelection || this.state.predictingNow) {
      return;
    }
    this.setState({allowSelection: false, mainImage: imgsrc});
    this.predict(imgsrc);
    setTimeout(()=>this.setState({allowSelection: true}), 1000);
    
  }

  render() {
    
    let marker = "";
    let color = 'white'
    if(this.state.title==='NOT HOTDOG'){
      marker = 'X';
      color = 'red'
    }
    else if(this.state.title==='MAYBE HOTDOG'){
      marker = '?';
      color = 'yellow'
    }else if(this.state.title==='IS HOTDOG'){
      marker = '✔';
      color = 'green'
    }

    return <div className="App">
        <header className="App-header">
          <h1 className="App-title">HotdogNotHotdog</h1>
          
        </header>
        <div className="ContentWrapper">
          <h1 className="Title">
            {this.state.title + " "}
            <span style={{ color: color }}>{marker}</span>
          <input onChange={this.uploadHandler} id="file" className="inputfile" type="file" accept="image/*" capture="camera" />
          
        </h1>
          <MainImage selectImage={this.selectImage} mainImage={this.state.mainImage} />
          <Results predictions={this.state.predictions} />
        </div>
        <div className="ContentWrapper">
        <label className="uploadButton" htmlFor="file">
          <span role="img" aria-label="upload">
            Upload &#128228;
            </span>
        </label>
          <Carousel selectImage={this.selectImage} fetchRandomImages={this.fetchRandomImages} randomImages={this.state.randomImages} />
        </div>
      </div>;
  }
}

export default App;
