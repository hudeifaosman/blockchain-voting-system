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
  const name    = $(this).data('name');
  const hexName = web3.utils.fromAscii(name, 32);
  const count   = await votingContract.methods
    .totalVotesFor(hexName)
    .call();
  $(this).find('.vote-count').text(count);
});

// 7) Subscribe to all VoteCast events
votingContract.events.VoteCast({ fromBlock: 0 })
  .on('data', ev => {
    const name  = web3.utils.hexToUtf8(ev.returnValues.candidate).replace(/\0/g, '');
    const total = ev.returnValues.newTotal;
    $(`.candidate-card[data-name="${name}"] .vote-count`).text(total);
  });

// 8) Wire up Vote buttons
$('.vote-btn').click(async function () {
  const $card   = $(this).closest('.candidate-card');
  const name    = $card.data('name');
  const hexName = web3.utils.fromAscii(name, 32);

  try {
    const receipt = await votingContract.methods
      .voteForCandidate(hexName)
      .send({ from: userAccount, gas: 100_000 });
    console.log('Tx sent:', receipt.transactionHash);
  } catch (e) {
    console.error('Vote failed', e);
    return 
  }

  // Immediately refresh the card’s count
  const newCount = await votingContract.methods
    .totalVotesFor(hexName)
    .call();
  $card.find('.vote-count').text(newCount);
});
})();
