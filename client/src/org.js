flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: {
            type: 'dock',
            spacingY: 0
        },

        children: [
            { Class: 'Tree', id: 'org-tree', width: 240, dock: 'left' },

            { Class: 'Splitter', dock: 'left', },

            {
                Class: 'Panel',
                dock: 'fill',
                layout: 'dock',
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
                            //{ Class: 'Button', key: 'in', width: 80, text: '导入' },
                            //{ Class: 'Button', key: 'out', width: 80, text: '导出' },
                            { Class: 'Button', key: 'refresh', width: 85, text: '刷新', icon: 'icon-refresh' },
                            { Class: 'Button', key: 'search', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                            { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入物业项目编码、名称', dock: 'right' }
                        ]

                    },

                    {
                        Class: 'Grid',
                        id: 'org-grid',
                        locked: '1',
                        dock: 'fill',
                        columns: [
                            { type: 'no', no: true },
                            { type: 'check', no: true, title: '选择' },
                            { name: 'orgcode', title: '物业项目编码', type: 'textbox', size: 150, align: 'left' },
                            { name: 'orgname', title: '物业项目名称', type: 'textbox', size: 150, align: 'left' },
                            { name: 'sort', title: '顺序号', type: 'number', digits: 0, button: 'none', align: 'right' },
                            { name: 'isuse', title: '有效性', type: 'checkbox', size: 60 },
                            { name: 'remarks', title: '说明', type: 'textbox', size: 500 }
                        ]
                    }


                ]

            }

        ]
    },

    created: function () {

        var txtSearch = this.findById('txtSearch')[0];
        var orgtree = this.findById('org-tree')[0];
        var dataset = new flyingon.DataSet();
        var grid = this.findById('org-grid')[0];

        var nodeId;


        grid.dataset(dataset);


        flyingon.http.get('orgtreeinit').then(function (result) {
            //树加载(节点数据，主键，父键，根节点名称)
            orgtree.load(JSON.parse(result), 'id', 'pid', '');
            orgtree.expandTo();
            orgtree.current(orgtree[0]);
            // orgtree.current(node);    //设置树的当前选中为指定节点（不触发node-click事件）
            // orgtree.scrollTo(node);   //滚动到指定节点（不触发node-click事件）;
            
        });

        orgtree.on('node-click', function (event) {

            var node = event.node,
            current = orgtree.current();

            if (node === current) {
                return;
            }

            if (dataset.getChanges()[0]) {
                flyingon.toast('当前有未保存的数据，请先保存！');
                return false;
            }
            
            refresh(nodeId = node ? node.get('id') : '');
        });


        function refresh(id) {

            flyingon.http.get('org/' + encodeURIComponent(id)).then(function (result) {

                dataset.load(JSON.parse(result));
            });
        };


        this.findById('toolbar').on('click', function (event) {

            switch (event.target.key()) {
                case 'add':
                    //     dataset.push({ id: 'test' });   // 对应字段带默认值；
                    dataset.push({ pid: nodeId, isuse: 1 });
                    dataset.last();
                    break;

                case 'save':
                    saveClick();
                    break;

                case 'delete':
                    deleteClick();
                    break;

                case 'refresh':
                    refresh(nodeId);
                    break;

                case 'search':
                    searchClick();
                    break;
            }
        });

        function saveClick() {

            var rows = dataset.getChanges();
            if (rows.length > 0) {
                flyingon.toast({ text: '正在保存数据，请稍候……', time: 60000, loading: true });
                flyingon.http.post('org', rows.toJSON(true, 'id')).then(function (data) {

                    data = JSON.parse(data);
                    for (var i = rows.length; i--;) {
                        if (rows[i].state === 'add') {
                            rows[i].data.id = data[i].insertId;
                        }
                    };

                    dataset.acceptChanges();
                    flyingon.toast('数据保存成功！');
                });
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
                            logs.push('{"orgname":"' + rows[i].data['orgname'] + '"}');
                        };

                        flyingon.http.put('org', JSON.stringify({ data: keys, log: logs })).then(function () {
                            refresh(nodeId);
                        });
                    };
                });
            };
        };

        function searchClick() {

            flyingon.http.get('org?pid=' + nodeId + '&o=' + txtSearch.value()).then(function (result) {

                dataset.load(JSON.parse(result));
            });

        };

    }


});