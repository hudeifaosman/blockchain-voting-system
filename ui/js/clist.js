import Web3 from 'web3';
import config from '../config/blockchain.json';  // adjust path as needed

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

    $('#connectWallet').click(async () => {
        if (!window.ethereum) {
            return alert('MetaMask not detected. Please install MetaMask!');
        }

        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({method: 'eth_requestAccounts'});
        } catch (err) {
            console.error('User denied account access', err);
            return alert('Please allow wallet access to continue.');
        }

        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        $('#accountDisplay').text(`Connected: ${userAccount}`);
        $('#connectWallet').prop('disabled', true).text('Wallet Connected');

        const contractInstance = new web3.eth.Contract(
            config.abi,
            config.contractAddress,
            {from: userAccount}
        );

        contractInstance.events.VoteCast({fromBlock: 'latest'})
            .on('data', event => {
                const candidate = web3.utils.hexToUtf8(event.returnValues.candidate);
                const total = event.returnValues.total;
                $(`#${candidate}-count`).text(total);
            })
            .on('error', err => console.error('Event subscription error:', err));

        window.ethereum.on('accountsChanged', () => location.reload());
        window.ethereum.on('chainChanged', () => location.reload());

        const hex = name => web3.utils.asciiToHex(name);

        function disableVoting() {
            $('#vote1,#vote2,#vote3,#vote4').addClass('disabled');

            document.cookie = "show=; max-age=0; path=/";
            document.cookie = "aadhaar=; max-age=0; path=/";
            location.href = '/app';
        }

        $('#vote1').click(() => {
            contractInstance.methods.voteForCandidate(hex('Sanat'))
                .send()
                .on('transactionHash', hash => $('#loc_info').text('Tx sent: ' + hash))
                .on('receipt', () => {
                    $('#loc_info').text('Voted for Sanat!');
                    disableVoting();
                })
                .on('error', err => alert('Sanat vote failed: ' + err.message));
        });

        $('#vote2').click(() => {
            contractInstance.methods.voteForCandidate(hex('Aniket'))
                .send()
                .on('transactionHash', hash => $('#loc_info').text('Tx sent: ' + hash))
                .on('receipt', () => {
                    $('#loc_info').text('Voted for Aniket!');
                    disableVoting();
                })
                .on('error', err => alert('Aniket vote failed: ' + err.message));
        });

        $('#vote3').click(() => {
            contractInstance.methods.voteForCandidate(hex('Mandar'))
                .send()
                .on('transactionHash', hash => $('#loc_info').text('Tx sent: ' + hash))
                .on('receipt', () => {
                    $('#loc_info').text('Voted for Mandar!');
                    disableVoting();
                })
                .on('error', err => alert('Mandar vote failed: ' + err.message));
        });

        $('#vote4').click(() => {
            contractInstance.methods.voteForCandidate(hex('Akshay'))
                .send()
                .on('transactionHash', hash => $('#loc_info').text('Tx sent: ' + hash))
                .on('receipt', () => {
                    $('#loc_info').text('Voted for Akshay!');
                    disableVoting();
                })
                .on('error', err => alert('Akshay vote failed: ' + err.message));
        });
    });
});