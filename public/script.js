const fetchAllButton = document.getElementById('fetch-envelopes');
const fetchByEnvelopeButton = document.getElementById('fetch-by-envelope');
const distributeButton = document.getElementById('distribute-funds');
const addToWalletButton = document.getElementById('add-wallet-funds');

const envelopeContainer = document.getElementById('envelope-container');
const walletContainer = document.getElementById('walletContainer');
const distributeContainer = document.getElementById('distributeContainer');
const quoteText = document.querySelector('.quote');
const attributionText = document.querySelector('.attribution');

// transfer between envelopes - 
const renderWallet = () => {
  walletContainer.innerHTML = '';
  fetch('/wallet')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
  .then(response => {
    const newEnvelope = document.createElement('div');
    newEnvelope.className = 'single-envelope';
    newEnvelope.innerHTML = 
      `<div id="envelopeHolder">
        <div id="envelopeTop">
          <h3>${response.envelopeName}</h3>
        </div>
          <p>Amount Left: ${response.balance}</p>
        <div id="envelopeBottom"></div>
      </div>`
    walletContainer.appendChild(newEnvelope);
  })
}

const renderError = response => {
  envelopeContainer.innerHTML = `<p>Your request returned an error from the server: </p>
<p>Code: ${response.status}</p>
<p>${response.statusText}</p>`;
}

const renderEnvelopes = (envelopes = []) => {
  envelopeContainer.innerHTML = '';
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

addToWalletButton.addEventListener('click', () => {
  const amountToAdd = document.getElementById('amountToAdd').value;
  fetch(`/wallet/${amountToAdd}`, {
    method: 'PUT',
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    renderWallet();
  });
});

// Distribute maximum budget to each envelope from wallet
distributeButton.addEventListener('click', () => {
  let walletAmountLeft = 0;
  fetch('/wallet')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        renderError(response);
      }
    })
  .then(response => {
    walletAmountLeft = response.balance;
  });

  fetch('/envelopes')
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      renderError(response);
    }
  })
  .then(response => {
    let totalBudgetRequired = 0;
    for(let i = 0; i < response.length; i++){
      totalBudgetRequired += response[i].maxBudgetByAmount;
    }
    if (walletAmountLeft >= totalBudgetRequired){
      for(let i = 0; i < response.length; i++){
        const newAmountLeft = response[i].maxBudgetByAmount + response[i].amountLeft;
        fetch(`/envelopes/${response[i].envelopeName}?maxBudgetByAmount=${response[i].maxBudgetByAmount}&amountLeft=${newAmountLeft}`, {
          method: 'PUT',
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            renderError(response);
          }
        })
        //.then(response => {
          //renderWallet();
        //});
      }
      fetch(`/wallet/-${totalBudgetRequired}`, {
        method: 'PUT',
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          renderError(response);
        }
      })
      .then(response => {
        renderWallet();
      });
      walletContainer.innerHTML = `You deposited ${totalBudgetRequired} into your envelopes`;
    } else {
      walletContainer.innerHTML = 'Not Enough Funds';
    }
  });
});