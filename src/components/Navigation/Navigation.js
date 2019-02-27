import React from 'react';

const Navigation = ({changeRoute, signUserOut, isUserSignedIn}) => {
  return (
      <nav style={{display: 'flex', justifyContent: 'flex-end'}}>

        {

          (isUserSignedIn === true)

          ? (<p className='f3 link dim black underline pa3 pointer'
             onClick={() => { changeRoute('signin'); signUserOut(); }}>Sign Out</p>)

          : (
             <>
               <p className='f3 link dim black underline pa3 pointer'
               onClick={() => { changeRoute('signin'); signUserOut() }}>Sign In</p>
               <p className='f3 link dim black underline pa3 pointer'
               onClick={() => { changeRoute('register'); signUserOut() }}>Register</p>
             </>
            )

        }

      </nav>
  );
};

export default Navigation;
