const Notebook = require('../models/notebooks');
const InkError = require('../common/models/ink-errors');


/**
 * @param id
 *      id of the notebook to retrieve.
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(id) {

}

/**
 * TODO should be in an transaction
 * 
 * @param params 
 *      Data (field values) from which notebook will be created. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the created data with specified fields (or undefined).
 */
function create(params) {

}

/**
 * TODO should be in an transaction
 * TODO updating secret, password ...
 * 
 * @param id
 *      id of the notebook to update.
 * @param params 
 *      Data (field values) from which notebook will be updated. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the updated data with specified fields (or undefined).
 */
function update(id, params) {

}

/**
 * TODO transaction
 * 
 * @param id
 *      id of the notebook to delete.
 */
function destroy(id) {

}


exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
