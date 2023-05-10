import React, {
  createElement, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import './Slider.css';
import SlideCard from '../SlideCard/SlideCard';

function Slider({ elements, type, auto }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCards = [];

  const changeSlide = (quantity) => {
    setCurrentSlide((old) => {
      if (old === elements.length - 1 && quantity === 1) return 0;
      if (old === 0 && quantity === -1) return elements.length - 1;
      return old + quantity;
    });
  };

  const autoSlide = () => {
    if (auto) {
      setInterval(() => {
        changeSlide(1);
      }, 4000);
    }
  };

  useEffect(() => {
    autoSlide(auto);
  }, []);

  if (type === 'images') {
    elements.forEach((img, index) => {
      const slideCard = createElement(SlideCard, { key: img, image: img, display: `${index === currentSlide ? 'flex' : 'none'}` });
      slideCards.push(slideCard);
    });
  } else {
    elements.forEach((paragraph, index) => {
      const slideCard = createElement(SlideCard, {
        key: paragraph[0],
        title: paragraph[0],
        text: paragraph[1],
        display: `${index === currentSlide ? 'flex' : 'none'}`,
      });
      slideCards.push(slideCard);
    });
  }

  return (
    <div className="slider">
      {!auto && (
        <div className="controllers">
          <button type="button" onClick={() => changeSlide(-1)} className="slideChanger" id="back">{'<'}</button>
          <button type="button" onClick={() => changeSlide(1)} className="slideChanger" id="forward">{'>'}</button>
        </div>
      )}
      {slideCards}
    </div>
  );
}

Slider.defaultProps = {
  auto: true,
};

Slider.propTypes = {
  elements: PropTypes.arrayOf(String).isRequired,
  type: PropTypes.string.isRequired,
  auto: PropTypes.bool,
};

export default Slider;
