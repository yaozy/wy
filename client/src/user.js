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

                Class: 'Tab',
                id: 'tabUser',
                size: 90,
                width: 400,
                selected: 0,
                dock: 'right',
                children: [
                    {
                        class: 'TabPage',
                        id: 'page-role',
                        text: '用户角色关系',
                        padding: 8,
                        layout: 'dock',
                        children: [
                            {
                                // Class: 'Grid',
                                // id: 'user-grid-role',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'rolename', title: '角色名称', type: 'lable', size: 120, align: 'left' },
                                //     { name: 'rolecode', title: '角色编码', type: 'lable', size: 120, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 150 }
                                // ]
                                Class: 'Tree', id: 'user-tree-role', dock: 'fill'
                            }
                        ]
                    },
                    {
                        class: 'TabPage',
                        id: 'page-func',
                        text: '功能点权限',
                        padding: 8,
                        layout: 'dock',
                        children: [
                            {
                                // Class: 'Grid',
                                // id: 'user-grid-func',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'funcname', title: '功能点名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'type', title: '功能点类型', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 950 }
                                // ]
                                Class: 'Tree', id: 'user-tree-func', dock: 'fill'
                            }
                        ]
                    },

                    {
                        class: 'TabPage',
                        id: 'page-org',
                        text: '物业项目权限',
                        padding: 8,
                        layout: 'dock',
                        children: [
                            {
                                // Class: 'Grid',
                                // id: 'user-grid-org',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'orgtreename', title: '上级组织名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'orgname', title: '物业项目名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'orgcode', title: '物业项目编码', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 800 }
                                // ]
                                Class: 'Tree', id: 'user-tree-org', dock: 'fill'
                            }
                        ]
                    },
                    {
                        class: 'TabPage',
                        id: 'page-chart',
                        text: '图表权限',
                        padding: 8,
                        layout: 'dock',
                        children: [
                            {
                                // Class: 'Grid',
                                // id: 'user-grid-chart',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'charttypename', title: '图表分类', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'chartname', title: '图表名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 950 }
                                // ]
                                Class: 'Tree', id: 'user-tree-chart', dock: 'fill'
                            }
                        ]
                    }
                ]


            },

            { Class: 'Splitter', dock: 'right', width: 4 },


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
                    // { Class: 'Button', key: 'in', width: 80, text: '导入',icon:'icon-' },
                    // { Class: 'Button', key: 'out', width: 80, text: '导出',icon:'icon-' },
                    { Class: 'Button', key: 'reset', width: 85, text: '密码重置', icon: 'icon-reset' },
                    { Class: 'Button', key: 'refresh', width: 85, text: '刷新', icon: 'icon-refresh' },
                    { Class: 'Button', key: 'search', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                    { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入账号、姓名、工号、电话', dock: 'right' }
                ]

            },

            {
                Class: 'Grid',
                id: 'user-grid',
                dock: 'fill',
                locked: '1',
                columns: [
                    { type: 'no', no: true },
                    { type: 'check', no: true, title: '选择' },
                    // { name: 'xz', title: '选择', type: 'checkbox', size: 60 },
                    { name: 'useraccount', title: '用户账号', type: 'textbox', size: 100, align: 'left' },
                    { name: 'username', title: '用户姓名', type: 'textbox', size: 100, align: 'left' },
                    { name: 'jobno', title: '用户工号', type: 'textbox', size: 80, align: 'left' },
                    { name: 'phone', title: '联系电话', type: 'textbox', size: 100 },
                    { name: 'email', title: '联系邮箱', type: 'textbox', size: 150 },
                    { name: 'isuse', title: '有效性', type: 'checkbox', size: 40 },
                    { name: 'sort', title: '顺序号', type: 'number', size: 60, digits: 0, button: 'none', align: 'right' },
                    { name: 'remarks', title: '说明', type: 'textbox', size: 200 }
                ]
            },

        ]
    },

    created: function () {

        var dataset = new flyingon.DataSet();
        var grid = this.findById('user-grid')[0];
        var columns = grid.columns();
        var tab = this.findByType('Tab')[0];

        var txtSearch = this.findById('txtSearch')[0];

        var page_role = this.findById('page-role')[0];
        var page_func = this.findById('page-func')[0];
        var page_org = this.findById('page-org')[0];
        var page_chart = this.findById('page-chart')[0];


        // page_role.$grid = this.findById('user-grid-role')[0];
        page_role.$tree = this.findById('user-tree-role')[0];
        //page_func.$grid = this.findById('user-grid-func')[0];
        page_func.$tree = this.findById('user-tree-func')[0];
        // page_org.$grid = this.findById('user-grid-org')[0];
        page_org.$tree = this.findById('user-tree-org')[0];
        // page_chart.$grid = this.findById('user-grid-chart')[0];
        page_chart.$tree = this.findById('user-tree-chart')[0];


        //循环绑定渲染方法
        for (var i = columns.length; i--;) {
            columns[i].onrender = render;
        }

        //为指定的单元格渲染与只读
        function render(cell, row, column) {

            var colname = column.name();
            //debugger;
            if (row.data['useraccount'] === 'system') {
                if (cell.readonly) {
                    cell.readonly(true);
                }
                cell.backgroundColor('silver');
            }

        }

        //数据集行切换事件
        dataset.on('move', function (event) {

            tab.selectedPage().$refresh(event.value.get('id'));
        });


        flyingon.http.get('user').then(function (result) {

            dataset.load(JSON.parse(result));
            grid.dataset(dataset);

            tab.selectedPage().$refresh(dataset[0] ? dataset[0].get('id') : '');
        });


        //用户关联子表的表格页签切换时，调用对应页签的刷新事件
        tab.on('tab-change', function (event) {

            var page = event.current,
                row = dataset.current(),
                id = row ? row.get('id') : '';

            if (id !== page.userId) {
                page.$refresh(id);
            }
        });


        //用户对应角色
        page_role.$refresh = function (userid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds);
            // }

            this.userId = userid;

            flyingon.http.get('user2role/' + userid).then(function (result) {

                // ds.load(JSON.parse(result));
                page_role.$tree.load(JSON.parse(result), 'id', 'pid', '');
                page_role.$tree.expandTo();
            });
        }

        //用户对应功能点
        page_func.$refresh = function (userid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds);
            // }


            this.userId = userid;

            flyingon.http.get('user2func/' + userid).then(function (result) {

                //     ds.load(JSON.parse(result));

                page_func.$tree.load(JSON.parse(result), 'id', 'pid', '');
                page_func.$tree.expandTo();
                //page_func.$tree.select(page_func.$tree[0]);

            });

        }

        //用户对应物业项目
        page_org.$refresh = function (userid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds);
            // }

            this.userId = userid;

            flyingon.http.get('user2org/' + userid).json(function (result) {

                var tree = page_org.$tree;

                tree.splice(0);
                tree.push.apply(tree, result);
                tree.expandTo();
            });
        }

        //用户对应图表   
        page_chart.$refresh = function (userid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds);
            // }

            this.userId = userid;

            flyingon.http.get('user2chart/' + userid).then(function (result) {

                // ds.load(JSON.parse(result));
                page_chart.$tree.load(JSON.parse(result), 'id', 'pid', '');
                page_chart.$tree.expandTo();
            });
        }


        this.findById('toolbar').on('click', function (event) {

            switch (event.target.key()) {
                case 'add':
                    dataset.push({ isuse: 1, userpassword: '8af9e332d5365c982fbf3fdea3de342d' });
                    dataset.last();
                    break;

                case 'save':
                    saveClick();
                    break;

                case 'delete':
                    deleteClick();
                    break;

                case 'in':
                    inClick();
                    break;

                case 'out':
                    outClick();
                    break;

                case 'reset':
                    resetClick();
                    break;

                case 'refresh':
                    refreshClick();
                    break;

                case 'search':
                    searchClick();
                    break;
            }
        });


        //保存
        //获取表格数据变化内容
        function saveClick() {

            //dataset.getChanges();  true:只取变化的行，“id”：传到后台的主键值；
            //dataset.getChanges().toJSON(true, 'id');

            var rows = dataset.getChanges();

            if (rows.length > 0) {
                flyingon.toast({ text: '正在保存数据，请稍候……', time: 60000, loading: true });
                flyingon.http.post('user', rows.toJSON(true, 'id')).then(function (data) {

                    data = JSON.parse(data);
                    for (var i = rows.length; i--;) {
                        if (rows[i].state === 'add') {
                            rows[i].data.id = data[i].insertId;
                        }
                    };

                    dataset.acceptChanges();
                    flyingon.toast('数据保存成功！');
                });
            }
        };

        //删除表格行
        function deleteClick() {
            //dataset.splice(0, 1);

            var rows = grid.checkedRows();

            if (rows.length > 0) {

                flyingon.showMessage('删除', '确定要删除选中的数据？', 'warn', 'ok,cancel').on('closed', function (e) {

                    if (e.closeType === 'ok') {

                        var keys = [], logs = [];

                        for (var i = 0, l = rows.length; i < l; i++) {
                            keys.push(rows[i].data['id']);
                            logs.push('{"username":"' + rows[i].data['username'] + '"}');
                        }

                        flyingon.http.put('user', JSON.stringify({ data: keys, log: logs })).then(function () {

                            //refreshClick();
                            grid.removeCheckedRows();
                        });
                    };
                });
            };

        };

        //导入
        function inClick() {
            //
            alert('待完善');
        };

        //导出
        function outClick() {
            //
            alert('待完善');
        };

        //密码重置
        function resetClick() {

            if (dataset.current().get('id')) {
                flyingon.showMessage('密码重置', '确定要将账号"' + dataset.current().get('useraccount') + '"的密码重置为初始密码？', 'warn', 'ok,cancel').on('closed', function (e) {

                    if (e.closeType === 'ok') {

                        var keys = [];
                        keys.push(dataset.current().get('id'));

                        flyingon.http.put('reset', JSON.stringify(keys)).then(function () {

                            flyingon.toast('密码重置成功！');
                            //flyingon.showMessage('密码重置', '密码重置成功！');
                        });
                    };
                });

            }

        };

        //刷新
        function refreshClick() {
            flyingon.http.get('user').then(function (result) {

                dataset.load(JSON.parse(result));
            });
        };


        //查询
        function searchClick() {
            flyingon.http.get('user/' + encodeURIComponent(txtSearch.value())).then(function (result) {

                dataset.load(JSON.parse(result));
            });
        };


    }


});