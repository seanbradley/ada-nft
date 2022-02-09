# HOW TO RUN A CARDANO NODE AND MINT A CARDANO NFT

### Work In Progress


## Install Cardano Node and CLI

	https://developers.cardano.org/docs/get-started/installing-cardano-node

See also the Local Blockchain instructions in the README for the CLI.

A list of CLI commands...

	https://iohk.zendesk.com/hc/en-us/articles/900001219863-The-Cardano-CLI-commands

Another crib sheet...

	https://reposhub.com/linux/miscellaneous/input-output-hk-cardano-node.html


The CLI has specific instructions to instantiate a local blockchain more quickly and with less memory consumption than the docs at the developer portal.


More details here...

	https://github.com/input-output-hk/cardano-cli/blob/master/USAGE.md


Start by executing...

	cardano-cli blockchain new --template=testnet


"When you have created your first copy of a blockchain, you will find that there is no blocks in the blockchain just yet. This is because you need to fetch the blocks from other peers."

List available remotes...

	cardano-cli blockchain remote-ls testnet


"Try 

	--detailed 
	
for more details about the status of the remotes, and 

	--complete 
	
(necessitate network connection) for a comparative review of the local states and the remotes."

"And now, to fetch the block you can either use remote-sync or pull commands. The latter will also forward the state of the local blockchain to the latest block within the remotes."

	cardano-cli blockchain remote-fetch testnet

Or faster...

	cardano-cli blockchain remote-fetch testnet hermes 

first.

"Choose which of the new blocks will be the next tip of your local copy."

	cardano-cli blockchain forward testnet a928cb61b01...

"Or let the CLI choose for you the next tip by omitting the block hash parameter."

hint: use pull command to combine remote-fetch and forward.



## Run and Sync Node with Testnet

	https://developers.cardano.org/docs/get-started/running-cardano/

	./run

Syncing may take 6 to 8 hours or more.

You can try to run in background by prefacing with nohup...

	nohup ./run



## Check Status of Sync

Execute...

For testnet...

Read the slot number on the output of the node's command line.

Then compare that slot number with latest slot at....

	https://explorer.cardano-testnet.iohkdev.io/en.html


You can also try to fetch via...

	cardano-cli query tip --testnet-magic 1097911063
	

If you are getting an error message like...

	Network.Socket.connect: <socket: 13>: does not exist (No such file or directory)

...try running the node in the same terminal from which you run the query tip command.


...or...


Execute...

	cardano-cli sync progress

...or use an external API...

	https://blockfrost.io/

	https://cardano.stackexchange.com/questions/2223/how-can-i-check-if-my-node-is-fully-synced
 
 

## HOW TO STOP, RESTART, AND RESYNC NODE


Seems like a graceful stop and restart is not exactly possible. 


Stopping the node will result in needing to resync upon restart. The resync process may take some time. Likely, the longer your node is stopped, the longer it will take to sync.


	ctrl-C

...or...

	cardano-node stop

...or...

	cardano-cli shelley system stop

...or...

	cardano-node kill & restart 



## MINTING AN NFT

	https://developers.cardano.org/docs/native-tokens/minting-nfts/

...or a Javascript minter...

	https://github.com/armada-alliance/cardano-minter



## THE JAVASCRIPT MINTER

	git clone this repo

cd into the resultant directory

	npm init -y

	npm install cardanocli-js --save

Copy the Cardano node genesis latest build number from IOHK hydra website

	https://hydra.iohk.io/build/5367762/download/1/index.html

Download Genesis config file needed for shelly-era (this was already done if you set up and are running your node)

	nano fetch-config.sh

	NODE_BUILD_NUM=5822084

	wget -N https://hydra.iohk.io/build/${NODE_BUILD_NUM}/download/1/mainnet-shelley-genesis.json  # this URL needs to change if fetching testnet

	chmod +x fetch-config.sh
	
	./fetch-config.sh
	
	mkdir src

	cd src

	nano cardano.js

	const Cardano = require("cardanocli-js");

	const cardano = new Cardano({
	  network: "mainnet",
	  dir: __dirname + "/../",
	  shelleyGenesisPath: __dirname + "/../mainnet-shelley-genesis.json", # this URL needs to change if fetching testnet
	});

	module.exports = cardano;


	nano create-wallet.js

	const cardano = require("./cardano");

	const createWallet = (account) => {
	  const payment = cardano.addressKeyGen(account);
	  const stake = cardano.stakeAddressKeyGen(account);
	  cardano.stakeAddressBuild(account);
	  cardano.addressBuild(account, {
		paymentVkey: payment.vkey,
		stakeVkey: stake.vkey,
	  });
	  return cardano.wallet(account);
	};

	createWallet("ADAPI");

	cd cardano-minter

	node src/create-wallet.js

We need to verify the wallet balance is zero, then we need to fund the wallet...
    
First, we need to create a get-balance.js script.

	const cardano = require("./cardano");

	const sender = cardano.wallet("ADAPI");

	console.log(sender.balance());



## Additional Resources

Here's a simpler Pythonic blockchain to help one more easily grok the broad strokes...

	https://github.com/krvaibhaw/blockchain


