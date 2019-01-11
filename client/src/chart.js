if (typeof CodeMirror === 'undefined') {
    flyingon.script('js/codemirror.js');
    flyingon.script('js/codemirror-javascript.js');
}


flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: {
            type: 'dock',
            spacingY: 0
        },

        children: [
            {
                Class: 'Tree',
                id: 'charttree',
                width: 240,
                dock: 'left'
            },

            { Class: 'Splitter', dock: 'left' },

            {
                Class: 'Panel',
                layout: 'dock',
                dock: 'fill',
                children: [
                    {
                        Class: 'Panel',
                        id: 'toolbar',
                        height: 34,
                        layout: 'dock',
                        padding: '0 0 8 0',
                        dock: 'top',
                        fontSize: '12px',
                        children: [
                            { Class: 'Button', key: 'add', width: 85, text: '增加', icon: 'icon-add' },
                            { Class: 'Button', key: 'delete', width: 85, text: '删除', icon: 'icon-delete' },
                            { Class: 'Button', key: 'save', width: 85, text: '保存', icon: 'icon-save' },
                            // { Class: 'Button', key: 'in', width: 85, text: '数据导入', icon: 'icon-in' },
                            // { Class: 'Button', key: 'out', width: 85, text: '数据导出', icon: 'icon-out' },
                            { Class: 'Button', key: 'datafix', width: 85, text: '数据维护', icon: 'icon-datafix' },
                            { Class: 'Button', key: 'refresh', width: 85, text: '刷新', icon: 'icon-refresh' },
                            { Class: 'Lable', width: 20 },
                            { Class: 'Button', key: 'homeset', width: 85, text: '首页配置', icon: 'icon-refresh' },
                            { Class: 'Button', key: 'search', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                            { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入图表名称', dock: 'right' }
                        ]

                    },

                    {
                        Class: 'Grid',
                        id: 'chart-grid',
                        locked: '1',
                        dock: 'fill',
                        columns: [
                            { type: 'no', no: true },
                            { type: 'check', no: true, title: '选择' },
                            { name: 'chartname', title: '图表名称', type: 'textbox', size: 150, align: 'left' },
                            { name: 'sort', title: '顺序号', type: 'number', size: 70, digits: 0, button: 'none', align: 'right' },
                            { name: 'isuse', title: '有效性', type: 'checkbox', size: 60 },
                            { name: 'chartjson', title: '图表配置', type: 'lable', size: 500 },
                            //{ name: 'homejson', title: '首层图表配置', type: 'lable', size: 250 },
                            { name: 'remarks', title: '说明', type: 'textbox', size: 150 }
                        ]
                    }


                ]

            }

        ]
    },

    created: function () {

        var txtSearch = this.findById('txtSearch')[0];
        var grid = this.findById('chart-grid')[0];
        var dataset = new flyingon.DataSet();
        var charttree = this.findById('charttree')[0];

        var datafix = this.findById('datafix')[0];

        var nodeId = '';

        var tbar = this.findById('toolbar')[0]

        grid.dataset(dataset);


        flyingon.http.get('charttypeinit').then(function (result) {

            var tree = charttree;

            result = JSON.parse(result);

            if (result.length > 0) {
                //树加载
                tree.load(result, 'id', 'pid', '');
                tree.current(tree[0]);
                tree.expandTo();

                refresh(nodeId = tree[0].get('id'))
            }
            else {
                alert('无图表分类数据！');
            }
        });


        charttree.on('node-click', function (event) {

            var node = event.node;
            refresh(nodeId = node ? node.get('id') : '');
        });


        function refresh(id) {

            flyingon.http.get('chartlist/' + id).then(function (result) {
                dataset.load(JSON.parse(result));
            });

            //每次切换树节点时，清空搜索框
            //txtSearch.value = '';

        }

        this.findById('toolbar').on('click', function (event) {

            bntsave = event;

            switch (event.target.key()) {

                case 'add':
                    dataset.push({ pid: nodeId, isuse: 1 });
                    dataset.last();
                    break;

                case 'save':
                    saveClick();
                    break;

                case 'delete':
                    deleteClick();
                    break;

                // case 'in':
                //     inClick();
                //     break;

                // case 'out':
                //     outClick();
                //     break;

                case 'datafix':
                    datafixClick();
                    break;

                case 'refresh':
                    refresh(nodeId);
                    break;

                case 'search':
                    searchClick();
                    break;

                case 'homeset':
                    homesetClick();
                    break;

            };

        });

        function saveClick() {

            var rows = dataset.getChanges();
            if (rows.length > 0) {

                flyingon.toast({ text: '正在保存数据，请稍候……', time: 60000, loading: true });
                flyingon.http.post('chart', rows.toJSON(true, 'id')).then(function (data) {

                    data = JSON.parse(data);
                    for (var i = rows.length; i--;) {
                        if (rows[i].state === 'add') {
                            rows[i].data.id = data[i].insertId;
                        }
                    }

                    dataset.acceptChanges();
                    flyingon.toast('数据保存成功！');
                })

            };
        };

        function deleteClick() {
            var rows = grid.checkedRows();
            if (rows.length > 0) {

                flyingon.showMessage('删除', '确定要删除选中的数据？', 'warn', 'ok,cancel').on('closed', function (e) {

                    if (e.closeType === 'ok') {

                        var keys = [], logs = [];
                        for (var i = 0, l = rows.length; i < l; i++) {
                            keys.push(rows[i].data['id']);
                            logs.push('{"chartname":"' + rows[i].data['chartname'] + '"}');
                        };

                        flyingon.http.put('chart', JSON.stringify({ data: keys, log: logs })).then(function () {
                            refresh(nodeId);
                        });
                    };
                });
            };
        };



        function datafixClick() {

            var row = dataset.current();
            if (!row) {
                return;
            };

            var chartid = row.data.id;
            var chartname = row.data.chartname;
            var table = '';
            var tablekey = '';

            var dialog = window.dialog = new flyingon.Dialog();

            // dialog.resizable(true);
            dialog.text('数据维护');
            dialog.padding(8);
            dialog.layout('dock');
            dialog.width(1000);
            dialog.height(600);
            dialog.minWidth(300);
            dialog.minHeight(200);
            dialog.resizable(true);

            dialog.push(

                {
                    Class: 'Panel',
                    id: 'datatoolbar',
                    height: 34,
                    layout: 'dock',
                    padding: '0 0 8 0',
                    dock: 'top',
                    fontSize: '12px',
                    children: [
                        { Class: 'Button', key: 'add', width: 85, text: '增加', icon: 'icon-add' },
                        { Class: 'Button', key: 'delete', width: 85, text: '删除', icon: 'icon-delete' },
                        { Class: 'Button', key: 'save', width: 85, text: '保存', icon: 'icon-save' },
                        //{ Class: 'Button', key: 'in', width: 80, text: '导入', icon: 'icon-in' },
                        {
                            Class: 'File', width: 80, text: '导入', icon: 'icon-in',
                            accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        },
                        { Class: 'Button', key: 'out', width: 80, text: '导出', icon: 'icon-out' },
                        { Class: 'Button', key: 'refresh', width: 85, text: '刷新', icon: 'icon-refresh' }
                        // { Class: 'Button', key: 'search', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                        // { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入要查询的内容', dock: 'right' }
                    ]

                },

                {
                    Class: 'Grid',
                    id: 'user-grid',
                    dock: 'fill',
                    group: 35, //分组框高度
                    locked: '1',
                    columns: [
                        { type: 'no', no: true, size: 45 },
                        { type: 'check', no: true, title: '选择' }
                        //其他表格根据数据表自动加载
                    ]
                }

            );



            var chartGrid = dialog.findById('user-grid')[0];
            var chartDataset = new flyingon.DataSet();
            chartGrid.dataset(chartDataset);

            dialog.showDialog();

            //传入图表ID，返回两个结果集，A、表格列；B、表格数据；
            flyingon.toast({ text: '正在加载数据，请稍候……', time: 60000, loading: true });
            flyingon.http.get('charttbstru/' + chartid).json(function (result) {

                chartGrid.columns(result[0].columns);
                table = result[0].table;
                tablekey = result[0].primarykey;

                chartDataset.load(result[1]);

                flyingon.toast('数据加载完成！');

            });


            dialog.findById('datatoolbar').on('click', function (event) {

                switch (event.target.key()) {
                    case 'add':
                        chartDataset.push({});
                        chartDataset.last();
                        break;

                    case 'delete':
                        fixdeleteClick();
                        break;

                    case 'save':
                        fixsaveClick();
                        break;

                    case 'out':
                        fixoutClick();
                        break;

                    case 'refresh':
                        fixrefreshClick();
                        break;


                }
            });

            dialog.on('closed', function () {
                // var rows = chartDataset.getChanges();
                // if (rows.length > 0) {
                //     flyingon.showMessage('关闭', '有未保存的数据，确定要关闭吗？', 'warn', 'ok,cancel').on('closed', function (e) {
                //         if (e.closeType === 'ok') {
                //             dialog.close();
                //         }
                //     });
                // }

            });

            function fixsaveClick() {
                //
                var rows = chartDataset.getChanges();

                if (rows.length > 0) {

                    flyingon.toast({ text: '正在保存数据，请稍候……', time: 60000, loading: true });

                    //flyingon.http.post('chartdata', rows.toJSON(true, 'id')).then(function (data) {
                    flyingon.http.post('chartdata', JSON.stringify({ data: rows.toJSON(true, tablekey), tblname: table, primarykey: tablekey })).then(function (data) {

                        data = JSON.parse(data);
                        for (var i = rows.length; i--;) {
                            if (rows[i].state === 'add') {
                                rows[i].data.id = data[i].insertId;
                            }
                        };

                        chartDataset.acceptChanges();
                        flyingon.toast('数据保存成功！');
                    });
                }

            };

            function fixdeleteClick() {
                //
                var rows = chartGrid.checkedRows();

                if (rows.length > 0) {

                    flyingon.showMessage('删除', '确定要删除选中的数据？', 'warn', 'ok,cancel').on('closed', function (e) {

                        if (e.closeType === 'ok') {

                            var keys = [];

                            for (var i = 0, l = rows.length; i < l; i++) {
                                keys.push(rows[i].data[tablekey]);
                            }

                            flyingon.http.put('chartdata', JSON.stringify({ data: keys, tblname: table, primarykey: tablekey })).then(function () {

                                //刷新，需要考虑大数据量，建议直接对表格进行操作删除行；
                                chartGrid.removeCheckedRows();
                            });
                        };
                    });
                };

            };

            //从文件导入数据
            dialog.findByType('File').on('change', function (event) {

                flyingon.importXlsx(event.dom.files[0], function (data) {
                   
                    debugger

                });
            });

            //导出表格数据
            function fixoutClick() {

                var data = [],
                    ds = chartDataset;

                for (var i = ds.length; i--;)
                {
                    data[i] = ds[i].data;
                };

                 //alert(chartGrid.columns[0].title);
                 //alert(chartGrid.rows['orgcode']);

                // chartDataset
                // var outdata = [{ a: 1, b: 2 }, { a: 11, b: 22 }];

                flyingon.exportToXlsx(chartname, data);

            };


            function fixrefreshClick() {
                //
                flyingon.toast({ text: '正在刷新数据，请稍候……', time: 60000, loading: true });
                flyingon.http.get('charttbstru/' + chartid).json(function (result) {

                    chartDataset.load(result[1]);

                    flyingon.toast('数据刷新完成！');

                });
            };


        };


        // function refreshClick() {
        //     flyingon.http.get('chart').then(function (result) {

        //         dataset.load(JSON.parse(result));
        //     });

        // };


        // grid.on('focus', function (event) {

        //     event.target.readonly(true);
        // })


        //表格点击事件
        grid.on('click', function (event) {
            //debugger;

            var row = event.target.row;

            if (row) {

                var col = event.target.column.name();

                if (col === 'chartjson') {

                    var caption, fldName;
                    caption = '图表配置';
                    fldName = 'chartjson';
                    
                    var dialog = window.dialog = new flyingon.Dialog();

                    // dialog.resizable(true);
                    //dialog.text('图表配置');
                    dialog.text(caption);
                    dialog.padding(8);
                    dialog.layout('dock');
                    dialog.width(1000);
                    dialog.height(600);


                    dialog.showDialog();

                    var body = dialog.view_content;

                    body.style.padding = '0';
                    body.innerHTML = '<textarea style="width:100%;height:100%;font-size:16px;"></textarea>';

                    var memo = dialog.view_content.firstChild;

                    //memo.value = dataset.current().data['chartjson'];
                    memo.value = dataset.current().data[fldName];

                    var editor = CodeMirror.fromTextArea(memo, {

                        mode: 'javascript',     // 编辑器语言
                        lineNumbers: true,
                        indentUnit: 4,          // 缩进单位
                        smartIndent: false,      // 自动缩进
                        // theme: 'seti',       // 选择主题,没引入主题的话可以不写
                        matchBrackets: true,    // 括号匹配
                    });

                    body.lastChild.style.height = '100%';

                    dialog.on('closed', function () {

                        //dataset.current().set('chartjson').value = mem;
                        //dataset.current().set('chartjson', editor.getValue());

                        dataset.current().set(fldName, editor.getValue());

                        //表格也要刷新；
                        //
                    });

                    //ctrl+s 保存图表配置
                    dialog.on('keydown', function (e) {

                        e = window.event || e;
                        if (e.keyCode == 83 && e.ctrlKey) {

                            /*延迟，兼容FF浏览器  */
                            setTimeout(function () {

                                //alert('ctrl+s');

                                dataset.current().set(fldName, editor.getValue());
                                saveClick();

                            }, 1);

                            e.stopPropagation();
                            e.preventDefault();
                            return false;
                        }
                    });
                }
            }
        });


        function searchClick() {

            flyingon.http.get('chart?pid=' + nodeId + '&c=' + txtSearch.value()).then(function (result) {

                dataset.load(JSON.parse(result));
            });

        };


        function homesetClick() {

            var homepageid = 0;
            var dialog = window.dialog = new flyingon.Dialog();

            // dialog.resizable(true);
            dialog.text('首页配置');
            dialog.padding(8);
            dialog.layout('dock');
            dialog.width(1000);
            dialog.height(600);


            dialog.showDialog();

            var body = dialog.view_content;

            body.style.padding = '0';
            body.innerHTML = '<textarea style="width:100%;height:100%;font-size:16px;"></textarea>';

            var memo = dialog.view_content.firstChild;
            var editor;

            //editor.setSize('100%','100%');

            flyingon.http.get('homepage').then(function (result) {

                result = JSON.parse(result);

                if (result.length > 0) {

                    homepageid = result[0].id;
                    memo.value = result[0].pagejson;
                    //memo.height(598);

                    editor = CodeMirror.fromTextArea(memo, {
        
                        mode: 'javascript',     // 编辑器语言
                        lineNumbers: true,
                        indentUnit: 4,          // 缩进单位
                        smartIndent: false,      // 自动缩进
                        // theme: 'seti',       // 选择主题,没引入主题的话可以不写
                        matchBrackets: true,    // 括号匹配
                    });

                    editor.setSize('100%','100%');

                }
                else {
                    alert('无系统首页配置数据！');
                }
            });


            body.lastChild.style.height = '100%';

            dialog.on('closed', function () {

                var keys = [];
                keys.push(homepageid);
                keys.push(editor.getValue());

                flyingon.http.put('homepage', JSON.stringify(keys)).then(function () {

                    flyingon.toast('首页配置保存成功！');
                });

            });

            //ctrl+s 保存图表配置
            dialog.on('keydown', function (e) {

                e = window.event || e;
                if (e.keyCode == 83 && e.ctrlKey) {

                    /*延迟，兼容FF浏览器  */
                    setTimeout(function () {

                        //alert('ctrl+s');

                        var keys = [];
                        keys.push(homepageid);
                        keys.push(editor.getValue());

                        flyingon.http.put('homepage', JSON.stringify(keys)).then(function () {

                            flyingon.toast('首页配置保存成功!');
                        });

                    }, 1);

                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });

        }
    }


});

