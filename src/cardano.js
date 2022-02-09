const Cardano = require("cardanocli-js");

const cardano = new Cardano({
  network: "testnet",
  dir: __dirname + "/../",
  shelleyGenesisPath: __dirname + "/../testnet-shelley-genesis.json",
});

module.exports = cardano;

