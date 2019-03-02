import React from 'react';

const Rank = ({user}) => {
  return (
      <div className=''>
        <div className='white f3'>
          {`${user.name}, your current submit count is...`}
        </div>
        <div className='white f1'>
          {`${user.entries}`}
        </div>
      </div>
  );
};

export default Rank;
