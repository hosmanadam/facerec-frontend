import React from 'react';
import Particles from 'react-particles-js';
import './Background.css'


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

const Background = () => (
          <Particles
              className='Particles'
              params={particlesOptions}
          />
);

export default Background;
