
<reference path="lib/js/QvExtensionFramework2.js" />

function D3CalendarView_Init() {

    var _ExtensionName = 'D3CalendarView';
    var _LoadUrl = Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=';


    var cssFiles = [];
    cssFiles.push('Extensions/' + _ExtensionName + '/lib/css/QvExtensionFramework.css');
    cssFiles.push('Extensions/' + _ExtensionName + '/lib/css/style.css');
    cssFiles.push('Extensions/' + _ExtensionName + '/lib/css/colorbrewer.css');
    for (var i = 0; i < cssFiles.length; i++) {
        Qva.LoadCSS(_LoadUrl + cssFiles[i]);
    }


    var jsFiles = [];
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/QvExtensionFramework2.js');
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/d3.v3.min.js');
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/calendar.js');
    Qv.LoadExtensionScripts(jsFiles, function () {

        Qva.AddExtension("D3CalendarView",
            function () {
            
                var _t = this;
                if(!_t.d3){
                    _t.d3 = d3;
                }
            
                var _extFW = new QvExtensionFramework2();
                _extFW.initialize(
                    {
                        doTraceOutput: false,
                        doPersistSettings: true,
                        doClearConsoleOnInit: false,
                        qvExtension: _t
                    });

                
                _extFW.Settings.addDefProp('MaxYears', 0, 10);

                var qvData = getData();
                

                if (qvData === null || qvData.length === 0) {
                    return;
                }

                var minYear = getMinYear(qvData);
                var maxYear = getMaxYear(qvData);

                if ((maxYear - minYear) > _extFW.Settings.getDefPropValue('MaxYears')) {

                    $(_t.Element).empty();
                    _extFW.ValidationErrors.add('Only ' + _extFW.Settings.getDefPropValue('MaxYears') + ' years can be displayed at maximum');
                    _extFW.ValidationErrors.display();
                    return;
                }
                RenderContainer();


                RenderChart(qvData, minYear, maxYear);

                function RenderContainer() {

                    $(_t.Element).empty();

                    
                    var $container = $(document.createElement('div'));
                    _extFW.Settings.add('ContainerId', 'Container_' + _extFW.Settings.getUniqueId());
                    $container.attr('id', _extFW.Settings.get('ContainerId'));
                    $container.addClass('D3CV_Container');

                    
                    var $chart = $(document.createElement('div'));
                    _extFW.Settings.add('ChartId', 'Chart_' + _extFW.Settings.getUniqueId());
                    $chart.attr('id', _extFW.Settings.get('ChartId'));
                    $chart.addClass('D3CV_Chart');
                    $container.append($chart);

                    $(_t.Element).append($container);

                }

                function getData() {

                    var data = [];

                    var counter = -1;
                    for (var i = 0; i < _t.Data.Rows.length; i++) {
                        counter++;
                        var dateKey = _t.Data.Rows[i][0].text;
                        var val = parseFloat(_t.Data.Rows[i][1].data);
                        var valToolTip = (_extFW.Utils.nullOrEmpty(_t.Data.Rows[i][2].text) ? 'Value: ' + val : _t.Data.Rows[i][2].text);
                        data[counter] = { Date: dateKey, Measure: val, ToolTip: valToolTip };
                    }
                    
                    return data;
                }


/*************************************** */
                function getMinYear(data) {

                    var s = _t.d3.values(data)
                        .sort(function (a, b) { return _t.d3.ascending(a.Date.substr(-4), b.Date).substr(-4); })
                        [0];
                    return parseInt(s.Date.substr(-4));
                }

                function getMaxYear(data) {
                    var s = _t.d3.values(data)
                        .sort(function (a, b) { return _t.d3.descending(a.Date.substr(-4), b.Date.substr(-4)); })
                        [0];
                    return parseInt(s.Date.substr(-4));
                }
/************************************** */
                function getMinValue(data) {
                    var s = _t.d3.values(data)
                        .sort(function (a, b) { return _t.d3.ascending(a.Measure, b.Measure); })
                        [0];
                    return parseFloat(s.Measure);
                }

                function getMaxValue(data) {
                    var s = _t.d3.values(data)
                        .sort(function (a, b) { return _t.d3.descending(a.Measure, b.Measure); })
                        [0];
                    return parseFloat(s.Measure);
                }
                

                function RenderChart(qvData, minYear, maxYear) {

                    var w = _extFW.config.qvExtension.GetWidth() - 25,
                        pw = 14,
                        z = ~~((w - pw * 2) / 53),
                        ph = z >> 1,
                        h = z * 7;

                    var vis = _t.d3.select('#' + _extFW.Settings.get('ChartId'))
                      .selectAll("svg")
                        .data(_t.d3.range(minYear, (maxYear + 1)))
                      .enter().append("svg:svg")
                        .attr("width", w)
                        .attr("height", h + ph * 2)
                        .attr("class", "RdYlGn")
                      .append("svg:g")
                        .attr("transform", "translate(" + pw + "," + ph + ")");

                    vis.append("svg:text")
                        .attr("transform", "translate(-6," + h / 2 + ")rotate(-90)")
                        .attr("text-anchor", "middle")
                        .text(function (d) { return d; });

                    vis.selectAll("rect.D3CV_day")
                        .data(calendar.dates)
                      .enter().append("svg:rect")
                        .attr("x", function (d) { return d.week * z; })
                        .attr("y", function (d) { return d.day * z; })
                        .attr("class", "D3CV_day")
                        .attr("width", z)
                        .attr("height", z);

                    vis.selectAll("path.D3CV_month")
                        .data(calendar.months)
                      .enter().append("svg:path")
                        .attr("class", "D3CV_month")
                        .attr("d", function (d) {
                            return "M" + (d.firstWeek + 1) * z + "," + d.firstDay * z
                                + "H" + d.firstWeek * z
                                + "V" + 7 * z
                                + "H" + d.lastWeek * z
                                + "V" + (d.lastDay + 1) * z
                                + "H" + (d.lastWeek + 1) * z
                                + "V" + 0
                                + "H" + (d.firstWeek + 1) * z
                                + "Z";
                        });


                    var data = _t.d3.nest()
                        .key(function (d) { return d.Date; })
                        .rollup(function (d) { return { "Measure": d[0].Measure, "ToolTip": d[0].ToolTip }; })
                        .map(qvData);

                    var minValue = getMinValue(qvData);
                    var maxValue = getMaxValue(qvData);
                   
                    if (minValue === maxValue) {
                        minValue = minValue * 2;
                        maxValue = maxValue * 2;
                    }

                    var divTooltip = _t.d3.select('#' + _extFW.Settings.get('ChartId')).append('div')
                        .attr('class', 'D3CV_ToolTip')
                        .style('opacity', 0);

                    var divAction = _t.d3.select('#' + _extFW.Settings.get('ChartId')).append('div')
                        .attr('class', 'D3CV_ToolTip')
                        .style('opacity', 0);

                    /*********************************** */
                    var color = _t.d3.scale.quantize()
                            .domain([minValue, maxValue])
                            .range(_t.d3.range(9))
                    ;
                    /*********************************** */
                    var leftOffset = $('#' + _extFW.Settings.get('ChartId')).offset().left;
                    var topOffset = $('#' + _extFW.Settings.get('ChartId')).offset().top;

                    

                    vis.selectAll("rect.D3CV_day")
                        .attr("class", function (d) {
                            /*************************** */
                            if (!_extFW.Utils.nullOrEmpty(data[d.Date])) {
                                if (Object.keys(data).length > 1) {
                                    return "D3CV_day q" + (9 - color(data[d.Date].Measure)) + "-9";
                                } else {
                                    return "D3CV_day D3CV_day_single";
                                }
                            }
                            else {
                                return "D3CV_day";
                            }
                         /******************************** */   
                        })
                        .on('click', function (d) {
                            _t.Data.SelectTextsInColumn(0, true, d.Date);
                        })
                        .on('mouseover', function (d) {

                            divTooltip.transition()
                                .duration(200)
                                .style('opacity', .99)
                                .style('display', 'block');
                            divTooltip.html('Date: ' + d.Date + '<br/>' + (!_extFW.Utils.nullOrEmpty(data[d.Date]) ? data[d.Date].ToolTip : ''))
                                .style('left', (_t.d3.event.pageX) - leftOffset + 'px')
                                .style('top', ((_t.d3.event.pageY) - divTooltip.attr('height') - topOffset + 5) + 'px');
                        })
                        .on('mouseout', function (d) {
                            divTooltip.transition()
                                .duration(200)
                                .style('opacity', 0)
                                .style('display', 'none');
                        });



                } 

            });

        });
}

D3CalendarView_Init();