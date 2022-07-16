const submitButton = document.getElementById('submit-deleteEnvelope');
const deletedEnvelopeContainer = document.getElementById('deleted-envelope');

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
  fetch(`/envelopes/${envelopeName}`, {
    method: 'DELETE',
  })
  //.then(response => response.json())
  .then(response => {
    const newEnvelope = document.createElement('div');
      newEnvelope.className = 'single-envelope';
      newEnvelope.innerHTML = 
        `<p>Deleted ${envelopeName} Envelope</p>`
        deletedEnvelopeContainer.appendChild(newEnvelope);
  });
});