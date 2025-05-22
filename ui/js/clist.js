import Web3 from 'web3';
import config from '../config/blockchain.json';  // adjust path as needed

// js/clist.js
$(document).ready(async () => {
  // 1) Load your deployed details at runtime
  const res = await fetch('blockchain.json');
  if (!res.ok) {
    return alert('Could not load contract info');
  }
  const config = await res.json();           // { abi: […], contractAddress: "0x…" }
  
  // 2) MetaMask connect logic (as before)…
  if (!window.ethereum) {
    return alert('MetaMask not detected');
  }
  const web3 = new Web3(window.ethereum);
  let accounts = await window.ethereum.request({ method: 'eth_accounts' });
  if (accounts.length === 0) {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  const userAccount = accounts[0];
  $('#accountDisplay').text(`Connected: ${userAccount}`);
  $('#connectWallet').prop('disabled', true).text('Wallet Connected');

  // 3) Instantiate your contract from the fetched JSON
  const votingContract = new web3.eth.Contract(
    config.abi,
    config.contractAddress,
    { from: userAccount }
  );

  // …then wire up your Vote buttons & events exactly as before…
  votingContract.events.VoteCast({ fromBlock: 'latest' })
    .on('data', ev => {
      const name = web3.utils.hexToUtf8(ev.returnValues.candidate);
      $(`#${name}-count`).text(ev.returnValues.newTotal);
    });

  const hex = name => web3.utils.asciiToHex(name);
  $('#vote1').click(() =>
    votingContract.methods.voteForCandidate(hex('Sanat'))
      .send()
      .on('transactionHash', h => $('#loc_info').text('Tx sent: ' + h))
      .on('receipt', () => $('#loc_info').text('Voted for Sanat!'))
  );
  // …and so on for #vote2, #vote3, #vote4 …
});


$(document).ready(function () {
    $('.modal').modal();
    const aadhaarList = {
        "300000000000": "Akola",
        "738253790005": "Bhandara"
    };

    function readCookie(name) {
        const nameEQ = name + "=";
        return document.cookie.split(';').map(c => c.trim())
            .find(c => c.startsWith(nameEQ))
            ?.substring(nameEQ.length) || null;
    }

    const aadhaar = readCookie('aadhaar');
    $('#loc_info').text('Location based on Aadhaar: ' + (aadhaarList[aadhaar] || 'Unknown'));
});
