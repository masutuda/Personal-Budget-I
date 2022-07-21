const submitButton = document.getElementById('submit-transfer');
const updatedEnvelopeContainer = document.getElementById('updated-envelope');

const selectEnvelopeFrom = document.getElementById("selectEnvelopeFrom");
const selectEnvelopeTo = document.getElementById("selectEnvelopeTo");

// Populate drop down menu
fetch('/envelopes')
    .then(response => response.json())
    .then(budgetEnvelopes => {
        for(let i = 0; i < budgetEnvelopes.length; i++) {
            let opt = budgetEnvelopes[i].envelopeName;
            let el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            selectEnvelopeFrom.appendChild(el);
        };
    });

fetch('/envelopes')
.then(response => response.json())
.then(budgetEnvelopes => {
    for(let i = 0; i < budgetEnvelopes.length; i++) {
        let opt = budgetEnvelopes[i].envelopeName;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectEnvelopeTo.appendChild(el);
    };
});


submitButton.addEventListener('click', () => {
  const fromEnvelopeName = document.getElementById('selectEnvelopeFrom').value;
  const toEnvelopeName = document.getElementById('selectEnvelopeTo').value;
  const transferAmount = Number(document.getElementById('transferAmount').value);

  fetch(`/envelopes/${fromEnvelopeName}`)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(fromEnvelope => {
     if(fromEnvelope.amountLeft >= transferAmount && transferAmount > 0) {
        const newFromAmount = fromEnvelope.amountLeft - transferAmount;
        fetch(`/envelopes/${fromEnvelopeName}?maxBudgetByAmount=${fromEnvelope.maxBudgetByAmount}&amountLeft=${newFromAmount}`, {
            method: 'PUT',
          });
        fetch(`/envelopes/${toEnvelopeName}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(toEnvelope => {
            const newToAmount = toEnvelope.amountLeft + transferAmount;
            fetch(`/envelopes/${toEnvelopeName}?maxBudgetByAmount=${toEnvelope.maxBudgetByAmount}&amountLeft=${newToAmount}`, {
                method: 'PUT',
              });
            updatedEnvelopeContainer.innerHTML = `Added ${transferAmount} to ${toEnvelopeName}.  New balance is ${newToAmount}`;
        });
     } else if (transferAmount > 0) {
        updatedEnvelopeContainer.innerHTML = 'Not Enough Funds To Transfer'
     } else {
        updatedEnvelopeContainer.innerHTML = 'Minimum Transfer Amount is $1'
     }
  });

  
});