import React from 'react';
import PropTypes from 'prop-types';

function BottomWave({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250" className={className}>
      <path
        fill="#16337F"
        fillOpacity="1"
      >
        <animate
          attributeName="d"
          dur="30000ms"
          repeatCount="indefinite"
          values={`
            M0,160L30,176C60,192,120,224,180,229.3C240,235,300,213,360,176C420,139,480,85,540,80C600,75,660,117,720,154.7C780,192,840,224,900,202.7C960,181,1020,107,1080,96C1140,85,1200,139,1260,149.3C1320,160,1380,128,1410,112L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z;
            M0,128L30,133.3C60,139,120,149,180,160C240,171,300,181,360,192C420,203,480,213,540,202.7C600,192,660,160,720,144C780,128,840,128,900,117.3C960,107,1020,85,1080,90.7C1140,96,1200,128,1260,149.3C1320,171,1380,181,1410,186.7L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z;
            M0,256L30,240C60,224,120,192,180,160C240,128,300,96,360,112C420,128,480,192,540,213.3C600,235,660,213,720,218.7C780,224,840,256,900,240C960,224,1020,160,1080,133.3C1140,107,1200,117,1260,128C1320,139,1380,149,1410,154.7L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z;

            M0,160L30,176C60,192,120,224,180,229.3C240,235,300,213,360,176C420,139,480,85,540,80C600,75,660,117,720,154.7C780,192,840,224,900,202.7C960,181,1020,107,1080,96C1140,85,1200,139,1260,149.3C1320,160,1380,128,1410,112L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z;
              `}
        />
      </path>
    </svg>
  );
}

export default BottomWave;

BottomWave.propTypes = {
  className: PropTypes.string,
};

BottomWave.defaultProps = {
  className: '',
};
