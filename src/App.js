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
      state: '' };
  }

  

  fetchRandomImages() {

  }


  selectHandler(imgsrc) {

    // set state to locked

    // load image

    // fetch thing

    // on promise resolve, trigger rerender

    

  }

  render() {
    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <MainImage mainImage={this.state.mainImage} />
      <Results />
      <Carousel />
    </div>;
  }
}

export default App;
