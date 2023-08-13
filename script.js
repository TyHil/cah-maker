/* Load SVGs */

fetch('/images/white-front.svg')
  .then(r => r.text())
  .then(text => {
    document.getElementById('white-front').getElementsByClassName('card')[0].innerHTML = text;
  })
  .catch((e) => console.error(e));

fetch('/images/black-front.svg')
  .then(r => r.text())
  .then(text => {
    document.getElementById('black-front').getElementsByClassName('card')[0].innerHTML = text;
  })
  .catch((e) => console.error(e));



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
