import React, {Component} from 'react';
import './Foreground.css';
import '../../animate.css';
import Navigation from '../Navigation/Navigation';
import Logo from '../Logo/Logo';
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm';
import Rank from '../Rank/Rank';
import FaceRecognition from '../FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';


const app = new Clarifai.App({apiKey: '0a6e9572400640b5ae84ff587db1436c'});

class Foreground extends Component {
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
        <div className="Foreground">
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

export default Foreground;
