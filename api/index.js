'use strict';

const express = require('express');
const router = express.Router();
const transaction = require('./transaction');
const block = require('./block');
const wallet = require('./wallet');
const notification = require('./notification');

router.use('/transaction',  transaction);
router.use('/block',  block);
router.use('/wallet',  wallet);
router.use('/wallet',  wallet);
router.use('/notification',  notification);

module.exports = router;