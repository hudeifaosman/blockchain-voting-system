// login.js
$(document).ready(function () {
	var cookie = readCookie('auth');
	if (cookie != null) {
		window.location = "/app";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	$('#messagebox').hide();

	$('#connectWallet').click(async () => {
		if (!window.ethereum) {
			$('#messagebox').show();
			$('#errormsg').text('MetaMask not detected. Please install MetaMask!');
			return;
		}

		try {
			// 1) see if we're already connected
			let accounts = await window.ethereum.request({ method: 'eth_accounts' });
			// 2) first-time visitor? ask for permission
			if (accounts.length === 0) {
				accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			}
			const userAccount = accounts[0];
			$('#accountDisplay').text(`Connected: ${userAccount}`);

			// 3) now that we're connected, go straight to the vote page
			window.location.href = 'clist.html';

		} catch (err) {
			console.error('User denied account access', err);
			$('#messagebox').show();
			$('#errormsg').text('Please allow wallet access to continue.');
		}

		// Handle account and chain changes (optional, but good practice)
		window.ethereum.on('accountsChanged', (accounts) => {
			if (accounts.length === 0) {
				// User disconnected all accounts
				$('#accountDisplay').text('');
				$('#connectWallet').prop('disabled', false).text('Connect Wallet');
			} else {
				// Account changed
				$('#accountDisplay').text(`Connected: ${accounts[0]}`);
			}
		});

		window.ethereum.on('chainChanged', (chainId) => {
			// Reload the page or update UI based on the new chain
			console.log('Chain changed to:', chainId);
			location.reload();
		});
	});
});