/* Hand-drawn festive illustrations for A Little Diwali. */
(function () {
  'use strict';

  const BOX_STYLES = [
    { base: '#c87954', side: '#a8503e', lid: '#f6db9c', ribbon: '#a8444c', accent: '#edb950', pattern: 'floral' },
    { base: '#f5a34c', side: '#dd8139', lid: '#ffedc5', ribbon: '#c98235', accent: '#f7d96c', pattern: 'star' },
    { base: '#b9a4cf', side: '#947eae', lid: '#f2e7f4', ribbon: '#856d9e', accent: '#e98d73', pattern: 'dot' }
  ];

  const DIYA_STYLES = [
    { bowl: '#e98d73', trim: '#f7d96c', flower: '#f5b9c5', flame: '#ffd65e' },
    { bowl: '#d99b42', trim: '#fff0bd', flower: '#fff1d1', flame: '#ffc34c' },
    { bowl: '#b981a0', trim: '#f7d96c', flower: '#f5b9c5', flame: '#ffe278' },
    { bowl: '#a383b4', trim: '#f4c66b', flower: '#a9c69a', flame: '#ffd65e' }
  ];

  const RIBBON_STYLES = [
    { color: '#cf6476', light: '#f6c4c0', name: 'Classic bow' },
    { color: '#bc8738', light: '#f6dfa0', name: 'Golden bow' },
    { color: '#9e5266', light: '#f0b5aa', name: 'Festive bow' }
  ];

  const FLOWER_STYLES = [
    { name: 'Blush', petals: 6, color: '#f4a8ba', shade: '#cf6f89', center: '#e5a331' },
    { name: 'Daisy', petals: 10, color: '#fff7e6', shade: '#c4d2ec', center: '#f1c35b' },
    { name: 'Lavender', petals: 8, color: '#b8a5d7', shade: '#7868a5', center: '#a66f4f' },
    { name: 'Marigold', petals: 12, color: '#f4bd45', shade: '#dc862c', center: '#865b31' },
    { name: 'Coral', petals: 6, color: '#ee8d91', shade: '#c95568', center: '#f3d577' },
    { name: 'Bluebell', petals: 5, color: '#9fbde5', shade: '#5d7fae', center: '#f1c66c' }
  ];

  function svgStart(viewBox, width, height, className) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width || '100%'}" height="${height || 'auto'}" ${className ? `class="${className}"` : ''} role="img" aria-hidden="true">`;
  }

  function flower(cx, cy, scale, color) {
    const petals = Array.from({ length: 8 }, (_, i) =>
      `<ellipse cx="${cx}" cy="${cy - 9 * scale}" rx="${3.6 * scale}" ry="${6.2 * scale}" transform="rotate(${i * 45} ${cx} ${cy})" fill="${color}" stroke="#b97655" stroke-width="${0.65 * scale}"/>`
    ).join('');
    return `<g>${petals}<circle cx="${cx}" cy="${cy}" r="${3.4 * scale}" fill="#f7d96c" stroke="#b97655" stroke-width="${0.7 * scale}"/><circle cx="${cx}" cy="${cy}" r="${1.3 * scale}" fill="#fff1d1"/></g>`;
  }

  function sweetShape(id, x, y, scale) {
    const colors = {
      ladoo: ['#efa83f', '#d9892d'],
      kaju_katli: ['#fff0d3', '#c4a47b'],
      barfi: ['#c5cf83', '#849951'],
      peda: ['#c9834a', '#8e5637'],
      jalebi: ['#f39a2e', '#d9651d'],
      gulab_jamun: ['#a95635', '#763d2b'],
      coconut_ladoo: ['#fff0d9', '#b9946d'],
      modak: ['#fff0cf', '#b8794f']
    };
    const s = scale;
    const [fill, stroke] = colors[id] || colors.ladoo;
    const outline = '#87513f';
    const garnish = (cx, cy, r, color) =>
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="#a97045" stroke-width="${.45*s}"/>`;
    let shape;
    if (id === 'kaju_katli') {
      shape = `<g stroke="${outline}" stroke-width="${1.15*s}" stroke-linejoin="round">
        <path d="M${x-19*s} ${y+5*s}  L${x-12*s} ${y-11*s}  Q${x-10*s} ${y-14*s} ${x-6*s} ${y-12*s} L${x+4*s} ${y-6*s} L${x-3*s} ${y+10*s}Z" fill="#f3dfb8"/>
        <path d="M${x-3*s} ${y+10*s}  L${x+4*s} ${y-6*s}  L${x+14*s} ${y-12*s} Q${x+18*s} ${y-14*s} ${x+20*s} ${y-10*s} L${x+24*s} ${y+5*s}Z" fill="#fff1d1"/>
        <path d="M${x-19*s} ${y+5*s} L${x-3*s} ${y+10*s} L${x+9*s} ${y+17*s} L${x+24*s} ${y+5*s} L${x+20*s} ${y-10*s} L${x+14*s} ${y-12*s} L${x+4*s} ${y-6*s} L${x-6*s} ${y-12*s} L${x-12*s} ${y-11*s}Z" fill="none"/>
        <path d="M${x-11*s} ${y-8*s} Q${x-6*s} ${y-11*s} ${x-1*s} ${y-7*s} M${x+9*s} ${y-7*s} Q${x+15*s} ${y-12*s} ${x+18*s} ${y-8*s}" fill="none" stroke="#fffdf3" stroke-width="${2*s}" stroke-linecap="round"/>
        ${garnish(x-6*s,y-7*s,1.1*s,'#d9b560')}${garnish(x+13*s,y-8*s,1*s,'#d9b560')}
      </g>`;
    } else if (id === 'barfi') {
      shape = `<g stroke="${outline}" stroke-width="${1.05*s}" stroke-linejoin="round">
        <path d="M${x-19*s} ${y+3*s} L${x-12*s} ${y-11*s} L${x+1*s} ${y-16*s} L${x-5*s} ${y-1*s}Z" fill="#d2d79c"/>
        <path d="M${x-5*s} ${y-1*s} L${x+1*s} ${y-16*s} L${x+17*s} ${y-10*s} L${x+11*s} ${y+5*s}Z" fill="#e2dfb0"/>
        <path d="M${x-19*s} ${y+3*s} L${x-5*s} ${y-1*s} L${x-11*s} ${y+14*s} L${x-22*s} ${y+10*s}Z" fill="#bec982"/>
        <path d="M${x-5*s} ${y-1*s} L${x+11*s} ${y+5*s} L${x+6*s} ${y+18*s} L${x-11*s} ${y+14*s}Z" fill="#d3d79a"/>
        <path d="M${x+11*s} ${y+5*s} L${x+17*s} ${y-10*s} L${x+22*s} ${y-7*s} L${x+19*s} ${y+9*s} L${x+6*s} ${y+18*s}Z" fill="#b9c578"/>
        <path d="M${x-16*s} ${y+2*s} L${x-11*s} ${y-8*s} M${x-2*s} ${y-2*s} L${x+3*s} ${y-12*s} M${x+1*s} ${y+2*s} L${x+8*s} ${y+5*s}" fill="none" stroke="#f7efcf" stroke-width="${1.5*s}" stroke-linecap="round"/>
        ${garnish(x-11*s,y-8*s,1*s,'#d99454')}${garnish(x+3*s,y-12*s,.9*s,'#d99454')}
      </g>`;
    } else if (id === 'peda') {
      shape = `<ellipse cx="${x}" cy="${y+4*s}" rx="${19*s}" ry="${12*s}" fill="#aa6845" opacity=".22"/>
        <path d="M${x-19*s} ${y+1*s} Q${x-17*s} ${y-12*s} ${x} ${y-13*s} Q${x+17*s} ${y-12*s} ${x+19*s} ${y+1*s} Q${x+16*s} ${y+13*s} ${x} ${y+13*s} Q${x-16*s} ${y+13*s} ${x-19*s} ${y+1*s}Z" fill="${fill}" stroke="${outline}" stroke-width="${1.35*s}"/>
        <path d="M${x-13*s} ${y} Q${x-12*s} ${y-8*s} ${x} ${y-9*s} Q${x+12*s} ${y-8*s} ${x+13*s} ${y}" fill="none" stroke="#e6b278" stroke-width="${1.15*s}"/>
        ${flower(x,y, .34*s, '#f7d96c')}
        <path d="M${x-15*s} ${y+5*s} Q${x} ${y+12*s} ${x+15*s} ${y+5*s}" fill="none" stroke="#b97655" stroke-width="${.8*s}" opacity=".8"/>`;
    } else if (id === 'jalebi') {
      shape = `<path d="M${x-17*s} ${y+8*s} C${x-27*s} ${y-5*s} ${x-17*s} ${y-20*s} ${x-3*s} ${y-16*s} C${x+8*s} ${y-13*s} ${x+10*s} ${y-3*s} ${x+1*s} ${y+1*s} C${x-7*s} ${y+5*s} ${x-12*s} ${y-2*s} ${x-8*s} ${y-8*s} C${x-4*s} ${y-14*s} ${x+5*s} ${y-9*s} ${x+4*s} ${y-3*s} C${x+2*s} ${y+4*s} ${x-8*s} ${y+4*s} ${x-9*s} ${y+11*s} C${x-10*s} ${y+19*s} ${x+5*s} ${y+20*s} ${x+13*s} ${y+12*s} C${x+22*s} ${y+3*s} ${x+17*s} ${y-13*s} ${x+6*s} ${y-17*s}" fill="none" stroke="#b95d25" stroke-width="${8*s}" stroke-linecap="round"/>
        <path d="M${x-17*s} ${y+8*s} C${x-27*s} ${y-5*s} ${x-17*s} ${y-20*s} ${x-3*s} ${y-16*s} C${x+8*s} ${y-13*s} ${x+10*s} ${y-3*s} ${x+1*s} ${y+1*s} C${x-7*s} ${y+5*s} ${x-12*s} ${y-2*s} ${x-8*s} ${y-8*s} C${x-4*s} ${y-14*s} ${x+5*s} ${y-9*s} ${x+4*s} ${y-3*s} C${x+2*s} ${y+4*s} ${x-8*s} ${y+4*s} ${x-9*s} ${y+11*s} C${x-10*s} ${y+19*s} ${x+5*s} ${y+20*s} ${x+13*s} ${y+12*s} C${x+22*s} ${y+3*s} ${x+17*s} ${y-13*s} ${x+6*s} ${y-17*s}" fill="none" stroke="#f4a12d" stroke-width="${4*s}" stroke-linecap="round"/>
        <path d="M${x-17*s} ${y+8*s} C${x-27*s} ${y-5*s} ${x-17*s} ${y-20*s} ${x-3*s} ${y-16*s}" fill="none" stroke="#ffdc70" stroke-width="${1.5*s}" stroke-linecap="round"/>`;
    } else if (id === 'gulab_jamun') {
      shape = `<ellipse cx="${x}" cy="${y+11*s}" rx="${22*s}" ry="${7*s}" fill="#d9a453" opacity=".3"/>
        <circle cx="${x-10*s}" cy="${y+4*s}" r="${11*s}" fill="#87432e" stroke="${outline}" stroke-width="${1.2*s}"/>
        <circle cx="${x+10*s}" cy="${y+4*s}" r="${11*s}" fill="#9d4b30" stroke="${outline}" stroke-width="${1.2*s}"/>
        <circle cx="${x}" cy="${y-8*s}" r="${11*s}" fill="${fill}" stroke="${outline}" stroke-width="${1.2*s}"/>
        <path d="M${x-6*s} ${y-16*s} Q${x} ${y-20*s} ${x+5*s} ${y-15*s}" fill="none" stroke="#e99a5a" stroke-width="${2*s}" stroke-linecap="round"/>
        ${garnish(x+1*s,y-9*s,1*s,'#f1cb73')}`;
    } else if (id === 'coconut_ladoo') {
      const flakes = [[-11,-9],[-6,-15],[1,-15],[9,-11],[13,-4],[-14,-1],[-5,-4],[4,-7],[10,2],[-10,7],[0,9],[7,7]];
      shape = `<ellipse cx="${x}" cy="${y+11*s}" rx="${24*s}" ry="${7*s}" fill="#a96c45" opacity=".18"/>
        <circle cx="${x-12*s}" cy="${y+2*s}" r="${11*s}" fill="#f3e5c9" stroke="${outline}" stroke-width="${1.2*s}"/>
        <circle cx="${x+11*s}" cy="${y+3*s}" r="${11*s}" fill="#fff3df" stroke="${outline}" stroke-width="${1.2*s}"/>
        <circle cx="${x}" cy="${y-8*s}" r="${12*s}" fill="#fff8e9" stroke="${outline}" stroke-width="${1.2*s}"/>
        <path d="M${x-7*s} ${y-16*s} Q${x} ${y-20*s} ${x+6*s} ${y-14*s}" fill="none" stroke="#e2c99f" stroke-width="${1.4*s}" stroke-linecap="round"/>
        ${flakes.map(([dx,dy],i)=>garnish(x+dx*s,y+dy*s,.9*s,i%2?'#fffdf5':'#e5d1b1')).join('')}`;
    } else if (id === 'modak') {
      shape = `<ellipse cx="${x}" cy="${y+12*s}" rx="${20*s}" ry="${6*s}" fill="#a96c45" opacity=".2"/>
        <path d="M${x-17*s} ${y+10*s} Q${x-20*s} ${y+3*s} ${x-13*s} ${y-4*s} Q${x-8*s} ${y-10*s} ${x-8*s} ${y-13*s} Q${x-7*s} ${y-19*s} ${x} ${y-23*s} Q${x+7*s} ${y-19*s} ${x+8*s} ${y-13*s} Q${x+8*s} ${y-10*s} ${x+13*s} ${y-4*s} Q${x+20*s} ${y+3*s} ${x+17*s} ${y+10*s} Q${x} ${y+16*s} ${x-17*s} ${y+10*s}Z" fill="${fill}" stroke="${outline}" stroke-width="${1.35*s}" stroke-linejoin="round"/>
        <path d="M${x-13*s} ${y+5*s} Q${x-9*s} ${y-2*s} ${x-6*s} ${y-8*s} Q${x-3*s} ${y-13*s} ${x} ${y-20*s} Q${x+3*s} ${y-13*s} ${x+6*s} ${y-8*s} Q${x+9*s} ${y-2*s} ${x+13*s} ${y+5*s} M${x-7*s} ${y+10*s} Q${x-4*s} ${y+2*s} ${x} ${y-8*s} Q${x+4*s} ${y+2*s} ${x+7*s} ${y+10*s} M${x-1*s} ${y+13*s} Q${x} ${y+5*s} ${x+1*s} ${y+13*s}" fill="none" stroke="#d4ae7c" stroke-width="${1.1*s}" stroke-linecap="round"/>
        <path d="M${x-3*s} ${y-21*s} Q${x} ${y-28*s} ${x+3*s} ${y-21*s}" fill="#e7b86b" stroke="${outline}" stroke-width="${.8*s}"/>`;
    } else {
      const pearls = [[-10,-9,1.3],[-3,-13,1.1],[5,-12,1.4],[11,-7,1],[-13,-2,1.2],[-6,-4,1.4],[2,-5,1.1],[9,0,1.4],[-11,5,1],[-3,7,1.3],[5,7,1.1],[12,5,1]];
      shape = `<circle cx="${x}" cy="${y+2*s}" r="${17*s}" fill="${fill}" stroke="${stroke}" stroke-width="${1.5*s}"/>
        <path d="M${x-13*s} ${y-5*s} Q${x-4*s} ${y-18*s} ${x+10*s} ${y-10*s}" fill="none" stroke="#ffd785" stroke-width="${2*s}" stroke-linecap="round" opacity=".9"/>
        ${pearls.map(([dx,dy,r],i)=>garnish(x+dx*s,y+dy*s,r*s,i%3===0?'#f7d96c':i%3===1?'#fff0c6':'#d18b32')).join('')}
        <path d="M${x-5*s} ${y-17*s}q5-7 10 0" fill="none" stroke="#a9c69a" stroke-width="${1.6*s}" stroke-linecap="round"/>`;
    }
    return `<g>${shape}</g>`;
  }

  function diyaMarkup(styleIndex, x, y, scale, idPrefix) {
    const s = DIYA_STYLES[styleIndex] || DIYA_STYLES[0];
    return `<g transform="translate(${x} ${y}) scale(${scale})">
      <ellipse cx="0" cy="3" rx="39" ry="7" fill="#8c574b" opacity=".14"/>
      <path d="M-34 -8 Q-30 20 0 23 Q30 20 34 -8 Q17 1 0 1 Q-17 1 -34 -8Z" fill="${s.bowl}" stroke="#8c574b" stroke-width="2.2"/>
      <path d="M-34 -8 Q0 8 34 -8" fill="none" stroke="${s.trim}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-24 2 Q0 14 24 2" fill="none" stroke="${s.trim}" stroke-width="1.5" opacity=".9"/>
      ${flower(-15, 3, .46, s.flower)}${flower(0, 7, .58, s.flower)}${flower(15, 3, .46, s.flower)}
      <path id="${idPrefix || 'flame'}" class="flame" d="M0 -7 C-15 -25 -5 -39 1 -53 C10 -39 15 -24 0 -7Z" fill="${s.flame}" stroke="#db8b36" stroke-width="1.8"/>
      <path d="M1 -13 C-6 -23 -1 -31 2 -37 C8 -27 8 -20 1 -13Z" fill="#fff7d9"/>
      <path d="M-7 -7 Q0 -3 7 -7" fill="none" stroke="#8c574b" stroke-width="2" stroke-linecap="round"/>
    </g>`;
  }

  function getSweetSVG(id, size) {
    const dim = size || 72;
    return `${svgStart('0 0 76 64', dim, dim)}
      <ellipse cx="38" cy="49" rx="31" ry="10" fill="#f4dfc1" stroke="#956044" stroke-width="1.6"/>
      <ellipse cx="38" cy="47" rx="26" ry="7" fill="#fff8e9" stroke="#d4ab7f" stroke-width="1.1"/>
      <path d="M11 49q27 13 54 0" fill="none" stroke="#e4c69f" stroke-width="1.2"/>
      ${sweetShape(id, 38, 34, 1.12)}
      ${flower(17, 47, .24, '#f5b9c5')}${flower(59, 47, .24, '#f5a34c')}
    ${svgEnd()}`;
  }

  function svgEnd() {
    return '</svg>';
  }

  function getBoxOptionSVG(index) {
    const style = BOX_STYLES[index] || BOX_STYLES[0];
    const boxDecor = style.pattern === 'floral'
      ? `${flower(29, 54, .52, '#fff1d1')}${flower(72, 58, .48, style.accent)}`
      : style.pattern === 'star'
        ? `<path d="M28 52l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1zM72 55l2 4 4 1-3 2 1 4-4-2-3 2 1-4-3-2 4-1z" fill="#fff1d1"/>`
        : `<circle cx="30" cy="54" r="3" fill="#fff1d1"/><circle cx="70" cy="56" r="3" fill="${style.accent}"/><circle cx="49" cy="69" r="2.5" fill="#fff1d1"/>`;
    return `${svgStart('0 0 100 86', '100%', 86)}
      <ellipse cx="50" cy="77" rx="37" ry="5" fill="#8c574b" opacity=".12"/>
      <path d="M15 35 50 21 85 35 50 50Z" fill="${style.lid}" stroke="#8c574b" stroke-width="1.8"/>
      <path d="M15 35 50 49 50 74 15 60Z" fill="${style.base}" stroke="#8c574b" stroke-width="1.8"/>
      <path d="M50 49 85 35 85 60 50 74Z" fill="${style.side}" stroke="#8c574b" stroke-width="1.8"/>
      ${boxDecor}
      <path d="M49 23v49" stroke="${style.ribbon}" stroke-width="7"/>
      <path d="M50 24 C35 13 25 15 27 23 C29 30 41 29 50 26 C59 29 71 30 73 23 C75 15 64 13 50 24Z" fill="${style.ribbon}" stroke="#8c574b" stroke-width="1.5"/>
      <path d="M47 24 39 17M53 24 61 17" stroke="#f5b9c5" stroke-width="1.4" opacity=".8"/>
      ${svgEnd()}`;
  }

  function getDiyaOptionSVG(index) {
    return `${svgStart('0 0 100 78', '100%', 78)}<g transform="translate(50 48) scale(.63)">${diyaMarkup(index, 0, 0, 1, `flame-card-${index}`)}</g>${svgEnd()}`;
  }

  function getRibbonOptionSVG(index) {
    const ribbon = RIBBON_STYLES[index] || RIBBON_STYLES[0];
    return `${svgStart('0 0 100 64', '100%', 64)}
      <path d="M50 29 C36 12 20 17 25 28 C29 36 42 35 50 31 C58 35 71 36 75 28 C80 17 64 12 50 29Z" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.7"/>
      <path d="M45 31 34 52 47 44 51 32M55 31 66 52 53 44 49 32" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.5" stroke-linejoin="round"/>
      <ellipse cx="50" cy="30" rx="6" ry="5" fill="${ribbon.light}" stroke="#87513f" stroke-width="1.3"/>
      <path d="M49 29q1-3 2 0m-2 2q1 3 2 0" fill="none" stroke="#fff5da" stroke-width="1"/>${svgEnd()}`;
  }

  function flowerStickerMarkup(index, cx, cy, scale) {
    const style = FLOWER_STYLES[index] || FLOWER_STYLES[0];
    const petalMarkup = Array.from({ length: style.petals }, (_, i) =>
      `<g transform="rotate(${i * 360 / style.petals} ${cx} ${cy})">
        <ellipse cx="${cx}" cy="${cy - 7.5 * scale}" rx="${4.8 * scale}" ry="${8.5 * scale}" fill="${style.color}" stroke="${style.shade}" stroke-width="${1.15 * scale}"/>
        <path d="M${cx} ${cy - 13 * scale}q${2 * scale} ${3 * scale} 0 ${6 * scale}" fill="none" stroke="#fff9ee" stroke-width="${1.1 * scale}" stroke-linecap="round" opacity=".8"/>
      </g>`
    ).join('');
    const centerDots = Array.from({ length: 9 }, (_, i) => {
      const angle = i * Math.PI * 2 / 9;
      const dotX = cx + Math.cos(angle) * 2.8 * scale;
      const dotY = cy + Math.sin(angle) * 2.8 * scale;
      return `<circle cx="${dotX}" cy="${dotY}" r="${.8 * scale}" fill="${i % 2 ? '#fff1c8' : style.shade}"/>`;
    }).join('');
    return `<g class="flower-sticker">
      <circle cx="${cx}" cy="${cy}" r="${15 * scale}" fill="#fffdf7" stroke="#e9d8bd" stroke-width="${1.1 * scale}"/>
      ${petalMarkup}
      <circle cx="${cx}" cy="${cy}" r="${4.2 * scale}" fill="${style.center}" stroke="${style.shade}" stroke-width="${.7 * scale}"/>
      ${centerDots}
    </g>`;
  }

  function getFlowerOptionSVG(index) {
    return `${svgStart('0 0 100 80', '100%', 80)}${flowerStickerMarkup(index, 50, 39, 1.45)}${svgEnd()}`;
  }

  function getPreviewSVG(boxIndex, sweetIds, diyaIndex, ribbonIndex, flowerIndices, diyaIndices, flowerQuantities, stickerPositions, selectedStickerKey) {
    const style = BOX_STYLES[boxIndex] || BOX_STYLES[0];
    const ribbon = RIBBON_STYLES[ribbonIndex] || RIBBON_STYLES[0];
    const savedPositions = stickerPositions && typeof stickerPositions === 'object' ? stickerPositions : {};
    const savedPosition = (key, baseX, baseY) => {
      const position = savedPositions[key];
      return position && Number.isFinite(position.x) && Number.isFinite(position.y)
        ? {
          x: Math.min(430, Math.max(110, position.x)),
          y: Math.min(410, Math.max(205, position.y)),
          scale: Number.isFinite(position.scale) ? Math.min(2.4, Math.max(.45, position.scale)) : 1
        }
        : { x: baseX, y: baseY, scale: 1 };
    };
    const selectedFlowers = (Array.isArray(flowerIndices) ? flowerIndices : [0, 2])
      .filter((index, i, all) => Number.isInteger(index) && FLOWER_STYLES[index] && all.indexOf(index) === i)
      .slice(0, 6);
    const selectedDiyas = (Array.isArray(diyaIndices) ? diyaIndices : [diyaIndex])
      .filter((index, i, all) => Number.isInteger(index) && DIYA_STYLES[index] && all.indexOf(index) === i)
      .slice(0, 4);
    const sweets = Array.isArray(sweetIds)
      ? sweetIds.slice(0, 6).map(item => typeof item === 'string'
        ? { id: item, quantity: 1 }
        : {
          id: item && typeof item.id === 'string' ? item.id : 'ladoo',
          quantity: item && Number.isInteger(item.quantity) ? Math.min(12, Math.max(1, item.quantity)) : 1
        })
      : [];
    const sweetPieces = sweets.flatMap(({ id, quantity }) =>
      Array.from({ length: quantity }, (_, pieceIndex) => ({ id, pieceIndex }))
    );
    const featuredSweetPositions = [
      [165, 238], [270, 238], [375, 238],
      [165, 376], [270, 376], [375, 376],
      [165, 280], [375, 280], [165, 330], [375, 330],
      [220, 210], [320, 210], [220, 405], [320, 405],
      [220, 278], [320, 278], [220, 355], [320, 355]
    ];
    const denseSweetPositions = [];
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 10; column += 1) {
        if ((column === 4 || column === 5) && (row === 3 || row === 4)) continue;
        denseSweetPositions.push([140 + column * (260 / 9), 205 + row * (202 / 7)]);
      }
    }
    const sweetPositions = sweetPieces.length <= featuredSweetPositions.length
      ? featuredSweetPositions
      : denseSweetPositions;
    const sweetScale = sweetPieces.length <= 6
      ? 1.12
      : sweetPieces.length <= featuredSweetPositions.length
        ? 1 - (sweetPieces.length - 7) * .007
        : Math.max(.55, .72 - (sweetPieces.length - 19) * .003);
    const sweetMarks = sweetPieces.map(({ id, pieceIndex }, i) => {
      const [x, y] = sweetPositions[i];
      const key = pieceIndex === 0 ? `sweet-${id}` : `sweet-${id}-${pieceIndex}`;
      const position = savedPosition(key, x, y);
      return `<g class="gift-sweet draggable-sticker${key === selectedStickerKey ? ' selected-sticker' : ''}" data-sticker-key="${key}" data-base-x="${x}" data-base-y="${y}" data-scale="${position.scale}" transform="translate(${position.x} ${position.y}) scale(${position.scale}) translate(${-x} ${-y})">${sweetShape(id, x, y, sweetScale)}</g>`;
    }).join('');
    const flowerPositions = [
      [113, 218], [427, 218], [113, 246], [427, 246],
      [113, 274], [427, 274], [113, 302], [427, 302],
      [113, 330], [427, 330], [113, 358], [427, 358],
      [113, 386], [427, 386], [113, 408], [427, 408]
    ];
    const flowerStickersList = [];
    selectedFlowers.forEach(index => {
      const quantity = flowerQuantities && Number.isInteger(flowerQuantities[index])
        ? Math.min(8, Math.max(1, flowerQuantities[index]))
        : 1;
      for (let repeatIndex = 0; repeatIndex < quantity && flowerStickersList.length < flowerPositions.length; repeatIndex++) {
        flowerStickersList.push({ index, repeatIndex });
      }
    });
    const flowerStickers = flowerStickersList.map(({ index, repeatIndex }, i) => {
      const [x, y] = flowerPositions[i];
      const key = `flower-${index}-${repeatIndex}`;
      const position = savedPosition(key, x, y);
      return `<g class="draggable-sticker${key === selectedStickerKey ? ' selected-sticker' : ''}" data-sticker-key="${key}" data-base-x="${x}" data-base-y="${y}" data-scale="${position.scale}" transform="translate(${position.x} ${position.y}) scale(${position.scale}) translate(${-x} ${-y})">${flowerStickerMarkup(index, x, y, 1.22)}</g>`;
    }).join('');
    const diyaPositions = selectedDiyas.length === 1
      ? [[270, 307]]
      : selectedDiyas.map((_, i) => [270 + (i - (selectedDiyas.length - 1) / 2) * 50, 307]);
    const diyaStickers = selectedDiyas.map((index, i) => {
      const [x, y] = diyaPositions[i];
      const key = `diya-${index}`;
      const position = savedPosition(key, x, y);
      return `<g class="draggable-sticker${key === selectedStickerKey ? ' selected-sticker' : ''}" data-sticker-key="${key}" data-base-x="${x}" data-base-y="${y}" data-scale="${position.scale}" transform="translate(${position.x} ${position.y}) scale(${position.scale}) translate(${-x} ${-y})"><g transform="translate(${x} ${y}) scale(.8)">${diyaMarkup(index, 0, 0, 1, `main-flame-${index}`)}</g></g>`;
    }).join('');
    const stickerMarkup = sweetMarks + flowerStickers + diyaStickers;
    const ribbonDecoration = ribbonIndex === 1
      ? `<g>${flower(270, 435, .6, ribbon.light)}<path d="M270 421v29" stroke="${ribbon.color}" stroke-width="7"/><path d="M270 428 C254 412 239 416 242 426 C245 435 259 435 270 430 C281 435 295 435 298 426 C301 416 286 412 270 428Z" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.5"/></g>`
      : ribbonIndex === 2
        ? `<path d="M93 436h354" stroke="${ribbon.color}" stroke-width="7"/><path d="M270 431 C253 415 235 419 239 429 C243 438 259 438 270 433 C281 438 297 438 301 429 C305 419 287 415 270 431Z" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.5"/><path d="M261 433 251 450 266 443M279 433 289 450 274 443" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.2"/>`
        : `<path d="M94 436h352" stroke="${ribbon.color}" stroke-width="7"/><path d="M270 431 C252 413 232 417 236 429 C240 440 258 439 270 433 C282 439 300 440 304 429 C308 417 288 413 270 431Z" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.5"/><path d="M263 433 248 452 266 443M277 433 292 452 274 443" fill="${ribbon.color}" stroke="#87513f" stroke-width="1.3"/>`;
    return `${svgStart('0 0 540 500', '100%', 500, 'gift-illustration')}
      <defs>
        <linearGradient id="boxPaper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${style.lid}"/><stop offset="1" stop-color="${style.base}"/></linearGradient>
        <linearGradient id="boxGold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffedbd"/><stop offset=".5" stop-color="#d6a652"/><stop offset="1" stop-color="#f5d894"/></linearGradient>
        <linearGradient id="boxInside" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff5df"/><stop offset="1" stop-color="#f1dfbf"/></linearGradient>
        <pattern id="boxPaisley" width="38" height="38" patternUnits="userSpaceOnUse">
          <path d="M19 5c9 6 7 15 0 21-7-6-9-15 0-21zm0 6c-4 4-3 8 0 11 4-4 4-7 0-11z" fill="#d9aa5d" opacity=".48"/>
          <circle cx="5" cy="31" r="1.6" fill="#a65c4d" opacity=".42"/><circle cx="33" cy="31" r="1.6" fill="#a65c4d" opacity=".42"/>
          <path d="M5 8q4-6 8 0-4 6-8 0zm20 20q4-6 8 0-4 6-8 0z" fill="#bd7152" opacity=".34"/>
        </pattern>
      </defs>
      <ellipse cx="270" cy="459" rx="205" ry="18" fill="#b98a5b" opacity=".16"/>

      <!-- Open decorated lid of a traditional mithai box -->
      <rect x="72" y="34" width="396" height="118" rx="16" fill="url(#boxPaper)" stroke="#70463b" stroke-width="3"/>
      <rect x="79" y="41" width="382" height="104" rx="12" fill="#fff0d6" stroke="url(#boxGold)" stroke-width="4"/>
      <rect x="89" y="48" width="362" height="90" rx="9" fill="url(#boxPaisley)" stroke="#9e6849" stroke-width="1.5"/>
      <rect x="134" y="62" width="272" height="62" rx="28" fill="#fff8e9" stroke="#be8d4e" stroke-width="2"/>
      <rect x="140" y="68" width="260" height="50" rx="24" fill="none" stroke="#d8b772" stroke-width="1" stroke-dasharray="2 3"/>
      <text x="270" y="103" text-anchor="middle" font-family="'Great Vibes',cursive" font-size="25" fill="#70463b">Shubh Deepavali</text>
      ${flower(109, 91, .55, '#e98d73')}${flower(431, 91, .55, '#e98d73')}
      <path d="M89 145h362" stroke="${ribbon.color}" stroke-width="8"/>
      <path d="M270 144 C251 123 231 127 235 139 C239 150 258 151 270 145 C282 151 301 150 305 139 C309 127 289 123 270 144Z" fill="${ribbon.color}" stroke="#70463b" stroke-width="1.5"/>
      <ellipse cx="270" cy="145" rx="7" ry="5" fill="${ribbon.light}" stroke="#70463b" stroke-width="1"/>

      <!-- Shallow, top-view Indian mithai dabba -->
      <rect x="72" y="161" width="396" height="283" rx="25" fill="url(#boxPaper)" stroke="#70463b" stroke-width="3"/>
      <rect x="79" y="168" width="382" height="269" rx="20" fill="url(#boxGold)" stroke="#fff0bd" stroke-width="2"/>
      <rect x="89" y="178" width="362" height="249" rx="15" fill="${style.base}" stroke="#87513f" stroke-width="2"/>
      <rect x="97" y="186" width="346" height="233" rx="11" fill="url(#boxInside)" stroke="#fdf0cd" stroke-width="2"/>
      <rect x="103" y="192" width="334" height="221" rx="8" fill="url(#boxPaisley)" opacity=".56"/>
      <rect x="105" y="194" width="330" height="217" rx="8" fill="none" stroke="#b77c42" stroke-width="1.4" stroke-dasharray="4 4"/>
      <path d="M93 181 Q270 195 447 181M93 424 Q270 410 447 424" fill="none" stroke="#fff2c9" stroke-width="2"/>
      ${stickerMarkup}
      <g class="sticker-controls" display="none" pointer-events="none"></g>
      ${ribbonDecoration}
      <path d="M48 234v18m-9-9h18M491 374v16m-8-8h16" stroke="#d69545" stroke-width="2" stroke-linecap="round"/>
      <path d="m47 345 2 4 5 .7-3.5 3.2.8 4.7-4.3-2.2-4.2 2.2.8-4.7-3.4-3.2 4.7-.7zM493 235l2 4 5 .7-3.5 3.2.8 4.7-4.3-2.2-4.2 2.2.8-4.7-3.4-3.2 4.7-.7z" fill="#f5a34c" stroke="#c8833d" stroke-width="1"/>
      ${svgEnd()}`;
  }

  function getDecorativeSVG(type) {
    if (type === 'marigold' || type === 'lotus') {
      const petal = type === 'lotus' ? '#f5b9c5' : '#f5a34c';
      return `${svgStart('0 0 100 100', '100%', '100%')}${flower(50, 50, 2.4, petal)}<path d="M48 67q-20 1-25-13 18-3 25 13zm4 0q20 1 25-13-18-3-25 13z" fill="#a9c69a" stroke="#72885f" stroke-width="1.5"/>${svgEnd()}`;
    }
    if (type === 'lantern') {
      return `${svgStart('0 0 80 120', '100%', '100%')}<path d="M40 1v18M31 19h18l7 13v48l-7 15H31l-7-15V32z" fill="#f7d96c" stroke="#a76549" stroke-width="2"/><path d="M28 37h24v34H28z" fill="#f5a34c" stroke="#a76549" stroke-width="1.5"/><path d="M40 41c-9 11 1 18 0 26 12-6 9-17 0-26z" fill="#fff1d1"/><path d="M24 33h32M24 75h32M32 95v9m16-9v9m-8 0v12" fill="none" stroke="#a76549" stroke-width="2"/><circle cx="40" cy="25" r="3" fill="#f5b9c5"/>${svgEnd()}`;
    }
    if (type === 'butterfly') {
      return `${svgStart('0 0 100 80', '100%', '100%')}<path d="M49 39C27 3 4 13 18 42c8 17 22 13 31 5C35 76 9 71 14 57c5-14 21-12 35-5M51 39C73 3 96 13 82 42c-8 17-22 13-31 5 14 29 40 24 35 10-5-14-21-12-35-5" fill="#f5b9c5" stroke="#b96575" stroke-width="2"/><path d="M50 37v26M50 39q-9-13-15-9m15 9q9-13 15-9" fill="none" stroke="#8c574b" stroke-width="2" stroke-linecap="round"/><circle cx="28" cy="33" r="3" fill="#f7d96c"/><circle cx="72" cy="33" r="3" fill="#f7d96c"/>${svgEnd()}`;
    }
    if (type === 'toran') {
      const blossoms = Array.from({ length: 19 }, (_, i) => {
        const x = 10 + i * (580 / 18);
        const curve = Math.sin((i / 18) * Math.PI);
        const y = 8 + curve * 39;
        const petal = i % 2 ? '#f5a34c' : '#f7d96c';
        const leaves = i < 18
          ? `<ellipse cx="${x + 13}" cy="${y - 7}" rx="7" ry="3" transform="rotate(-24 ${x + 13} ${y - 7})" fill="#8da26c"/><ellipse cx="${x + 18}" cy="${y + 6}" rx="7" ry="3" transform="rotate(24 ${x + 18} ${y + 6})" fill="#a9b879"/>`
          : '';
        const blossoms = flower(x, y + 7, .68, petal);
        const garlandBud = `<circle cx="${x}" cy="${y + 22}" r="2" fill="#c2743b" stroke="#956044" stroke-width=".6"/><path d="M${x - 3} ${y + 24}q3 4 6 0" fill="none" stroke="#a27e4f" stroke-width="1"/>`;
        return `${leaves}<path d="M${x} ${y - 4}v${Math.max(3, 10 - curve * 5)}" stroke="#a27e4f" stroke-width="1.4"/>${blossoms}${garlandBud}`;
      }).join('');
      return `${svgStart('0 0 600 76', '100%', 76)}<path d="M0 5 Q300 78 600 5" fill="none" stroke="#8f7750" stroke-width="2.2"/><path d="M0 8 Q300 81 600 8" fill="none" stroke="#d4aa60" stroke-width="1" stroke-dasharray="2 5"/>${blossoms}${svgEnd()}`;
    }
    if (type === 'toran-secondary') {
      const beads = Array.from({ length: 25 }, (_, i) => {
        const x = 4 + i * (592 / 24);
        const y = 5 + Math.sin((i / 24) * Math.PI) * 22;
        const color = i % 2 ? '#cf8150' : '#d8b15e';
        return `<path d="M${x} ${y}v8" stroke="#9d7951" stroke-width="1"/><circle cx="${x}" cy="${y + 10}" r="2.4" fill="${color}"/><circle cx="${x}" cy="${y + 15}" r="1.25" fill="#9aab75"/>`;
      }).join('');
      return `${svgStart('0 0 600 42', '100%', 42)}<path d="M0 3 Q300 43 600 3" fill="none" stroke="#aa8050" stroke-width="1.5"/>${beads}${svgEnd()}`;
    }
    if (type === 'hanging-toran') {
      const flowers = Array.from({ length: 11 }, (_, i) => {
        const y = 17 + i * 27;
        const x = 42 + Math.sin((i / 10) * Math.PI * 1.15) * 10;
        const leaves = i < 10
          ? `<ellipse cx="${x - 12}" cy="${y + 13}" rx="7" ry="3" transform="rotate(-35 ${x - 12} ${y + 13})" fill="#8da26c"/><ellipse cx="${x + 12}" cy="${y + 13}" rx="7" ry="3" transform="rotate(35 ${x + 12} ${y + 13})" fill="#a9b879"/>`
          : '';
        return `<path d="M${x - 5} ${y - 16}q5-7 10 0" fill="none" stroke="#a27e4f" stroke-width="1.5"/>${flower(x, y, i === 0 || i === 10 ? .75 : .58, i % 2 ? '#f5a34c' : '#f7d96c')}${leaves}`;
      }).join('');
      return `${svgStart('0 0 84 310', '100%', '100%')}<path d="M42 0 C31 75 54 180 42 310" fill="none" stroke="#a27e4f" stroke-width="2"/><path d="M46 0 C35 75 58 180 46 310" fill="none" stroke="#d3a758" stroke-width=".8" stroke-dasharray="2 4"/>${flowers}<path d="m44 298-7 9 8-2 7 2-7-9" fill="#dc8b45" stroke="#9c6647" stroke-width="1"/>${svgEnd()}`;
    }
    const iconPaths = {
      gift_icon: '<rect x="3" y="12" width="18" height="10" rx="2"/><path d="M2 12h20V9H2zM12 9v13m0-13C5 9 5 3 9 3c3 0 3 6 3 6zm0 0c7 0 7-6 3-6-3 0-3 6-3 6z"/>',
      sweet_icon: '<path d="M7 7 3 4 2 10l5 2m10-5 4-3 1 6-5 2M7 9c0-4 10-4 10 0v7c0 3-10 3-10 0z"/><path d="M7 12c0 3 10 3 10 0"/>',
      diya_icon: '<path d="M3 13q9 7 18 0-2 8-9 8t-9-8z"/><path d="M12 13c-5-6 0-9 1-12 4 5 5 9-1 12z"/>',
      letter_icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>'
    };
    return `${svgStart('0 0 24 24', 22, 22)}<g fill="none" stroke="#b8795d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${iconPaths[type] || ''}</g>${svgEnd()}`;
  }

  window.getSweetSVG = getSweetSVG;
  window.getBoxOptionSVG = getBoxOptionSVG;
  window.getDiyaOptionSVG = getDiyaOptionSVG;
  window.getRibbonOptionSVG = getRibbonOptionSVG;
  window.getFlowerOptionSVG = getFlowerOptionSVG;
  window.getPreviewSVG = getPreviewSVG;
  window.getDecorativeSVG = getDecorativeSVG;
})();
