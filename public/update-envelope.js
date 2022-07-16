const submitButton = document.getElementById('submit-updatedEnvelope');
const updatedEnvelopeContainer = document.getElementById('updated-envelope');

const selectEnvelope = document.getElementById("selectEnvelope");

// Populate drop down menu
fetch('/envelopes')
    .then(response => response.json())
    .then(budgetEnvelopes => {
        for(let i = 0; i < budgetEnvelopes.length; i++) {
            let opt = budgetEnvelopes[i].envelopeName;
            let el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            selectEnvelope.appendChild(el);
        };
    });


submitButton.addEventListener('click', () => {
  const envelopeName = document.getElementById('selectEnvelope').value;
  const budgetAmount = document.getElementById('budgetAmount').value;
  fetch(`/envelopes/${envelopeName}?maxBudgetByAmount=${budgetAmount}&amountLeft=${budgetAmount}`, {
    method: 'PUT',
  })
  .then(response => response.json())
  .then(({envelope}) => {
    const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<p>Updated Envelope</p>
        <div id="envelopeHolder">
          <div id="envelopeTop">
            <h3>${envelopeName}</h3>
          </div>
            <p>Max Budget: ${envelope.maxBudgetByAmount}</p>
            <p>Amount Left: ${envelope.amountLeft}</p>
          <div id="envelopeBottom"></div>
        </div>
        <button onclick="window.location.href='index.html';">HOME</button>`
        updatedEnvelopeContainer.appendChild(newEnvelope);
  });
});