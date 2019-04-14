//#region Helper Functions

function getMinYear(_t, data) {
    /// <summary>
    /// Returns the minimum year value.
    /// </summary>
    /// <param name="data"></param>
    /// <returns type="">minimum year</returns>
    var s = _t.d3.values(data)
        .sort(function (a, b) { return _t.d3.ascending(a.Date, b.Date); })
        [0];
    return parseInt(s.Date.substr(0, 4));
}

function getMaxYear(_t, data) {
    /// <summary>
    /// Returns the maximum year value.
    /// </summary>
    /// <param name="data"></param>
    /// <returns type=""></returns>
    var s = _t.d3.values(data)
        .sort(function (a, b) { return _t.d3.descending(a.Date, b.Date); })
        [0];
    return parseInt(s.Date.substr(0, 4));
}

function getMinValue(_t, data) {
    /// <summary>
    /// Return the absolute minimum value.
    /// </summary>
    /// <param name="data"></param>
    /// <returns type=""></returns>
    var s = _t.d3.values(data)
        .sort(function (a, b) { return _t.d3.ascending(a.Measure, b.Measure); })
        [0];
    return parseFloat(s.Measure);
}

function getMaxValue(_t, data) {
    /// <summary>
    /// Return the absolute maximum value.
    /// </summary>
    /// <param name="data"></param>
    /// <returns type=""></returns>
    var s = _t.d3.values(data)
        .sort(function (a, b) { return _t.d3.descending(a.Measure, b.Measure); })
        [0];
    return parseFloat(s.Measure);
}

//#endregion