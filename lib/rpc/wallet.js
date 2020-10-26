'use strict';

const resp = require('../../response');
const client = require('../../db_connection');

/**
 * Get balance of a address
 * @param {String} address address
 */
const getBalanceDB = async (address) => {
    try {
        let queryTx = `SELECT balance, address, public_key, sequence, evm_code, permission FROM account WHERE address = '${address}'`;

        let account_info = await client.query(queryTx);
        account_info = account_info.rows;

        account_info = account_info.length > 0 ? account_info[0] : {};

        return resp.success(account_info);
    } catch (e) {
        return resp.error(e);
    }
};

module.exports = {
    getBalanceDB
};

