'use strict';

const express = require('express');
const router = express.Router();
const config = require('../config');
const utils = require('../lib/utils');
const resp = require('../response');
const transaction = require('../lib/rpc/transaction');

/**
 * @api {get} /api/notification/get-notifications
 * @apiGroup Notification
 * @apiName Get notifications
 * @apiDescription Get notifications details
 * @apiVersion 1.0.0
 *
 *
 * @apiParam {String} address Address of wallet.
 * @apiParamExample {String} API Get:
 * http://172.16.1.107:3000/api/notification/get-notifications?page=1&&address=C7C85764CAFBBD97E4ABEFCC61B3EF2A5D54CD15
 * 
 * @apiSuccess {Boolean}  success Request status.
 * @apiSuccess {Object}  data data Notification of a wallet.
 * @apiSuccess {Number}  data.total Total element of the list wallet.
 * @apiSuccess {Number}  data.total_page Total page devide to 10 base on total element of the list.
 * @apiSuccess {Number}  data.current_page Page request.
 * @apiSuccess {Object}  data.txs The list of notifications.
 * @apiSuccess {Number}  data.txs.notification_id Id of a notification.
 * @apiSuccess {String}  data.txs.tx_hash Transaction hash of a notification.
 * @apiSuccess {String}  data.txs.timestamp Timestamp of a notification.
 * @apiSuccess {Number}  data.txs.amount Amount token transfering of a notification.
 * @apiSuccess {Object}  data.txs.status Status read or not yet of a notification.
 * @apiSuccess {Number}  data.txs.from_acc_id Account id of sender.
 * @apiSuccess {Number}  data.txs.to_acc_id Account id of receiver.
 * @apiSuccess {String}  data.txs.from_acc_addr Account address of sender.
 * @apiSuccess {String}  data.txs.to_acc_addr Account address of receiver.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *           {
 *           "success": true,
 *           "data": {
 *                 "total": 12,
 *                 "total_page": 2,
 *                "current_page": 1,
 *                 "txs": [
 *                       {
 *                       "notification_id": "17",
 *                       "tx_hash": "5947C0AFD12FACA70389C889D285E836C7E4A70AEF7337A52840CCB252C3750F",
 *                       "timestamp": "2019-11-14T03:34:44.800982043Z",
 *                       "amount": "1000000",
 *                       "status": [],
 *                       "from_acc_id": "5",
 *                       "to_acc_id": "6",
 *                       "from_acc_addr": "C7C85764CAFBBD97E4ABEFCC61B3EF2A5D54CD15",
 *                       "to_acc_addr": "FA867390ABEFF1B3586127E2845632BCF3F2512B"
 *                       },
 *                       {
 *                       "notification_id": "16",
 *                       "tx_hash": "7643E3995B95396AE1F3D942D7253DA78BA2EC48DB82817B3210CA2B23C743BD",
 *                       "timestamp": "2019-11-13T09:13:09.757886515Z",
 *                       "amount": "4000000",
 *                       "status": [
 *                             "7"
 *                       ],
 *                       "from_acc_id": "5",
 *                       "to_acc_id": "7",
 *                       "from_acc_addr": "C7C85764CAFBBD97E4ABEFCC61B3EF2A5D54CD15",
 *                       "to_acc_addr": "FAA10F81749073492B951FE37C4542698DF0F382"
 *                       }
 *                 ]
 *           }
 *     }
 * }
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *        "total": 0,
 *        "total_page": 0,
 *        "current_page": 1,
 *        "txs": []
 *        }
 *     }
 * 
 *
 * @apiError {Boolean}  success Request status.
 * @apiError {Number}  error Error description.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "error": "INVALID_ADDRESS"
 *     }
 * 
 */
router.get('/get-notifications', async(req, res) => {
      try {
            let { page, address } = req.query;
  
            if (address && utils.isAddress(address)) {
                  page = Number(page);
      
                  if (Number.isNaN(page) || !Number.isInteger(page) || page <= 0) {
                        page = 1;
                  }
            
                  const limit = Number(config.PAGE_LIMIT);
            
                  const data = await transaction.getAllNotification(page, limit, address.toUpperCase());
                  if (data.length === 0) {
                        return res.json(resp.error(data));
                  }
            
                  return res.json(resp.success({
                        total: data.total, 
                        total_page: data.total_page, 
                        current_page: page, 
                        txs: data.tx_info
                  }));
            }
            return res.json(resp.error('INVALID_ADDRESS'));
  
      } catch (e) {
            return res.json(resp.error(e));
      }
});
  
/**
 * @api {get} /api/notification/amount-unreadable-notify
 * @apiGroup Notification
 * @apiName Get amount
 * @apiDescription Get amount of unread notification
 * @apiVersion 1.0.0
 *
 *
 * @apiParam {String} address Address of wallet.
 * @apiParamExample {String} API Get:
 * http://172.16.1.107:3000/api/notification/amount-unreadable-notify?address=FAA10F81749073492B951FE37C4542698DF0F382
 * 
 * @apiSuccess {Boolean}  success Request status.
 * @apiSuccess {Object}  data data Notification of a wallet.
 * @apiSuccess {Number}  data.unreadable_notification Amount of unread notification.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": {
 *              "unreadable_notification": 0
 *        }
 *     }
 *
 * @apiError {Boolean}  success Request status.
 * @apiError {Number}  error Error description.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "error": "INVALID_ADDRESS"
 *     }
 * 
 */
router.get('/amount-unreadable-notify', async(req, res) => {
      try {
            const address = req.query.address;
      
            if (address && utils.isAddress(address)) {
                  const data = await transaction.unreadableNotification(address.toUpperCase());
      
                  return res.json(resp.success(data));
            }
      
            return res.json(resp.error('INVALID_ADDRESS')); 
      } catch (e) {
            return res.json(resp.error(e));
      }
});
  
/**
 * @api {post} /api/notification
 * @apiGroup Notification
 * @apiName Update status
 * @apiDescription Update status of reading of a notification
 * @apiVersion 1.0.0
 *
 * @apiParam {String} address Address of wallet.
 * @apiParamExample {String} API Get:
 *     {
 *           "idNotification": "4",
 *           "address": "FAA10F81749073492B951FE37C4542698DF0F382"
 *     } 
 * 
 * @apiSuccessExample {json} Success-Response-Update:
 *     HTTP/1.1 200 OK
 *     {
 *     "success": true,
 *     "data": {
 *           "command": "UPDATE",
 *           "rowCount": 1,
 *           "oid": null,
 *           "rows": [],
 *           "fields": [],
 *           "_parsers": [],
 *           "_types": {
 *                 "_types": {
 *                 "arrayParser": {},
 *                 "builtins": {
 *                       "BOOL": 16,
 *                       "BYTEA": 17,
 *                       "CHAR": 18,
 *                       "INT8": 20,
 *                       "INT2": 21,
 *                       "INT4": 23,
 *                       "REGPROC": 24,
 *                       "TEXT": 25,
 *                       "OID": 26,
 *                       "TID": 27,
 *                       "XID": 28,
 *                       "CID": 29,
 *                       "JSON": 114,
 *                       "XML": 142,
 *                       "PG_NODE_TREE": 194,
 *                       "SMGR": 210,
 *                       "PATH": 602,
 *                       "POLYGON": 604,
 *                       "CIDR": 650,
 *                       "FLOAT4": 700,
 *                       "FLOAT8": 701,
 *                       "ABSTIME": 702,
 *                       "RELTIME": 703,
 *                       "TINTERVAL": 704,
 *                       "CIRCLE": 718,
 *                       "MACADDR8": 774,
 *                       "MONEY": 790,
 *                       "MACADDR": 829,
 *                       "INET": 869,
 *                       "ACLITEM": 1033,
 *                       "BPCHAR": 1042,
 *                       "VARCHAR": 1043,
 *                       "DATE": 1082,
 *                       "TIME": 1083,
 *                       "TIMESTAMP": 1114,
 *                       "TIMESTAMPTZ": 1184,
 *                       "INTERVAL": 1186,
 *                       "TIMETZ": 1266,
 *                       "BIT": 1560,
 *                       "VARBIT": 1562,
 *                       "NUMERIC": 1700,
 *                       "REFCURSOR": 1790,
 *                       "REGPROCEDURE": 2202,
 *                       "REGOPER": 2203,
 *                       "REGOPERATOR": 2204,
 *                       "REGCLASS": 2205,
 *                       "REGTYPE": 2206,
 *                       "UUID": 2950,
 *                       "TXID_SNAPSHOT": 2970,
 *                       "PG_LSN": 3220,
 *                       "PG_NDISTINCT": 3361,
 *                       "PG_DEPENDENCIES": 3402,
 *                       "TSVECTOR": 3614,
 *                       "TSQUERY": 3615,
 *                       "GTSVECTOR": 3642,
 *                       "REGCONFIG": 3734,
 *                       "REGDICTIONARY": 3769,
 *                       "JSONB": 3802,
 *                       "REGNAMESPACE": 4089,
 *                       "REGROLE": 4096
 *                 }
 *                 },
 *                 "text": {},
 *                 "binary": {}
 *           },
 *           "RowCtor": null,
 *           "rowAsArray": false
 *     }
 *     }
 * 
 * @apiSuccessExample {json} Success-Response-Not-Update:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "data": null
 *     }
 *
 * @apiError {Boolean}  success Request status.
 * @apiError {Number}  error Error description.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "error": "INVALID_INPUT"
 *     }
 * 
 */
router.post('/', async(req, res) => {
      try {
            let {idNotification, address} = req.body;
      
            idNotification = Number(idNotification);
      
            if (address && utils.isAddress(address)) {
                  if (!Number.isNaN(idNotification) && Number.isInteger(idNotification) && idNotification > 0) {
                        const data = await transaction.readableUpdating(Number(idNotification), address.toUpperCase());
                        if (data === 'INVALID_INPUT') {
                              return res.json(resp.error('INVALID_INPUT'));
                        }
                        return res.json(resp.success(data));
                  }
            }
      
            return res.json(resp.error('INVALID_INPUT'));
      } catch (e) {
            return res.json(resp.error(e));
      }
});

module.exports = router;