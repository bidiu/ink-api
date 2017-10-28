const Op = require('sequelize').Op;


/**
 * allowed operator aliases
 * 
 * IMPORTANT.
 * ONLY allow a very limited portion of operators given by client.
 * And these operator aliases ONLY will be considered in indexing situation.
 * So the inject risks and the potential damage could be minimized.
 */
const ALLOWED_OP_ALIASES = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $is: Op.is,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $and: Op.and,
    $or: Op.or
};


module.exports = ALLOWED_OP_ALIASES;
