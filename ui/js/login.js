// login.js
$(document).ready(function () {
	// Existing cookie check and redirection (keep this if still needed for login)
	var cookie = readCookie('auth');
	if (cookie != null) {
		window.location = "/app";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	// Error message box (keep if needed for other errors)
	$('#messagebox').hide();

	// MetaMask Connection Logic (moved from clist.js)
	$('#connectWallet').click(async () => {
		if (!window.ethereum) {
			$('#messagebox').show();
			$('#errormsg').text('MetaMask not detected. Please install MetaMask!');
			return;
		}

		const web3 = new Web3(window.ethereum); // You'll need to ensure Web3 is available. See step 3.
		try {
			const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
			const userAccount = accounts[0];
			$('#accountDisplay').text(`Connected: ${userAccount}`);
			$('#connectWallet').prop('disabled', true).text('Wallet Connected');

			// You might want to redirect to a different page or enable other UI elements here
			// after a successful connection. For example:
			// window.location.href = '/app'; // Or '/info'

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
				// You might want to redirect the user back to the login page or handle re-connection
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

	// Remove or comment out the old login button click handler if it's no longer needed
	// $(login).click(function(){ ... });
});