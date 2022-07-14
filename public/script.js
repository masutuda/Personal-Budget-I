const fetchAllButton = document.getElementById('fetch-envelopes');
const fetchByEnvelopeButton = document.getElementById('fetch-by-envelope');

const envelopeContainer = document.getElementById('envelope-container');
const quoteText = document.querySelector('.quote');
const attributionText = document.querySelector('.attribution');

const resetQuotes = () => {
  envelopeContainer.innerHTML = '';
}

const renderError = response => {
  envelopeContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
}

const renderEnvelopes = (envelopes = []) => {
  if (envelopes.length > 0) {
    envelopes.forEach(envelope => {
      const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelope.envelopeName}</h3>
          </div>
            <p>Max Budget: ${envelope.maxBudgetByAmount}</p>
            <p>Amount Left: ${envelope.amountLeft}</p>
          <div id="envelopeBottom"></div>
        </div>`
      envelopeContainer.appendChild(newEnvelope);
    });
  } else if (typeof envelopes === 'object'){
      const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelopes.envelopeName}</h3>
          </div>
            <p>Max Budget: ${envelopes.maxBudgetByAmount}</p>
            <p>Amount Left: ${envelopes.amountLeft}</p>
          <div id="envelopeBottom"></div>
        </div>`
      envelopeContainer.appendChild(newEnvelope);
  } else {
    envelopeContainer.innerHTML = '<p>You have no envelopes!</p>';
  } 
}

fetchAllButton.addEventListener('click', () => {
  fetch('/envelopes')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderEnvelopes(response);
  });
});

fetchByEnvelopeButton.addEventListener('click', () => {
  const envelopeName = document.getElementById('envelopeName').value;
  fetch(`/envelopes/${envelopeName}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderEnvelopes(response);
  });
});