import React from 'react';
import './FaceBox.css';

const FaceBox = ({coordinates, imageWidth, imageHeight}) => {
  let {top_row, left_col, bottom_row, right_col} = coordinates;

  let style = {
    top: `${top_row * imageHeight}px`,
    left: `${left_col * imageWidth}px`,
    width: `${(right_col - left_col) * imageWidth}px`,
    height: `${(bottom_row - top_row) * imageHeight}px`,
  };

  return (
      <div
          className='face-box'
          style={style}
      >
      </div>
  );
};

export default FaceBox;
