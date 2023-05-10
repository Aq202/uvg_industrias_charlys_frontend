import React from 'react'
import PropTypes from 'prop-types'
import './SlideCard.css'

const SlideCard = ({
  image, display, title, text,
}) => (
  <div className="slideCard" style={{ display: `${display}` }}>
    {image
      && <img alt={image} src={image} />}
    {title
      && <h1>{title}</h1>}
    {text && <p>{text}</p>}
  </div>
)

SlideCard.defaultProps = {
  image: undefined,
  title: undefined,
  text: undefined,
}

SlideCard.propTypes = {
  image: PropTypes.string,
  display: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
}

export default SlideCard
