/**
 * append additional conditions with `and` operator
 * 
 * @param {*} where         original conditions
 * @param {*} conditions    conditions to append
 */
function appendConditions(where, ...conditions) {
    return {
        $and: [
            where,
            ...conditions
        ]
    };
}

exports.appendConditions = appendConditions;
