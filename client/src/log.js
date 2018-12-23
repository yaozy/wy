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
                height: 34,
                layout: 'dock',
                padding: '0 0 8 0',
                dock: 'top',
                fontSize: '12px',
                children: [
                    { Class: 'Label', text: '日志类型' },
                    { Class: 'ComboBox', id: 'chkLogtype', checked: 'checkbox', items: '登录 新增 修改 删除'.split(' '), width: 150, value: '' },
                    { Class: 'Label', text: '操作时间' },
                    { Class: 'Date', id: 'beginDate', width: 150, today: true, clear: true, time: true },
                    //{ Class: 'Time', id: 'begTime', width: 80, value: '0:0:0' },
                    { Class: 'Label', width: 20, text: '～' },
                    { Class: 'Date', id: 'endDate', width: 150, today: true, clear: true, time: true },
                    //{ Class: 'Time', id: 'endTime', width: 80, value: '23:59:59' },
                    { Class: 'Button', id: 'btnSearch', text: '查询', width: 65, dock: 'right', icon: 'icon-search' },
                    { Class: 'TextBox', id: 'txtSearch', width: 200, placeholder: '请输入操作员、日志内容', dock: 'right' }
                ]

            },

            //滚动条
            // {
            //     Class: 'Pagination',
            //     id: 'pageControl',
            //     dock: 'bottom',
            //     total: 1000,
            //     records: 5000
            // },
            {
                Class: 'Grid',
                id: 'log-grid',
                dock: 'fill',
                locked: '1',
                group: 35, //分组框高度
                // groups: 'type', //设置默认分组
                columns: [
                    { type: 'no', no: true },
                    { name: 'type', title: '日志类型', size: 120, align: 'left' },
                    { name: 'logby', title: '操作人', size: 120, align: 'left' },
                    { name: 'time', title: '操作时间', size: 180, align: 'left' },
                    { name: 'text', title: '日志内容', size: 600 }
                ]
            }
        ]
    },


    created: function () {


        var txt = this.findById('txtSearch')[0];
        var logType = this.findById('chkLogtype')[0];
        var dateB = this.findById('beginDate')[0];
        var dateE = this.findById('endDate')[0];

        var grid = this.findById('log-grid')[0];
        var dataset = new flyingon.DataSet();
        grid.dataset(dataset);

        flyingon.http.get('log').then(function (result) {

            dataset.load(JSON.parse(result));
        });




        this.findById('btnSearch').on('click', function (e) {

            //debugger;

            var array = [],
                value;

            if (value = logType.value()) {
                array.push('l=' + encodeURIComponent(logType.value().replace(/\,/g, '|')));
            }

            if (value = dateB.value()) {
                array.push('s=' + value.getTime());
            }

            if (value = dateE.value()) {
                array.push('e=' + value.getTime());
            }

            if (value = txt.value()) {
                array.push('t=' + encodeURIComponent(txt.value()));
            }

            flyingon.http.get(array[0] ? 'log?' + array.join('&') : 'log').then(function (result) {
                dataset.load(JSON.parse(result));
            });
        });


        //this.findById('pageControl')[0].records = 20;

    }


});