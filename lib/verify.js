'use strict';

const utils = require ('./utils');
const config = require ('../config');
const query = require('../lib/rpc/wallet');

const verifyCallTxInputs = (input) => {
  if (!utils.isAddress (input.Address) || !utils.isUint (input.Sequence)) {
    return false;
  }
  return true;
};

const verifyInputs = (inputs) => {
  let len = inputs.length;
  
  for (let i = 0; i < len; i++) {
    let input = inputs[i];
    if (!utils.isAddress (input.Address) || !utils.isUint (input.Amount) || !utils.isUint (input.Sequence)) {
      return false;
    }
    if (i == 0) {
      let currBalance;
      currBalance = query.getBalanceDB(input.Address.toUpperCase())
      if (currBalance < input.Amount + config.TRANSACTION_FEE_AMOUNT) {
        return false;
      }
    }
  }
  return true;
};

const verifyOutputs = (outputs) => {
  let len = outputs.length;
  
  for (let i = 0; i < len; i++) {
    let output = outputs[i];
    if (!utils.isAddress (output.Address) || !utils.isUint (output.Amount)) {
      return false;
    }
  }
  return true;
};

// thuannd start
const verifyAmount = (inputs, outputs) => {
  let totalI = 0;
  let totalO = 0;

  for (let i = 0; i < inputs.length; i++) {
    totalI += inputs[i].Amount;
  }
  for (let i = 0; i < outputs.length; i++) {
    totalO += outputs[i].Amount;
  }
  if (totalI != totalO) {
    return false;
  }
  return true;
};
// thuannd end

const checkTx = (tx) => {
  if (!tx) {
    return false;
  }
  
  let txType = tx.Type;
  
  switch (txType) {
    case 'SendTx': {
      // thuannd start
      return verifyInputs (tx.Payload.Inputs) && verifyOutputs (tx.Payload.Outputs) && verifyAmount(tx.Payload.Inputs, tx.Payload.Outputs);
      // thuannd end
    }
    case 'CallTx': {
      return verifyCallTxInputs(tx.Payload.Input);
    }
    default:
      return false;
  }
};

module.exports = {
  checkTx: checkTx
};

