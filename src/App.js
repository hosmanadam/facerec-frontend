import React, {Component} from 'react';
import './App.css';
import './animate.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
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
      imageUrl: '',
      imageWidth: null,
      imageHeight: null,
      faceBoxes: [],
      isAnalysisDone: true,
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = (event) => {
    this.setState(
        {
          imageUrl: this.state.input,
          imageWidth: null,
          imageHeight: null,
          faceBoxes: [],
          isAnalysisDone: false,
        }
        );
  };

  handleImage = () => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
        .then(this.extractClarifaiData)
        .catch(console.log);

    let inputImage = document.querySelector('.input-image');
    this.setState({
      imageHeight: inputImage.height,
      imageWidth: inputImage.width,
    })
  };

  extractClarifaiData = (response) => {
    let data = response.outputs[0].data;
    let newFaceBoxes = [];

    if ('regions' in data) {
      for (let region of data.regions) {
        newFaceBoxes.push(region.region_info.bounding_box)
      }
      console.log('Faces found:', newFaceBoxes);
    } else {
      console.log('No faces found!')
    }

    this.setState(
        {
          faceBoxes: newFaceBoxes,
          isAnalysisDone: true,
        }
    );
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
        <FaceRecognition
            imageUrl={this.state.imageUrl}
            handleImage={this.handleImage}
            faceBoxes={this.state.faceBoxes}
            imageWidth={this.state.imageWidth}
            imageHeight={this.state.imageHeight}
            isAnalysisDone={this.state.isAnalysisDone}
        />
      </div>
    );
  }
}

export default App;
