/**
 * @api {get} /user/:id
 * @apiGroup User
 * @apiName GetUser
 * @apiDescription Get User
 * @apiVersion 1.0.0
 * @apiHeader {String} access-key Users unique access-key.
 * 
 * @apiHeaderExample {json} Header-Example:
 *  {
 *    "Accept-Encoding": "Accept-Encoding: gzip, deflate"
 *  }
 * 
 * @apiParam {Number} id Users unique ID.
 * 
 * @apiSuccess {Object}  profile       User profile information.
 * @apiSuccess {Number}  profile.age   Users age.
 * @apiSuccess {String}  profile.image Avatar-Image.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 * 
 */

 /**
 * @api {post} /user
 * @apiGroup User
 * @apiName UpdateUser
 * @apiDescription Update user
 * @apiVersion 1.0.0
 * @apiHeader {String} access-key Users unique access-key.
 * 
 * @apiHeaderExample {json} Header-Example:
 *  {
 *    "Accept-Encoding": "Accept-Encoding: gzip, deflate"
 *  }
 * 
 * @apiParam {Number} id Users unique ID.
 * @apiParamExample {json} Request-Example:
 * {
 *    "id": 4711
 * }
 * 
 * @apiSuccess {Object}  profile       User profile information.
 * @apiSuccess {Number}  profile.age   Users age.
 * @apiSuccess {String}  profile.image Avatar-Image.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 * 
 */