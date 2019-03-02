import React, {Component} from 'react';
import './Foreground.css';
import '../../animate.css';
import Navigation from '../Navigation/Navigation';
import Logo from '../Logo/Logo';
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm';
import Rank from '../Rank/Rank';
import FaceRecognition from '../FaceRecognition/FaceRecognition';
import SignIn from '../SignIn/SignIn';
import Register from '../Register/Register';
import Clarifai from 'clarifai';


const app = new Clarifai.App({apiKey: '0a6e9572400640b5ae84ff587db1436c'});

class Foreground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      imageUrl: '',
      isImageDisplayed: false,
      imageWidth: null,
      imageHeight: null,
      faceBoxes: [],
      isAnalysisDone: true,
      route: 'signin',
      isUserSignedIn: false,
      user: null,
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };

  onButtonSubmit = (event) => {
    this.setState(
        {
          imageUrl: this.state.input,
          isImageDisplayed: false,
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
      isImageDisplayed: true,
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

  changeRoute = (newRoute) => {
    this.setState({route: newRoute})
  };

  signUserIn = () => {
    let password = document.querySelector('#password').value;
    let email = document.querySelector('#email-address').value;
    let form = {"email": email, "password": password};

    fetch(
        'http://localhost:3000/signin',
        {
          method: 'POST',
          mode: 'cors',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(form),
        })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Failed to login');
          }
        })
        .then((body) => {
          this.setState({isUserSignedIn: true, user: body});
          this.changeRoute('home');
          console.log('Logged in successfully');
          console.log(this.state.user);
        })
        .catch(console.log)
  };


  registerUser = () => {
    let name = document.querySelector('#name').value;
    let password = document.querySelector('#password').value;
    let email = document.querySelector('#email-address').value;
    let form = {"name": name, "email": email, "password": password};

    fetch(
        'http://localhost:3000/register',
        {
          method: 'POST',
          mode: 'cors',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(form),
        })
        .then(response => {
          if (response.status === 200) {
            console.log('Registered successfully');
            this.changeRoute('signin');
          } else {
            console.log('Failed to register');
          }
        });

  };

  signUserOut = () => {
    this.setState({isUserSignedIn: false, user: null});
    this.changeRoute('signin');
  };

  render() {
    return (
        <div className="Foreground">
          <Navigation changeRoute={this.changeRoute} signUserOut={this.signUserOut} isUserSignedIn={this.state.isUserSignedIn}/>
          {
            (this.state.route === 'signin')
            ? <SignIn signUserIn={this.signUserIn}/>
            : (this.state.route === 'register')
            ? <Register registerUser={this.registerUser}/>
            : <div>
              <Logo/>
              <Rank userName={this.state.user.name}/>
              <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                  inputValue={this.state.input}/>
              <FaceRecognition
                  imageUrl={this.state.imageUrl}
                  handleImage={this.handleImage}
                  isImageDisplayed={this.state.isImageDisplayed}
                  faceBoxes={this.state.faceBoxes}
                  imageWidth={this.state.imageWidth}
                  imageHeight={this.state.imageHeight}
                  isAnalysisDone={this.state.isAnalysisDone}
              />
            </div>
          }
        </div>
    );
  }
}

export default Foreground;
