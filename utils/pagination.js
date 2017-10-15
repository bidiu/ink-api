exports.calcLastPageNo = function(limit, totalCnt) {
    return Math.ceil(totalCnt / limit);
}
