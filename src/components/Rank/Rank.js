import React from 'react';

const Rank = ({userName}) => {
  return (
      <div className=''>
        <div className='white f3'>
          {`${userName}, your current rank is...`}
        </div>
        <div className='white f1'>
          {'#5'}
        </div>
      </div>
  );
};

export default Rank;
