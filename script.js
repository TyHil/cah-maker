/* Tab Icon */

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.querySelector('link[rel="icon"]').href = '/cah-maker/tabicon-light.png';
}

/* Load SVGs */

['white-front', 'black-front'].forEach(fileName => {
  fetch('cah-maker/images/' + fileName + '.svg')
    .then(r => r.text())
    .then(text => {
      document.getElementById(fileName).getElementsByClassName('card')[0].innerHTML = text;
    })
    .catch(e => console.error(e));
});

/* Process edits */

const MAX_LINES = 10;
const Y_POSITIONS = {
  large: [55, 79, 103, 127, 151, 175, 199, 223, 247, 271],
  small: [51, 71, 91, 111, 131, 151, 171, 191, 211, 231]
};
// 15 - 10: 15 size gap minus 10 px closer to the top that the image is than the text
const IMAGE_TRANSFORM = 5;

['white-front', 'black-front']
  .map(id => document.getElementById(id))
  .forEach(div => {
    function localSetDownloadHref() {
      setDownloadHref(
        div.getElementsByClassName('card')[0],
        div.getElementsByTagName('a')[0],
        div.id + ' (' + lineInputs[0].value + ').svg'
      );
    }
    // Text
    const lineInputs = div.getElementsByClassName('text-input');
    function setListeners(lineInput, num) {
      lineInput.addEventListener('input', function () {
        const svg = div.getElementsByTagName('svg')[0];
        const rect = svg.getElementsByTagName('rect')[0];
        const line = svg.getElementsByClassName('line' + num)[0];
        line.textContent = this.value;
        if (line.getBBox().width > rect.getAttribute('width') - 2 * line.getAttribute('x')) {
          lineInput.setCustomValidity('Line is too wide.');
        } else {
          lineInput.setCustomValidity('');
        }
      });
      lineInput.addEventListener('change', function () {
        localSetDownloadHref();
      });
      lineInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          if (lineInput.nextElementSibling.tagName === 'INPUT') {
            lineInput.nextElementSibling.focus();
          } else {
            addLine();
          }
        }
      });
    }
    for (let i = 0; i < lineInputs.length; i++) {
      setListeners(lineInputs[i], i);
    }

    // Add line
    const addLineEl = div.getElementsByClassName('addLine')[0];
    function addLine() {
      const linesLength = div.getElementsByClassName('text-input').length;
      if (linesLength < MAX_LINES) {
        const newLine = lineInputs[0].cloneNode();
        newLine.value = '';
        newLine.placeholder = 'Line ' + (linesLength + 1);
        setListeners(newLine, linesLength);
        div.getElementsByClassName('lines-container')[0].insertBefore(newLine, addLineEl);
        if (linesLength >= 9) {
          addLineEl.style.display = 'none';
        }
        newLine.focus();
      }
    }
    addLineEl.addEventListener('click', addLine);

    // Image
    const imageInput = div.getElementsByClassName('image-input')[0];
    const removeImageButton = div.getElementsByClassName('remove-image')[0];
    function removeImage() {
      const imageSpot = div.querySelectorAll('svg .image')[0];
      const textGroup = div.querySelectorAll('svg .text')[0];
      imageSpot.setAttribute('href', '');
      imageSpot.setAttribute('height', 0);
      textGroup.setAttribute('transform', 'translate(0, 0)');
      localSetDownloadHref();
      removeImageButton.style.display = 'none';
    }
    imageInput.addEventListener('change', function () {
      if (!this.files.length) {
        removeImage();
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageSpot = div.querySelectorAll('svg .image')[0];
        const textGroup = div.querySelectorAll('svg .text')[0];

        imageSpot.setAttribute('href', e.target.result);

        const img = new Image();
        img.onload = function () {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const heightInSvg = (imageSpot.getAttribute('width') / width) * height;
          imageSpot.setAttribute('height', heightInSvg);
          textGroup.setAttribute(
            'transform',
            'translate(0, ' + (heightInSvg + IMAGE_TRANSFORM) + ')'
          );

          localSetDownloadHref();

          removeImageButton.style.display = 'block';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    });
    removeImageButton.addEventListener('click', function () {
      removeImage();
      imageInput.value = '';
    });

    // Small text
    const smallTextInput = div.getElementsByClassName('small-text-input')[0];
    function updateTextSize() {
      const textGroup = div.querySelectorAll('svg .text')[0];
      textGroup.setAttribute('font-size', smallTextInput.checked ? '16px' : '20px');

      const lines = div.querySelectorAll('svg tspan');
      for (let i = 0; i < lines.length; i++) {
        lines[i].setAttribute('y', Y_POSITIONS[smallTextInput.checked ? 'small' : 'large'][i]);
      }

      localSetDownloadHref();
    }
    smallTextInput.addEventListener('change', updateTextSize);
  });

function setDownloadHref(card, a, filename) {
  const blob = new Blob([card.innerHTML], { type: 'image/svg+xml' });
  a.href = URL.createObjectURL(blob);
  if (typeof filename === 'undefined') {
    a.download = '';
  } else {
    a.download = filename;
  }
}

/* Icon */

document.getElementById('icon-input').addEventListener('change', function () {
  const reader = new FileReader();
  reader.onload = function (e) {
    const iconSpots = document.querySelectorAll('svg .icon');
    for (let i = 0; i < iconSpots.length; i++) {
      while (iconSpots[i].firstChild) {
        iconSpots[i].removeChild(iconSpots[i].firstChild);
      }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.innerHTML = e.target.result;
      iconSpots[i].append(svg);
    }
    const divIDs = ['white-front', 'black-front'];
    for (let i = 0; i < divIDs.length; i++) {
      const div = document.getElementById(divIDs[i]);
      setDownloadHref(
        div.getElementsByClassName('card')[0],
        div.getElementsByTagName('a')[0],
        divIDs[i] + '.svg'
      );
    }
  };
  reader.readAsText(this.files[0]);
});

/* Font not available */
//From: https://stackoverflow.com/a/62687060

const container = document.createElement('span');
container.innerHTML = Array(100).join('wi');
container.style.cssText = [
  'position:absolute',
  'width:auto',
  'font-size:128px',
  'left:-99999px'
].join(' !important;');

function getWidth(fontFamily) {
  container.style.fontFamily = fontFamily;
  document.body.appendChild(container);
  width = container.clientWidth;
  document.body.removeChild(container);
  return width;
}

// Pre compute the widths of monospace, serif & sans-serif
// to improve performance.
const monoWidth = getWidth('monospace');
const serifWidth = getWidth('serif');
const sansWidth = getWidth('sans-serif');

function isFontAvailable(font) {
  return (
    monoWidth !== getWidth(font + ',monospace') ||
    sansWidth !== getWidth(font + ',sans-serif') ||
    serifWidth !== getWidth(font + ',serif')
  );
}

if (!isFontAvailable('HelveticaNeue')) {
  const p = document.createElement('p');
  p.innerText = "Looks like you don't have the right font installed. Download and install it from ";
  const a = document.createElement('a');
  a.href = 'https://fontsgeek.com/fonts/helveticaneue-bold';
  a.target = '_blank';
  a.rel = 'noopener';
  a.innerText = 'Fonts geek';
  p.appendChild(a);
  createToast(p, { permanent: true, htmlText: true });
}
