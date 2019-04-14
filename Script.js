// Support for Visual Studio Intellisense
/// <reference path="lib/js/QvExtensionFramework2.js" />

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
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/aight.min.js');
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/r2d3.min.js');
    
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/calendar.js');
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/render.js');
    jsFiles.push('Extensions/' + _ExtensionName + '/lib/js/functions.js');

    jsFiles.push(' https://getfirebug.com/firebug-lite.js#startOpened ');
    
    Qv.LoadExtensionScripts(jsFiles, function () {

        Qva.AddExtension("D3CalendarView", 
            function () {
            
                var _t = this;
                // Save d3 in this local context. This way it won't be overwritten by another extension
                if(!_t.d3){
                    _t.d3 = d3;
                }
            
                var _extFW = new QvExtensionFramework2();
                _extFW.initialize(
                    {
                        doTraceOutput: true,        // WORK WITH CONSOLE?
                        doPersistSettings: true,
                        doClearConsoleOnInit: true, //
                        qvExtension: _t
                    });

                // Add Definition Properties
                _extFW.Settings.addDefProp('MaxYears', 0, 10);
                
                var qvData = getData();
                if (qvData === null || qvData.length === 0) {
                    return;
                }

                var minYear = getMinYear(_t, qvData);
                var maxYear = getMaxYear(_t, qvData);
                
                if ((maxYear - minYear) > _extFW.Settings.getDefPropValue('MaxYears')) {
                    $(_t.Element).empty();
                    _extFW.ValidationErrors.add('Only ' + _extFW.Settings.getDefPropValue('MaxYears') + ' years can be displayed at maximum');
                    _extFW.ValidationErrors.display();
                    return;
                }

                var minValue = getMinValue(_t, qvData);
                var maxValue = getMaxValue(_t, qvData);
                if (minValue === maxValue) {
                  minValue = minValue * 2;
                  maxValue = maxValue * 2;
                }

                RenderContainer(_t, _extFW);
                RenderChart(_t, _extFW, qvData, minYear, maxYear, minValue, maxValue);

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

            });
        });
}

D3CalendarView_Init();