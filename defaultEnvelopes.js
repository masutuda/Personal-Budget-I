const defaultEnvelopes = [
    {   
        id: 1,
        envelopeName: 'MORTGAGE',
        maxBudgetByAmount: 2000,
        amountLeft: 2000
    },
    {
        id: 2,
        envelopeName: 'AUTO',
        maxBudgetByAmount: 500,
        amountLeft: 500
    },
    {
        id: 3,
        envelopeName: 'SAVINGS',
        maxBudgetByAmount: 1000,
        amountLeft: 1000
    },
    {
        id: 4,
        envelopeName: 'GROCERIES',
        maxBudgetByAmount: 500,
        amountLeft: 500
    },
    {
        id: 5,
        envelopeName: 'UTILITIES',
        maxBudgetByAmount: 300,
        amountLeft: 300
    }
];

const defaultWallet = {
    envelopeName: 'WALLET',
    balance: 6000
}

module.exports = {defaultEnvelopes, defaultWallet};