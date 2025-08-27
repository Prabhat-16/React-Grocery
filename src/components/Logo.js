import React from 'react';

const Logo = ({ size = 192 }) => (
  <div 
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#4a90e2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: size * 0.6,
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}
  >
    🛒
  </div>
);

export default Logo;
