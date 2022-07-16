const submitButton = document.getElementById('submit-envelope');
const newEnvelopeContainer = document.getElementById('new-envelope');

const renderError = response => {
  newEnvelopeContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`
}

submitButton.addEventListener('click', () => {
  const envelopeName = document.getElementById('envelopeName').value;
  const budgetAmount = document.getElementById('budgetAmount').value;

  fetch(`/envelopes?envelopeName=${envelopeName}&maxBudgetByAmount=${budgetAmount}&amountLeft=${budgetAmount}`, {
    method: 'POST',
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(({envelope}) => {
    newEnvelopeContainer.innerHTML = '';
    const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<p>New Envelope Added</p>
        <div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelope.envelopeName}</h3>
          </div>
            <p>Max Budget: ${envelope.maxBudgetByAmount}</p>
            <p>Amount Left: ${envelope.amountLeft}</p>
          <div id="envelopeBottom"></div>
        </div>
        <button onclick="window.location.href='index.html';">HOME</button>`
        newEnvelopeContainer.appendChild(newEnvelope);
  });
});