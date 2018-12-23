flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: {
            type: 'dock',
            spacingY: 0
        },

        children: [
            { Class: 'Tree', id: 'org-tree', width: 280, dock: 'left', icon: 'icon-charttype' },

            { Class: 'Splitter', dock: 'left' },

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
                            { Class: 'Button', key: 'refresh', width: 85, text: '刷新', icon: 'icon-refresh' },
                            { Class: 'Button', key: 'search', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                            { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入组织编码，名称', dock: 'right' }
                        ]

                    },

                    {
                        Class: 'Grid',
                        id: 'orgtree-grid',
                        dock: 'fill',
                        locked: '1',
                        columns: [
                            { type: 'no', no: true },
                            { type: 'check', no: true, title: '选择' },
                            { name: 'orgtreecode', title: '组织编码', type: 'textbox', size: 150, align: 'left' },
                            { name: 'orgtreename', title: '组织名称', type: 'textbox', size: 150, align: 'left' },
                            { name: 'sort', title: '顺序号', type: 'number', digits: 0, button: 'none', align: 'right' },
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
        var grid = this.findById('orgtree-grid')[0];
        grid.dataset(dataset);

        var nodeId = '';

        flyingon.http.get('orgtreeinit').then(function (result) {

            result = JSON.parse(result);
            if (result.length > 0) {

                //树加载(节点数据，主键，父键，根节点名称)
                orgtree.load(result, 'id', 'pid', '');
                orgtree.current(orgtree[0]); //设置树的当前选中为指定节点（不触发node-click事件）
                orgtree.expandTo();

                // orgtree.scrollTo(node);   //滚动到指定节点（不触发node-click事件）;

                refresh(nodeId = orgtree[0].get('id'));
            }
            else {

                alert('WARNING:');
            }
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

            //flyingon.http.get('orgtree/' + encodeURIComponent(id)).then(function (result) {
            flyingon.http.get('orgtree?pid=' + id).then(function (result) {
                dataset.load(JSON.parse(result));
            });
        };


        this.findById('toolbar').on('click', function (event) {

            switch (event.target.key()) {
                case 'add':
                    //     dataset.push({ id: 'test' });   // 对应字段带默认值；
                    dataset.push({ pid: nodeId });
                    dataset.last();

                    // orgtree.current().push();
                    break;

                case 'save':
                    saveClick();
                    break;

                case 'delete':
                    deleteClick();
                    break;

                case 'refresh':
                    refreshTree(nodeId);
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
                flyingon.http.post('orgtree', rows.toJSON(true, 'id')).then(function (data) {

                    data = JSON.parse(data);
                    for (var i = rows.length; i--;) {
                        if (rows[i].state === 'add') {
                            rows[i].data.id = data[i].insertId;
                        }
                    };

                    dataset.acceptChanges();
                    flyingon.toast('数据保存成功！');

                    refreshTree(nodeId);
                    
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
                            logs.push('{"orgtreename":"' + rows[i].data['orgtreename'] + '"}');
                        };

                        flyingon.http.put('orgtree', JSON.stringify({ data: keys, log: logs })).then(function (result) {
                            if (result > 0) {
                                var msg = '组织名称为“' + rows[result - 1].data['orgtreename'] + '”有下级关联数据，不能删除，请检查！';
                                flyingon.showMessage('删除失败', msg, 'warn', 'ok');
                            }
                            else {

                                refresh(nodeId);   //刷页面数据
                                refreshTree(nodeId);   //刷树数据
                            }
                        });

                        // var node = orgtree.current();
                        // refreshTree(node);
                    };
                });
            };

        };

        function refreshTree(nodeId) {

            flyingon.http.get('orgtreeinit').then(function (result) {

                result = JSON.parse(result);

                if (result.length > 0) {

                    orgtree.load(result, 'id', 'pid', '');
                    orgtree.expandTo();

                    locateTree(nodeId);

                }
                else {

                    alert('WARNING:');
                }
            });

        };


        function locateTree(id) {

            var node = orgtree.findNode(function (node) {

                if (node.get('id') === id) {
                    return node;
                }
            });

            if (node) {
                orgtree.current(node);
                orgtree.scrollTo(node);
            }
        };

        function searchClick() {

            flyingon.http.get('orgtree?pid=' + nodeId + '&ot=' + txtSearch.value()).then(function (result) {

                dataset.load(JSON.parse(result));
            });

        };

    }


});