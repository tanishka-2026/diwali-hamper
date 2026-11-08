/* ============================================================
 *  A Little Diwali — Main Application Logic (app.js)
 *  Runs after svgAssets.js is loaded.
 *  Manages: selection handling, preview rendering, message form,
 *           sharing and downloading.
 * ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
   *  DATA DEFINITIONS
   * ────────────────────────────────────────────── */

  const SWEETS = [
    { id: 'ladoo',         name: 'Ladoo' },
    { id: 'kaju_katli',    name: 'Kaju Katli' },
    { id: 'barfi',         name: 'Barfi' },
    { id: 'peda',          name: 'Peda' },
    { id: 'jalebi',        name: 'Jalebi' },
    { id: 'gulab_jamun',   name: 'Gulab Jamun' },
    { id: 'coconut_ladoo', name: 'Coconut Ladoo' },
    { id: 'modak',         name: 'Modak' }
  ];

  const MAX_SWEET_QUANTITY = 12;
  const MAX_FLOWER_QUANTITY = 8;
  const MAX_FLOWER_STICKERS = 16;

  const BOXES = [
    { id: 0, name: 'Blush Floral' },
    { id: 1, name: 'Marigold' },
    { id: 2, name: 'Lavender' }
  ];

  const RIBBONS = [
    { id: 0, name: 'Classic bow' },
    { id: 1, name: 'Golden bow' },
    { id: 2, name: 'Festive bow' }
  ];

  const FLOWERS = [
    { id: 0, name: 'Blush' },
    { id: 1, name: 'Daisy' },
    { id: 2, name: 'Lavender' },
    { id: 3, name: 'Marigold' },
    { id: 4, name: 'Coral' },
    { id: 5, name: 'Bluebell' }
  ];

  const DIYAS = [
    { id: 0, name: 'Traditional' },
    { id: 1, name: 'Golden' },
    { id: 2, name: 'Rose' },
    { id: 3, name: 'Festive' }
  ];

  const sweetStickerKey = (sweetId, pieceIndex) =>
    pieceIndex === 0 ? `sweet-${sweetId}` : `sweet-${sweetId}-${pieceIndex}`;

  /* ──────────────────────────────────────────────
   *  APPLICATION STATE
   * ────────────────────────────────────────────── */

  const state = {
    selectedBox: 0,
    selectedRibbon: 0,
    selectedFlowers: [],
    flowerQuantities: {},
    selectedSweets: [],
    sweetQuantities: {},
    selectedDiya: 0,
    selectedDiyas: [],
    stickerPositions: {},
    selectedStickerKey: '',
    recipientName: '',
    senderName: '',
    message: ''
  };

  /* ──────────────────────────────────────────────
   *  HELPER — safe element getter
   * ────────────────────────────────────────────── */

  function el(id) {
    return document.getElementById(id);
  }

  function setHTML(id, html) {
    const node = el(id);
    if (node) node.innerHTML = html;
  }

  function getFlowerStickerCount() {
    return state.selectedFlowers.reduce((total, index) => total + (state.flowerQuantities[index] || 1), 0);
  }

  /* ──────────────────────────────────────────────
   *  PREVIEW UPDATE  (debounced)
   * ────────────────────────────────────────────── */

  let previewTimer = null;

  function updatePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      const sweetItems = state.selectedSweets.map(index => ({
        id: SWEETS[index].id,
        quantity: state.sweetQuantities[index] || 1
      }));
      const previewHTML = getPreviewSVG(state.selectedBox, sweetItems, state.selectedDiya, state.selectedRibbon, state.selectedFlowers, state.selectedDiyas, state.flowerQuantities, state.stickerPositions, state.selectedStickerKey);
      const container = el('previewContainer');
      if (container) {
        container.innerHTML = previewHTML;
        const svg = container.querySelector('svg');
        const selected = svg && state.selectedStickerKey
          ? svg.querySelector(`[data-sticker-key="${state.selectedStickerKey}"]`)
          : null;
        if (selected) {
            svg.querySelectorAll('.selected-sticker').forEach(sticker => sticker.classList.remove('selected-sticker'));
            selected.classList.add('selected-sticker');
            selected.parentNode.appendChild(selected);
            updateStickerControls(svg, selected);
        }
      }
    }, 80);
  }

  /* ──────────────────────────────────────────────
   *  VISUAL SELECTION SYNC
   * ────────────────────────────────────────────── */

  function applySelections() {
    /* Box cards */
    document.querySelectorAll('#boxOptions .option-card').forEach((card, i) => {
      card.classList.toggle('selected', i === state.selectedBox);
      card.setAttribute('aria-pressed', String(i === state.selectedBox));
    });
    document.querySelectorAll('#ribbonOptions .option-card').forEach((card, i) => {
      card.classList.toggle('selected', i === state.selectedRibbon);
      card.setAttribute('aria-pressed', String(i === state.selectedRibbon));
    });
    document.querySelectorAll('#flowerOptions .option-card').forEach((card, i) => {
      const selected = state.selectedFlowers.includes(i);
      card.classList.toggle('selected', selected);
      const select = card.querySelector('.flower-select');
      if (select) select.setAttribute('aria-pressed', String(selected));
      const quantity = card.querySelector('.flower-quantity-value');
      if (quantity) quantity.textContent = state.flowerQuantities[i] || 1;
      const minus = card.querySelector('[data-flower-quantity-change="-1"]');
      const plus = card.querySelector('[data-flower-quantity-change="1"]');
      if (minus) minus.disabled = !selected || state.flowerQuantities[i] <= 1;
      if (plus) plus.disabled = !selected
        || state.flowerQuantities[i] >= MAX_FLOWER_QUANTITY
        || getFlowerStickerCount() >= MAX_FLOWER_STICKERS;
    });
    /* Sweet cards */
    document.querySelectorAll('#sweetGrid .option-card').forEach((card, i) => {
      card.classList.toggle('selected', state.selectedSweets.includes(i));
      const select = card.querySelector('.sweet-select');
      if (select) select.setAttribute('aria-pressed', String(state.selectedSweets.includes(i)));
      const quantity = card.querySelector('.sweet-quantity-value');
      if (quantity) quantity.textContent = state.sweetQuantities[i] || 1;
      const minus = card.querySelector('[data-quantity-change="-1"]');
      const plus = card.querySelector('[data-quantity-change="1"]');
      if (minus) minus.disabled = !state.selectedSweets.includes(i) || state.sweetQuantities[i] <= 1;
      if (plus) plus.disabled = !state.selectedSweets.includes(i) || state.sweetQuantities[i] >= MAX_SWEET_QUANTITY;
    });
    /* Diya cards */
    document.querySelectorAll('#diyaOptions .option-card').forEach((card, i) => {
      const selected = state.selectedDiyas.includes(i);
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
  }

  function getShareData() {
    return {
      b: state.selectedBox,
      s: state.selectedSweets,
      q: state.sweetQuantities,
      d: state.selectedDiya,
      r: state.selectedRibbon,
      fl: state.selectedFlowers,
      fq: state.flowerQuantities,
      ds: state.selectedDiyas,
      sp: state.stickerPositions,
      sk: state.selectedStickerKey,
      t: state.recipientName,
      f: state.senderName,
      m: state.message
    };
  }

  function encodeShortPositionKey(key) {
    const sweetMatch = key.match(/^sweet-(ladoo|kaju_katli|barfi|peda|jalebi|gulab_jamun|coconut_ladoo|modak)(?:-(\d+))?$/);
    if (sweetMatch) {
      const sweetIndex = SWEETS.findIndex(sweet => sweet.id === sweetMatch[1]);
      return (Number(sweetMatch[2] || 0) * SWEETS.length) + sweetIndex;
    }
    const flowerMatch = key.match(/^flower-(\d+)-(\d+)$/);
    if (flowerMatch) return 96 + Number(flowerMatch[1]) * MAX_FLOWER_QUANTITY + Number(flowerMatch[2]);
    const diyaMatch = key.match(/^diya-(\d+)$/);
    if (diyaMatch) return 144 + Number(diyaMatch[1]);
    return -1;
  }

  async function encodeShortSharePayload() {
    const data = getShareData();
    const sweetQuantities = data.s.map(index => data.q[index] || 1);
    const flowerQuantities = data.fl.map(index => data.fq[index] || 1);
    const activeStickerCodes = new Set();
    data.s.forEach(index => {
      const sweetId = SWEETS[index].id;
      for (let piece = 0; piece < (data.q[index] || 1); piece += 1) {
        activeStickerCodes.add(piece * SWEETS.length + index);
      }
    });
    data.fl.forEach(index => {
      for (let repeat = 0; repeat < (data.fq[index] || 1); repeat += 1) {
        activeStickerCodes.add(96 + index * MAX_FLOWER_QUANTITY + repeat);
      }
    });
    data.ds.forEach(index => activeStickerCodes.add(144 + index));

    const positions = Object.entries(data.sp)
      .map(([key, position]) => [encodeShortPositionKey(key), position])
      .filter(([code, position]) => activeStickerCodes.has(code) && position)
      .map(([code, position]) => [
        code,
        Math.round(position.x * 10),
        Math.round(position.y * 10),
        Math.round(position.scale * 1000)
      ]);
    const selectedKey = encodeShortPositionKey(data.sk);
    const compactData = [
      2, data.b, data.s, sweetQuantities, data.d, data.r, data.fl,
      flowerQuantities, data.ds, positions,
      activeStickerCodes.has(selectedKey) ? selectedKey : -1,
      data.t, data.f, data.m
    ];
    const json = JSON.stringify(compactData);
    if (!('CompressionStream' in window)) {
      throw new Error('Short links require a browser with built-in compression support.');
    }
    const compressed = await new Response(
      new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))
    ).arrayBuffer();
    const bytes = new Uint8Array(compressed);
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return `c=${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
  }

  /* ──────────────────────────────────────────────
   *  SHARE LINK GENERATION
   * ────────────────────────────────────────────── */

  async function generateShareLink() {
    const data = getShareData();
    const status = el('copyStatus');
    try {
      const json = JSON.stringify(data);
      let payload;
      if ('CompressionStream' in window) {
        const compressed = await new Response(
          new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))
        ).arrayBuffer();
        const bytes = new Uint8Array(compressed);
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
        }
        payload = `z=${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
      } else {
        payload = btoa(unescape(encodeURIComponent(json)));
      }

      const shareUrl = new URL('gift.html', window.location.href);
      shareUrl.hash = payload;
      const input = el('shareLinkInput');
      if (input) input.value = shareUrl.href;

      const modal = el('shareModal');
      if (modal) modal.classList.add('active');
      if (status) status.textContent = '';
    } catch (error) {
      console.error('Your share link could not be generated.', error);
      if (status) status.textContent = 'Could not create the share link. Please try again.';
    }
  }

  /* ──────────────────────────────────────────────
   *  DOWNLOAD AS IMAGE  (html2canvas)
   * ────────────────────────────────────────────── */

  function downloadAsImage() {
    const previewEl = el('previewContainer');
    if (!previewEl) return;

    if (typeof html2canvas !== 'undefined') {
      const card = document.createElement('section');
      card.style.cssText = 'position:fixed;left:-10000px;top:0;width:1000px;padding:34px;background:#fff3df;border:3px solid #dca979;border-radius:26px;color:#70463b;font-family:Nunito,sans-serif;display:flex;align-items:center;gap:24px;';

      const illustration = document.createElement('div');
      illustration.style.cssText = 'width:620px;flex:0 0 620px;';
      illustration.innerHTML = getPreviewSVG(
        state.selectedBox,
        state.selectedSweets.map(index => ({
          id: SWEETS[index].id,
          quantity: state.sweetQuantities[index] || 1
        })),
        state.selectedDiya,
        state.selectedRibbon,
        state.selectedFlowers,
        state.selectedDiyas,
        state.flowerQuantities,
        state.stickerPositions,
        state.selectedStickerKey
      );
      const illustrationSvg = illustration.querySelector('svg');
      if (illustrationSvg) {
        const selected = state.selectedStickerKey
          ? illustrationSvg.querySelector(`[data-sticker-key="${state.selectedStickerKey}"]`)
          : null;
        if (selected) selected.parentNode.appendChild(selected);
        illustrationSvg.style.cssText = 'display:block;width:100%;height:auto;';
      }

      const note = document.createElement('div');
      note.style.cssText = 'flex:1;padding:26px 22px;background:#fff9ed;border:2px dashed #efa7a1;border-radius:20px;text-align:center;';
      const title = document.createElement('h2');
      title.textContent = `A little Diwali gift for ${state.recipientName || 'you'}`;
      title.style.cssText = 'margin:0 0 20px;font:600 27px Georgia,serif;color:#8c574b;';
      const message = document.createElement('p');
      message.textContent = state.message || 'Wishing you a bright and beautiful Diwali!';
      message.style.cssText = 'margin:0 0 22px;font:20px/1.6 Nunito,sans-serif;white-space:pre-wrap;';
      const sender = document.createElement('p');
      sender.textContent = `With love, ${state.senderName || 'a friend'}`;
      sender.style.cssText = 'margin:0;font:italic 18px Georgia,serif;color:#936957;';
      note.append(title, message, sender);
      card.append(illustration, note);
      document.body.appendChild(card);

      html2canvas(card, {
        backgroundColor: '#fff3df',
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-diwali-gift.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(err => {
        console.error('Download failed:', err);
        alert('Download failed. Please try again!');
      }).finally(() => {
        card.remove();
      });
    } else {
      alert('Download feature is loading. Please try again in a moment.');
    }
  }

  /* ──────────────────────────────────────────────
   *  COPY TO CLIPBOARD  (with fallback)
   * ────────────────────────────────────────────── */

  function copyToClipboard(text) {
    const status = el('copyStatus');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (status) status.textContent = 'Copied!';
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      const status = el('copyStatus');
      if (status) status.textContent = 'Copied!';
    } catch (e) {
      const status = el('copyStatus');
      if (status) status.textContent = 'Copy failed — please select and copy manually.';
    }
    document.body.removeChild(ta);
  }

  /* ──────────────────────────────────────────────
   *  BUILDER INITIALISATION
   * ────────────────────────────────────────────── */

  function initBuilder() {

    /* ---- a. Page decorations ---- */
    setHTML('pageDecoFlowerTL',  getDecorativeSVG('marigold'));
    setHTML('pageDecoFlowerTR',  getDecorativeSVG('marigold'));
    setHTML('pageDecoFlowerBL',  getDecorativeSVG('marigold'));
    setHTML('pageDecoFlowerBR',  getDecorativeSVG('marigold'));
    setHTML('pageDecoLanternL',  getDecorativeSVG('lantern'));
    setHTML('pageDecoLanternR',  getDecorativeSVG('lantern'));
    setHTML('pageDecoCornerToranL', getDecorativeSVG('hanging-toran'));
    setHTML('pageDecoCornerToranR', getDecorativeSVG('hanging-toran'));
    setHTML('pageDecoSideLanternL1', getDecorativeSVG('lantern'));
    setHTML('pageDecoSideLanternL2', getDecorativeSVG('lantern'));
    setHTML('pageDecoSideLanternR1', getDecorativeSVG('lantern'));
    setHTML('pageDecoSideLanternR2', getDecorativeSVG('lantern'));
    setHTML('pageDecoButterfly', getDecorativeSVG('butterfly'));
    setHTML('headerToran',       getDecorativeSVG('toran'));
    setHTML('headerToranBack',   getDecorativeSVG('toran-secondary'));
    setHTML('sectionIconBox',    getDecorativeSVG('gift_icon'));
    setHTML('sectionIconRibbon', getRibbonOptionSVG(0));
    setHTML('sectionIconFlower', getFlowerOptionSVG(0));
    setHTML('sectionIconSweet',  getDecorativeSVG('sweet_icon'));
    setHTML('sectionIconDiya',   getDecorativeSVG('diya_icon'));
    setHTML('sectionIconMessage', getDecorativeSVG('letter_icon'));

    /* ---- b. Box option cards ---- */
    const boxContainer = el('boxOptions');
    if (boxContainer) {
      boxContainer.innerHTML = '';
      BOXES.forEach((box, i) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'option-card' + (i === state.selectedBox ? ' selected' : '');
        card.setAttribute('data-box-id', box.id);
        card.setAttribute('aria-pressed', String(i === state.selectedBox));
        card.innerHTML =
          '<div class="option-svg">' + getBoxOptionSVG(box.id) + '</div>' +
          '<div class="option-label">' + box.name + '</div>';
        boxContainer.appendChild(card);
      });
    }

    /* ---- b2. Ribbon option cards ---- */
    const ribbonContainer = el('ribbonOptions');
    if (ribbonContainer) {
      ribbonContainer.innerHTML = '';
      RIBBONS.forEach((ribbon, i) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'option-card' + (i === state.selectedRibbon ? ' selected' : '');
        card.setAttribute('data-ribbon-id', ribbon.id);
        card.setAttribute('aria-pressed', String(i === state.selectedRibbon));
        card.setAttribute('aria-label', ribbon.name);
        card.innerHTML =
          '<div class="option-svg">' + getRibbonOptionSVG(ribbon.id) + '</div>' +
          '<div class="option-label">' + ribbon.name + '</div>';
        ribbonContainer.appendChild(card);
      });
    }

    /* ---- b3. Flower sticker option cards ---- */
    const flowerContainer = el('flowerOptions');
    if (flowerContainer) {
      flowerContainer.innerHTML = '';
      FLOWERS.forEach((flower, i) => {
        const selected = state.selectedFlowers.includes(i);
        const card = document.createElement('div');
        card.className = 'option-card flower-option' + (selected ? ' selected' : '');
        card.setAttribute('data-flower-id', flower.id);
        card.innerHTML =
          '<button type="button" class="flower-select" aria-pressed="' + selected + '" aria-label="Select ' + flower.name + '">' +
            '<span class="option-svg">' + getFlowerOptionSVG(flower.id) + '</span>' +
            '<span class="option-label">' + flower.name + '</span>' +
          '</button>' +
          '<div class="sweet-quantity flower-quantity" aria-label="Quantity for ' + flower.name + '">' +
            '<button type="button" class="quantity-button" data-flower-quantity-change="-1" aria-label="Remove one ' + flower.name + '"' + (!selected || state.flowerQuantities[i] <= 1 ? ' disabled' : '') + '>−</button>' +
            '<span class="sweet-quantity-value flower-quantity-value" aria-live="polite">' + (state.flowerQuantities[i] || 1) + '</span>' +
            '<button type="button" class="quantity-button" data-flower-quantity-change="1" aria-label="Add one ' + flower.name + '"' + (!selected || state.flowerQuantities[i] >= MAX_FLOWER_QUANTITY || getFlowerStickerCount() >= MAX_FLOWER_STICKERS ? ' disabled' : '') + '>+</button>' +
          '</div>';
        flowerContainer.appendChild(card);
      });
    }

    /* ---- c. Sweet option cards ---- */
    const sweetContainer = el('sweetGrid');
    if (sweetContainer) {
      sweetContainer.innerHTML = '';
      SWEETS.forEach((sweet, i) => {
        const selected = state.selectedSweets.includes(i);
        const card = document.createElement('div');
        card.className = 'option-card sweet-option' + (selected ? ' selected' : '');
        card.setAttribute('data-sweet-idx', i);
        card.innerHTML =
          '<button type="button" class="sweet-select" aria-pressed="' + selected + '">' +
            '<span class="option-svg">' + getSweetSVG(sweet.id) + '</span>' +
            '<span class="option-label">' + sweet.name + '</span>' +
          '</button>' +
          '<div class="sweet-quantity" aria-label="Quantity for ' + sweet.name + '">' +
            '<button type="button" class="quantity-button" data-quantity-change="-1" aria-label="Remove one ' + sweet.name + '"' + (!selected || state.sweetQuantities[i] <= 1 ? ' disabled' : '') + '>−</button>' +
            '<span class="sweet-quantity-value" aria-live="polite">' + (state.sweetQuantities[i] || 1) + '</span>' +
            '<button type="button" class="quantity-button" data-quantity-change="1" aria-label="Add one ' + sweet.name + '"' + (!selected || state.sweetQuantities[i] >= MAX_SWEET_QUANTITY ? ' disabled' : '') + '>+</button>' +
          '</div>';
        sweetContainer.appendChild(card);
      });
    }

    /* ---- d. Diya option cards ---- */
    const diyaContainer = el('diyaOptions');
    if (diyaContainer) {
      diyaContainer.innerHTML = '';
      DIYAS.forEach((diya, i) => {
        const card = document.createElement('button');
        card.type = 'button';
        const selected = state.selectedDiyas.includes(i);
        card.className = 'option-card' + (selected ? ' selected' : '');
        card.setAttribute('data-diya-id', diya.id);
        card.setAttribute('aria-pressed', String(selected));
        card.innerHTML =
          '<div class="option-svg">' + getDiyaOptionSVG(diya.id) + '</div>' +
          '<div class="option-label">' + diya.name + '</div>';
        diyaContainer.appendChild(card);
      });
    }

    /* ---- e. Initial preview ---- */
    updatePreview();

    /* ---- f. Event listeners ---- */
    setupEventListeners();

    /* ---- g. Start with a clean gift each visit ---- */
    el('recipientName').value = state.recipientName;
    el('senderName').value = state.senderName;
    el('messageText').value = state.message;
    el('charCount').textContent = state.message.length;
    updatePreview();

    try {
      localStorage.removeItem('littleDiwaliGift');
    } catch (error) {
      console.warn('A previously saved gift could not be cleared from this browser.', error);
    }

    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      state.selectedBox = 0;
      state.selectedRibbon = 0;
      state.selectedFlowers = [];
      state.flowerQuantities = {};
      state.selectedSweets = [];
      state.sweetQuantities = {};
      state.selectedDiya = 0;
      state.selectedDiyas = [];
      state.stickerPositions = {};
      state.selectedStickerKey = '';
      state.recipientName = '';
      state.senderName = '';
      state.message = '';
      el('recipientName').value = '';
      el('senderName').value = '';
      el('messageText').value = '';
      el('charCount').textContent = '0';
      applySelections();
      updatePreview();
    });
  }

  function setupStickerDragging() {
    const container = el('previewContainer');
    if (!container) return;

    let activeDrag = null;
    const svgPoint = (svg, event) => {
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    };
    const positionFor = sticker => {
      const key = sticker.getAttribute('data-sticker-key');
      const saved = state.stickerPositions[key];
      return {
        x: saved ? saved.x : Number(sticker.getAttribute('data-base-x')),
        y: saved ? saved.y : Number(sticker.getAttribute('data-base-y')),
        scale: saved ? saved.scale : Number(sticker.getAttribute('data-scale')) || 1
      };
    };
    const setStickerTransform = (sticker, position) => {
      const baseX = Number(sticker.getAttribute('data-base-x'));
      const baseY = Number(sticker.getAttribute('data-base-y'));
      sticker.setAttribute('data-scale', String(position.scale));
      sticker.setAttribute('transform', `translate(${position.x} ${position.y}) scale(${position.scale}) translate(${-baseX} ${-baseY})`);
    };

    container.addEventListener('pointerdown', event => {
      const handle = event.target.closest('[data-resize-handle]');
      let sticker = handle && state.selectedStickerKey
        ? container.querySelector(`[data-sticker-key="${state.selectedStickerKey}"]`)
        : event.target.closest('.draggable-sticker');
      const svg = sticker && sticker.ownerSVGElement;
      if (!sticker || !svg || !container.contains(sticker)) return;

      state.selectedStickerKey = sticker.getAttribute('data-sticker-key');
      svg.querySelectorAll('.selected-sticker').forEach(node => node.classList.remove('selected-sticker'));
      sticker.classList.add('selected-sticker');
      sticker.parentNode.appendChild(sticker);
      updateStickerControls(svg, sticker);
      const point = svgPoint(svg, event);
      const position = positionFor(sticker);
      const resizeCenter = { x: position.x, y: position.y };
      activeDrag = {
        sticker,
        svg,
        key: sticker.getAttribute('data-sticker-key'),
        pointerId: event.pointerId,
        mode: handle ? 'resize' : 'move',
        startPointerX: point.x,
        startPointerY: point.y,
        startX: position.x,
        startY: position.y,
        startScale: position.scale,
        startDistance: Math.max(1, Math.hypot(point.x - resizeCenter.x, point.y - resizeCenter.y)),
        center: resizeCenter,
        baseX: Number(sticker.getAttribute('data-base-x')),
        baseY: Number(sticker.getAttribute('data-base-y'))
      };
      event.preventDefault();
      svg.setPointerCapture(event.pointerId);
      sticker.classList.add('is-dragging');
    });

    container.addEventListener('pointermove', event => {
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
      const point = svgPoint(activeDrag.svg, event);
      const next = { x: activeDrag.startX, y: activeDrag.startY, scale: activeDrag.startScale };
      if (activeDrag.mode === 'resize') {
        const distance = Math.hypot(point.x - activeDrag.center.x, point.y - activeDrag.center.y);
        next.scale = Math.min(2.4, Math.max(.45, activeDrag.startScale * distance / activeDrag.startDistance));
      } else {
        next.x = Math.min(430, Math.max(110, activeDrag.startX + point.x - activeDrag.startPointerX));
        next.y = Math.min(410, Math.max(205, activeDrag.startY + point.y - activeDrag.startPointerY));
      }
      setStickerTransform(activeDrag.sticker, next);
      activeDrag.current = next;
      updateStickerControls(activeDrag.svg, activeDrag.sticker);
    });

    const finishDrag = event => {
      if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
      activeDrag.sticker.classList.remove('is-dragging');
      if (activeDrag.current) {
        state.stickerPositions[activeDrag.key] = activeDrag.current;
      }
      activeDrag = null;
    };
    container.addEventListener('pointerup', finishDrag);
    container.addEventListener('pointercancel', finishDrag);
    container.addEventListener('click', event => {
      if (event.target.closest('.draggable-sticker') || event.target.closest('[data-resize-handle]')) return;
      state.selectedStickerKey = '';
      container.querySelectorAll('.selected-sticker').forEach(sticker => sticker.classList.remove('selected-sticker'));
      container.querySelector('.sticker-controls')?.setAttribute('display', 'none');
    });
  }

  function updateStickerControls(svg, sticker) {
    const controls = svg.querySelector('.sticker-controls');
    if (!controls) return;
    controls.replaceChildren();
    if (!sticker) {
      controls.setAttribute('display', 'none');
      return;
    }

    const bounds = sticker.getBBox();
    const toSvg = svg.getCTM().inverse().multiply(sticker.getCTM());
    const corners = [
      [bounds.x, bounds.y],
      [bounds.x + bounds.width, bounds.y],
      [bounds.x + bounds.width, bounds.y + bounds.height],
      [bounds.x, bounds.y + bounds.height]
    ].map(([x, y]) => {
      const point = svg.createSVGPoint();
      point.x = x;
      point.y = y;
      return point.matrixTransform(toSvg);
    });
    const xs = corners.map(point => point.x);
    const ys = corners.map(point => point.y);
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    const top = Math.min(...ys);
    const bottom = Math.max(...ys);
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    border.setAttribute('x', left);
    border.setAttribute('y', top);
    border.setAttribute('width', Math.max(1, right - left));
    border.setAttribute('height', Math.max(1, bottom - top));
    border.setAttribute('rx', '3');
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', '#b86b70');
    border.setAttribute('stroke-width', '1.4');
    border.setAttribute('stroke-dasharray', '4 3');
    border.setAttribute('pointer-events', 'none');
    controls.appendChild(border);

    corners.forEach((point, index) => {
      const handle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      handle.setAttribute('cx', point.x);
      handle.setAttribute('cy', point.y);
      handle.setAttribute('r', '5.5');
      handle.setAttribute('fill', '#fffdf7');
      handle.setAttribute('stroke', '#b86b70');
      handle.setAttribute('stroke-width', '2');
      handle.setAttribute('data-resize-handle', String(index));
      handle.setAttribute('pointer-events', 'all');
      controls.appendChild(handle);
    });
    controls.setAttribute('display', 'inline');
    svg.appendChild(controls);
  }

  /* ──────────────────────────────────────────────
   *  EVENT LISTENERS
   * ────────────────────────────────────────────── */

  function setupEventListeners() {
    setupStickerDragging();

    /* --- 1. Box selection (single-select) --- */
    const boxContainer = el('boxOptions');
    if (boxContainer) {
      boxContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        const boxId = parseInt(card.getAttribute('data-box-id'), 10);
        if (isNaN(boxId)) return;

        state.selectedBox = boxId;
        boxContainer.querySelectorAll('.option-card').forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        updatePreview();
      });
    }

    /* --- 1b. Ribbon selection (single-select) --- */
    const ribbonContainer = el('ribbonOptions');
    if (ribbonContainer) {
      ribbonContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        const ribbonId = parseInt(card.getAttribute('data-ribbon-id'), 10);
        if (isNaN(ribbonId)) return;

        state.selectedRibbon = ribbonId;
        ribbonContainer.querySelectorAll('.option-card').forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        updatePreview();
      });
    }

    /* --- 1c. Flower sticker selection and quantities --- */
    const flowerContainer = el('flowerOptions');
    if (flowerContainer) {
      flowerContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        const flowerId = parseInt(card.getAttribute('data-flower-id'), 10);
        if (isNaN(flowerId)) return;

        const quantityButton = e.target.closest('[data-flower-quantity-change]');
        if (quantityButton) {
          if (!state.selectedFlowers.includes(flowerId)) return;
          const change = parseInt(quantityButton.getAttribute('data-flower-quantity-change'), 10);
          const quantity = state.flowerQuantities[flowerId] || 1;
          if (change > 0 && getFlowerStickerCount() >= MAX_FLOWER_STICKERS) return;
          state.flowerQuantities[flowerId] = Math.min(MAX_FLOWER_QUANTITY, Math.max(1, quantity + change));
          state.selectedStickerKey = `flower-${flowerId}-${change > 0 ? quantity : Math.max(0, quantity - 2)}`;
          applySelections();
          updatePreview();
          return;
        }
        if (!e.target.closest('.flower-select')) return;

        const index = state.selectedFlowers.indexOf(flowerId);
        if (index >= 0) {
          state.selectedFlowers.splice(index, 1);
          if (state.selectedStickerKey.startsWith(`flower-${flowerId}-`)) state.selectedStickerKey = '';
        } else if (state.selectedFlowers.length < 6) {
          state.selectedFlowers.push(flowerId);
          state.selectedStickerKey = `flower-${flowerId}-0`;
        } else {
          return;
        }
        applySelections();
        updatePreview();
      });
    }

    /* --- 2. Sweet selection (multi-select, max 6) --- */
    const sweetContainer = el('sweetGrid');
    if (sweetContainer) {
      sweetContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        const idx = parseInt(card.getAttribute('data-sweet-idx'), 10);
        if (isNaN(idx)) return;

        const quantityButton = e.target.closest('[data-quantity-change]');
        if (quantityButton) {
          if (!state.selectedSweets.includes(idx)) return;
          const change = parseInt(quantityButton.getAttribute('data-quantity-change'), 10);
          const quantity = state.sweetQuantities[idx] || 1;
          state.sweetQuantities[idx] = Math.min(MAX_SWEET_QUANTITY, Math.max(1, quantity + change));
          state.selectedStickerKey = sweetStickerKey(SWEETS[idx].id, change > 0 ? quantity : Math.max(0, quantity - 2));
          applySelections();
          updatePreview();
          return;
        }
        if (!e.target.closest('.sweet-select')) return;

        const pos = state.selectedSweets.indexOf(idx);

        if (pos > -1) {
          /* Already selected → deselect (but keep at least 1) */
          if (state.selectedSweets.length <= 1) return;   // must keep ≥1
          state.selectedSweets.splice(pos, 1);
          if (state.selectedStickerKey.startsWith(`sweet-${SWEETS[idx].id}`)) state.selectedStickerKey = '';
          card.classList.remove('selected');
          card.querySelector('.sweet-select').setAttribute('aria-pressed', 'false');
        } else if (state.selectedSweets.length < 6) {
          /* Room to add → select */
          state.selectedSweets.push(idx);
          state.selectedStickerKey = sweetStickerKey(SWEETS[idx].id, 0);
          card.classList.add('selected');
          card.querySelector('.sweet-select').setAttribute('aria-pressed', 'true');
        } else {
          /* Keep the selection capped at six kinds. */
          return;
        }

        if (state.selectedSweets.includes(idx)) state.selectedStickerKey = sweetStickerKey(SWEETS[idx].id, 0);
        applySelections();
        updatePreview();
      });
    }

    /* --- 3. Diya selection (multi-select, max 4) --- */
    const diyaContainer = el('diyaOptions');
    if (diyaContainer) {
      diyaContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (!card) return;
        const diyaId = parseInt(card.getAttribute('data-diya-id'), 10);
        if (isNaN(diyaId)) return;

        const index = state.selectedDiyas.indexOf(diyaId);
        if (index >= 0) {
          state.selectedDiyas.splice(index, 1);
          if (state.selectedStickerKey === `diya-${diyaId}`) state.selectedStickerKey = '';
        } else if (state.selectedDiyas.length < 4) {
          state.selectedDiyas.push(diyaId);
          state.selectedStickerKey = `diya-${diyaId}`;
        } else {
          return;
        }
        state.selectedDiya = state.selectedDiyas[0] || 0;
        if (state.selectedDiyas.includes(diyaId)) state.selectedStickerKey = `diya-${diyaId}`;
        applySelections();
        updatePreview();
      });
    }

    /* --- 4. Form inputs --- */
    const recipientInput = el('recipientName');
    if (recipientInput) {
      recipientInput.addEventListener('input', () => {
        state.recipientName = recipientInput.value;
      });
    }

    const senderInput = el('senderName');
    if (senderInput) {
      senderInput.addEventListener('input', () => {
        state.senderName = senderInput.value;
      });
    }

    const messageInput = el('messageText');
    const charCount    = el('charCount');
    if (messageInput) {
      messageInput.addEventListener('input', () => {
        state.message = messageInput.value;
        if (charCount) charCount.textContent = messageInput.value.length;
      });
    }

    /* --- 5. Pre-written wishes --- */
    document.querySelectorAll('.wish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const wish = btn.getAttribute('data-wish');
        if (!wish) return;
        if (messageInput) {
          messageInput.value = wish;
          state.message = wish;
          if (charCount) charCount.textContent = wish.length;
        }
      });
    });

    /* --- 6. Share button --- */
    const shareBtn = el('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        await generateShareLink();
      });
    }

    /* --- 7. Download button --- */
    const downloadBtn = el('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        downloadAsImage();
      });
    }

    /* --- 8. Copy link button --- */
    const copyLinkBtn = el('copyLinkBtn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const input = el('shareLinkInput');
        if (input) copyToClipboard(input.value);
      });
    }

    const shortenLinkBtn = el('shortenLinkBtn');
    if (shortenLinkBtn) {
      shortenLinkBtn.addEventListener('click', async () => {
        const status = el('copyStatus');
        shortenLinkBtn.disabled = true;
        if (status) status.textContent = 'Making your link shorter…';
        try {
          const shareUrl = new URL('gift.html', window.location.href);
          shareUrl.hash = await encodeShortSharePayload();
          const input = el('shareLinkInput');
          if (input) input.value = shareUrl.href;
          if (status) status.textContent = 'Shorter link ready — copy it to share.';
        } catch (error) {
          console.error('Your shorter share link could not be generated.', error);
          if (status) status.textContent = error.message || 'Could not shorten the link. Please try again.';
        } finally {
          shortenLinkBtn.disabled = false;
        }
      });
    }

    /* --- 9. Modal close --- */
    const modalCloseBtn = el('modalCloseBtn');
    const shareModal    = el('shareModal');

    if (modalCloseBtn && shareModal) {
      modalCloseBtn.addEventListener('click', () => {
        shareModal.classList.remove('active');
      });
    }

    if (shareModal) {
      shareModal.addEventListener('click', (e) => {
        /* Close only when clicking the dark backdrop, not the card itself */
        if (e.target === shareModal) {
          shareModal.classList.remove('active');
        }
      });
    }
  }

  /* ──────────────────────────────────────────────
   *  INTRO OVERLAY → BUILDER TRANSITION
   * ────────────────────────────────────────────── */

  initBuilder();

});
