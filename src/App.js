import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


const app = new Clarifai.App({apiKey: '0a6e9572400640b5ae84ff587db1436c'});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = (event) => {
    app.models.predict('a403429f2ddf4b49b307e318f00e528b', this.state.input)
        .then(this.logBoxes)
        .catch(console.log);
    this.setState({input: ''});
  };

  logBoxes = (response) => {
    let regions = response.outputs[0].data.regions;
    for (let region of regions) {
      console.log(region.region_info.bounding_box)
    }
  };

  render() {
    return (
      <div className="App">
        <Particles
            className='Particles'
            params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            inputValue={this.state.input} />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
