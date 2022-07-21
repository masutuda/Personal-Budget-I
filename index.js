const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const {defaultEnvelopes, defaultWallet} = require('./defaultEnvelopes.js');


let wallet = defaultWallet;
let budgetEnvelopes = defaultEnvelopes;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/envelopes/:envelopeId', (req, res, next) => {
    let  envelopeIndex = budgetEnvelopes.findIndex(envelope => envelope.envelopeName === req.params.envelopeId.toUpperCase());
    if (envelopeIndex === -1) {
        const envelopeId = Number(req.params.envelopeId);
        envelopeIndex = budgetEnvelopes.findIndex(envelope => envelope.id === envelopeId);
        if (envelopeIndex === -1) {
            return res.status(404).send('Envelope not found!');
         }
        req.envelopeIndex = envelopeIndex;
        next();
     } else {
        req.envelopeIndex = envelopeIndex;
        next();
     }
  });

app.get('/wallet', (req, res) => {
    res.send(wallet);
})

// Return all Envelopes
app.get('/envelopes', (req, res) => {
    res.send(budgetEnvelopes);
});

// Return single Envelope
app.get('/envelopes/:envelopeName', (req, res) => {
    res.send(budgetEnvelopes[req.envelopeIndex]);
});

// Add Envelope
app.post('/envelopes', (req, res) => {
    const newEnvelope = req.query;
    let  envelopeIndex = budgetEnvelopes.findIndex(envelope => envelope.envelopeName === newEnvelope.envelopeName.toUpperCase());
    if(newEnvelope.envelopeName && newEnvelope.maxBudgetByAmount && envelopeIndex === -1) {
        newEnvelope.id = budgetEnvelopes.length + 1;
        newEnvelope.envelopeName = newEnvelope.envelopeName.toUpperCase();
        newEnvelope.maxBudgetByAmount = Number(newEnvelope.maxBudgetByAmount);
        newEnvelope.amountLeft = Number(newEnvelope.amountLeft);
        budgetEnvelopes.push(newEnvelope);
        res.status(201);
        res.send({
        envelope: req.query
        });
    } else {
        res.status(400).send('Invalid');
    }
});

// Update Wallet
app.put('/wallet/:amountToAdd', (req, res) => {
    amountToAdd = Number(req.params.amountToAdd);
    wallet.balance += amountToAdd;
    res.send(wallet);
});

// Update Envelope
app.put('/envelopes/:envelopeName', (req, res) => {
    budgetEnvelopes[req.envelopeIndex].maxBudgetByAmount = Number(req.query.maxBudgetByAmount);
    budgetEnvelopes[req.envelopeIndex].amountLeft = Number(req.query.amountLeft);
    res.status(201);
    res.send({
        envelope: req.query
    });
});

// Delete Envelope
app.delete('/envelopes/:envelopeName', (req, res) => {
    const leftoverFunds = budgetEnvelopes[req.envelopeIndex].amountLeft;
    const deletedEnvelope = budgetEnvelopes[req.envelopeIndex];
    budgetEnvelopes.splice(req.envelopeIndex, 1);
    wallet.balance += leftoverFunds;
    res.status(204);
    res.send(deletedEnvelope); 
});

app.listen(port, () => console.log(`Listening on port: ${port}...`));