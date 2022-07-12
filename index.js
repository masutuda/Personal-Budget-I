const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const {defaultEnvelopes} = require('./defaultEnvelopes.js');

let totalBudget;
let budgetEnvelopes = [];
budgetEnvelopes = defaultEnvelopes;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/envelopes/:envelopeId', (req, res, next) => {
    const envelopeId = Number(req.params.envelopeId);
    const envelopeIndex = budgetEnvelopes.findIndex(envelope => envelope.id === envelopeId);
    if (envelopeIndex === -1) {
      return res.status(404).send('Envelope not found');
    }
    req.envelopeIndex = envelopeIndex;
    next();
  });


const validateEnvelope = (req, res, next) => {
    const newEnvelope = req.body;
    newEnvelope.maxBudgetByAmount = Number(newEnvelope.maxBudgetByAmount);
    newEnvelope.amountLeft = Number(newEnvelope.amountLeft);
    next();
}


// Return all Envelopes
app.get('/envelopes', (req, res) => {
    res.send(budgetEnvelopes);
});

// Return single Envelope
app.get('/envelopes/:id', (req, res) => {
    res.send(budgetEnvelopes[req.envelopeIndex]);
});

// Add Envelope
app.post('/envelopes', validateEnvelope, (req, res) => {
    const newEnvelope = req.body;
    newEnvelope.id = budgetEnvelopes.length + 1;
    budgetEnvelopes.push(newEnvelope);
    res.status(201).send(newEnvelope);
});

// Update Envelope
app.put('/envelopes/:id', validateEnvelope, (req, res) => {
    budgetEnvelopes[req.envelopeIndex] = req.body;
    res.send(req.body);
});

// Delete Envelope
app.delete('/envelopes/:id', (req, res) => {
    const deletedEnvelope = budgetEnvelopes[req.envelopeIndex];
    budgetEnvelopes.splice(req.envelopeIndex, 1);
    res.send(deletedEnvelope);
    res.status(204);
});


app.listen(port, () => console.log(`Listening on port: ${port}...`));