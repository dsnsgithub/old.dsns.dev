//? Source: https://github.com/Agezao/confetti-js/blob/master/src/confetti.js

function ConfettiGenerator(e){var t={target:"confetti-holder",max:80,size:1,animate:!0,respawn:!0,props:["circle","square","triangle","line"],colors:[[165,104,246],[230,61,135],[0,199,228],[253,214,126]],clock:25,interval:null,rotate:!1,start_from_edge:!1,width:window.innerWidth,height:window.innerHeight};if(e&&(e.target&&(t.target=e.target),e.max&&(t.max=e.max),e.size&&(t.size=e.size),void 0!==e.animate&&null!==e.animate&&(t.animate=e.animate),void 0!==e.respawn&&null!==e.respawn&&(t.respawn=e.respawn),e.props&&(t.props=e.props),e.colors&&(t.colors=e.colors),e.clock&&(t.clock=e.clock),void 0!==e.start_from_edge&&null!==e.start_from_edge&&(t.start_from_edge=e.start_from_edge),e.width&&(t.width=e.width),e.height&&(t.height=e.height),void 0!==e.rotate&&null!==e.rotate&&(t.rotate=e.rotate)),"object"!=typeof t.target&&"string"!=typeof t.target)throw new TypeError("The target parameter should be a node or string");if("object"==typeof t.target&&(null===t.target||!t.target instanceof HTMLCanvasElement)||"string"==typeof t.target&&(null===document.getElementById(t.target)||!document.getElementById(t.target)instanceof HTMLCanvasElement))throw new ReferenceError("The target element does not exist or is not a canvas element");var r="object"==typeof t.target?t.target:document.getElementById(t.target),a=r.getContext("2d"),o=[];function i(e,t){e||(e=1);var r=Math.random()*e;return t?Math.floor(r):r}var n=t.props.reduce(function(e,t){return e+(t.weight||1)},0);function s(){var e=t.props[function(){for(var e=Math.random()*n,r=0;r<t.props.length;++r){var a=t.props[r].weight||1;if(e<a)return r;e-=a}}()];return{prop:e.type?e.type:e,x:i(t.width),y:t.start_from_edge?t.clock>=0?-10:parseFloat(t.height)+10:i(t.height),src:e.src,radius:i(4)+1,size:e.size,rotate:t.rotate,line:Math.floor(i(65)-30),angles:[i(10,!0)+2,i(10,!0)+2,i(10,!0)+2,i(10,!0)+2],color:t.colors[i(t.colors.length,!0)],rotation:i(360,!0)*Math.PI/180,speed:i(t.clock/7)+t.clock/30}}function l(e){if(e){var r=e.radius<=3?.4:.8;switch(a.fillStyle=a.strokeStyle="rgba("+e.color+", "+r+")",a.beginPath(),e.prop){case"circle":a.moveTo(e.x,e.y),a.arc(e.x,e.y,e.radius*t.size,0,2*Math.PI,!0),a.fill();break;case"triangle":a.moveTo(e.x,e.y),a.lineTo(e.x+e.angles[0]*t.size,e.y+e.angles[1]*t.size),a.lineTo(e.x+e.angles[2]*t.size,e.y+e.angles[3]*t.size),a.closePath(),a.fill();break;case"line":a.moveTo(e.x,e.y),a.lineTo(e.x+e.line*t.size,e.y+5*e.radius),a.lineWidth=2*t.size,a.stroke();break;case"square":a.save(),a.translate(e.x+15,e.y+5),a.rotate(e.rotation),a.fillRect(-15*t.size,-5*t.size,15*t.size,5*t.size),a.restore();break;case"svg":a.save();var o=new window.Image;o.src=e.src;var i=e.size||15;a.translate(e.x+i/2,e.y+i/2),e.rotate&&a.rotate(e.rotation),a.drawImage(o,-i/2*t.size,-i/2*t.size,i*t.size,i*t.size),a.restore()}}}var c=function(){t.animate=!1,clearInterval(t.interval),requestAnimationFrame(function(){a.clearRect(0,0,r.width,r.height);var e=r.width;r.width=1,r.width=e})};return{render:function(){r.width=t.width,r.height=t.height,o=[];for(var e=0;e<t.max;e++)o.push(s());return requestAnimationFrame(function e(){for(var r in a.clearRect(0,0,t.width,t.height),o)l(o[r]);!function(){for(var e=0;e<t.max;e++){var r=o[e];r&&(t.animate&&(r.y+=r.speed),r.rotate&&(r.rotation+=r.speed/35),(r.speed>=0&&r.y>t.height||r.speed<0&&r.y<0)&&(t.respawn?(o[e]=r,o[e].x=i(t.width,!0),o[e].y=r.speed>=0?-10:parseFloat(t.height)):o[e]=void 0))}o.every(function(e){return void 0===e})&&c()}(),t.animate&&requestAnimationFrame(e)})},clear:c}}