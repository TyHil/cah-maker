/* Tab Icon */

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.querySelector('link[rel="icon"]').href = '/cah-maker/tabicon-light.png';
}

/* Load SVGs */

const fileNames = ['white-front', 'black-front'];
for (let i = 0; i < fileNames.length; i++) {
  fetch('cah-maker/images/' + fileNames[i] + '.svg')
    .then(r => r.text())
    .then(text => {
      document.getElementById(fileNames[i]).getElementsByClassName('card')[0].innerHTML = text;
    })
    .catch(e => console.error(e));
}

/* Process edits */

function setSVGLine(div, number, value) {
  div.getElementsByTagName('svg')[0].getElementsByClassName('line' + number)[0].textContent = value;
}

const divIDs = ['white-front', 'black-front'];
for (let i = 0; i < divIDs.length; i++) {
  const div = document.getElementById(divIDs[i]);

  //Existing
  const lines = div.getElementsByTagName('input');
  for (let j = 0; j < lines.length; j++) {
    lines[j].addEventListener('input', function () {
      setSVGLine(div, j, this.value);
    });
    lines[j].addEventListener('change', function () {
      setDownloadHref(
        div.getElementsByClassName('card')[0],
        div.getElementsByTagName('a')[0],
        divIDs[i] + '.svg'
      );
    });
  }

  //New
  div.getElementsByClassName('addLine')[0].addEventListener('click', function () {
    const linesLength = div.getElementsByTagName('input').length;
    const newLine = lines[0].cloneNode();
    newLine.value = '';
    newLine.placeholder = 'Line ' + (linesLength + 1);
    newLine.addEventListener('input', function () {
      setSVGLine(div, linesLength, this.value);
    });
    newLine.addEventListener('change', function () {
      setDownloadHref(
        div.getElementsByClassName('card')[0],
        div.getElementsByTagName('a')[0],
        divIDs[i] + '.svg'
      );
    });
    div.insertBefore(newLine, this);
    if (linesLength >= 9) {
      this.style.display = 'none';
    }
  });
}

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

document.getElementById('file').addEventListener('change', function () {
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
