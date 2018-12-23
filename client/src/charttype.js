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
                    { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入图表分类名称', dock: 'right' }
                ]

            },

            {
                Class: 'Grid',
                id: 'charttype_grid',
                locked: '1',
                dock: 'fill',
                columns: [
                    { type: 'no', no: true },
                    { type: 'check', no: true, title: '选择' },
                    { name: 'charttypename', title: '图表分类名称', type: 'textbox', size: 150, align: 'left' },
                    { name: 'sort', title: '顺序号', type: 'number', digits: 0, button: 'none', align: 'right' },
                    { name: 'remarks', title: '说明', type: 'textbox', size: 950 }
                ]
            }
        ]

    },



    created: function () {

        var dataset = new flyingon.DataSet();
        var grid = this.findById('charttype_grid')[0];
        var txtSearch = this.findById('txtSearch')[0];

        flyingon.http.get('charttype').then(function (result) {

            dataset.load(JSON.parse(result));
            grid.dataset(dataset);
        });


        this.findById('toolbar').on('click', function (event) {

            switch (event.target.key()) {
                case 'add':
                    dataset.push({ pid: 1 });
                    dataset.last();
                    break;

                case 'save':
                    saveClick();
                    break;

                case 'delete':
                    deleteClick();
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

            var rows = dataset.getChanges();

            if (rows.length > 0) {
                flyingon.toast({ text: '正在保存数据，请稍候……', time: 60000, loading: true });
                flyingon.http.post('charttype', rows.toJSON(true, 'id')).then(function (data) {

                    data = JSON.parse(data);
                    for (var i = rows.length; i--;) {
                        if (rows[i].state === 'add') {
                            rows[i].data.id = data[i].insertId;
                        }
                    }

                    dataset.acceptChanges();
                    flyingon.toast('数据保存成功！');
                });

            }
        };

        //删除表格行
        function deleteClick() {

            var rows = grid.checkedRows();

            if (rows.length > 0) {

                flyingon.showMessage('删除', '确定要删除选中的数据？', 'warn', 'ok,cancel').on('closed', function (e) {

                    if (e.closeType === 'ok') {

                        var keys = [], logs = [];
                        for (var i = 0, l = rows.length; i < l; i++) {
                            keys.push(rows[i].data['id']);
                            logs.push('{"charttypename":"' + rows[i].data['charttypename'] + '"}');
                        };

                        flyingon.http.put('charttype', JSON.stringify({ data: keys, log: logs })).then(function (result) {

                            if (result > 0) {
                                var msg = '图表分类名称为“' + rows[result - 1].data['charttypename'] + '”有下级关联数据，不能删除，请检查！';
                                flyingon.showMessage('删除失败', msg, 'warn', 'ok');
                            }
                            else {
                                grid.removeCheckedRows();
                                //refreshClick();
                            };

                        });
                    };
                });

            };

        };

        //刷新
        function refreshClick() {
            flyingon.http.get('charttype').then(function (result) {

                dataset.load(JSON.parse(result));
            });
        };


        //查询
        function searchClick() {
            flyingon.http.get('charttype/' + encodeURIComponent(txtSearch.value())).then(function (result) {

                dataset.load(JSON.parse(result));
            });
        };


    }

});