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
                id: 'tabRole',
                size: 90,
                width: 400,
                selected: 0,
                dock: 'right',
                children: [
                    {
                        class: 'TabPage',
                        id: 'page-user',
                        text: '用户角色关系',
                        padding: 8,
                        layout: 'dock',
                        children: [
                            // { Class: 'Button', name: 'btnSave', width: 80, text: '保存' },
                            {
                                Class: 'Grid',
                                id: 'role-grid-user',
                                dock: 'fill',
                                locked: '1',
                                columns: [
                                    { name: 'XZ', title: '选择', type: 'checkbox', size: 50 },
                                    { name: 'username', title: '用户姓名', type: 'lable', size: 150, align: 'left' },
                                    { name: 'useraccount', title: '用户账号', type: 'lable', size: 150, align: 'left' }
                                    // { name: 'jobno', title: '用户工号', type: 'lable', size: 150, align: 'left' },
                                    // { name: 'phone', title: '联系电话', type: 'lable', size: 150, align: 'left' },
                                    // { name: 'email', title: '联系邮箱', type: 'lable', size: 150, align: 'left' },
                                    // { name: 'remarks', title: '说明', type: 'lable', size: 450 }
                                ]
                                //Class: 'Tree', id: 'role-tree-user', dock: 'fill'
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
                            // { Class: 'Button', name: 'btnSave', width: 80, text: '保存' },
                            {
                                // Class: 'Grid',
                                // id: 'role-grid-func',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'XZ', title: '选择', type: 'checkbox', size: 50 },
                                //     { name: 'funcname', title: '功能点名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'type', title: '功能点类型', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 900 }
                                // ]
                                Class: 'Tree', id: 'role-tree-func', dock: 'fill', checked: true
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
                            // { Class: 'Button', name: 'btnSave', width: 80, text: '保存' },
                            {
                                // Class: 'Grid',
                                // id: 'role-grid-org',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'XZ', title: '选择', type: 'checkbox', size: 50 },
                                //     { name: 'orgname', title: '物业项目名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'orgcode', title: '物业项目编码', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 900 }
                                // ]
                                Class: 'Tree', id: 'role-tree-org', dock: 'fill', checked: true
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
                            //{ Class: 'Button', name: 'btnSave', width: 80, text: '保存' },
                            {
                                // Class: 'Grid',
                                // id: 'role-grid-chart',
                                // dock: 'fill',
                                // locked: '1',
                                // columns: [
                                //     { name: 'XZ', title: '选择', type: 'checkbox', size: 50 },
                                //     { name: 'chartname', title: '图表名称', type: 'lable', size: 150, align: 'left' },
                                //     { name: 'remarks', title: '说明', type: 'lable', size: 1050 }
                                // ]
                                Class: 'Tree', id: 'role-tree-chart', dock: 'fill', checked: true
                            }
                        ]
                    }
                ]


            },

            { Class: 'Splitter', dock: 'right', height: 4 },

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
                    // { Class: 'Button', key: 'copy', width: 80, text: '角色复制' },  //后续考虑用“权限复制”的功能实现
                    { Class: 'Button', key: 'refresh', width: 85, text: '刷新', icon: 'icon-refresh' },
                    { Class: 'Button', key: 'search', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                    { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入角色编码、名称', dock: 'right' }
                ]
            },

            {
                Class: 'Grid',
                id: 'role-grid',
                dock: 'fill',
                locked: '1',
                columns: [
                    { type: 'no', no: true },
                    { type: 'check', no: true, title: '选择' },
                    { name: 'rolecode', title: '角色编码', type: 'textbox', size: 150, align: 'left' },
                    { name: 'rolename', title: '角色名称', type: 'textbox', size: 250, align: 'left' },
                    { name: 'sort', title: '顺序号', type: 'number', size: 60, digits: 0, button: 'none', align: 'right' },
                    { name: 'remarks', title: '说明', type: 'textbox', size: 370 }
                ]
            }
        ]
    },

    created: function () {

        var dataset = new flyingon.DataSet();
        var grid = this.findById('role-grid')[0];
        var tab = this.findByType('Tab')[0];

        var txtSearch = this.findById('txtSearch')[0];

        var page_user = this.findById('page-user')[0];
        var page_func = this.findById('page-func')[0];
        var page_org = this.findById('page-org')[0];
        var page_chart = this.findById('page-chart')[0];

        page_user.$grid = this.findById('role-grid-user')[0];
        // page_func.$grid = this.findById('role-grid-func')[0];
        // page_org.$grid = this.findById('role-grid-org')[0];
        // page_chart.$grid = this.findById('role-grid-chart')[0];
        // page_user.$tree = this.findById('role-tree-user')[0];
        page_func.$tree = this.findById('role-tree-func')[0];
        page_org.$tree = this.findById('role-tree-org')[0];
        page_chart.$tree = this.findById('role-tree-chart')[0];


        //图表树的选择；？？？？三态问题
        page_func.$tree.on('checked-change', onfunccheckedchange);
        page_org.$tree.on('checked-change', onorgcheckedchange);
        page_chart.$tree.on('checked-change', onchartcheckedchange);

        function onfunccheckedchange(event) {

            var nodes = event.target.all(),
                checked = event.value,
                list = [checked ? 1 : 0],
                id;       //数组的第1个值为“选中”标识；

            list.push(page_func.roleid);      //数组的第2个值为“角色ID”标识； 

            //由于功能点都是要授权的，所以不管是否有子节点，树节点本身要更新选中状态；
            id = event.target.get('id');
            list.push(id);

            //当有子节点时，进行循环选中，并拼接字符功能点字符串
            if (nodes.length > 0) {

                page_func.$tree.off('checked-change', onfunccheckedchange);

                for (var i = nodes.length; i--;) {

                    var node = nodes[i];

                    if (node.checked() !== checked) {
                        node.checked(checked);

                        //由于功能点ID拼接，保存“是否选中状态”
                        id = node.get('id');
                        list.push(id);    //数组的第2个以后的值为“功能点ID”标识； 
                    }
                }

                page_func.$tree.on('checked-change', onfunccheckedchange);
            }
            // else {
            //     id = event.target.get('id');
            //     list.push(id);
            // }

            //批量保存
            if (list.length > 2) {
                flyingon.http.post('role2func', JSON.stringify(list));
            };
        };

        function onorgcheckedchange(event) {

            var nodes = event.target.all(),
                checked = event.value,
                list = [checked ? 1 : 0],
                id;       //数组的第1个值为“选中”标识；

            list.push(page_org.roleid);      //数组的第2个值为“角色ID”标识； 

            if (nodes.length > 0) {

                page_org.$tree.off('checked-change', onorgcheckedchange);

                for (var i = nodes.length; i--;) {

                    var node = nodes[i];

                    if (node.checked() !== checked) {
                        node.checked(checked);

                        //由于拼接树节点时，将物业项目ID加了“-”号，所以只要是小于0的ID，就是物业项目ID，就应该保存“是否选中状态”
                        if ((id = node.get('id') | 0) < 0) {
                            list.push(-id);    //数组的第2个以后的值为“物业项目ID”标识； 
                        }
                    }
                }

                page_org.$tree.on('checked-change', onorgcheckedchange);
            }
            else if ((id = event.target.get('id') | 0) < 0) {
                list.push(-id);
            }

            //批量保存
            if (list.length > 2) {
                flyingon.http.post('role2org', JSON.stringify(list));
            };
        };

        function onchartcheckedchange(event) {

            var nodes = event.target.all(),
                checked = event.value,
                list = [checked ? 1 : 0],
                id;       //数组的第1个值为“选中”标识；

            list.push(page_chart.roleid);      //数组的第2个值为“角色ID”标识； 

            if (nodes.length > 0) {

                page_chart.$tree.off('checked-change', onchartcheckedchange);

                for (var i = nodes.length; i--;) {

                    var node = nodes[i];

                    if (node.checked() !== checked) {
                        node.checked(checked);

                        //由于拼接树节点时，将图表ID加了“-”号，所以只要是小于0的ID，就是图表ID，就应该保存“是否选中状态”
                        if ((id = node.get('id') | 0) < 0) {
                            list.push(-id);    //数组的第2个以后的值为“图表ID”标识； 
                        }
                    }
                }

                page_chart.$tree.on('checked-change', onchartcheckedchange);
            }
            else if ((id = event.target.get('id') | 0) < 0) {
                list.push(-id);
            }

            //批量保存
            if (list.length > 2) {
                flyingon.http.post('role2chart', JSON.stringify(list));
            };
        };


        dataset.on('move', function (event) {

            tab.selectedPage().$refresh(event.value.get('id'));
        });


        flyingon.http.get('role').then(function (result) {

            dataset.load(JSON.parse(result));
            grid.dataset(dataset);

            tab.selectedPage().$refresh(dataset[0] ? dataset[0].get('id') : '');
        });


        //用户关联子表的表格页签切换时，调用对应页签的刷新事件
        tab.on('tab-change', function (event) {

            var page = event.current,
                row = dataset.current(),
                id = row ? row.get('id') : '';

            if (id !== page.roleid) {
                page.$refresh(id);
            }
        });


        //角色对应用户
        page_user.$refresh = function (roleid) {

            var ds = this.$dataset;

            if (!ds) {
                this.$dataset = ds = new flyingon.DataSet();
                this.$grid.dataset(ds);

                //数据源有数据变化触发
                ds.on('change', function (event) {

                    flyingon.http.post('role2user', JSON.stringify([
                        page_user.roleid,
                        event.row.data['id'],
                        event.value ? 1 : 0
                    ]));

                })

            }

            this.roleid = roleid;

            flyingon.http.get('role2user/' + roleid).then(function (result) {

                ds.load(JSON.parse(result));
            });
        }

        //角色对应功能点
        page_func.$refresh = function (roleid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds);

            //     //数据源有数据变化触发
            //     ds.on('change', function (event) {

            //         flyingon.http.post('role2func', JSON.stringify([
            //             page_func.roleid,
            //             event.row.data['id'],
            //             event.value ? 1 : 0
            //         ]));
            //     })
            // }

            this.roleid = roleid;

            flyingon.http.get('role2func/' + roleid).then(function (result) {

                // ds.load(JSON.parse(result));
                page_func.$tree.load(JSON.parse(result), 'id', 'pid', '');
                page_func.$tree.expandTo();
            });
        }

        //角色对应物业项目
        page_org.$refresh = function (roleid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds)

            //     //数据源有数据变化触发
            //     ds.on('change', function (event) {

            //         flyingon.http.post('role2org', JSON.stringify([
            //             page_org.roleid,
            //             event.row.data['id'],
            //             event.value ? 1 : 0
            //         ]));

            //     })
            // }

            this.roleid = roleid;

            flyingon.http.get('role2org/' + roleid).then(function (result) {

                // ds.load(JSON.parse(result));
                page_org.$tree.load(JSON.parse(result), 'id', 'pid', '');
                page_org.$tree.expandTo();
            });
        }

        //角色对应图表   
        page_chart.$refresh = function (roleid) {

            // var ds = this.$dataset;

            // if (!ds) {
            //     this.$dataset = ds = new flyingon.DataSet();
            //     this.$grid.dataset(ds);

            //     //数据源有数据变化触发
            //     ds.on('change', function (event) {

            //         flyingon.http.post('role2chart', JSON.stringify([
            //             page_chart.roleid,
            //             event.row.data['id'],
            //             event.value ? 1 : 0
            //         ]));
            //     })

            // }

            this.roleid = roleid;

            flyingon.http.get('role2chart/' + roleid).then(function (result) {

                // ds.load(JSON.parse(result));
                page_chart.$tree.load(JSON.parse(result), 'id', 'pid', '');
                page_chart.$tree.expandTo();
            });
        }


        this.findById('toolbar').on('click', function (event) {

            switch (event.target.key()) {
                case 'add':
                    //     dataset.push({ id: 'test' });   // 对应字段带默认值；
                    dataset.push({});
                    dataset.last();
                    break;

                case 'save':
                    saveClick();
                    break;

                case 'delete':
                    deleteClick();
                    break;

                // case 'copy':
                //     copyClick()
                //     break;

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

            var rows = dataset.getChanges();

            if (rows.length > 0) {
                flyingon.toast({ text: '正在保存数据，请稍候……', time: 60000, loading: true });
                flyingon.http.post('role', rows.toJSON(true, 'id')).then(function (data) {

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
        }


        //删除表格行
        function deleteClick() {

            var rows = grid.checkedRows();

            if (rows.length > 0) {

                flyingon.showMessage('删除', '确定要删除选中的数据？', 'warn', 'ok,cancel').on('closed', function (e) {

                    if (e.closeType === 'ok') {

                        var keys = [],
                            logs = [];

                        for (var i = 0, l = rows.length; i < l; i++) {
                            keys.push(rows[i].data['id']);
                            logs.push('{"rolename":"' + rows[i].data['rolename'] + '"}');
                        }

                        flyingon.http.put('role', JSON.stringify({ data: keys, log: logs })).then(function () {
                           
                            grid.removeCheckedRows();
                            //refreshClick();
                        });
                    };
                });
            };
        };


        // //角色复制
        // function copyClick() {
        //     var row = dataset.current(),
        //         id = row ? row.get('id') : '';

        //     alert('待完善');
        //     //
        // }

        //刷新
        function refreshClick() {
            //
            flyingon.http.get('role').then(function (result) {

                dataset.load(JSON.parse(result));
            });
        }


        //查询
        function searchClick() {
            flyingon.http.get('role/' + encodeURIComponent(txtSearch.value())).then(function (result) {

                dataset.load(JSON.parse(result));
            });
        }




    }



});