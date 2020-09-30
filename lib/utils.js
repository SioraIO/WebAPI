'use strict';

const bigInt = require("big-integer");
const MAX_BIGINT = 9223372036854775807;

function validateAddress(address) {
    return /^[0-9a-fA-F]{40}$/.test(address);
}

function validateBlock(height) {
    try {
        height = bigInt(height);
        return height.geq(bigInt.one) && height.leq(MAX_BIGINT);
    } catch (e) {
        return false;
    }
}

function validateTxHash(hash) {
    return /^[0-9a-fA-F]{64}$/.test(hash);
}

const isUint = (n) => {
    n = Number(n);
    return Number.isInteger(n) && n >= 0;
};

module.exports = {
    isTxHash: validateTxHash,
    isBlockHeight : validateBlock,
    isAddress: validateAddress,
    isUint: isUint
};

