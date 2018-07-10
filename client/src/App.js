import React, { Component } from 'react';
import MainImage from './components/MainImage';
import Results from './components/Results';
import Carousel from './components/Carousel';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      mainImage: '/images/hotdogs/hotdog.png', 
      randomImages: [],
      allowSelection: true,
      overlay: 'none' // can be 'none', 'ishotdog', 'notishotdog'
    };
    this.fetchRandomImages = this.fetchRandomImages.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.fetchRandomImages();
  }

  

  fetchRandomImages() {

    fetch('/random')
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
    console.log(img);
    this.setState({allowSelection: false, mainImage: img.src});
    // set state to locked

    // load image
    setTimeout(()=>this.setState({allowSelection: true}), 1000);
    // fetch thing
    // on promise resolve, trigger rerender
  }

  render() {
    console.log(this.state);
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
