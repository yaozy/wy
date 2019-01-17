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

        for (var i = data.length; i--;) {
            array[i] = data[i][field];
        }

        return array;
    }


    function fieldMaps(data, category, value) {

        var array = [];

        if (category instanceof Array) {
            category = category[0];
        }

        if (value instanceof Array) {
            value = value[0];
        }

        for (var i = data.length; i--;) {
            array[i] = { name: data[i][category], value: data[i][value] };
        }

        return array;
    }


    this.setData = function (dataset) {

        var template = this.template,
            data = dataset[this.table],
            any;

        if (!data) {
            flyingon.showMessage('图表配置错误', 'table "' + this.table + '"不存在!', 'information', 'ok');
            return;
        }

        if ((any = template.xAxis) && any.type === 'category') {
            any.data = fieldValues(data, template.category);
        }
        else if ((any = template.yAxis) && any.type === 'category') {
            any.data = fieldValues(data, template.category);
        }

        if (any = template.series) {
            var valueFields = template.valueFields;

            if (!(any instanceof Array)) {
                any = template.series = [];

                for (var i = valueFields.length; i--;) {
                    any[i] = Object.assign({}, any);
                    any[i].name = valueFields[i];
                }
            }

            for (var i = any.length; i--;) {
                if (any[i].type === 'pie') {
                    any[i].data = fieldMaps(data, template.category, template.value);
                }
                else {
                    any[i].data = fieldValues(data, any[i].name);
                }
            }
        }

        setTimeout(function () {

            (this.chart || (this.chart = echarts.init(this.view))).setOption(template);

        }.bind(this));
    }


    this.refreshChart = function () {

        if (this.chart) {
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

        if (table && field && (table = dataset[table])) {
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

        if (control.length > 0 && control.__visible) {
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



flyingon.Control.extend('HomeMap', function () {


    var maps = function (keys) {

        var data = [];

        for (var name in keys) {
            data.push({
                name: name,
                file: 'map/' + keys[name] + '.json'
            });
        }

        return data;

    }({
        '北京': 'province/beijing',
        '北京市': 'city/110100',

        '天津': 'province/tianjin',
        '天津市': 'city/120100',

        '河北': 'province/hebei',
        '石家庄市': 'city/130100',
        '唐山市': 'city/130200',
        '秦皇岛市': 'city/130300',
        '邯郸市': 'city/130400',
        '邢台市': 'city/130500',
        '保定市': 'city/130600',
        '张家口市': 'city/130700',
        '承德市': 'city/130800',
        '沧州市': 'city/130900',
        '廊坊市': 'city/131000',
        '衡水市': 'city/131100',

        '山西': 'province/shanxi',
        '太原市': 'city/140100',
        '大同市': 'city/140200',
        '阳泉市': 'city/140300',
        '长治市': 'city/140400',
        '晋城市': 'city/140500',
        '朔州市': 'city/140600',
        '晋中市': 'city/140700',
        '运城市': 'city/140800',
        '忻州市': 'city/140900',
        '临汾市': 'city/141000',
        '吕梁市': 'city/141100',

        '内蒙古': 'province/neimenggu',
        '呼和浩特市': 'city/150100',
        '包头市': 'city/150200',
        '乌海市': 'city/150300',
        '赤峰市': 'city/150400',
        '通辽市': 'city/150500',
        '鄂尔多斯市': 'city/150600',
        '呼伦贝尔市': 'city/150700',
        '巴彦淖尔市': 'city/150800',
        '乌兰察布市': 'city/150900',
        '兴安盟': 'city/152200',
        '锡林郭勒盟': 'city/152500',
        '阿拉善盟': 'city/152900',

        '辽宁': 'province/liaoning',
        '沈阳市': 'city/210100',
        '大连市': 'city/210200',
        '鞍山市': 'city/210300',
        '抚顺市': 'city/210400',
        '本溪市': 'city/210500',
        '丹东市': 'city/210600',
        '锦州市': 'city/210700',
        '营口市': 'city/210800',
        '阜新市': 'city/210900',
        '辽阳市': 'city/211000',
        '盘锦市': 'city/211100',
        '铁岭市': 'city/211200',
        '朝阳市': 'city/211300',
        '葫芦岛市': 'city/211400',

        '吉林': 'province/jilin',
        '长春市': 'city/220100',
        '吉林市': 'city/220200',
        '四平市': 'city/220300',
        '辽源市': 'city/220400',
        '通化市': 'city/220500',
        '白山市': 'city/220600',
        '松原市': 'city/220700',
        '白城市': 'city/220800',
        '延边朝鲜族自治州': 'city/222400',

        '黑龙江': 'province/heilongjiang',
        '哈尔滨市': 'city/230100',
        '齐齐哈尔市': 'city/230200',
        '鸡西市': 'city/230300',
        '鹤岗市': 'city/230400',
        '双鸭山市': 'city/230500',
        '大庆市': 'city/230600',
        '伊春市': 'city/230700',
        '佳木斯市': 'city/230800',
        '七台河市': 'city/230900',
        '牡丹江市': 'city/231000',
        '黑河市': 'city/231100',
        '绥化市': 'city/231200',
        '大兴安岭地区': 'city/232700',

        '上海': 'province/shanghai',
        '上海市': 'city/310100',
        '崇明县': 'city/310200',

        '江苏': 'province/jiangsu',
        '南京市': 'city/320100',
        '无锡市': 'city/320200',
        '徐州市': 'city/320300',
        '常州市': 'city/320400',
        '苏州市': 'city/320500',
        '南通市': 'city/320600',
        '连云港市': 'city/320700',
        '淮安市': 'city/320800',
        '盐城市': 'city/320900',
        '扬州市': 'city/321000',
        '镇江市': 'city/321100',
        '泰州市': 'city/321200',
        '宿迁市': 'city/321300',

        '浙江': 'province/zhejiang',
        '杭州市': 'city/330100',
        '宁波市': 'city/330200',
        '温州市': 'city/330300',
        '嘉兴市': 'city/330400',
        '湖州市': 'city/330500',
        '绍兴市': 'city/330600',
        '金华市': 'city/330700',
        '衢州市': 'city/330800',
        '舟山市': 'city/330900',
        '台州市': 'city/331000',
        '丽水市': 'city/331100',

        '安徽': 'province/anhui',
        '合肥市': 'city/340100',
        '芜湖市': 'city/340200',
        '蚌埠市': 'city/340300',
        '淮南市': 'city/340400',
        '马鞍山市': 'city/340500',
        '淮北市': 'city/340600',
        '铜陵市': 'city/340700',
        '安庆市': 'city/340800',
        '黄山市': 'city/341000',
        '滁州市': 'city/341100',
        '阜阳市': 'city/341200',
        '宿州市': 'city/341300',
        '六安市': 'city/341500',
        '亳州市': 'city/341600',
        '池州市': 'city/341700',
        '宣城市': 'city/341800',

        '福建': 'province/fujian',
        '福州市': 'city/350100',
        '厦门市': 'city/350200',
        '莆田市': 'city/350300',
        '三明市': 'city/350400',
        '泉州市': 'city/350500',
        '漳州市': 'city/350600',
        '南平市': 'city/350700',
        '龙岩市': 'city/350800',
        '宁德市': 'city/350900',

        '江西': 'province/jiangxi',
        '南昌市': 'city/360100',
        '景德镇市': 'city/360200',
        '萍乡市': 'city/360300',
        '九江市': 'city/360400',
        '新余市': 'city/360500',
        '鹰潭市': 'city/360600',
        '赣州市': 'city/360700',
        '吉安市': 'city/360800',
        '宜春市': 'city/360900',
        '抚州市': 'city/361000',
        '上饶市': 'city/361100',

        '山东': 'province/shandong',
        '济南市': 'city/370100',
        '青岛市': 'city/370200',
        '淄博市': 'city/370300',
        '枣庄市': 'city/370400',
        '东营市': 'city/370500',
        '烟台市': 'city/370600',
        '潍坊市': 'city/370700',
        '济宁市': 'city/370800',
        '泰安市': 'city/370900',
        '威海市': 'city/371000',
        '日照市': 'city/371100',
        '莱芜市': 'city/371200',
        '临沂市': 'city/371300',
        '德州市': 'city/371400',
        '聊城市': 'city/371500',
        '滨州市': 'city/371600',
        '菏泽市': 'city/371700',

        '河南': 'province/henan',
        '郑州市': 'city/410100',
        '开封市': 'city/410200',
        '洛阳市': 'city/410300',
        '平顶山市': 'city/410400',
        '安阳市': 'city/410500',
        '鹤壁市': 'city/410600',
        '新乡市': 'city/410700',
        '焦作市': 'city/410800',
        '濮阳市': 'city/410900',
        '许昌市': 'city/411000',
        '漯河市': 'city/411100',
        '三门峡市': 'city/411200',
        '南阳市': 'city/411300',
        '商丘市': 'city/411400',
        '信阳市': 'city/411500',
        '周口市': 'city/411600',
        '驻马店市': 'city/411700',

        '湖北': 'province/hubei',
        '湖北省直辖县市': 'city/429000',
        '武汉市': 'city/420100',
        '黄石市': 'city/420200',
        '十堰市': 'city/420300',
        '宜昌市': 'city/420500',
        '襄阳市': 'city/420600',
        '鄂州市': 'city/420700',
        '荆门市': 'city/420800',
        '孝感市': 'city/420900',
        '荆州市': 'city/421000',
        '黄冈市': 'city/421100',
        '咸宁市': 'city/421200',
        '随州市': 'city/421300',
        '恩施土家族苗族自治州': 'city/422800',

        '湖南': 'province/hunan',
        '长沙市': 'city/430100',
        '株洲市': 'city/430200',
        '湘潭市': 'city/430300',
        '衡阳市': 'city/430400',
        '邵阳市': 'city/430500',
        '岳阳市': 'city/430600',
        '常德市': 'city/430700',
        '张家界市': 'city/430800',
        '益阳市': 'city/430900',
        '郴州市': 'city/431000',
        '永州市': 'city/431100',
        '怀化市': 'city/431200',
        '娄底市': 'city/431300',
        '湘西土家族苗族自治州': 'city/433100',

        '广东': 'province/guangdong',
        '广州市': 'city/440100',
        '韶关市': 'city/440200',
        '深圳市': 'city/440300',
        '珠海市': 'city/440400',
        '汕头市': 'city/440500',
        '佛山市': 'city/440600',
        '江门市': 'city/440700',
        '湛江市': 'city/440800',
        '茂名市': 'city/440900',
        '肇庆市': 'city/441200',
        '惠州市': 'city/441300',
        '梅州市': 'city/441400',
        '汕尾市': 'city/441500',
        '河源市': 'city/441600',
        '阳江市': 'city/441700',
        '清远市': 'city/441800',
        '东莞市': 'city/441900',
        '中山市': 'city/442000',
        '潮州市': 'city/445100',
        '揭阳市': 'city/445200',
        '云浮市': 'city/445300',

        '广西': 'province/guangxi',
        '南宁市': 'city/450100',
        '柳州市': 'city/450200',
        '桂林市': 'city/450300',
        '梧州市': 'city/450400',
        '北海市': 'city/450500',
        '防城港市': 'city/450600',
        '钦州市': 'city/450700',
        '贵港市': 'city/450800',
        '玉林市': 'city/450900',
        '百色市': 'city/451000',
        '贺州市': 'city/451100',
        '河池市': 'city/451200',
        '来宾市': 'city/451300',
        '崇左市': 'city/451400',

        '海南': 'province/hainan',
        '省直辖县级行政区划': 'city/469000',
        '海口市': 'city/460100',
        '三亚市': 'city/460200',
        '三沙市': 'city/460300',

        '重庆': 'province/chongqing',
        '重庆市': 'city/500100',

        '四川': 'province/sichuan',
        '成都市': 'city/510100',
        '自贡市': 'city/510300',
        '攀枝花市': 'city/510400',
        '泸州市': 'city/510500',
        '德阳市': 'city/510600',
        '绵阳市': 'city/510700',
        '广元市': 'city/510800',
        '遂宁市': 'city/510900',
        '内江市': 'city/511000',
        '乐山市': 'city/511100',
        '南充市': 'city/511300',
        '眉山市': 'city/511400',
        '宜宾市': 'city/511500',
        '广安市': 'city/511600',
        '达州市': 'city/511700',
        '雅安市': 'city/511800',
        '巴中市': 'city/511900',
        '资阳市': 'city/512000',
        '阿坝藏族羌族自治州': 'city/513200',
        '甘孜藏族自治州': 'city/513300',
        '凉山彝族自治州': 'city/513400',

        '贵州': 'province/guizhou',
        '贵阳市': 'city/520100',
        '六盘水市': 'city/520200',
        '遵义市': 'city/520300',
        '安顺市': 'city/520400',
        '毕节市': 'city/520500',
        '铜仁市': 'city/520600',
        '黔西南布依族苗族自治州': 'city/522300',
        '黔东南苗族侗族自治州': 'city/522600',
        '黔南布依族苗族自治州': 'city/522700',

        '云南': 'province/yunnan',
        '昆明市': 'city/530100',
        '曲靖市': 'city/530300',
        '玉溪市': 'city/530400',
        '保山市': 'city/530500',
        '昭通市': 'city/530600',
        '丽江市': 'city/530700',
        '普洱市': 'city/530800',
        '临沧市': 'city/530900',
        '楚雄彝族自治州': 'city/532300',
        '红河哈尼族彝族自治州': 'city/532500',
        '文山壮族苗族自治州': 'city/532600',
        '西双版纳傣族自治州': 'city/532800',
        '大理白族自治州': 'city/532900',
        '德宏傣族景颇族自治州': 'city/533100',
        '怒江傈僳族自治州': 'city/533300',
        '迪庆藏族自治州': 'city/533400',

        '西藏': 'province/xizang',
        '拉萨市': 'city/540100',
        '昌都地区': 'city/542100',
        '山南地区': 'city/542200',
        '日喀则地区': 'city/542300',
        '那曲地区': 'city/542400',
        '阿里地区': 'city/542500',
        '林芝地区': 'city/542600',

        '陕西': 'province/shanxi1',
        '西安市': 'city/610100',
        '铜川市': 'city/610200',
        '宝鸡市': 'city/610300',
        '咸阳市': 'city/610400',
        '渭南市': 'city/610500',
        '延安市': 'city/610600',
        '汉中市': 'city/610700',
        '榆林市': 'city/610800',
        '安康市': 'city/610900',
        '商洛市': 'city/611000',

        '甘肃': 'province/gansu',
        '兰州市': 'city/620100',
        '嘉峪关市': 'city/620200',
        '金昌市': 'city/620300',
        '白银市': 'city/620400',
        '天水市': 'city/620500',
        '武威市': 'city/620600',
        '张掖市': 'city/620700',
        '平凉市': 'city/620800',
        '酒泉市': 'city/620900',
        '庆阳市': 'city/621000',
        '定西市': 'city/621100',
        '陇南市': 'city/621200',
        '临夏回族自治州': 'city/622900',
        '甘南藏族自治州': 'city/623000',

        '青海': 'province/qinghai',
        '西宁市': 'city/630100',
        '海东地区': 'city/632100',
        '海北藏族自治州': 'city/632200',
        '黄南藏族自治州': 'city/632300',
        '海南藏族自治州': 'city/632500',
        '果洛藏族自治州': 'city/632600',
        '玉树藏族自治州': 'city/632700',
        '海西蒙古族藏族自治州': 'city/632800',

        '宁夏': 'province/ningxia',
        '银川市': 'city/640100',
        '石嘴山市': 'city/640200',
        '吴忠市': 'city/640300',
        '固原市': 'city/640400',
        '中卫市': 'city/640500',

        '新疆': 'province/xinjiang',
        '乌鲁木齐市': 'city/650100',
        '克拉玛依市': 'city/650200',
        '吐鲁番地区': 'city/652100',
        '哈密地区': 'city/652200',
        '昌吉回族自治州': 'city/652300',
        '博尔塔拉蒙古自治州': 'city/652700',
        '巴音郭楞蒙古自治州': 'city/652800',
        '阿克苏地区': 'city/652900',
        '克孜勒苏柯尔克孜自治州': 'city/653000',
        '喀什地区': 'city/653100',
        '和田地区': 'city/653200',
        '伊犁哈萨克自治州': 'city/654000',
        '塔城地区': 'city/654200',
        '阿勒泰地区': 'city/654300',
        '自治区直辖县级行政区划': 'city/659000',

        '香港': 'province/xianggang',
        '香港特别行政区': 'city/810100',

        '澳门': 'province/aomen',
        '澳门特别行政区': 'city/820000',

        '台湾省': 'city/710000'
    });


    var cache = Object.create(null);



    this.onmount = function (dom) {

        var self = this,
            stack = [];

        this.on('click', function () {

            if (stack[3]) {
                stack.length -= 2;
                load(self, null, stack[stack.length - 2], stack[stack.length - 1]);
            }
        });

        setTimeout(function () {

            var chart = self.chart = echarts.init(self.view);

            load(self, stack, 'map/china.json', '');

            chart.on('click', function (params) {

                var file;

                if (params.data && (file = params.data.file)) {
                    load(self, stack, file, params.name);
                }

                params.event.event.stopPropagation();
            });

        }, 0);
    }


    function load(self, stack, file, text) {

        var data;

        if (stack) {
            stack.push(file, text);
        }

        if (data = cache[file]) {
            show(self, file, text, data);
            return;
        }

        flyingon.http.get(file).then(function (data) {

            show(self, file, text, cache[file] = JSON.parse(data));
        });
    }


    function show(self, file, text, data) {

        echarts.registerMap(file, data);

        self.chart.setOption({
            title: {
                text: text
            },
            series: [{
                type: 'map',
                mapType: file,
                data: maps
            }]
        });
    }



    this.refreshChart = function () {

        if (this.chart) {
            this.chart.resize();
        }
    }



}).register();



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

        if (control.length > 0 && control.__visible) {
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
                //height: 118,
                height: 85,
                dock: 'top',
                children: [
                    // {
                    //     Class: 'DigitalTime',
                    //     margin: '6 0 0 8',
                    //     width: '100%',
                    //     textAlign: 'left',
                    //     fontSize: '20px'
                    // },
                    {
                        Class: 'Label',
                        text: '顺彩BI智能分析平台',
                        width: '100%',
                        height: 60,
                        margin: '12 0',
                        textAlign: 'center',
                        fontSize: '24px'
                    }
                    // },
                    // {
                    //     Class: 'DigitalTime',
                    //     width: '100%',
                    //     textAlign: 'center',
                    //     fontSize: '20px'
                    // }
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

            while (target && target !== this) {
                if (url = target.url) {
                    if (checkUrl(globals.menutree, url)) {
                        location.hash = '!' + url;
                    }
                    else {
                        flyingon.showMessage('提醒', '您没有查看此图表的权限!', 'information', 'ok');
                    }

                    return;
                }

                target = target.parent;
            }
        });



        function checkResize() {

            var value = host.offsetWidth << 8 + host.offsetHeight;

            if (value !== size) {
                if (size > 0) {
                    var controls = [];

                    findControls(host, 'refreshChart', controls);

                    for (var i = controls.length; i--;) {
                        controls[i].refreshChart();
                    }
                }

                size = value;
            }

            timeout = setTimeout(checkResize, 100);
        }


        function refresh() {

            if (timeout) {
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

            for (var i = controls.length; i--;) {
                controls[i].setData(data);
            }

            timeout = setTimeout(checkResize, 100);
        }


        function findControls(parent, name, outputs) {

            for (var i = parent.length; i--;) {
                if (parent[i][name]) {
                    outputs.push(parent[i]);
                }
                else if (parent[i].length > 0) {
                    findControls(parent[i], name, outputs);
                }
            }
        }



        function checkUrl(list, url) {

            for (var i = list.length; i--;) {
                var item = list[i];

                if (item.url === url) {
                    return true;
                }

                if (item.children && checkUrl(item.children, url)) {
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

        if (computed) {
            this.computed = computed = eval(computed);

            for (var i = data.length; i--;) {
                for (var name in computed) {
                    data[i][name] = computed[name](data[i]);
                }
            }
        }
        else {
            this.valueFields = valueFields;
            this.computed = null;
        }
    }


    // 解析计算字段(移除计算字段)
    this.praseComputed = function (target, valueFields) {

        var computed = this.computed,
            computedFields;

        if (valueFields) {
            valueFields = valueFields.slice(0);

            if (computed) {
                for (var i = valueFields.length; i--;) {
                    var name = valueFields[i];

                    if (computed[name]) {
                        valueFields.splice(i, 1);
                        (computedFields || (computedFields = Object.create(null)))[name] = computed[name];
                    }
                }
            }
        }
        else {
            valueFields = [];
        }

        target.valueFields = valueFields;
        target.computedFields = computedFields;
    }


    // 计算分组值
    this.computeValues = function (target, data, valueFields, computedFields) {

        var decimal = Decimal.singleton(0),
            field;

        for (var i = valueFields.length; i--;) {
            field = valueFields[i];
            decimal.v = decimal.d = 0;

            for (var j = data.length; j--;) {
                decimal.plus(data[j][field]);
            }

            target[field] = decimal.value;
        }

        if (computedFields) {
            for (field in computedFields) {
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

        if ((length = categoryFields.length) > 1) {
            any = new Array(length);

            for (var i = 0, l = data.length; i < l; i++) {
                item = data[i];

                for (var j = length; j--;) {
                    any[j] = item[categoryFields[j]];
                }

                if (group = keys[key = any.join('-')]) {
                    group.__data.push(item);
                }
                else {
                    groups.push(group = keys[key] = {
                        __by: key,
                        __data: [item]
                    });

                    for (var j = length; j--;) {
                        group[categoryFields[j]] = any[j];
                    }
                }
            }
        }
        else {
            categoryFields = categoryFields[0];

            for (var i = 0, l = data.length; i < l; i++) {
                item = data[i];

                if (group = keys[key = item[categoryFields]]) {
                    group.__data.push(item);
                }
                else {
                    groups.push(group = keys[key] = {
                        __by: key,
                        __data: [item]
                    });

                    group[categoryFields] = key;
                }
            }
        }

        for (var i = groups.length; i--;) {
            this.computeValues(groups[i], groups[i].__data, valueFields, computedFields);
        }

        return groups;
    }


    this.sortCategory = function (data, categoryFields, desc) {


    }


    this.sortData = function (data, name, desc) {

        if (name) {
            if (desc) {
                data.sort(function (a, b) {

                    a = a[name];
                    b = b[name];

                    if (a > b) {
                        return 1;
                    }

                    return a < b ? -1 : 0;
                });
            }
            else {
                data.sort(function (a, b) {

                    a = a[name];
                    b = b[name];

                    if (a > b) {
                        return -1;
                    }

                    return a < b ? 1 : 0;
                });
            }
        }
        else if (desc) {
            data.sort(function (a, b) {

                return -('' + a.__by).localeCompare(b.__by, 'zh');
            });
        }
        else {
            data.sort(function (a, b) {

                return ('' + a.__by).localeCompare(b.__by, 'zh');
            });
        }
    }



    function fieldValues(data, field) {

        var array = [];

        for (var i = data.length; i--;) {
            array[i] = data[i][field];
        }

        return array;
    }


    this.show = function (option, data, valueFields, sort, desc) {

        var any;

        this.sortData(data, sort, desc);

        if ((any = option.xAxis) && any.type === 'category') {
            any.data = fieldValues(data, '__by');
        }
        else if ((any = option.yAxis) && any.type === 'category') {
            any.data = fieldValues(data, '__by');
        }

        if (any = option.series) {
            var array = any;

            if (!(array instanceof Array)) {
                array = option.series = [];

                for (var i = valueFields.length; i--;) {
                    array[i] = Object.assign({}, any);
                    array[i].name = valueFields[i];
                }
            }

            for (var i = array.length; i--;) {
                array[i].data = fieldValues(data, array[i].name);
            }
        }

        if (!(any = this.chart)) {
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

        if (show) {
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

            if (categoryBox.value()) {
                flyingon.showMessage('提醒', '选择了分组时不能往下钻取!', 'information', 'ok');
                return;
            }

            if ((key = event.chart) && (key = key.name)) {
                drilldownClick(key);
            }
        });


        toolbar.on('click', function (event) {

            switch (event.target.get('key')) {
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

            if ((sortField = sortBox.value()) === defaultSort) {
                sortField = '';
            }

            chart.switchSort(sortField, sortDesc);
        });



        function drilldownClick(key) {

            var last = drilldownStack[drilldownStack.length - 1],
                groups = last.keys[key];

            if (groups && groups.__list[0]) {
                pushDrilldown(last.dimension, last.index + 1, key, groups);
                refreshChart(true);
            }
            else {
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

            try {
                data = data && JSON.parse(data);
            }
            catch (e) {
                flyingon.toast.hide();
                flyingon.showMessage('错误', '图表配置错误, 无法正确解析配置的数据!\n\n错误信息:\n' + e.message, 'error', 'ok');
                return;
            }

            if (!data) {
                flyingon.toast.hide();
                flyingon.showMessage('错误', '未配置图表, 请检查!', 'error', 'ok');
                return;
            }

            try {
                var options = data[0],
                    view = dimensionHost.view;

                // 默认选中第一个维度
                if (view = view && view.querySelector('input[type="radio"]')) {
                    view.checked = true;
                }

                dimensionList.length = drilldownStack.length = 0;

                pathHost.text('');

                categoryBox.clear();

                // 数组模板为钻取图表
                if (options instanceof Array) {
                    // 获取列配置
                    columns = options[0];
                    options.shift();

                    // 编译用到的统计字段
                    chart.compileComputed(data[1], data[2]);
                    options.shift();

                    parseColumns(columns);

                    initDimension(dimensionList = options, data[2]);
                }
                else {
                    chart.compileComputed(data[1], data[2]);

                    categoryBox.items(options.category || []);

                    sortBox.items([defaultSort].concat(options.value));
                    sortBox.value(defaultSort);

                    options.data = data[2];
                    nodrilldown = options;

                    parseColumns(options.fields);

                    if (host[1]) {
                        host[0].remove();
                    }

                    if (dimension.grid) {
                        host.splice(0, 0, dimension.grid);
                        flyingon.__update_patch();
                    }

                    refreshChart();
                }
            }
            finally {
                flyingon.toast.hide();
            }
        }


        function initDimension(dimensions, data) {

            var array = [],
                name = 'c' + chart.chartId;

            dimensions.index = 0;

            for (var i = 0, l = dimensions.length; i < l; i++) {
                var dimension = dimensions[i],
                    field = dimension.field;

                array.push('<label style="margin:0 6px;">',
                    '<input type="radio" index="', i,
                    '" name="', name,
                    '" style="margin:0;vertical-align:middle;"',
                    i === 0 ? ' checked="checked"' : '', ' />',
                    '<span>', dimensions[i].text, '</span>',
                    '</label>');

                if (field instanceof Array) {
                    if (!field[0] || !field[1]) {
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

            if (!groups) {
                groups = dimension.groups = dimension.fields ? drilldownFields(dimension, data) : drilldownField(dimension, data);

                chart.praseComputed(dimension, dimension.value);
                computeDrilldown(groups, dimension.valueFields, dimension.computedFields, chart.computeValues);
            }

            if (host[1]) {
                host[0].remove();
            }

            if (dimension.grid) {
                host.splice(0, 0, dimension.grid);
                flyingon.__update_patch();
            }

            pathHost.text('');
            categoryBox.items(dimension.category || []);

            // 添加分组起点
            pushDrilldown(dimension, 0, '起点', groups);

            // 只有一个项继续往下钻
            if (dimension.skipstart) {
                var index = 1;

                while ((groups = groups.__list).length === 1) {
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

            for (var i = 0, l = data.length; i < l; i++) {
                if (key = (item = data[i])[field]) {
                    list = key.split(split);

                    if (any = keys[key = list[0]]) {
                        group = any;
                        group.__data.push(item);
                    }
                    else {
                        groups.push(group = keys[key] = {
                            __by: key,
                            __keys: Object.create(null),
                            __data: [item],
                            __list: []
                        });

                        group[field] = key;
                    }

                    for (var j = 1, l2 = list.length; j < l2; j++) {
                        if (any = group.__keys[key = list[j]]) {
                            group = any;
                            group.__data.push(item);
                        }
                        else {
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

            for (var i = 0, l = data.length; i < l; i++) {
                item = data[i];

                if (any = keys[key = item[field]]) {
                    group = any;
                    group.__data.push(item);
                }
                else {
                    groups.push(group = keys[key] = {
                        __by: key,
                        __keys: Object.create(null),
                        __data: [item],
                        __list: []
                    });

                    group[field] = key;
                }

                for (var j = 1; j < length; j++) {
                    if (any = group.__keys[key = item[fields[j]]]) {
                        group = any;
                        group.__data.push(item);
                    }
                    else {
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

            for (var i = list.length; i--;) {
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

            if (target.nodeType !== 1) {
                target = target.parentNode;
            }

            var index = target.getAttribute('index');

            if (index) {
                var any;

                target = target.parentNode;

                while (any = target.nextSibling) {
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

            if (dimension) {
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
            if (last = nodrilldown) {
                renderFilter(chartData = last.data);

                if (category) {
                    data = chart.computeGroup(chartData, category, last.valueFields, last.computedFields);
                }
                else {
                    data = chartData;
                }
            }
            else if (last = drilldownStack[drilldownStack.length - 1]) {
                renderFilter(chartData = last.data);

                if (category) {
                    last = last.dimension;
                    data = chart.computeGroup(chartData, category, last.valueFields, last.computedFields);
                }
                else {
                    data = last.groups;
                    last = last.dimension;
                }
            }

            chart.show(last.template, data, last.value, sortField, sortDesc);

            if (host[1]) {
                refreshGrid(last.value, data);
            }
        }


        function refreshFilter() {

            var category = categoryBox.value(),
                last,
                data;

            // 非钻取图表
            if (last = nodrilldown) {
                syncFilter(chartData = filterData(last.data));

                if (category) {
                    data = chart.computeGroup(chartData, category, last.valueFields, last.computedFields);
                }
            }
            else if (last = drilldownStack[drilldownStack.length - 1]) {
                var dimension = last.dimension;

                if (category) {
                    syncFilter(chartData = filterData(last.data));
                    data = chart.computeGroup(chartData, category, dimension.valueFields, dimension.computedFields);
                }
                else {
                    chartData && (chartData.length = 0);
                    data = filterGroup(last.groups, last.field, dimension.valueFields, dimension.computedFields, chart.computeValues, chartData);
                }

                last = dimension;
            }

            chart.show(last.template, data, last.value, sortField, sortDesc);

            if (host[1]) {
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

            if (category) {
                category = category.split(',');

                for (var i = 0, l = category.length; i < l; i++) {
                    if (column = findColumn(columns, category[i])) {
                        column = Object.assign({}, column);
                        column.merge = 1;

                        total += column.size;
                        list.push(column);
                    }
                }
            }
            else {
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

            for (var i = 0, l = columns.length; i < l; i++) {
                if (valueFields.indexOf(columns[i].name) >= 0) {
                    column = Object.assign({}, columns[i]);

                    total += column.size;
                    list.push(column);
                }
            }

            total = (grid.offsetWidth - 60) / total;

            for (var i = 1, l = list.length; i < l; i++) {
                list[i].size = list[i].size * total | 0;
            }

            grid.columns(list);
            grid.dataset(dataset);
        }


        function findColumn(columns, name) {

            for (var i = columns.length; i--;) {
                if (columns[i].name === name) {
                    return columns[i];
                }
            }
        }


        function filterGroup(groups, field, valueFields, computedFields, fn, chartData) {

            var list = [],
                all = [];

            for (var i = groups.length; i--;) {
                var item = groups[i],
                    data = filterData(item.__data);

                if (data.length > 0) {
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
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];

                for (var name in keys) {
                    if (keys[name][item[name]]) {
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

            for (var i = 0, l = items.length; i < l; i++) {
                name = items[i];

                if (text.indexOf(name) >= 0) {
                    continue;
                }

                if (html = renderFilterHtml(data, name)) {
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

            for (var i = 0, l = data.length; i < l; i++) {
                text = data[i][field];

                if (!keys[text]) {
                    keys[text] = true;
                    list.push(text);
                }
            }

            if (list.length > 1) {
                list.sort(localeCompare);
            }

            return list;
        }


        function renderFilterHtml(data, field) {

            var list = categoryValues(data, field);

            if (list.length > 0) {
                for (var i = list.length; i--;) {
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

            if (!dom.checked) {
                if (keys) {
                    any = keys[type] || (keys[type] = {});
                }
                else {
                    keys = filterKeys = {};
                    keys[type] = any = {};
                }

                any[key] = 1;
            }
            else if (keys && (any = keys[type])) {
                delete any[key];
            }

            if (filterDelay) {
                clearTimeout(filterDelay);
            }

            filterDelay = setTimeout(refreshFilter, 500);
        }


        function filterClick(event) {

            var dom = event.target,
                box,
                key;

            while (dom && (dom.nodeType !== 1 || !(key = dom.getAttribute('key')))) {
                dom = dom.parentNode;
            }

            if (box = dom && dom.parentNode) {
                while (box && !box.classList.contains('chart-filter-box')) {
                    box = box.parentNode;
                }

                switch (key) {
                    case 'select-all':
                        if (filterKeys) {
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

            if (keys = keys[type]) {
                var dom = box.lastChild.firstChild;

                while (dom) {
                    if (key = dom.getAttribute('key')) {
                        dom.firstChild.checked = true;
                        delete keys[key];
                    }

                    dom = dom.nextSibling;
                }

                if (filterDelay) {
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

            while (dom) {
                if (key = dom.getAttribute('key')) {
                    if (dom.firstChild.checked = keys[key]) {
                        delete keys[key];
                    }
                    else {
                        keys[key] = true;
                    }
                }

                dom = dom.nextSibling;
            }

            if (filterDelay) {
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

            while (dom) {
                var field = dom.getAttribute('field'),
                    keys = Object.create(null);

                categoryValues(data, field, keys);
                setFilterChecked(dom.lastChild, keys);

                dom = dom.nextSibling;
            }
        }


        function setFilterChecked(dom, keys) {

            dom = dom.firstChild;

            while (dom) {
                dom.firstChild.checked = keys[dom.getAttribute('key')] || false;
                dom = dom.nextSibling;
            }
        }



        function showDataView() {

            if (!chartData || !chartData.length) {
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

            for (var i = 0, l = fields.length; i < l; i++) {
                var field = fields[i];

                if (field.visible === false) {
                    continue;
                }

                var column = {
                    name: field.name,
                    title: field.name,
                    size: field.width || 100
                };

                switch (field.type) {
                    case 'boolean':
                        column.type = 'checkbox';
                        break;

                    case 'number':
                        column.align = 'right';

                        if (field.summary) {
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

            if (digits > 0) {
                column.precision = digits;
            }

            if (fn) {
                column.onsummary = function (row, value) {

                    var value = row.data[name] = fn(row.data);
                    return digits ? decimal(value).toFixed(digits) : value;
                }
            }
            else {
                column.onsummary = function (row, value) {

                    return digits ? decimal(value).toFixed(digits) : value;
                }
            }
        }


        function exportTo(chart) {

            var grid;

            if (host[0] && host[0].findByType && (grid = host[0].findByType('Grid'))) {
                var columns = grid.columns().slice(0),
                    dataset = grid.dataset(),
                    data = [];

                for (var i = columns.length; i--;) {
                    columns[i] = columns[i].title();
                }

                for (var i = dataset.length; i--;) {
                    data[i] = dataset[i].data;
                }

                flyingon.exportToXlsx(chart.chartName,
                    '<img src="' + chart.toDataURL() + '" /><br></br>' +
                    flyingon.arrayToHtml(columns, data));
            }
            else {
                chart.saveAsImage(chart.chartName);
            }
        }

    }


});




flyingon.downloadDataURL = function (name, dataURL) {

    var a = document.createElement('a');

    // Chrome and Firefox
    if (a.download != null) {
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

        while (length--) {
            array[length] = text.charCodeAt(length);
        }

        navigator.msSaveOrOpenBlob(new Blob([array]), name);
    }
}


flyingon.downloadBlob = function (name, blob) {

    var a = document.createElement('a');

    // Chrome and Firefox
    if (a.download != null) {
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

        reader.onload = function (event) {

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
