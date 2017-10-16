function calcLastPageNo(limit, totalCnt) {
    return Math.ceil(totalCnt / limit);
}

/**
 * if current page is the last page, return null
 */
function calcNextPageNo(curPageNo, lastPageNo) {
    return curPageNo < lastPageNo ? curPageNo + 1 : null;
}


exports.calcLastPageNo = calcLastPageNo;
exports.calcNextPageNo = calcNextPageNo;
