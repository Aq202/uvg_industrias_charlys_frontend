import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import './Portfolio.css'
import Slider from '../../components/Slider/Slider'

const Portfolio = () => {
  const uniforms = ['/catalogue/uniforms/chumpa.jpg', '/catalogue/uniforms/completo frente.jpg', '/catalogue/uniforms/completo atras.jpg',
    '/catalogue/uniforms/pants 1.jpg', '/catalogue/uniforms/polos 1.jpg', '/catalogue/uniforms/polos 2.jpg', '/catalogue/uniforms/polos 3.jpg',
    '/catalogue/uniforms/polos 4.jpg']
  const kids = ['/catalogue/kids/kids 1.jpg', '/catalogue/kids/kids 2.jpg', '/catalogue/kids/kids 3.jpg', '/catalogue/kids/kids 4.jpg',
    '/catalogue/kids/kids 5.jpg', '/catalogue/kids/kids 6.jpg', '/catalogue/kids/kids 7.jpg', '/catalogue/kids/kids 8.jpg', '/catalogue/kids/kids 9.jpg',
    '/catalogue/kids/kids 10.jpg', '/catalogue/kids/kids 11.jpg', '/catalogue/kids/kids 12.jpg', '/catalogue/kids/kids 13.jpg']
  const info = [['ACERCA DE NOSOTROS', 'Somos fabricantes con más de 20 años de experiencia por lo que contamos con todo el equipo y conocimiento necesario para trabajar sus prendas.'], ['MISIÓN', 'Apoyar a nuestros clientes en el proceso de diseño y elaboración de las prendas que representan el valor y la imagen de sus organizaciones, ofreciendo calidad y compromiso para su satisfacción.'], ['VISIÓN', 'Brindar un servicio eficiente y distintivo a nuestros clientes, ampliando nuestro catálogo y mejorando cada día nuestros productos.']]
  return (
    <div className="portfolio">
      <NavBar />
      <figure className="headerimg">
        <img alt="encabezado" src="/catalogue/header.png" />
      </figure>
      <div className="pageContent">
        <svg style={{ marginBottom: '-10px' }} xmlns="http://www.w3.org/2000/svg" viewBox="100 0 1300 305">
          <path fill="#ffffff" fillOpacity="1" d="M0,320L48,272C96,224,192,128,288,122.7C384,117,480,203,576,229.3C672,256,768,224,864,229.3C960,235,1056,277,1152,288C1248,299,1344,277,1392,266.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <div className="info">
          <p className="initial">C</p>
          <Slider elements={info} type="text" />
        </div>
        <div className="products">
          <h3>NUESTROS PRODUCTOS</h3>
          <div className="section">
            <h2>UNIFORMES ESCOLARES</h2>
            <Slider elements={uniforms} type="images" auto={false} />
          </div>
          <div className="section">
            <Slider elements={kids} type="images" auto={false} />
            <h2>SECCIÓN INFANTIL</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
