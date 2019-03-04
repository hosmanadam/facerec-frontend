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
import validateForm from '../../util';


const initialState = {
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
};


const initialImageState = {
  imageUrl: initialState.imageUrl,
  isImageDisplayed: initialState.isImageDisplayed,
  imageWidth: initialState.imageWidth,
  imageHeight: initialState.imageHeight,
  faceBoxes: initialState.faceBoxes,
  isAnalysisDone: initialState.isAnalysisDone,
};


class Foreground extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };


  onButtonSubmit = (event) => {
    this.setState(
        initialImageState,
        () => {this.setState({imageUrl: this.state.input})}
        );

    fetch(
        `${process.env.REACT_APP_BACKEND_URL}/image`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            user: this.state.user,
            imageUrl: this.state.input,
          }),
        })
        .then(response => response.json())
        .then(body => {
          this.setState(
            {user: Object.assign(
                this.state.user,
                {entries: body.user.entries}
                )}
          );
          return body;
        })
        .then(body => this.extractClarifaiData(body.clarifaiData))
        .catch(console.log);
  };

  handleImage = () => {
    let inputImage = document.querySelector('.input-image');
    this.setState({
      isImageDisplayed: true,
      imageHeight: inputImage.height,
      imageWidth: inputImage.width,
      isAnalysisDone: false,
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

    let {isFormValid, formValidationError} = validateForm(form);

    if (isFormValid) {
      fetch(
          `${process.env.REACT_APP_BACKEND_URL}/signin`,
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
    } else {
      console.log(formValidationError.message)
    }
  };


  registerUser = () => {
    let name = document.querySelector('#name').value;
    let email = document.querySelector('#email-address').value;
    let password = document.querySelector('#password').value;
    let form = {"name": name, "email": email, "password": password};

    let {isFormValid, formValidationError} = validateForm(form);

    if (isFormValid) {
      fetch(
          `${process.env.REACT_APP_BACKEND_URL}/register`,
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
    } else {
      console.log(formValidationError.message)
    }
  };

  signUserOut = () => {
    this.setState(initialState);
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
              <Rank user={this.state.user}/>
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
