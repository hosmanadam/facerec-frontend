import React from 'react';
import './FaceRecognition.css'
import FaceBox from '../FaceBox/FaceBox'


const FaceRecognition = ({imageUrl, handleImage, faceBoxes, imageWidth, imageHeight, isAnalysisDone}) => {
  let faceBoxComponents = faceBoxes.map(
      (coordinates, i) => (
          <FaceBox
            key={i}
            coordinates={coordinates}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
          />
      )
  );

  let foundAnnouncement = (
        <p className='found-announcement f3'>
          {
            (imageUrl === '') ? ' ' :
            (isAnalysisDone === false) ? 'Looking for faces...' :
            (faceBoxes.length === 0) ? 'No faces found!' :
            (faceBoxes.length === 1) ? '1 face found!' :
            `${faceBoxes.length} faces found!`
          }
        </p>
  );

  return (
      <div className='result-container center ma'>
        {foundAnnouncement}
        <div className='input-image-container mt2 relative'>
          <img className='br3 input-image' src={imageUrl} alt="" onLoad={handleImage}/>
          {faceBoxComponents}
        </div>
      </div>
  );
};

export default FaceRecognition;
