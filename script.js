/* Tab Icon */

const tabicon = document.querySelector('link[rel="icon"]');
window
  .matchMedia('(prefers-color-scheme: light)')
  .addEventListener('change', function(event) {
    if (event.matches) {
      tabicon.href = './tabicon-light.png';
    } else {
      tabicon.href = './tabicon.png';
    }
  });



/* Load SVGs */

const divIDs = ['white-front', 'black-front'];
for (let i = 0; i < divIDs.length; i++) {
  fetch('cah-maker/images/' + divIDs[i] + '.svg')
    .then(r => r.text())
    .then(text => {
      document.getElementById(divIDs[i]).getElementsByClassName('card')[0].innerHTML = text;
    })
    .catch((e) => console.error(e));
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
    lines[j].addEventListener('input', function() {
      setSVGLine(div, j, this.value);
    });
    lines[j].addEventListener('change', function() {
      setDownloadHref(div.getElementsByClassName('card')[0], div.getElementsByTagName('a')[0], divIDs[i] + '.svg');
    });
  }

  //New
  div.getElementsByClassName('addLine')[0].addEventListener('click', function() {
    const linesLength = div.getElementsByTagName('input').length;
    const newLine = lines[0].cloneNode();
    newLine.value = '';
    newLine.placeholder = 'Line ' + (linesLength + 1);
    newLine.addEventListener('input', function() {
      setSVGLine(div, linesLength, this.value);
    });
    newLine.addEventListener('change', function() {
      setDownloadHref(div.getElementsByClassName('card')[0], div.getElementsByTagName('a')[0], divIDs[i] + '.svg');
    });
    div.insertBefore(newLine, this);
    if (linesLength >= 9) {
      this.style.display = 'none';
    }
  });
}

function setDownloadHref(card, a, filename) {
  const blob = new Blob(
    [ card.innerHTML ],
    { type: 'image/svg+xml' }
  );
  a.href = URL.createObjectURL(blob);
  a.download = filename ?? '';
}



/* Icon */

document.getElementById('file').addEventListener('change', function() {
  const reader = new FileReader();
  reader.onload = function(e) {
    const iconSpots = document.querySelectorAll('svg .icon');
    for (let i = 0; i < iconSpots.length; i++) {
      while (iconSpots[i].firstChild) {
        iconSpots[i].removeChild(iconSpots[i].firstChild);
      }
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.innerHTML = e.target.result;
      iconSpots[i].append(svg);
    }
    const divIDs = ['white-front', 'black-front'];
    for (let i = 0; i < divIDs.length; i++) {
      const div = document.getElementById(divIDs[i]);
      setDownloadHref(div.getElementsByClassName('card')[0], div.getElementsByTagName('a')[0], divIDs[i] + '.svg');
    }
  }
  reader.readAsText(this.files[0]);
});
