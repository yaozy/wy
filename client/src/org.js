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
                            { name: 'provincename', title: '所属省份', type: 'combobox', checked: 'checkbox', popupWidth: 50, size: 80, align: 'left' },
                            { name: 'cityname', title: '所属城市', type: 'combobox', checked: 'checkbox', popupWidth: 120, size: 120, align: 'left' },
                            { name: 'sort', title: '顺序号', type: 'number', digits: 0, button: 'none', size: 60, align: 'right' },
                            { name: 'longitude', title: '经度', type: 'number', digits: 6, button: 'none', align: 'right' },
                            { name: 'latitude', title: '纬度', type: 'number', digits: 6, button: 'none', align: 'right' },
                            { name: 'isuse', title: '有效性', type: 'checkbox', size: 50 },
                            { name: 'remarks', title: '说明', type: 'textbox', size: 200 }
                        ]
                    }


                ]

            }

        ]
    },

    created: function () {

        var cities = {
            '北京': ['北京市'],
            '天津': ['天津市'],
            '河北': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
            '山西': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
            '内蒙古': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
            '辽宁': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
            '吉林': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
            '黑龙江': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
            '上海': ['上海市', '崇明县'],
            '江苏': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
            '浙江': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
            '安徽': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
            '福建': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
            '江西': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
            '山东': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
            '河南': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市'],
            '湖北': ['湖北省直辖县市', '武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州'],
            '湖南': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
            '广东': ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
            '广西': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
            '海南': ['省直辖县级行政区划', '海口市', '三亚市', '三沙市'],
            '重庆': ['重庆市'],
            '四川': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
            '贵州': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
            '云南': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
            '西藏': ['拉萨市', '昌都地区', '山南地区', '日喀则地区', '那曲地区', '阿里地区', '林芝地区'],
            '陕西': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
            '甘肃': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
            '青海': ['西宁市', '海东地区', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
            '宁夏': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
            '新疆': ['乌鲁木齐市', '克拉玛依市', '吐鲁番地区', '哈密地区', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '自治区直辖县级行政区划'],
            '香港': ['香港特别行政区'],
            '澳门': ['澳门特别行政区'],
            '台湾': ['台湾']
        };



        var txtSearch = this.findById('txtSearch')[0];
        var orgtree = this.findById('org-tree')[0];
        var dataset = new flyingon.DataSet();
        var grid = this.findById('org-grid')[0];

        grid.columns(4).items(['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '香港', '澳门', '台湾']);

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


        //选择为“城市”列时
        grid.on('change', function (event) {

            var row = event.target.row;

            if (row) {

                var col = event.target.column.name();

                if (col === 'provincename') {

                    grid.columns(5).items(cities[event.value]);

                }
            }
        })


    }


});