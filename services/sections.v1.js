const Section = require('../models/sections');
const InkError = require('../common/models/ink-errors');

function retrieve(sectionId) {
    let where = { id: sectionId };

    return Section.findOne({
                attributes: { exclude: Section.excludeOnRetrieve },
                where
            })
            .then((retrieved) => {
                if (!retrieved) { throw new InkError.NotFound(); }
                return retrieved;
            });
}

/**
 * Note that here no need to check the existance of the notebook, 
 * because auth-verifying middleware already checked the ownership.
 * Even though the ownership verifying is not in a transaction with
 * the creation of section, just let database's foreign key constraint
 * to handle that.
 * 
 * TODO because we are using `paranoid` option of Sequelize, to verify
 * 
 * @param {*} params 
 * @param {*} notebookId
 * @param {*} auth 
 */
function create(params, notebookId, auth) {
    let sanitized = Section.sanitizeOnCreate(params);
    sanitized.notebookId = notebookId;
    sanitized.owner = auth.sub;

    return Section.create(sanitized)
            .then((created) => {
                return retrieve(created.id);
            });
}

exports.retrieve = retrieve;
exports.create = create;
