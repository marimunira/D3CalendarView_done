function RenderContainer(_t, _extFW) {
  $(_t.Element).empty();

  // Container
  _extFW.Settings.add('ContainerId', 'Container_' + _extFW.Settings.getUniqueId());
  var $container = $(document.createElement('div'))
    .attr('id', _extFW.Settings.get('ContainerId'))
    .addClass('D3CV_Container');

  // Chart
  _extFW.Settings.add('ChartId', 'Chart_' + _extFW.Settings.getUniqueId());
  var $chart = $(document.createElement('div'))
    .attr('id', _extFW.Settings.get('ChartId'))
    .addClass('D3CV_Chart');

  $container.append($chart);
  $(_t.Element).append($container);

}


function RenderChart(_t, _extFW, qvData, minYear, maxYear, minValue, maxValue) {
  console.log(_t.d3.select('#' + _extFW.Settings.get('ChartId'))
    .data(_t.d3.range(minYear, (maxYear + 1))));
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


  var color = _t.d3.scale.quantize()
    .domain([minValue, maxValue])
    .range(_t.d3.range(9));

  var data = _t.d3.nest()
    .key(function (d) { return d.Date; })
    .rollup(function (d) { return { "Measure": d[0].Measure, "ToolTip": d[0].ToolTip }; })
    .map(qvData);

  vis.selectAll("rect.D3CV_day")
    .data(calendar.dates)
    .enter().append("svg:rect")
    .attr("x", function (d) { return d.week * z; })
    .attr("y", function (d) { return d.day * z; })
    .attr("class", function (d) {
      if (!_extFW.Utils.nullOrEmpty(data[d.Date]) && data[d.Date].Measure) {
        return "D3CV_day q" + (8-color(data[d.Date].Measure)) + "-9";
      }
      else {
        return "D3CV_day";
      }

    })
    .attr("width", z)
    .attr("height", z)
    /*.on('click', function (d) {
      _t.Data.SelectTextsInColumn(0, true, d.Date);

    })*/
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



  var divTooltip = _t.d3.select('#' + _extFW.Settings.get('ChartId')).append('div')
    .attr('class', 'D3CV_ToolTip')
    .style('opacity', 0);

  var divAction = _t.d3.select('#' + _extFW.Settings.get('ChartId')).append('div')
    .attr('class', 'D3CV_ToolTip')
    .style('opacity', 0);



  var leftOffset = $('#' + _extFW.Settings.get('ChartId')).offset().left;
  var topOffset = $('#' + _extFW.Settings.get('ChartId')).offset().top;






} // RenderChart