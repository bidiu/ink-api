const Notebook = require('../models/notebooks');
const InkError = require('../common/models/ink-errors');


/**
 * @param notebookId
 *      id of the notebook to retrieve.
 * @param options
 *      userId      (optional)
 *      expand      (optional)
 *      expLimit    (optional)
 * @returns
 *      A promise to resolve the retrieved data.
 */
function retrieve(notebookId, { userId, params } = {}) {
    let where = { id: notebookId };
    if (userId) { where.userId = userId; }

    return Notebook.findOne({
                attributes: { exclude: Notebook.excludeOnRetrieve },
                where: where,
                include: Notebook.getExpandDef(
                    { expand: params._expand, expLimit: params._expLimit }
                )
            })
            .then((retrieved) => {
                if (retrieved) {
                    return retrieved;
                }
                throw new InkError.NotFound();
            });
}

/**
 * TODO should be in an transaction
 * 
 * @param params 
 *      Data (field values) from which notebook will be created. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the created data.
 */
function create(params) {
    let sanitized = Notebook.sanitizeOnCreate(params);

    return Notebook.create(sanitized)
            .then((created) => {
                return retrieve(created.id);
            });
}

/**
 * TODO should be in an transaction
 * TODO updating secret, password ...
 * 
 * @param notebookId
 *      id of the notebook to update.
 * @param params 
 *      Data (field values) from which notebook will be updated. This function won't
 *      alter this parameter.
 * @return 
 *      A promise to resolve the updated data.
 */
function update(notebookId, params) {

}

/**
 * TODO transaction
 * 
 * @param notebookId
 *      notebookId of the notebook to delete.
 */
function destroy(notebookId) {

}


exports.retrieve = retrieve;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
