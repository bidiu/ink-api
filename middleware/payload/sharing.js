const Sequlize = require('sequelize');
const User = require('../../models/users');
const authUtils = require('../../utils/auth');
const InkError = require('../../common/models/ink-errors');
const SharingLevel = require('../../common/constants').SharingLevel;
const GUEST_USERNAME = require('../../common/constants').GUEST_USERNAME;

const LIST_KEYS = [ '_indexed' ];

/**
 * whether to share
 * 
 * @param {*} sharingLevel 
 *      resource's sharing level
 * @param {*} auth 
 *      note that this function assumes that the owner of the 
 *      `auth` is not the owner of the resources
 */
async function toShare(sharingLevel, auth) {
    if (sharingLevel === SharingLevel.NOT_SHARING) {
        return false;
    } else if (sharingLevel === SharingLevel.USERS_ONLY) {
        return (await auth.user).username !== GUEST_USERNAME;
    } else {
        return true;
    }
}

/**
 * process sharable resouces
 * 
 * @param {*} instance 
 * @param {*} model 
 * @param {*} auth 
 * @return
 *      return the instance itself, if the current requesting
 *      user doesn't have the access to the instance, null will
 *      be returned
 */
async function processSharable(instance, model, auth) {
    if (model === User && instance.id === auth.sub || authUtils.compareOwner(instance, auth)) {
        return instance;
    } else if (instance.private) {
        return null;
    } else if (await toShare(instance.sharing, auth)) {
        return instance;
    } else {
        for (let field of model.sharingFields) {
            instance[field] = undefined;
        }
        return instance;
    }
}

/**
 * process non-sharable resources
 * 
 * @param {*} instance 
 * @param {*} model 
 * @param {*} auth 
 * @return
 *      return the instance itself, if the current requesting
 *      user doesn't have the access to the instance, null will
 *      be returned
 */
async function processNonSharable(instance, model, auth) {
    if (authUtils.compareOwner(instance, auth)) {
        return instance;
    } else {
        return null;
    }
}

async function processInstances(instances, auth) {
    return await Promise.all(
        instances.map(async (i) => await processInstance(i, auth))
    );
}

/**
 * @param {*} instance 
 * @param {*} auth 
 * @return
 *      return the instance itself (might processed)
 */
async function processInstance(instance, auth) {
    let model = instance.__proto__.constructor;

    if (model.skipSharing) {
        return instance;
    } else if (model.sharable) {
        instance = await processSharable(instance, model, auth);
    } else {
        instance = await processNonSharable(instance, model, auth);
    }

    if (instance) {
        return instance;
    } else {
        // requesting user doesn't have the access
        throw new InkError.NoAuthorization();
    }
}

/**
 * Note you MUST register this before the `plain` post
 * processor.
 * 
 * ### **IMPORTANT**
 * This post processor assumes the `payload.data` is the
 * model instance for retrieval-like actions. Also see 
 * `LIST_KEYS` above for indexing-like actions.
 * 
 * @param {*} payload 
 * @param {*} req 
 */
async function postProcess(payload, req) {
    if (! payload.data) { return payload; }

    let data = payload.data;
    let auth = req.auth;

    if (data instanceof Sequlize.Model) {
        // retrieval-like action
        payload.data = await processInstance(data, auth);
    } else {
        let listKey = LIST_KEYS.find((k) => data.hasOwnProperty(k));
        if (!listKey) { return payload; }
    
        // indexing-like action
        payload.data[listKey] = await processInstances(data[listKey], auth);   
    }

    return payload;
}

module.exports = postProcess;
