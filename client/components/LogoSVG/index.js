import React from 'react'
import PropTypes from 'prop-types'

const LogoSVG = (props) => {
  let length = props.length; // eslint-disable-line
  // return <svg className="svg" width={length} height={length} viewBox="0 0 64 64" version="1.1">
  //   <title>Icon</title>
  //   <desc>Created with Sketch.</desc>
  //   <defs>
  //     <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
  //       <stop stopColor="#FFFFFF" offset="0%"></stop>
  //       <stop stopColor="#F2F2F2" offset="100%"></stop>
  //     </linearGradient>
  //     <circle id="path-2" cx="31.9988602" cy="31.9988602" r="2.92886048"></circle>
  //     <filter x="-85.4%" y="-68.3%" width="270.7%" height="270.7%" filterUnits="objectBoundingBox" id="filter-3">
  //       <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
  //       <feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
  //       <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.159703351 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
  //     </filter>
  //   </defs>
  //   <g id="首页" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
  //     <g id="大屏幕">
  //       <g id="Icon">
  //         <circle id="Oval-1" fill="url(#linearGradient-1)" cx="32" cy="32" r="32"></circle>
  //         <path d="M36.7078009,31.8054514 L36.7078009,51.7110548 C36.7078009,54.2844537 34.6258634,56.3695395 32.0579205,56.3695395 C29.4899777,56.3695395 27.4099998,54.0704461 27.4099998,51.7941246 L27.4099998,31.8061972 C27.4099998,29.528395 29.4909575,27.218453 32.0589004,27.230043 C34.6268432,27.241633 36.7078009,29.528395 36.7078009,31.8054514 Z" id="blue" fill="#2359F1" fillRule="nonzero"></path>
  //         <path d="M45.2586091,17.1026914 C45.2586091,17.1026914 45.5657231,34.0524383 45.2345291,37.01141 C44.9033351,39.9703817 43.1767091,41.6667796 40.6088126,41.6667796 C38.040916,41.6667796 35.9609757,39.3676862 35.9609757,37.0913646 L35.9609757,17.1034372 C35.9609757,14.825635 38.0418959,12.515693 40.6097924,12.527283 C43.177689,12.538873 45.2586091,14.825635 45.2586091,17.1026914 Z" id="green" fill="#57CF27" fillRule="nonzero" transform="translate(40.674608, 27.097010) rotate(60.000000) translate(-40.674608, -27.097010) "></path>
  //         <path d="M28.0410158,17.0465598 L28.0410158,36.9521632 C28.0410158,39.525562 25.9591158,41.6106479 23.3912193,41.6106479 C20.8233227,41.6106479 18.7433824,39.3115545 18.7433824,37.035233 L18.7433824,17.0473055 C18.7433824,14.7695034 20.8243026,12.4595614 23.3921991,12.4711513 C25.9600956,12.4827413 28.0410158,14.7695034 28.0410158,17.0465598 Z" id="red" fill="#FF561B" fillRule="nonzero" transform="translate(23.392199, 27.040878) rotate(-60.000000) translate(-23.392199, -27.040878) "></path>
  //         <g id="inner-round">
  //           <use fill="black" fillOpacity="1" filter="url(#filter-3)" xlinkHref="#path-2"></use>
  //           <use fill="#F7F7F7" fillRule="evenodd" xlinkHref="#path-2"></use>
  //         </g>
  //       </g>
  //     </g>
  //   </g>
  // </svg>
    return <svg width={length} height={length} viewBox="0 0 170 205" version="1.1"><g><title>background</title><rect fill="none" id="canvas_background" height="207" width="172" y="-1" x="-1"/></g><g><title>Layer 1</title><g id="svg_2"><path id="svg_3" d="m157.8,67c-1.1,-3.5 -7.2,-19.7 -9.3,-24.1c-1.5,-3.1 -2.7,-7.8 -6.3,-9.1c-4.7,-1.8 -131.8,-31.7 -139.1,-33.7c-0.2,-0.1 -0.3,-0.1 -0.5,-0.1c-0.8,0 -1.6,0.3 -2.1,1c-0.6,0.8 -0.7,1.9 -0.2,2.7c6.9,12.1 12.3,25 16.3,38.3c4.1,13.9 6.7,28.3 7.9,42.8c1,12.4 1.2,25 -0.1,37.4c-0.1,1 -0.4,2.1 -0.2,3.1c0.3,2.3 3.1,0.5 4.1,-0.2c7.7,-5.3 15.2,-11.1 22.6,-16.9l3,-2.4c1.1,-0.9 8,-6.4 10.8,-6.7c3.3,-0.4 6,1.6 8.8,3c5.6,2.7 22.8,10.3 25.7,11.5c3.4,1.5 7.1,3.4 10.9,2.5c2.8,-0.7 11.5,-7.9 13.8,-9.6c11.1,-8.2 22.4,-16.4 33.6,-24.7c1.3,-1 2.7,-1.7 2.7,-3.6l0,-0.1c-1,-3.8 -1.3,-7.5 -2.4,-11.1z" fill="#0AF"/><path id="svg_4" d="m162.9,98.6c0,-0.7 -0.1,-1.4 -0.3,-2.1c-1.3,-4.2 -5.3,-0.3 -7.2,1.1c-3.8,2.8 -7.5,5.8 -11.4,8.5c-6.4,4.6 -12.9,9.3 -19.3,14c-2.8,2.1 -5.5,4.4 -8.2,6.5c-2.2,1.7 -4.7,3.4 -7.6,2.6c-4.3,-1.2 -8.4,-3.3 -12.6,-4.9c-4.5,-1.8 -23.6,-10.4 -28.8,-11.4c-3.2,-0.7 -6.2,1.3 -8.6,3.2c-4.9,3.9 -9.8,7.7 -14.8,11.4c-4.2,3.1 -8.5,6.2 -12.7,9.3c-2.1,1.6 -4.3,3.1 -6.5,4.7c-1.7,1.3 -3.2,2.2 -4,4.2c-1.2,2.9 -1.7,6.2 -2.4,9.2c-3.4,13.5 -8.2,26.3 -14.6,38.6c-1,2 -3.7,7.4 -0.2,8.6c3,1.1 128.4,-28.9 136.4,-31.8c5.1,-1.8 5.6,-4.8 7.8,-9.3c1.6,-3.2 7.8,-21.3 9.5,-27c2,-6.5 3.4,-13 4.3,-19.7c0.6,-5.1 1.5,-10.5 1.2,-15.7z" fill="#56D844"/></g></g></svg>
}

LogoSVG.propTypes = {
  length: PropTypes.any
}

export default LogoSVG;
