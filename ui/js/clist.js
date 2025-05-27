// js/clist.js

(async function () {
  // 1) Load deployed ABI & address
  const res = await fetch('blockchain.json');
  if (!res.ok) return alert('Could not load contract info');
  const { abi, contractAddress } = await res.json();

  // 2) MetaMask / Web3 setup
  if (!window.ethereum) return alert('MetaMask not detected');
  const web3 = new Web3(window.ethereum);

  // 3) Connect once
  let accounts = await window.ethereum.request({ method: 'eth_accounts' });
  if (accounts.length === 0) {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  const userAccount = accounts[0];
  $('#accountDisplay')
    .text(userAccount);
  $('#connectWallet')
    .text('Wallet Connected')
    .prop('disabled', true)
    .off('click'); // disable further clicks

  // 4) Instantiate contract
  const votingContract = new web3.eth.Contract(abi, contractAddress);

  // 5) Helper to sanitize names → IDs
  function idify(name) {
    return name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  }

  // 6) Load initial vote counts
  $('.candidate-card').each(async function () {
    const name = $(this).data('name');
    const hexName = web3.utils.asciiToHex(name);
    const count = await votingContract.methods.totalVotesFor(hexName).call();
    $(`#${idify(name)} .count`).text(count);
  });

  // 7) Subscribe to on-chain events
  votingContract.events.VoteCast({ fromBlock: 0 })
    .on('data', ev => {
      // updateUI logic:
      const raw = web3.utils.hexToAscii(ev.returnValues.candidate).replace(/\0/g, '');
      const total = ev.returnValues.newTotal;
      $(`.candidate-card[data-name="${raw}"] .count`).text(total);
    });


  // 8) Wire up Vote buttons
  $('.vote-btn').click(async function () {
    const name = $(this).closest('.candidate-card').data('name');
    const hexName = web3.utils.asciiToHex(name);
    const receipt = await votingContract.methods
      .voteForCandidate(hexName)
      .send({
        from: userAccount
      })
    console.log('Tx sent:', receipt.transactionHash);
  });
})();
