flyingon.Control.extend('DigitalTime', function () {


}).register();



flyingon.renderer('DigitalTime', function (base) {


    this.render = function (writer, control, render) {

        writer.push('<div');
        
        render.call(this, writer, control);

        writer.push('></div>');
    };


    this.mount = function (control, dom) {

        base.mount.call(this, control, dom);

        dom.style.fontFamily = 'digital';
        show(dom, this.__text_name);
    }


    function show(dom, name) {

        dom[name] = new Date().format('yyyy-MM-dd hh:mm:ss');

        setTimeout(function () {

            show(dom, name);

        }, 1000);
    }


});


flyingon.Control.extend('HomeChart', function () {



    this.__custom_set = function (name, value) {

        this[name] = value;
    }


    function fieldValues(data, field) {

        var array = [];

        for (var i = data.length; i--;)
        {
            array[i] = data[i][field];
        }

        return array;
    }


    this.setData = function (dataset) {

        var template = this.template,
            data = dataset[this.table],
            any;

        if (!data)
        {
            flyingon.showMessage('图表配置错误', 'table "' + this.table + '"不存在!', 'information', 'ok');
            return;
        }

        if ((any = template.xAxis) && any.type === 'category')
        {
            any.data = fieldValues(data, template.category);
        }
        else if ((any = template.yAxis) && any.type === 'category')
        {
            any.data = fieldValues(data, template.category);
        }

        if (any = template.series)
        {
            var valueFields = template.valueFields;

            if (!(any instanceof Array))
            {
                any = template.series = [];

                for (var i = valueFields.length; i--;)
                {
                    any[i] = Object.assign({}, any);
                    any[i].name = valueFields[i];
                }
            }

            for (var i = any.length; i--;)
            {
                any[i].data = fieldValues(data, any[i].name);
            }
        }

        setTimeout(function () {

            (this.chart || (this.chart = echarts.init(this.view))).setOption(template);

        }.bind(this));
    }


    this.refreshChart = function () {

        if (this.chart)
        {
            this.chart.resize();
        }
    }



}).register();



flyingon.Control.extend('HomeIcon', function () {


    this.defaultWidth = this.defaultHeight = 40;


    this.defineProperty('icon', '', {

        set: this.render
    });


}).register();



flyingon.renderer('HomeIcon', function (base) {


    
    this.lineHeight = 1;


    this.render = function (writer, control, render) {

        writer.push('<span');
        
        render.call(this, writer, control);
        
        writer.push('></span>');
    };


    this.icon = function (control, view, value) {

        view.classList.add(value);
    };

});



flyingon.Control.extend('HomeText', function () {



    this.defineProperty('text', '', {

        set: this.render
    });


    
    this.defineProperty('table', '');


    this.defineProperty('field', '');


    this.setData = function (dataset) {

        var table = this.table(),
            field = this.field();

        if (table && field && (table = dataset[table]))
        {
            this.text(table[0][field]);
        }
    }



}).register();



flyingon.renderer('HomeText', function (base) {



    this.lineHeight = 1;


    this.render = function (writer, control, render) {

        writer.push('<span');
        
        render.call(this, writer, control);
        
        writer.push('></span>');
    };


    this.text = function (control, view, value) {

        view[this.__text_name] = value;
    };


});



flyingon.Panel.extend('HomeBox', function () {


    this.defaultWidth = 150;

    this.defaultHeight = 60;


}).register();



flyingon.renderer('HomeBox', 'Panel', function (base) {


    this.render = function (writer, control, render) {

        writer.push('<div');
        
        render.call(this, writer, control);

        writer.push('>',
            '<span class="f-homebox-corner1"></span>',
            '<span class="f-homebox-corner2"></span>',
            '<span class="f-homebox-corner3"></span>',
            '<span class="f-homebox-corner4"></span>',
            '<div class="f-homebox-body">');

        if (control.length > 0 && control.__visible)
        {
            control.__content_render = true;
            this.__render_children(writer, control, control, 0, control.length);
        }

        writer.push(this.__scroll_html, '</div></div>');
    };


    this.mount = function (control, view) {

        control.view_content = view.lastChild;
        base.mount.call(this, control, view);
    };


});



flyingon.Panel.extend('ChartPanel', function () {


    this.defaultWidth = 350;

    this.defaultHeight = 200;


    this.defineProperty('title', '', {

        set: this.render   
    });


    this.arrangeArea = function () {

        this.arrangeHeight -= 26;
        this.arrangeBottom -= 26;
    };


}).register();



flyingon.renderer('ChartPanel', 'Panel', function (base) {


    this.render = function (writer, control, render) {

        writer.push('<div');
        
        render.call(this, writer, control);

        writer.push('>',
            '<div class="f-chartpanel-head">',
                '<span class="f-chartpanel-title"></span>',
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg">',
                    '<path d="M0 1 S8 0 12 8 L20 24 S23 25 26 25" />',
                '</svg>',
                '<span class="f-chartpanel-img"></span>',
            '</div>',
            '<div class="f-chartpanel-corner" index="1"></div>',
            '<div class="f-chartpanel-corner" index="2"></div>',
            '<div class="f-chartpanel-corner" index="3"></div>',
            '<div class="f-chartpanel-corner" index="4"></div>',
            '<div class="f-chartpanel-body">');

        if (control.length > 0 && control.__visible)
        {
            control.__content_render = true;
            this.__render_children(writer, control, control, 0, control.length);
        }

        writer.push(this.__scroll_html, '</div>',
            '</div>');
    };

    
    this.mount = function (control, view) {

        control.view_content = view.lastChild;
        base.mount.call(this, control, view);
    };



    this.title = function (control, dom, value) {

        dom.firstChild.firstChild[this.__text_name] = value;
    }


});



flyingon.HomePlugin = flyingon.widget({

    template: {
        Class: 'Plugin',
        layout: 'dock',
        className: 'home',
        backgroundColor: '#07051a',
        children: [
            {
                Class: 'Panel',
                height: 118,
                dock: 'top',
                children: [
                    {
                        Class: 'Label',
                        text: '顺彩BI图表分析平台',
                        width: '100%',
                        height: 60,
                        margin: '12 0',
                        textAlign: 'center',
                        fontSize: '24px'
                    },
                    {
                        Class: 'DigitalTime',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '20px'
                    }
                ]
            },
            {
                Class: 'Panel',
                dock: 'fill',
                layout: 'dock',
                margin: '-12 0 0 0',
                padding: 10
            }
        ]
    },

    created: function () {


        var host = this[1];

        var size;

        var timeout;



        host.on('click', function (event) {

            var target = event.target,
                url;

            while (target && target !== this)
            {
                if (url = target.url)
                {
                    if (checkUrl(globals.menutree, url))
                    {
                        location.hash = '!' + url;
                    }
                    else
                    {
                        flyingon.showMessage('提醒', '您没有查看此图表的权限!', 'information', 'ok');
                    }
                    
                    return;
                }

                target = target.parent;
            }
        });



        function checkResize() {
        
            var value = host.offsetWidth << 8 + host.offsetHeight;

            if (value !== size)
            {
                if (size > 0)
                {
                    var controls = [];
                    
                    findControls(host, 'refreshChart', controls);

                    for (var i = controls.length; i--;)
                    {
                        controls[i].refreshChart();
                    }
                }

                size = value;
            }

            timeout = setTimeout(checkResize, 100);
        }


        function refresh() {
            
            if (timeout)
            {
                clearTimeout(timeout);
                timeout = 0;
            }

            flyingon.toast({

                text: '正在加载数据，请稍候......',
                time: 30000,
                loading: true
            });

            flyingon.http.get('chart-home/main').json(update);
        }


        function update(data) {

            var controls = [];

            flyingon.toast.hide();

            host.push.apply(host, data[0]);

            findControls(host, 'setData', controls);

            data = data[1];

            for (var i = controls.length; i--;)
            {
                controls[i].setData(data);
            }

            timeout = setTimeout(checkResize, 100);
        }


        function findControls(parent, name, outputs) {

            for (var i = parent.length; i--;)
            {
                if (parent[i][name])
                {
                    outputs.push(parent[i]);
                }
                else if (parent[i].length > 0)
                {
                    findControls(parent[i], name, outputs);
                }
            }
        }



        function checkUrl(list, url) {

            for (var i = list.length; i--;)
            {
                var item = list[i];

                if (item.url === url)
                {
                    return true;
                }

                if (item.children && checkUrl(item.children, url))
                {
                    return true;
                }
            }
        }


        refresh();

    }

});




flyingon.Control.extend(function (Class, base) {



    // 编译计算字段
    this.compileComputed = function (computed, data) {

        if (computed)
        {
            this.computed = computed = eval(computed);

            for (var i = data.length; i--;)
            {
                for (var name in computed)
                {
                    data[i][name] = computed[name](data[i]);
                }
            }
        }
        else
        {
            this.valueFields = valueFields;
            this.computed = null;
        }
    }


    // 解析计算字段(移除计算字段)
    this.praseComputed = function (target, valueFields) {

        var computed = this.computed,
            computedFields;

        if (valueFields)
        {
            valueFields = valueFields.slice(0);

            if (computed)
            {
                for (var i = valueFields.length; i--;)
                {
                    var name = valueFields[i];

                    if (computed[name])
                    {
                        valueFields.splice(i, 1);
                        (computedFields || (computedFields = Object.create(null)))[name] = computed[name];
                    }
                }
            }
        }
        else
        {
            valueFields = [];
        }

        target.valueFields = valueFields;
        target.computedFields = computedFields;
    }


    // 计算分组值
    this.computeValues = function (target, data, valueFields, computedFields) {
        
        var decimal = Decimal.singleton(0),
            field;

        for (var i = valueFields.length; i--;)
        {
            field = valueFields[i];
            decimal.v = decimal.d = 0;

            for (var j = data.length; j--;)
            {
                decimal.plus(data[j][field]);
            }
            
            target[field] = decimal.value;
        }
        
        if (computedFields)
        {
            for (field in computedFields)
            {
                target[field] = computedFields[field](target);
            }
        }
    }


    // 数据分组
    this.computeGroup = function (data, categoryFields, valueFields, computedFields) {

        var keys = Object.create(null),
            groups = [],
            group,
            length,
            item,
            key,
            any;

        categoryFields = categoryFields.split(',');

        if ((length = categoryFields.length) > 1)
        {
            any = new Array(length);
            
            for (var i = 0, l = data.length; i < l; i++)
            {
                item = data[i];

                for (var j = length; j--;)
                {
                    any[j] = item[categoryFields[j]];
                }

                if (group = keys[key = any.join('-')])
                {
                    group.__data.push(item);
                }
                else
                {
                    groups.push(group = keys[key] = {
                        __by: key,
                        __data: [item]
                    });

                    for (var j = length; j--;)
                    {
                        group[categoryFields[j]] = any[j];
                    }
                }
            }
        }
        else
        {
            categoryFields = categoryFields[0];

            for (var i = 0, l = data.length; i < l; i++)
            {
                item = data[i];

                if (group = keys[key = item[categoryFields]])
                {
                    group.__data.push(item);
                }
                else
                {
                    groups.push(group = keys[key] = {
                        __by: key,
                        __data: [item]
                    });

                    group[categoryFields] = key;
                }
            }
        }

        for (var i = groups.length; i--;)
        {
            this.computeValues(groups[i], groups[i].__data, valueFields, computedFields);
        }

        return groups;
    }


    this.sortCategory = function (data, categoryFields, desc) {


    }


    this.sortData = function (data, name, desc) {
    
        if (name)
        {
            if (desc)
            {
                data.sort(function (a, b) {

                    a = a[name];
                    b = b[name];
            
                    if (a > b)
                    {
                        return 1;
                    }
            
                    return a < b ? -1 : 0;
                });
            }
            else
            {
                data.sort(function (a, b) {

                    a = a[name];
                    b = b[name];
            
                    if (a > b)
                    {
                        return -1;
                    }
            
                    return a < b ? 1 : 0;
                });
            }
        }
        else if (desc)
        {
            data.sort(function (a, b) {

                return -('' + a.__by).localeCompare(b.__by, 'zh');
            });
        }
        else
        {
            data.sort(function (a, b) {

                return ('' + a.__by).localeCompare(b.__by, 'zh');
            });
        }
    }



    function fieldValues(data, field) {

        var array = [];

        for (var i = data.length; i--;)
        {
            array[i] = data[i][field];
        }

        return array;
    }


    this.show = function (option, data, valueFields, sort, desc) {

        var any;

        this.sortData(data, sort, desc);

        if ((any = option.xAxis) && any.type === 'category')
        {
            any.data = fieldValues(data, '__by');
        }
        else if ((any = option.yAxis) && any.type === 'category')
        {
            any.data = fieldValues(data, '__by');
        }

        if (any = option.series)
        {
            var array = any;

            if (!(array instanceof Array))
            {
                array = option.series = [];

                for (var i = valueFields.length; i--;)
                {
                    array[i] = Object.assign({}, any);
                    array[i].name = valueFields[i];
                }
            }

            for (var i = array.length; i--;)
            {
                array[i].data = fieldValues(data, array[i].name);
            }
        }

        if (!(any = this.chart))
        {
            var self = this;

            any = this.chart = echarts.init(this.view);

            any.on('click', function (event) {

                self.trigger('chart-click', 'chart', event);
            });
        }

        any.setOption(option);
        
        this.__show = [option, data, valueFields, sort, desc];
    }


    this.switchSort = function (field, desc) {

        var show = this.__show;

        if (show)
        {
            show[3] = field;
            show[4] = desc;

            this.show.apply(this, show);
        }
    }



    this.toDataURL = function () {

        var model = this.chart.getModel();

        return this.chart.getConnectedDataURL({
            type: 'png',
            backgroundColor: model.get('backgroundColor', true) || '#fff',
            excludeComponents: model.get('excludeComponents'),
            pixelRatio: model.get('pixelRatio')
        });
    }


    this.saveAsImage = function (name) {

        flyingon.downloadDataURL(name + '.png', this.toDataURL());
    }



}).register('ChartView');



flyingon.ChartPlugin = flyingon.widget({

    template: {
        Class: 'Plugin',
        layout: 'dock',
        children: [
            {
                Class: 'ToolBar',
                id: 'chart-tool',
                dock: 'top',
                height: 40,
                border: '0 0 1 0',
                padding: 4,
                children: [
                    { 
                        Class: 'Button',
                        width: 60,
                        key: 'refresh',
                        text: '刷新',
                        icon: 'icon-refresh',
                        border: 0,
                        backgroundColor: 'transparent'
                    },
                    {
                        Class: 'Button',
                        width: 80,
                        key: 'data',
                        text: '数据视图',
                        icon: 'icon-datafix',
                        border: 0,
                        backgroundColor: 'transparent'
                    },
                    {
                        Class: 'Button',
                        width: 60,
                        key: 'export',
                        text: '导出',
                        icon: 'icon-out',
                        border: 0,
                        backgroundColor: 'transparent'
                    },
                    {
                        id: 'dimension',
                        Class: 'Label',
                        html: true,
                        margin: '0 10',
                        width: 'auto'
                    },
                    {
                        id: 'category',
                        Class: 'ComboBox',
                        checked: 'checkbox',
                        width: 200,
                        height: 21,
                        // border: '0 0 1 0',
                        dock: 'right',
                        margin: '4 0 0 0'
                    },
                    {
                        Class: 'Label',
                        dock: 'right',
                        text: '切换分组:',
                        padding: '0 4 0 0',
                        textAlign: 'right'
                    },
                    {
                        Class: 'Button',
                        width: 20,
                        key: 'sort',
                        icon: 'icon-asc',
                        margin: '0 -20 0 -4',
                        border: 0,
                        backgroundColor: 'transparent',
                        dock: 'right'
                    },
                    {
                        id: 'sort',
                        Class: 'ComboBox',
                        width: 100,
                        height: 21,
                        // border: '0 0 1 0',
                        dock: 'right',
                        margin: '4 0 0 0'
                    },
                    {
                        Class: 'Label',
                        key: 'sort',
                        dock: 'right',
                        text: '排序:',
                        padding: '0 4 0 0',
                        textAlign: 'right'
                    },
                    {
                        id: 'path',
                        Class: 'Label',
                        html: true,
                        dock: 'fill'
                    }
                ]
            },
            {
                id: 'filter',
                Class: 'Control',
                dock: 'right',
                width: 260,
                cursor: 'default'
            },
            {
                Class: 'Panel',
                id: 'chart-host',
                dock: 'fill',
                layout: 'dock',
                margin: '8 0 0 0',
                children: [
                    {
                        Class: 'ChartView',
                        dock: 'fill'
                    }
                ]
            }
        ]
    },

    created: function () {

        
        var host = this.findById('chart-host')[0];
        var chart = host[0];
        var toolbar = this.findByType('ToolBar');
        var dimensionHost = this.findById('dimension')[0];
        var categoryBox = this.findById('category')[0];
        var sortBox = this.findById('sort')[0];
        var pathHost = this.findById('path')[0];
        var filterBox = this.findById('filter')[0];

        var dimensionList = [];
        var drilldownStack = window.drilldownStack = [];

        // 非钻取方式图片参数
        var nodrilldown = null;

        var filterKeys = null;
        var filterDelay = 0;

        // 当前图表数据
        var chartData = null;

        // 默认排序
        var defaultSort = '分组';
        var sortField = '';
        var sortDesc = false;



        chart.on('chart-click', function (event) {

            var key;

            if (categoryBox.value())
            {
                flyingon.showMessage('提醒', '选择了分组时不能往下钻取!', 'information', 'ok');
                return;
            }

            if ((key = event.chart) && (key = key.name))
            {
                drilldownClick(key);
            }
        });


        toolbar.on('click', function (event) {

            switch (event.target.get('key'))
            {
                case 'refresh':
                    refresh();
                    break;

                case 'data':
                    showDataView();
                    break;

                case 'export':
                    exportTo(chart);
                    break;

                case 'sort':
                    event.target.icon((sortDesc = !sortDesc) ? 'icon-desc' : 'icon-asc');
                    chart.switchSort(sortField, sortDesc);
                    break;
            }
        });


        categoryBox.on('change', refreshChart);


        sortBox.on('change', function () {

            if ((sortField = sortBox.value()) === defaultSort)
            {
                sortField = '';
            }

            chart.switchSort(sortField, sortDesc);
        });



        function drilldownClick(key) {

            var last = drilldownStack[drilldownStack.length - 1],
                groups = last.keys[key];

            if (groups && groups.__list[0])
            {
                pushDrilldown(last.dimension, last.index + 1, key, groups);
                refreshChart(true);
            }
            else
            {
                flyingon.showMessage('提醒', '钻到底了,不能继续往下钻取!', 'information', 'ok');
            }
        }


        this.loadPlugin = function (route, data) {

            chart.chartId = data.id;
            chart.chartName = data.text;

            refresh();
        }

        

        function refresh() {

            flyingon.toast({

                text: '正在加载数据，请稍候......',
                time: 30000,
                loading: true
            });

            return flyingon.http.get('chart-meta/' + chart.chartId).then(loadData);
        }


        function loadData(data) {

            try
            {
                data = data && JSON.parse(data);
            }
            catch (e)
            {
                flyingon.toast.hide();
                flyingon.showMessage('错误', '图表配置错误, 无法正确解析配置的数据!\n\n错误信息:\n' + e.message, 'error', 'ok');
                return;
            }

            if (!data)
            {
                flyingon.toast.hide();
                flyingon.showMessage('错误', '未配置图表, 请检查!', 'error', 'ok');
                return;
            }

            try
            {
                var options = data[0],
                    view = dimensionHost.view;
                
                // 默认选中第一个维度
                if (view = view && view.querySelector('input[type="radio"]'))
                {
                    view.checked = true;
                }

                dimensionList.length = drilldownStack.length = 0;

                pathHost.text('');

                categoryBox.clear();

                // 数组模板为钻取图表
                if (options instanceof Array)
                {
                    // 获取列配置
                    columns = options[0];
                    options.shift();

                    // 编译用到的统计字段
                    chart.compileComputed(data[1], data[2]);
                    options.shift();

                    parseColumns(columns);

                    initDimension(dimensionList = options, data[2]);
                }
                else
                {
                    chart.compileComputed(data[1], data[2]);

                    categoryBox.items(options.category || []);

                    sortBox.items([defaultSort].concat(options.value));
                    sortBox.value(defaultSort);

                    options.data = data[2];
                    nodrilldown = options;

                    parseColumns(options.fields);

                    if (host[1])
                    {
                        host[0].remove();
                    }
        
                    if (dimension.grid)
                    {
                        host.splice(0, 0, dimension.grid);
                        flyingon.__update_patch();
                    }

                    refreshChart();
                }
            }
            finally
            {
                flyingon.toast.hide();
            }
        }


        function initDimension(dimensions, data) {

            var array = [],
                name = 'c' + chart.chartId;

            dimensions.index = 0;

            for (var i = 0, l = dimensions.length; i < l; i++)
            {
                var dimension = dimensions[i],
                    field = dimension.field;

                array.push('<label style="margin:0 6px;">',
                    '<input type="radio" index="', i,
                        '" name="', name, 
                        '" style="margin:0;vertical-align:middle;"', 
                        i === 0 ? ' checked="checked"' : '', ' />',
                    '<span>', dimensions[i].text, '</span>',
                    '</label>');

                if (field instanceof Array)
                {
                    if (!field[0] || !field[1])
                    {
                        flyingon.showMessage('错误', '图表配置错误, 多字段钻取最少要设置两个字段!', 'error', 'ok');
                        return;
                    }

                    dimension.fields = field;
                    dimension.field = field[0];
                }

                dimension.data = data;

                sortBox.items([defaultSort].concat(dimension.value));
                sortBox.value(defaultSort);
            }

            dimensionHost.text(array.join(''));
            dimensionHost.parent.update();

            dimensionHost.view.onchange = changeDimension;
            pathHost.view.onclick = backDrilldown;

            startDrilldown(dimensions[0], data);
        }


        function startDrilldown(dimension, data) {

            var groups = dimension.groups;
            
            if (!groups)
            {
                groups = dimension.groups = dimension.fields ? drilldownFields(dimension, data) : drilldownField(dimension, data);

                chart.praseComputed(dimension, dimension.value);
                computeDrilldown(groups, dimension.valueFields, dimension.computedFields, chart.computeValues);
            }

            if (host[1])
            {
                host[0].remove();
            }

            if (dimension.grid)
            {
                host.splice(0, 0, dimension.grid);
                flyingon.__update_patch();
            }

            pathHost.text('');
            categoryBox.items(dimension.category || []);

            // 添加分组起点
            pushDrilldown(dimension, 0, '起点', groups);

            // 只有一个项继续往下钻
            if (dimension.skipstart)
            {
                var index = 1;

                while ((groups = groups.__list).length === 1)
                {
                    groups = groups[0];
                    pushDrilldown(dimension, index++, groups[dimension.field], groups);
                }
            }

            refreshChart();
        }


        // 单字段钻取
        function drilldownField(dimension, data) {

            var groups = [],
                keys = Object.create(null),
                field = dimension.field,
                split = dimension.split || '/',
                group,
                item,
                list,
                key,
                any;

            for (var i = 0, l = data.length; i < l; i++)
            {
                if (key = (item = data[i])[field])
                {
                    list = key.split(split);

                    if (any = keys[key = list[0]])
                    {
                        group = any;
                        group.__data.push(item);
                    }
                    else
                    {
                        groups.push(group = keys[key] = {
                            __by: key,
                            __keys: Object.create(null),
                            __data: [item],
                            __list: []
                        });
                        
                        group[field] = key;
                    }

                    for (var j = 1, l2 = list.length; j < l2; j++)
                    {
                        if (any = group.__keys[key = list[j]])
                        {
                            group = any;
                            group.__data.push(item);
                        }
                        else
                        {
                            group.__list.push(group = group.__keys[key] = {
                                __by: key,
                                __keys: Object.create(null),
                                __data: [item],
                                __list: []
                            });

                            group[field] = key;
                        }
                    }
                }
            }

            return dimension.groups = {
                __keys: keys,
                __data: data,
                __list: groups
            };
        }


        // 多字段钻取
        function drilldownFields(dimension, data) {

            var groups = [],
                keys = Object.create(null),
                fields = dimension.fields,
                field = fields[0],
                length = fields.length,
                group,
                item,
                key,
                any;

            for (var i = 0, l = data.length; i < l; i++)
            {
                item = data[i];

                if (any = keys[key = item[field]])
                {
                    group = any;
                    group.__data.push(item);
                }
                else
                {
                    groups.push(group = keys[key] = {
                        __by: key,
                        __keys: Object.create(null),
                        __data: [item],
                        __list: []
                    });
                    
                    group[field] = key;
                }

                for (var j = 1; j < length; j++)
                {
                    if (any = group.__keys[key = item[fields[j]]])
                    {
                        group = any;
                        group.__data.push(item);
                    }
                    else
                    {
                        group.__list.push(group = group.__keys[key] = {
                            __by: key,
                            __keys: Object.create(null),
                            __data: [item],
                            __list: []
                        });

                        group[field] = key;
                    }
                }
            }

            return dimension.groups = {
                __keys: keys,
                __data: data,
                __list: groups
            };
        }


        // 计算钻取字段值
        function computeDrilldown(groups, valueFields, computedFields, fn) {
        
            var list = groups.__list;

            for (var i = list.length; i--;)
            {
                computeDrilldown(list[i], valueFields, computedFields, fn);
            }

            fn(groups, groups.__data, valueFields, computedFields);
        }


        function pushDrilldown(dimension, index, text, groups) {

            drilldownStack.push({
                dimension: dimension,
                index: index,
                keys: groups.__keys,
                data: groups.__data,
                groups: groups.__list
            });

            index = drilldownStack.length - 1;

            pathHost.text(pathHost.text() + [

                '<span class="wy-drilldown-path">',
                    index > 0 ? '<span style="margin:0 4px;">&gt;</span>' : '',
                    '<span index="', index, '">', text, '</span>',
                '</span>'

            ].join(''));
        }


        function backDrilldown(event) {

            var target = event.target;

            if (target.nodeType !== 1)
            {
                target = target.parentNode;
            }

            var index = target.getAttribute('index');

            if (index)
            {
                var any;

                target = target.parentNode;

                while (any = target.nextSibling)
                {
                    any.parentNode.removeChild(any);
                }

                pathHost.text(pathHost.view.innerHTML);

                drilldownStack.splice((index |= 0) + 1);

                refreshChart();
            }
        }


        function changeDimension(event) {

            var index = event.target.getAttribute('index') | 0,
                dimension = dimensionList[index];

            if (dimension)
            {
                drilldownStack.length = 0;
                startDrilldown(dimension, dimension.data);
            }
        }

        
        function refreshChart() {

            var category = categoryBox.value(),
                last,
                data;

            filterKeys = null;

            // 非钻取图表
            if (last = nodrilldown)
            {
                renderFilter(chartData = last.data);

                if (category)
                {
                    data = chart.computeGroup(chartData, category, last.valueFields, last.computedFields);
                }
                else
                {
                    data = chartData;
                }
            }
            else if (last = drilldownStack[drilldownStack.length - 1])
            {
                renderFilter(chartData = last.data);

                if (category)
                {
                    last = last.dimension;
                    data = chart.computeGroup(chartData, category, last.valueFields, last.computedFields);
                }
                else
                {
                    data = last.groups;
                    last = last.dimension;
                }
            }

            chart.show(last.template, data, last.value, sortField, sortDesc);

            if (host[1])
            {
                refreshGrid(last.value, data);
            }
        }


        function refreshFilter() {

            var category = categoryBox.value(),
                last,
                data;

            // 非钻取图表
            if (last = nodrilldown)
            {
                syncFilter(chartData = filterData(last.data));

                if (category)
                {
                    data = chart.computeGroup(chartData, category, last.valueFields, last.computedFields);
                }
            }
            else if (last = drilldownStack[drilldownStack.length - 1])
            {
                var dimension = last.dimension;

                if (category)
                {
                    syncFilter(chartData = filterData(last.data));
                    data = chart.computeGroup(chartData, category, dimension.valueFields, dimension.computedFields);
                }
                else
                {
                    chartData && (chartData.length = 0);
                    data = filterGroup(last.groups, last.field, dimension.valueFields, dimension.computedFields, chart.computeValues, chartData);
                }

                last = dimension;
            }

            chart.show(last.template, data, last.value, sortField, sortDesc);
            
            if (host[1])
            {
                refreshGrid(last.value, data);
            }
        }


        function refreshGrid(valueFields, data) {

            var grid = host[0].findByType('Grid')[0],
                dataset = new flyingon.DataSet(),
                category = categoryBox.value(),
                list = [],
                total = 0,
                column;

            grid.columns().splice(0);
            dataset.load(data);

            list.push({
                type: 'no',
                size: 40,
                no: true
            });

            if (category)
            {
                category = category.split(',');

                for (var i = 0, l = category.length; i < l; i++)
                {
                    if (column = findColumn(columns, category[i]))
                    {
                        column = Object.assign({}, column);
                        column.merge = 1;

                        total += column.size;
                        list.push(column);
                    }
                }
            }
            else
            {
                total += 120;

                list.push({
                    name: '__by',
                    title: '分组',
                    size: 120,
                    onrender: function (cell) {

                        cell.color('#3498DB').cursor('default').on('click', function () {
                          
                            drilldownClick(this.text());
                        });
                    }
                });
            }

            for (var i = 0, l = columns.length; i < l; i++)
            {
                if (valueFields.indexOf(columns[i].name) >= 0)
                {
                    column = Object.assign({}, columns[i]);

                    total += column.size;
                    list.push(column);
                }
            }

            total = (grid.offsetWidth - 60) / total;

            for (var i = 1, l = list.length; i < l; i++)
            {
                list[i].size = list[i].size * total | 0;
            }

            grid.columns(list);
            grid.dataset(dataset);
        }


        function findColumn(columns, name) {

            for (var i = columns.length; i--;)
            {
                if (columns[i].name === name)
                {
                    return columns[i];
                }
            }
        }


        function filterGroup(groups, field, valueFields, computedFields, fn, chartData) {

            var list = [],
                all = [];

            for (var i = groups.length; i--;)
            {
                var item = groups[i],
                    data = filterData(item.__data);

                if (data.length > 0)
                {
                    all.push.apply(all, data);
                    all.push.apply(chartData, data);

                    list.push(item = {
                        __by: item.__by
                    });

                    item[field] = item.__by;
                    fn(item, data, valueFields, computedFields);
                }
            }

            syncFilter(all);

            return list;
        }


        function filterData(data) {

            var keys = filterKeys,
                list = [];

        LOOP:
            for (var i = 0, l = data.length; i < l; i++)
            {
                var item = data[i];

                for (var name in keys)
                {
                    if (keys[name][item[name]])
                    {
                        continue LOOP;
                    }
                }

                list.push(item);
            }

            return list;
        }


        function renderFilter(data) {

            var dom = filterBox.view,
                items = categoryBox.items(),
                text = categoryBox.text(),
                list = [],
                name,
                html;

            for (var i = 0, l = items.length; i < l; i++)
            {
                name = items[i];

                if (text.indexOf(name) >= 0)
                {
                    continue;
                }

                if (html = renderFilterHtml(data, name))
                {
                    list.push('<div class="chart-filter-box" field="', name, '">',
                            '<div class="chart-filter-head" key="switch-collapse">',
                                '<span>', name, '</span>',
                                '<span style="display:none;float:right;padding-right:10px;">展开</span>',
                                '<span key="select-all" style="float:right;padding:0 10px;">全选</span>',
                                '<span key="select-reverse" style="float:right;">反选</span>',
                            '</div>',
                            '<div class="chart-filter-body">', html, '</div>',
                        '</div>');
                }
            }

            dom.style.overflowY = 'auto';
            dom.innerHTML = list.join('');
            dom.onchange = switchFilter;
            dom.onclick = filterClick;
        }


        function localeCompare(a, b) {
        
            return ('' + a).localeCompare(b, 'zh');
        }


        function categoryValues(data, field, keys) {

            var list = [],
                text;
            
            keys = keys || Object.create(null);

            for (var i = 0, l = data.length; i < l; i++)
            {
                text = data[i][field];

                if (!keys[text])
                {
                    keys[text] = true;
                    list.push(text);
                }
            }

            if (list.length > 1)
            {
                list.sort(localeCompare);
            }

            return list;
        }


        function renderFilterHtml(data, field) {

            var list = categoryValues(data, field);

            if (list.length > 0)
            {
                for (var i = list.length; i--;)
                {
                    list[i] = '<span class="chart-filter-item" key="' 
                        + list[i] 
                        + '"><input type="checkbox" checked="checked" /><span>' 
                        + list[i] 
                        + '</span></span>';
                }

                return list.join('');
            }
        }


        function switchFilter(event) {

            var dom = event.target,
                keys = filterKeys,
                type = dom.parentNode.parentNode.parentNode.getAttribute('field'),
                key = dom.parentNode.getAttribute('key'),
                any;

            if (!dom.checked)
            {
                if (keys)
                {
                    any = keys[type] || (keys[type] = {});
                }
                else
                {
                    keys = filterKeys = {};
                    keys[type] = any = {};
                }

                any[key] = 1;
            }
            else if (keys && (any = keys[type]))
            {
                delete any[key];
            }

            if (filterDelay)
            {
                clearTimeout(filterDelay);
            }

            filterDelay = setTimeout(refreshFilter, 500);
        }


        function filterClick(event) {

            var dom = event.target,
                box,
                key;

            while (dom && (dom.nodeType !== 1 || !(key = dom.getAttribute('key'))))
            {
                dom = dom.parentNode;
            }

            if (box = dom && dom.parentNode)
            {
                while (box && !box.classList.contains('chart-filter-box'))
                {
                    box = box.parentNode;
                }

                switch (key)
                {
                    case 'select-all':
                        if (filterKeys)
                        {
                            selectAll(box);
                        }
                        break;

                    case 'select-reverse':
                        selectReverse(box);
                        break;

                    case 'switch-collapse':
                        switchCollapse(box);
                        break;
                }
            }
        }


        function selectAll(box) {

            var keys = filterKeys,
                type = box.getAttribute('field'),
                key;

            if (keys = keys[type])
            {
                var dom = box.lastChild.firstChild;

                while (dom)
                {
                    if (key = dom.getAttribute('key'))
                    {
                        dom.firstChild.checked = true;
                        delete keys[key];
                    }

                    dom = dom.nextSibling;
                }

                if (filterDelay)
                {
                    clearTimeout(filterDelay);
                }
    
                filterDelay = setTimeout(refreshFilter, 500);
            }
        }


        function selectReverse(box) {

            var keys = filterKeys || (filterKeys = {}),
                type = box.getAttribute('field'),
                key;

            var dom = box.lastChild.firstChild;

            keys = keys[type] || (keys[type] = {});

            while (dom)
            {
                if (key = dom.getAttribute('key'))
                {
                    if (dom.firstChild.checked = keys[key])
                    {
                        delete keys[key];
                    }
                    else
                    {
                        keys[key] = true;
                    }
                }

                dom = dom.nextSibling;
            }

            if (filterDelay)
            {
                clearTimeout(filterDelay);
            }

            filterDelay = setTimeout(refreshFilter, 500);
        }


        function switchCollapse(box) {

            var dom = box.firstChild,
                style = box.lastChild.style,
                collapse = style.display === 'none';

            style.display = collapse ? '' : 'none';
            dom.style.borderBottomStyle = collapse ? 'solid' : 'none';

            dom = dom.lastChild;
            dom.style.display = collapse ? '' : 'none';

            dom = dom.previousSibling;
            dom.style.display = collapse ? '' : 'none';

            dom = dom.previousSibling;
            dom.style.display = collapse ? 'none' : '';
        }


        function syncFilter(data) {

            var dom = filterBox.view.firstChild;

            while (dom)
            {
                var field = dom.getAttribute('field'),
                    keys = Object.create(null);

                categoryValues(data, field, keys);
                setFilterChecked(dom.lastChild, keys);

                dom = dom.nextSibling;
            }
        }


        function setFilterChecked(dom, keys) {
        
            dom = dom.firstChild;

            while (dom)
            {
                dom.firstChild.checked = keys[dom.getAttribute('key')] || false;
                dom = dom.nextSibling;
            }
        }



        function showDataView() {

            if (!chartData || !chartData.length)
            {
                flyingon.showMessage('提醒', '没有任何数据可供展示!', 'information', 'ok');
                return;
            }

            var dialog = new flyingon.Dialog()
                .text('数据视图')
                .padding('4 2 2 4')
                .width(1000)
                .height(480)
                .minWidth(100)
                .minHeight(100)
                .resizable(true);

            dialog.push({
                Class: 'Grid',
                width: '100%',
                height: '100%',
                header: 30, //列头高度
                group: 35, //分组框高度
                columns: columns
            });

            var grid = dialog.findByType('Grid');
            var dataset = new flyingon.DataSet();

            dialog.showDialog();

            dataset.load(chartData);

            // grid.groups(categoryBox.value());
            grid.dataset(dataset);
        }



        function parseColumns(fields) {

            var computed = chart.computed,
                list = [{ type: 'no', size: 40, no: true }];

            for (var i = 0, l = fields.length; i < l; i++)
            {
                var field = fields[i];

                if (field.visible === false)
                {
                    continue;
                }

                var column = {
                    name: field.name,
                    title: field.name,
                    size: field.width || 100
                };

                switch (field.type)
                {
                    case 'boolean':
                        column.type = 'checkbox';
                        break;

                    case 'number':
                        column.align = 'right';

                        if (field.summary)
                        {
                            column.summary = field.summary;
                        }

                        renderColumn(column, field, computed);
                        break;
                }

                list.push(column);
            }

            return columns = list;
        }


        function renderColumn(column, field, computed) {

            var decimal = Decimal.singleton,
                digits = field.digits,
                name = column.name,
                fn = computed && computed[name];

            column.summary = 'custom';

            if (digits > 0)
            {
                column.precision = digits;
            }

            if (fn)
            {
                column.onsummary = function (row, value) {

                    var value = row.data[name] = fn(row.data);
                    return digits ? decimal(value).toFixed(digits) : value;
                }
            }
            else
            {
                column.onsummary = function (row, value) {

                    return digits ? decimal(value).toFixed(digits) : value;
                }
            }
        }


        function exportTo(chart) {

            var grid;
            
            if (host[0] && host[0].findByType && (grid = host[0].findByType('Grid')))
            {
                var columns = grid.columns().slice(0),
                    dataset = grid.dataset(),
                    data = [];

                for (var i = columns.length; i--;)
                {
                    columns[i] = columns[i].title();
                }

                for (var i = dataset.length; i--;)
                {
                    data[i] = dataset[i].data;
                }

                flyingon.exportToXlsx(chart.chartName, 
                    '<img src="' + chart.toDataURL() + '" /><br></br>' +
                    flyingon.arrayToHtml(columns, data));
            }
            else
            {
                chart.saveAsImage(chart.chartName);
            }
        }

    }


});




flyingon.downloadDataURL = function (name, dataURL) {

    var a = document.createElement('a');

    // Chrome and Firefox
    if (a.download != null)
    {
        a.download = name;
        a.target = '_blank';
        a.href = dataURL;

        a.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: false
        }));
    }
    else if (navigator.msSaveOrOpenBlob) // IE
    {
        var text = atob(dataURL.split(',')[1]),
            length = text.length,
            array = new Uint8Array(length);

        while(length--)
        {
            array[length] = text.charCodeAt(length);
        }

        navigator.msSaveOrOpenBlob(new Blob([array]), name);
    }
}


flyingon.downloadBlob = function (name, blob) {

    var a = document.createElement('a');

    // Chrome and Firefox
    if (a.download != null)
    {
        a.download = name;
        a.target = '_blank';
        a.href = URL.createObjectURL(blob);

        a.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: false
        }));
    }
    else if (navigator.msSaveOrOpenBlob) // IE
    {
        navigator.msSaveOrOpenBlob(blob, name);
    }
}



flyingon.importXlsx = function (file, callback) {

    flyingon.script('js/xlsx.full.min.js', function () {

        var reader = new FileReader();

        reader.onload = function(event) {
            
            callback(XLSX.read(event.target.result, {
                type: 'binary'
            }));
        };

        reader.readAsBinaryString(file);
    });
}


flyingon.exportToXlsx = function (name, data) {
    
    flyingon.script('js/xlsx.full.min.js', function () {

        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(data);
        
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, name + '.xlsx');
    });
}
