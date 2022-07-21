const submitNewBudget = document.getElementById('submit-new-budget');
const submitWithdraw = document.getElementById('submit-withdraw');
const updatedEnvelopeContainer = document.getElementById('updated-envelope');

//const selectEnvelope = document.getElementById("selectEnvelope");

// Populate drop down menu
fetch('/envelopes')
    .then(response => response.json())
    .then(budgetEnvelopes => {
        for(let i = 0; i < budgetEnvelopes.length; i++) {
            let opt = budgetEnvelopes[i].envelopeName;
            let el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            updateBudgetEnvelope.appendChild(el);
            //withdrawEnvelope.appendChild(el);
        };
        for(let i = 0; i < budgetEnvelopes.length; i++) {
          let opt = budgetEnvelopes[i].envelopeName;
          let el = document.createElement("option");
          el.textContent = opt;
          el.value = opt;
          //updateBudgetEnvelope.appendChild(el);
          withdrawEnvelope.appendChild(el);
        };
    });


submitNewBudget.addEventListener('click', () => {
  const envelopeName = document.getElementById('updateBudgetEnvelope').value;
  const budgetAmount = document.getElementById('budgetAmount').value;
  fetch(`/envelopes/${envelopeName}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(envelope => {
    fetch(`/envelopes/${envelopeName}?maxBudgetByAmount=${budgetAmount}&amountLeft=${envelope.amountLeft}`, {
      method: 'PUT',
    })
    .then(response => response.json())
    .then(({envelope}) => {
      const newEnvelope = document.createElement('div');
        newEnvelope.className = 'single-envelope';
        newEnvelope.innerHTML = 
          `<h3>Updated Envelope</h3>
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
});

submitWithdraw.addEventListener('click', () => {
  const envelopeName = document.getElementById('withdrawEnvelope').value;
  const withdrawAmount = document.getElementById('withdrawAmount').value;
  let newBudgetAmount = 0;

  fetch(`/envelopes/${envelopeName}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(envelope => {
    newBudgetAmount = envelope.amountLeft - withdrawAmount;
    fetch(`/envelopes/${envelopeName}?maxBudgetByAmount=${envelope.maxBudgetByAmount}&amountLeft=${newBudgetAmount}`, {
      method: 'PUT',
    })
    .then(response => response.json())
    .then(({envelope}) => {
      console.log(newBudgetAmount);
      const newEnvelope = document.createElement('div');
        newEnvelope.className = 'single-envelope';
        newEnvelope.innerHTML = 
          `<h3>Updated Envelope</h3>
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
  })
});