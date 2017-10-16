const commonUtils = require('./common');


function calcLastPageNo(limit, totalCnt) {
    return Math.ceil(totalCnt / limit);
}

/**
 * if current page is the last page, return null
 */
function calcNextPageNo(curPageNo, lastPageNo) {
    return curPageNo < lastPageNo ? curPageNo + 1 : null;
}

function calcPrevPageNo(curPageNo) {
    return Math.min(1, curPageNo - 1);
}

/**
 * in-place change, but will return data itself as well
 * 
 * @param data
 *      MUST have '_totalCnt' in it.
 * @param params
 *      _limit
 *      _pageNo
 *      others...
 */
function addPagInfo(data, params) {
    let lastPageNo = calcLastPageNo(params._limit, data._totalCnt);
    let prevPageNo = calcPrevPageNo(params._pageNo);
    let nextPageNo = calcNextPageNo(params._pageNo, lastPageNo);
    let currPageNo = params._pageNo;

    // add pagination info
    data._pageNo = currPageNo;
    data._lastPageNo = lastPageNo;
    data._limit = params._limit;
    data._endpoint = '?params=' + encodeURIComponent(JSON.stringify(params));

    // previous page
    if (prevPageNo) {
        let _params = commonUtils.copyParams(params, { _pageNo: prevPageNo });
        data._prev = '?params=' + encodeURIComponent(JSON.stringify(_params));
    } else {
        data._prev = null;
    }

    // next page
    if (nextPageNo) {
        let _params = commonUtils.copyParams(params, { _pageNo: nextPageNo });
        data._next = '?params=' + encodeURIComponent(JSON.stringify(_params));
    } else {
        data._next = null;
    }

    // first & last page
    let _params = commonUtils.copyParams(params, { _pageNo: 1 });
    data._first = '?params=' + encodeURIComponent(JSON.stringify(_params));
    _params = commonUtils.copyParams(params, { _pageNo: lastPageNo });
    data._last = '?params=' + encodeURIComponent(JSON.stringify(_params));

    return data;
}


exports.calcLastPageNo = calcLastPageNo;
exports.calcNextPageNo = calcNextPageNo;
exports.calcPrevPageNo = calcPrevPageNo;
exports.addPagInfo = addPagInfo;
