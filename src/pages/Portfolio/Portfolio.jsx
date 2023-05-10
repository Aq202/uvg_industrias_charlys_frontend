/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import NavBar from '@components/NavBar/NavBar';
import './Portfolio.css';
import Slider from '@components/Slider/Slider';

function Portfolio() {
  const info = [['ACERCA DE NOSOTROS', 'Somos fabricantes con más de 20 años de experiencia por lo que contamos con todo el equipo y conocimiento necesario para trabajar sus prendas.'], ['MISIÓN', 'Apoyar a nuestros clientes en el proceso de diseño y elaboración de las prendas que representan el valor y la imagen de sus organizaciones, ofreciendo calidad y compromiso para su satisfacción.'], ['VISIÓN', 'Brindar un servicio eficiente y distintivo a nuestros clientes, ampliando nuestro catálogo y mejorando cada día nuestros productos.']];
  return (
    <div className="portfolio">
      <NavBar />
      <div className="header">
        <h1>Industrias Charly's</h1>
        <h3>- Uniformes escolares y más -</h3>
      </div>
      <div className="pageContent">
        <svg style={{ marginBottom: '-10px' }} xmlns="http://www.w3.org/2000/svg" viewBox="100 0 1300 305">
          <path fill="#ffffff" fillOpacity="1" d="M0,320L48,272C96,224,192,128,288,122.7C384,117,480,203,576,229.3C672,256,768,224,864,229.3C960,235,1056,277,1152,288C1248,299,1344,277,1392,266.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <div className="info">
          <p className="initial">C</p>
          <Slider elements={info} type="text" />
        </div>
        <svg style={{ position: 'absolute' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 80 1440 320">
          <path fill="#FFFFFF" fillOpacity="1" d="M0,128L48,122.7C96,117,192,107,288,122.7C384,139,480,181,576,197.3C672,213,768,203,864,181.3C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
        <div className="products">
          <h2>UNIFORMES</h2>
          <div className="section">
            <img className="mosaic" alt="uniformes" src="/catalogue/uniforms.png" />
            <div className="description">
              <h2>INSTITUCIONES EDUCATIVAS</h2>
              <p>
                Camisa polo, playera de algodón o poliéster,
                blusa y camisa de vestir, blusa y camisa tipo Columbia, pantalón de vestir,
                pantalón de lona, pantalón de gabardina, faldas, sudaderos, chumpas tipo
                universitario, chumpa y pants deportivo, entre otros.
              </p>
            </div>
          </div>
          <div className="section">
            <div className="description">
              <h2>EMPRESARIALES E INDUSTRIA</h2>
              <p>
                Productos con reflectivo, overoles, batas para mecánica, batas médicas,
                batas de laboratorio, mandiles y delantales, filipinas para chef, gorras,
                suéter y chalecos tejidos, chalecos, chumpas, sudaderas, pantalones de vestir,
                pantalones de gabardina, pantalones de lona, entre otros.
              </p>
            </div>
            <img className="mosaic" alt="uniformes" src="/catalogue/industry.png" />
          </div>
          <h2>PARA NIÑOS</h2>
          <div className="section">
            <img className="mosaic" alt="ankarlo" src="/catalogue/ankarlo.png" />
            <div className="description">
              <h2>ANKARLO</h2>
              <p>
                Nuestra marca Ankarlo está especializada en el diseño y confección de prendas para
                niños de todas las edades, con productos que incluyen sudaderas, playeras, overoles,
                pants, entre otros.
              </p>
            </div>
          </div>
          <div className="historyText">
            <p>
              Desde nuestros inicios como
              una pequeña empresa hasta la
              actualidad, nos hemos
              comprometido a ofrecer la
              mejor calidad a nuestros
              clientes, porque reconocemos la
              importancia de un buen
              uniforme.
            </p>
            <img alt="logo" src="/logo.png" />
            <p>
              Año tras año hemos mejorado
              nuestros procesos, técnicas y
              maquinaria, con el fin de
              entregarle prendas cómodas,
              seguras y duraderas.
            </p>
          </div>
        </div>
        <div className="footer">
          <h3>¡Contáctanos!</h3>
          <div className="contactInfo">
            <p>Dirección: 6ta Av. 4-90 col. Linda Vista, zona 4 de Villa Nueva</p>
            <p>Números de teléfono: 5334 – 4014 / 3005 – 1942</p>
            <p>Correo electrónico: industriascharlys@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
