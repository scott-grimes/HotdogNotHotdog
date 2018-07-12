import React, { Component } from 'react';
import MainImage from './components/MainImage';
import Results from './components/Results';
import Carousel from './components/Carousel';
import {
  getPredictionFromServer,
  imageToPixelBlob
} from "./scripts/api";
import "./App.css";
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
      lastRandomFetch: 0
     }; // can be 'none', 'ishotdog', 'notishotdog'
    this.fetchRandomImages = this.fetchRandomImages.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.predict = this.predict.bind(this);
    this.fetchRandomImages();
    this.predict(this.state.mainImage);
    this.uploadHandler = this.uploadHandler.bind(this)
    
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
    const self = this;
    this.setState({predictions: []})
    this.setState({title:'Processing...'})
    const img = document.createElement("IMG");
    var found = false;
    img.onload = async function(){
      try{
        const pixelBlob = await imageToPixelBlob(this);
      
        setTimeout(() => {
          if(!found){
            throw('Server Timeout')
          }
        }, 5000);
        const response = await getPredictionFromServer(pixelBlob);
        let predictions = null;
        
        if(response.status===200){
          found = true
          await response.json().then(res => predictions = res)
          
          self.setState({ predictions: predictions }); 
          

          let verdict = 'NOT HOTDOG';
          if (predictions.map(x => x.className).includes('hotdog')) {
          
            verdict = 'MAYBE HOTDOG';
          }
          if (predictions[0].className.includes('hotdog')) {

            verdict = 'IS HOTDOG';
          }

          self.setState({title:verdict})
          

        }
        
      }catch(err){
        console.log(err)
        
      }
      
    }
    img.src = imgsrc;

    
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
    const now = Date.now();
    if(now<this.state.lastRandomFetch+2000) return;
    this.setState({lastRandomFetch: now})
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
    if (!this.state.allowSelection) {
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
        <input onChange={this.uploadHandler} id="file" className="inputfile" type="file" accept="image/*" capture="camera" />
        <label class="uploadButton" htmlFor="file">
          Upload &#128228;
        </label></header>
        <div className="ContentWrapper">
          <h1 className="Title">{this.state.title+' '}<span style={{'color':color}}>{marker}</span></h1>
          <MainImage selectImage={this.selectImage} mainImage={this.state.mainImage} />
        <Results predictions={this.state.predictions} />
     </div>
     <div className="ContentWrapper">
      <Carousel selectImage={this.selectImage} fetchRandomImages={this.fetchRandomImages} randomImages={this.state.randomImages} />
      </div>
      </div>;
  }
}

export default App;
