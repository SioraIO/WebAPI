'use strict';

const SDK = require('xek-sdk');
const Web3 = require('web3');
const web3 = new Web3();
const config = require ('../../config');
const transaction = require('./transaction');

const myContract = new SDK.Contract(config.CHAIN_ID, null, config.CONTRACT_ABI, config.CONTRACT_BYTECODE);

const FROM = '0000000000000000000000000000000000000000';
const GAS_LIMIT = 1111111111;
const FEE = 0;

/**
 * Create transaction.
 * 
 * @param {String} contractAddr Contract address
 * @param {String} data Data
 */
function createTx(contractAddr, data) {
      return {
            Input: {
                  Address: Buffer.from(FROM, 'hex'),
                  Amount: 0,
            },
            Address: Buffer.from(contractAddr.toUpperCase(), 'hex'),
            Data: Buffer.from(data.toUpperCase(), 'hex'),
            GasLimit: GAS_LIMIT,
            Fee: FEE
      };
}

/**
 * Return number of transaction.
 * 
 * @param {String} contractAddr Contract address
 */
async function getTransactionCount(contractAddr) {
      try {
            let dataGetTxCount = myContract.getMethod("getTransactionCount",[true, true]);
            dataGetTxCount = dataGetTxCount.slice(2);

            const tx = createTx(contractAddr, dataGetTxCount);
      
            const callTxSim = await transaction.callTx(tx);
            const result = callTxSim && callTxSim.Result && callTxSim.Result.Return;
            const buffer = Buffer.from(result);

            const constantMethod = myContract.getConstantMethod('getTransactionCount');
            const {typeOutput} = constantMethod;

            return web3.eth.abi.decodeParameters(typeOutput, buffer.toString('hex'))[0];
      } catch (error) {
            throw new Error(error);
      }
}

/**
 * Return transaction info.
 * 
 * @param {String} contractAddr Contract address
 * @param {Number} index Transaction ID
 */
async function getTransaction(contractAddr, index) {
      try {
            let dataGetTx = myContract.getMethod("transactions",[index]);
            dataGetTx = dataGetTx.slice(2);

            const tx = createTx(contractAddr, dataGetTx);
      
            const callTxSim = await transaction.callTx(tx);
            const result = callTxSim && callTxSim.Result && callTxSim.Result.Return;
            const buffer = Buffer.from(result);

            const constantMethod = myContract.getConstantMethod('transactions');
            const {typeOutput} = constantMethod;

            let txInfo = web3.eth.abi.decodeParameters(typeOutput, buffer.toString('hex'));
            let data = txInfo[2];
            let decodedData;
            
            if(data) {
                  decodedData = myContract.decodeData(data);
            } else {
                  decodedData = {
                        name: 'Send To',
                        params: [txInfo[0], txInfo[1]]
                  }
            }

            const confirmations = await getConfirmations(contractAddr, index);

            return {
                  destination: txInfo[0],
                  value: 0,
                  data: decodedData,
                  confirmations,
                  executed: txInfo[3]
            }
      } catch (error) {
            throw new Error(error);
      }
}

/**
 * Get of confirmations.
 * @param {String} contractAddr Contract address
 * @param {Number} index Transaction ID
 */
async function getConfirmations(contractAddr, index) {
      try {
            let dataGetCons = myContract.getMethod("getConfirmations",[index]);
            dataGetCons = dataGetCons.slice(2);

            const tx = createTx(contractAddr, dataGetCons);
      
            const callTxSim = await transaction.callTx(tx);
            const result = callTxSim && callTxSim.Result && callTxSim.Result.Return;
            const buffer = Buffer.from(result);

            const constantMethod = myContract.getConstantMethod('getConfirmations');
            const {typeOutput} = constantMethod;

            return web3.eth.abi.decodeParameters(typeOutput, buffer.toString('hex'))[0];
      } catch (error) {
            throw new Error(error);
      }
}

/**
 * Decode list events.
 * 
 * @param {Object} events List events 
 */
function decodeEvent(events) {
      return myContract.getEvents(events);
}

module.exports = {
      getTransaction,
      getTransactionCount,
      getConfirmations,
      decodeEvent
}