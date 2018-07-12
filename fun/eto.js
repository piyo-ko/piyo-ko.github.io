'use strict';

const kan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  shi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  outer_radius = 200, inner_radius = 160,
  margin = 40, len = (outer_radius + margin) * 2,
  center_x = len/2, center_y = len/2,
  fontsize = 16, txt_dy = 4, ball_radius = 8;

function conv_x(orig_x) { return(  orig_x + center_x); }
function conv_y(orig_y) { return(- orig_y + center_y); }
function polar2xy(r, th) {
  return( {x: conv_x(Math.round(r * Math.cos(th))),
           y: conv_y(Math.round(r * Math.sin(th))) } );
}
function add_new_svg_elt(elt_type, attribute_arr, txt_str = '') {
  const svg_elt = document.getElementById('circular_eto_chart'),
    new_elt = document.createElementNS('http://www.w3.org/2000/svg', elt_type);
  attribute_arr.forEach(k_v => { new_elt.setAttribute(k_v[0], k_v[1]); });
  svg_elt.appendChild(new_elt);
  if (elt_type == 'text' && txt_str != '') {
    new_elt.appendChild(document.createTextNode(txt_str));
  }
}

function draw_circular_eto_chart() {
  const svg_elt = document.getElementById('circular_eto_chart');
  [['width', len], ['height', len], ['viewBox', '0 0 ' + len + ' ' + len]]
    .forEach(k_v => { svg_elt.setAttribute(k_v[0], k_v[1]); });

  add_new_svg_elt('circle',
    [['id', 'outer'], ['cx', center_x], ['cy', center_y], ['r', outer_radius]]);
  add_new_svg_elt('circle',
    [['id', 'inner'], ['cx', center_x], ['cy', center_y], ['r', inner_radius]]);

  const offset = 2 * Math.PI / 120;
  for (let n = 0; n < 60; n++) {
    const angle = (2 * Math.PI / 60) * (15 - n), 
          txt_xy = polar2xy(outer_radius, angle), rot_deg = n * 360 / 60;
     add_new_svg_elt('text',
       [['id', 'eto_' + n], ['x', txt_xy.x], ['y', txt_xy.y], 
        ['dx', 0], ['dy', txt_dy],
        ['transform', 'rotate(' + rot_deg + ', ' + txt_xy.x + ', ' + txt_xy.y + ')'],
        ['textLength', fontsize * 2], ['writing-mode', 'tb']],
       kan[n % 10] + shi[n % 12]);

    const xy1 = polar2xy(outer_radius, angle - offset),
          xy2 = polar2xy(inner_radius, angle - offset);
    add_new_svg_elt('line',
      [['x1', xy1.x], ['y1', xy1.y], ['x2', xy2.x], ['y2', xy2.y]]);
  }

  const x0 = conv_x(0), y0 = conv_y(0);
  add_new_svg_elt('line',
    [['id', 'axis_2'], ['class', 'axis'],
     ['x1', conv_x(-inner_radius)], ['y1', y0],
     ['x2', conv_x(inner_radius)], ['y2', y0]]);
  add_new_svg_elt('line',
    [['id', 'axis_1'], ['class', 'axis'],
     ['x1', x0], ['y1', conv_y(inner_radius)],
     ['x2', x0], ['y2', conv_y(-inner_radius)]]);
  add_new_svg_elt('circle',
    [['id', 'ball'], ['r', ball_radius],
     ['cx', x0], ['cy', conv_y(outer_radius + ball_radius)]]);
}

function update_indicators() {
  function rotate_line(line_elt, new_angle) {
    const xy1 = polar2xy(inner_radius, new_angle),
          xy2 = polar2xy(inner_radius, new_angle + Math.PI);
    [['x1', xy1.x], ['y1', xy1.y], ['x2', xy2.x], ['y2', xy2.y]]
      .forEach(k_v => { line_elt.setAttribute(k_v[0], k_v[1]); });
  }
  const n = parseInt(document.f.eto_indicator.value);
  rotate_line(document.getElementById('axis_1'), (2 * Math.PI / 60) * (15 - n));
  rotate_line(document.getElementById('axis_2'), (2 * Math.PI / 60) * (   - n));
  const ball = document.getElementById('ball'),
    cxcy = polar2xy(outer_radius + ball_radius, (2 * Math.PI / 60) * (15 - n));
  ball.setAttribute('cx', cxcy.x);
  ball.setAttribute('cy', cxcy.y);
}

window.top.onload = function () { draw_circular_eto_chart(); };
