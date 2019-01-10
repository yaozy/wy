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



flyingon.Control.extend('HomeMap', function () {


    var maps = {
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
    };



    this.onmount = function (dom) {

        var self = this,
            stack = ['map/china.json'];

        this.on('click', function () {

            if (stack[1])
            {
                stack.pop();
                load(self, stack[stack.length - 1]);
            }
        });

        setTimeout(function () {
         
            var chart = self.chart = echarts.init(self.view);

            load(self, stack[0]);

            chart.on('click', function(params){

                var name;

                if (name = maps[params.name])
                {
                    stack.push(name = 'map/' + name + '.json');
                    load(self, name, params.name);
                }

                params.event.event.stopPropagation();
            });

        }, 0);
    }


    function load(self, file, text) {

        flyingon.http.get(file).then(function (data) {

            echarts.registerMap(file, JSON.parse(data));

            self.chart.setOption({
                title: {
                    text: text
                },
                series: [{
                    type: 'map',
                    map: file
                }]
            });
        });

        self.trigger('');
    }



    this.refreshChart = function () {

        if (this.chart)
        {
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
                height: 80,
                dock: 'top',
                children: [
                    {
                        Class: 'Label',
                        text: '顺彩BI智能分析系统',
                        width: '100%',
                        height: 60,
                        margin: '12 0',
                        textAlign: 'center',
                        fontSize: '24px'
                    }//,
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



echarts.registerMap('china', {"type":"FeatureCollection","features":[{"id":"710000","geometry":{"type":"MultiPolygon","coordinates":[["@@°Ü¯Û","@@ƛĴÕƊÉɼģºðʀ\\ƎsÆNŌÔĚänÜƤɊĂǀĆĴĤǊŨxĚĮǂƺòƌâÔ®ĮXŦţƸZûÐƕƑGđ¨ĭMó·ęcëƝɉlÝƯֹÅŃ^Ó·śŃǋƏďíåɛGɉ¿IċããF¥ĘWǬÏĶñÄ","@@\\p|WoYG¿¥Ij@","@@¡@V^RqBbAnTXeQr©C","@@ÆEEkWqë I"]],"encodeOffsets":[[[122886,24033],[123335,22980],[122375,24193],[122518,24117],[124427,22618]]]},"properties":{"cp":[121.509062,25.044332],"name":"台湾","childNum":5}},{"id":"130000","geometry":{"type":"MultiPolygon","coordinates":[["@@\\aM`Ç½ÓnUKĜēs¤­©yrý§uģcJ»eIP]ªrºc_ħ²G¼s`jÎŸnüsÂľP","@@U`Ts¿mÄ","@@FOhđ©OiÃ`ww^ÌkÑH«ƇǤŗĺtFu{Z}Ö@U´ʚLg®¯Oı°Ãw ^VbÉsmAê]]w§RRl£ŭuwNÁ`ÇFēÝčȻuT¡Ĺ¯Õ¯sŗő£YªhVƍ£ƅnëYNgq¼ś¿µı²UºÝUąąŖóxV@tƯJ]eR¾fe|rHA|h~Ėƍl§ÏjVë` ØoÅbbx³^zÃĶ¶Sj®AyÂhðk`«PËµEFÛ¬Y¨Ļrõqi¼Wi°§Ð±²°`[À|ĠO@ÆxO\\ta\\p_Zõ^û{ġȧXýĪÓjùÎRb^Î»j{íděYfíÙTymńŵōHim½éŅ­aVcř§ax¹XŻácWU£ôãºQ¨÷Ñws¥qEHÙ|šYQoŕÇyáĂ£MÃ°oťÊP¡mWO¡v{ôvîēÜISpÌhp¨ jdeŔQÖjX³àĈ[n`Yp@UcM`RKhEbpŞlNut®EtqnsÁgAiúoHqCXhfgu~ÏWP½¢G^}¯ÅīGCÑ^ãziMáļMTÃƘrMc|O_¯Ŏ´|morDkO\\mĆJfl@cĢ¬¢aĦtRıÒXòë¬WP{ŵǫƝīÛ÷ąV×qƥV¿aȉd³BqPBmaËđŻģmÅ®V¹d^KKonYg¯XhqaLdu¥Ípǅ¡KąÅkĝęěhq}HyÃ]¹ǧ£Í÷¿qágPmoei¤o^á¾ZEY^Ný{nOl±Í@Mċèk§daNaÇį¿]øRiiñEūiǱàUtėGyl}ÓM}jpEC~¡FtoQiHkk{ILgĽxqÈƋÄdeVDJj£J|ÅdzÂFt~KŨ¸IÆv|¢r}èonb}`RÎÄn°ÒdÞ²^®lnÐèĄlðÓ×]ªÆ}LiĂ±Ö`^°Ç¶p®đDcŋ`ZÔ¶êqvFÆN®ĆTH®¦O¾IbÐã´BĐɢŴÆíȦpĐÞXR·nndO¤OÀĈƒ­QgµFo|gȒęSWb©osx|hYhgŃfmÖĩnºTÌSp¢dYĤ¶UĈjlǐpäðëx³kÛfw²Xjz~ÂqbTÑěŨ@|oMzv¢ZrÃVw¬ŧĖ¸f°ÐTªqs{S¯r æÝl¼ÖĞ ǆiGĘJ¼lr}~K¨ŸƐÌWö¼Þ°nÞoĦL|C~D©|q]SvKÑcwpÏÏĿćènĪWlĄkT}¬Tp~®Hgd˒ĺBVtEÀ¢ôPĎƗè@~kü\\rÊĔÖæW_§¼F´©òDòjYÈrbĞāøŀG{ƀ|¦ðrb|ÀH`pʞkvGpuARhÞÆǶgĘTǼƹS£¨¡ù³ŘÍ]¿ÂyôEP xX¶¹ÜO¡gÚ¡IwÃé¦ÅBÏ|Ç°N«úmH¯âbęU~xĈbȒ{^xÖlD¸dɂ~"]],"encodeOffsets":[[[120023,41045],[121616,39981],[122102,42307]]]},"properties":{"cp":[114.502461,38.045474],"name":"河北","childNum":3}},{"id":"140000","geometry":{"type":"Polygon","coordinates":["@@ħÜ_ªlìwGkÛÃǏokćiµVZģ¡coTSË¹ĪmnÕńehZg{gtwªpXaĚThȑp{¶Eh®RćƑP¿£PmcªaJyý{ýȥoÅîɡųAďä³aÏJ½¥PG­ąSM­sWz½µÛYÓŖgxoOkĒCo­Èµ]¯_²ÕjāK~©ÅØ^ÔkïçămÏk]­±cÝ¯ÑÃmQÍ~_apm~ç¡qu{JÅŧ·Ls}EyÁÆcI{¤IiCfUcƌÃp§]ě«vD@¡SÀµMÅwuYY¡DbÑc¡h×]nkoQdaMç~eDÛtT©±@¥ù@É¡ZcW|WqOJmĩl«ħşvOÓ«IqăV¥D[mI~Ó¢cehiÍ]Ɠ~ĥqX·eƷn±}v[ěďŕ]_œ`¹§ÕōIo©b­s^}Ét±ū«³p£ÿ¥WÑxçÁ«h×u×¥ř¾dÒ{ºvĴÎêÌɊ²¶ü¨|ÞƸµȲLLúÉƎ¤ϊęĔV`_bªS^|dzY|dz¥pZbÆ£¶ÒK}tĦÔņƠPYznÍvX¶Ěn ĠÔzý¦ª÷ÑĸÙUȌ¸dòÜJð´ìúNM¬XZ´¤ŊǸ_tldI{¦ƀðĠȤ¥NehXnYGR° ƬDj¬¸|CĞKqºfƐiĺ©ª~ĆOQª ¤@ìǦɌ²æBÊTĞHƘÁĪËĖĴŞȀÆÿȄlŤĒötÎ½î¼ĨXh|ªM¤ÐzÞĩÒSrao³"],"encodeOffsets":[[117016,41452]]},"properties":{"cp":[112.549248,37.857014],"name":"山西","childNum":1}},{"id":"150000","geometry":{"type":"MultiPolygon","coordinates":[["@@ǪƫÌÛMĂ[`ÕCn}¶Vcês¯PqFB|S³C|kñHdiÄ¥sŉÅPóÑÑE^ÅPpy_YtShQ·aHwsOnŉÃs©iqjUSiº]ïW«gW¡ARëśĳĘů`çõh]y»ǃǛҤxÒm~zf}pf|ÜroÈzrKÈĵSƧż؜Ġu~è¬vîS¼ĂhĖMÈÄw\\fŦ°W ¢¾luŸDw\\Ŗĝ","@@GVu»Aylßí¹ãe]Eāò³C¹ð¾²iÒAdkò^P²CǜңǄ z¼g^èöŰ_Ĳĕê}gÁnUI«m]jvV¼euhwqAaW_µj»çjioQR¹ēÃßt@r³[ÛlćË^ÍÉáGOUÛOB±XkÅ¹£k|e]olkVÍ¼ÕqtaÏõjgÁ£§U^RLËnX°ÇBz^~wfvypV ¯ƫĉ˭ȫƗŷɿÿĿƑ˃ĝÿÃǃßËőó©ǐȍŒĖM×ÍEyxþp]ÉvïèvƀnÂĴÖ@V~Ĉ³MEĸÅĖtējyÄDXÄxGQuv_i¦aBçw˛wD©{tāmQ{EJ§KPśƘƿ¥@sCTÉ}ɃwƇy±gÑ}T[÷kÐç¦«SÒ¥¸ëBX½HáÅµÀğtSÝÂa[ƣ°¯¦Pï¡]£ġÒk®G²èQ°óMq}EóƐÇ\\@áügQÍu¥FTÕ¿Jû]|mvāÎYua^WoÀa·­ząÒot×¶CLƗi¯¤mƎHǊ¤îìɾŊìTdåwsRÖgĒųúÍġäÕ}Q¶¿A[¡{d×uQAMxVvMOmăl«ct[wº_ÇÊjbÂ£ĦS_éQZ_lwgOiýe`YYJq¥IÁǳ£ÙË[ÕªuƏ³ÍTs·bÁĽäė[b[ŗfãcn¥îC¿÷µ[ŏÀQ­ōĉm¿Á^£mJVmL[{Ï_£F¥Ö{ŹA}×Wu©ÅaųĳƳhB{·TQqÙIķËZđ©Yc|M¡LeVUóK_QWk_ĥ¿ãZ»X\\ĴuUèlG®ěłTĠğDŃGÆÍz]±ŭ©Å]ÅÐ}UË¥©TċïxgckfWgi\\ÏĒ¥HkµEë{»ÏetcG±ahUiñiWsɁ·cCÕk]wȑ|ća}wVaĚá G°ùnM¬¯{ÈÐÆA¥ÄêJxÙ¢hP¢ÛºµwWOóFÁz^ÀŗÎú´§¢T¤ǻƺSėǵhÝÅQgvBHouʝl_o¿Ga{ïq{¥|ſĿHĂ÷aĝÇqZñiñC³ª»E`¨åXēÕqÉû[l}ç@čƘóO¿¡FUsAʽīccocÇS}£IS~ălkĩXçmĈŀÐoÐdxÒuL^T{r@¢ÍĝKén£kQyÅõËXŷƏL§~}kq»IHėǅjĝ»ÑÞoå°qTt|r©ÏS¯·eŨĕx«È[eM¿yupN~¹ÏyN£{©għWí»Í¾səšǅ_ÃĀɗ±ąĳĉʍŌŷSÉA±åǥɋ@ë£R©ąP©}ĹªƏj¹erLDĝ·{i«ƫC½ÉshVzGS|úþXgp{ÁX¿ć{ƱȏñZáĔyoÁhA}ŅĆfdŉ_¹Y°ėǩÑ¡H¯¶oMQqð¡Ë|Ñ`ƭŁX½·óÛxğįÅcQs«tȋǅFù^it«Č¯[hAi©á¥ÇĚ×l|¹y¯Kȝqgů{ñǙµïċĹzŚȭ¶¡oŽäÕG\\ÄT¿Òõr¯LguÏYęRƩɷŌO\\İÐ¢æ^Ŋ ĲȶȆbÜGĝ¬¿ĚVĎgª^íu½jÿĕęjık@Ľ]ėl¥ËĭûÁėéV©±ćn©­ȇÍq¯½YÃÔŉÉNÑÅÝy¹NqáʅDǡËñ­ƁYÅy̱os§ȋµʽǘǏƬɱàưN¢ƔÊuľýľώȪƺɂļxZĈ}ÌŉŪĺœĭFЛĽ̅ȣͽÒŵìƩÇϋÿȮǡŏçƑůĕ~Ç¼ȳÐUfdIxÿ\\G zâɏÙOº·pqy£@qþ@Ǟ˽IBäƣzsÂZÁàĻdñ°ŕzéØűzșCìDȐĴĺf®Àľưø@ɜÖÞKĊŇƄ§͑těï͡VAġÑÑ»d³öǍÝXĉĕÖ{þĉu¸ËʅğU̎éhɹƆ̗̮ȘǊ֥ड़ࡰţાíϲäʮW¬®ҌeרūȠkɬɻ̼ãüfƠSצɩςåȈHϚÎKǳͲOðÏȆƘ¼CϚǚ࢚˼ФÔ¤ƌĞ̪Qʤ´¼mȠJˀƲÀɠmɆǄĜƠ´ǠN~ʢĜ¶ƌĆĘźʆȬ˪ĚĒ¸ĞGȖƴƀj`ĢçĶāàŃºēĢĖćYÀŎüôQÐÂŎŞǆŞêƖoˆDĤÕºÑǘÛˤ³̀gńƘĔÀ^ªƂ`ªt¾äƚêĦĀ¼ÐĔǎ¨Ȕ»͠^ˮÊȦƤøxRrŜH¤¸ÂxDÄ|ø˂˜ƮÐ¬ɚwɲFjĔ²Äw°ǆdÀÉ_ĸdîàŎjÊêTĞªŌŜWÈ|tqĢUB~´°ÎFCU¼pĀēƄN¦¾O¶łKĊOjĚj´ĜYp{¦SĚÍ\\T×ªV÷Ší¨ÅDK°ßtŇĔK¨ǵÂcḷ̌ĚǣȄĽFlġUĵŇȣFʉɁMğįʏƶɷØŭOǽ«ƽū¹Ʊő̝Ȩ§ȞʘĖiɜɶʦ}¨֪ࠜ̀ƇǬ¹ǨE˦ĥªÔêFxúQEr´Wrh¤Ɛ \\talĈDJÜ|[Pll̚¸ƎGú´P¬W¦^¦H]prRn|or¾wLVnÇIujkmon£cX^Bh`¥V¦U¤¸}xRj[^xN[~ªxQ[`ªHÆÂExx^wN¶Ê|¨ìMrdYpoRzNyÀDs~bcfÌ`L¾n|¾T°c¨È¢ar¤`[|òDŞĔöxElÖdHÀI`Ď\\Àì~ÆR¼tf¦^¢ķ¶eÐÚMptgjɡČÅyġLûŇV®ÄÈƀĎ°P|ªVVªj¬ĚÒêp¬E|ŬÂ_~¼rƐK f{ĘFĒƌXưăkÃĄ}nµo×q£ç­kX{uĩ«āíÓUŅÝVUŌ]Ť¥lyň[oi{¦LĸĦ^ôâJ¨^UZðÚĒL¿Ìf£K£ʺoqNwğc`uetOj×°KJ±qÆġmĚŗos¬qehqsuH{¸kH¡ÊRǪÇƌbȆ¢´äÜ¢NìÉʖ¦â©Ɨؗ"]],"encodeOffsets":[[[128500,52752],[127089,51784]]]},"properties":{"cp":[111.670801,40.818311],"name":"内蒙古","childNum":2}},{"id":"210000","geometry":{"type":"MultiPolygon","coordinates":[["@@L@@s]","@@MnNm","@@dc","@@eÀC@b","@@fXwkbrÄ`qg","@@^jtWQ","@@~ Y[c","@@I`ĖN^_¿ZÁM","@@Ïxǌ{q_×^Gigp","@@iX¶BY","@@YZ","@@L_yG`b","@@^WqCTZ","@@\\[§t|]","@@m`p[","@@@é^BntaÊU]x ¯ÄPĲ­°hʙK³VÕ@Y~|EvĹsÇ¦­L^pÃ²ŸÒG Ël]xxÄ_fT¤Ď¤cPC¨¸TVjbgH²sdÎdHt`B²¬GJję¶[ÐhjeXdlwhðSČ¦ªVÊÏÆZÆŶ®²^ÎyÅHńĚDMħĜŁH­kçvV[ĳ¼WYÀäĦ`XlR`ôLUVfK¢{NZdĒªYĸÌÚJRr¸SA|ƴgŴĴÆbvªØX~źB|¦ÕE¤Ð`\\|KUnnI]¤ÀÂĊnŎR®Ő¿¶\\ÀøíDm¦ÎbŨabaĘ\\ľãÂ¸atÎSƐ´©v\\ÖÚÌǴ¤Â¨JKrZ_ZfjþhPkx`YRIjJcVf~sCN¤ EhæmsHy¨SðÑÌ\\\\ĐRÊwS¥fqŒßýáĞÙÉÖ[^¯ǤŲê´\\¦¬ĆPM¯£»uïpùzExanµyoluqe¦W^£ÊL}ñrkqWňûPUP¡ôJoo·U}£[·¨@XĸDXm­ÛÝºGUCÁª½{íĂ^cjk¶Ã[q¤LÉö³cux«|Zd²BWÇ®Yß½ve±ÃCý£W{Ú^q^sÑ·¨ËMr¹·C¥GDrí@wÕKţÃ«V·i}xËÍ÷i©ĝɝǡ]{c±OW³Ya±_ç©HĕoƫŇqr³Lys[ñ³¯OSďOMisZ±ÅFC¥Pq{Ã[Pg}\\¿ghćOk^ĩÃXaĕËĥM­oEqqZûěŉ³F¦oĵhÕP{¯~TÍlªNßYÐ{Ps{ÃVUeĎwk±ŉVÓ½ŽJãÇÇ»Jm°dhcÀffdF~ĀeĖd`sx² ®EĦ¦dQÂd^~ăÔH¦\\LKpĄVez¤NP ǹÓRÆąJSh­a[¦´ÂghwmBÐ¨źhI|VV|p] Â¼èNä¶ÜBÖ¼L`¼bØæKVpoúNZÞÒKxpw|ÊEMnzEQIZZNBčÚFÜçmĩWĪñtÞĵÇñZ«uD±|ƏlǗw·±PmÍada CLǑkùó¡³Ï«QaċÏOÃ¥ÕđQȥċƭy³ÁA"]],"encodeOffsets":[[[123686,41445],[126019,40435],[124393,40128],[126117,39963],[125322,40140],[126686,40700],[126041,40374],[125584,40168],[125509,40217],[125453,40165],[125362,40214],[125280,40291],[125774,39997],[125976,40496],[125822,39993],[122731,40949]]]},"properties":{"cp":[123.429096,41.796767],"name":"辽宁","childNum":16}},{"id":"220000","geometry":{"type":"Polygon","coordinates":["@@ñr½ÉKāGÁ¤ia ÉÈ¹`\\xs¬dĆkNnuNUwNx¶c¸|\\¢GªóĄ~RãÖÎĢùđŴÕhQxtcæëSɽŉíëǉ£ƍG£nj°KƘµDsØÑpyĆ¸®¿bXp]vbÍZuĂ{n^IüÀSÖ¦EvRÎûh@â[ƏÈô~FNr¯ôçR±­HÑlĢ^¤¢OðætxsŒ]ÞÁTĠs¶¿âÆGW¾ìA¦·TÑ¬è¥ÏÐJ¨¼ÒÖ¼ƦɄxÊ~StD@Ă¼Ŵ¡jlºWvÐzƦZÐ²CH AxiukdGgetqmcÛ£Ozy¥cE}|¾cZk¿uŐã[oxGikfeäT@SUwpiÚFM©£è^Ú`@v¶eňf heP¶täOlÃUgÞzŸU`l}ÔÆUvØ_Ō¬Öi^ĉi§²ÃB~¡ĈÚEgc|DC_Ȧm²rBx¼MÔ¦ŮdĨÃâYxƘDVÇĺĿg¿cwÅ\\¹¥Yĭl¤OvLjM_a W`zļMž·\\swqÝSAqŚĳ¯°kRē°wx^ĐkǂÒ\\]nrĂ}²ĊŲÒøãh·M{yMzysěnĒġV·°G³¼XÀ¤¹i´o¤ŃÈ`ÌǲÄUĞd\\iÖmÈBĤÜɲDEh LG¾ƀÄ¾{WaYÍÈĢĘÔRîĐj}ÇccjoUb½{h§Ǿ{KƖµÎ÷GĄØŜçưÌs«lyiē«`å§H¥Ae^§GK}iã\\c]v©ģZmÃ|[M}ģTɟĵÂÂ`ÀçmFK¥ÚíÁbX³ÌQÒHof{]ept·GŋĜYünĎųVY^ydõkÅZW«WUa~U·SbwGçǑiW^qFuNĝ·EwUtW·Ýďæ©PuqEzwAVXRãQ`­©GYYhcUGorBd}ģÉb¡·µMicF«Yƅ»é\\ɹ~ǙG³mØ©BšuT§Ĥ½¢Ã_Ã½L¡ûsT\\rke\\PnwAKy}ywdSefµ]UhĿD@mÿvaÙNSkCuncÿ`lWėVâ¦÷~^fÏ~vwHCį`xqT­­lW«ï¸skmßEGqd¯R©Ý¯¯S\\cZ¹iűƏCuƍÓXoR}M^o£R}oªU­FuuXHlEÅÏ©¤ßgXþ¤D²ÄufàÀ­XXÈ±Ac{Yw¬dvõ´KÊ£\\rµÄlidā]|î©¾DÂVH¹Þ®ÜWnCķ W§@\\¸~¤Vp¸póIO¢VOŇürXql~òÉK]¤¥Xrfkvzpm¶bwyFoúvð¼¤ N°ąO¥«³[éǣű]°Õ\\ÚÊĝôîŇÔaâBYlďQ[ Ë[ïÒ¥RI|`j]P"],"encodeOffsets":[[126831,44503]]},"properties":{"cp":[125.3245,43.886841],"name":"吉林","childNum":1}},{"id":"230000","geometry":{"type":"MultiPolygon","coordinates":[["@@UµNÿ¥īèçHÍøƕ¶Lǽ|g¨|a¾pVidd~ÈiíďÓQġėÇZÎXb½|ſÃH½KFgɱCģÛÇAnjÕc[VĝǱÃËÇ_ £ń³pj£º¿»WH´¯U¸đĢmtĜyzzNN|g¸÷äűÑ±ĉā~mq^[ǁÑďlw]¯xQĔ¯l°řĴrBÞTxr[tŽ¸ĻN_yX`biNKuP£kZĮ¦[ºxÆÀdhĹŀUÈƗCwáZħÄŭcÓ¥»NAw±qȥnD`{ChdÙFć}¢A±Äj¨]ĊÕjŋ«×`VuÓÅ~_kŷVÝyhVkÄãPsOµfgeŇµf@u_Ù ÙcªNªÙEojVxT@ãSefjlwH\\pŏäÀvlY½d{F~¦dyz¤PÜndsrhfHcvlwjF£G±DÏƥYyÏu¹XikĿ¦ÏqƗǀOŜ¨LI|FRĂn sª|C˜zxAè¥bfudTrFWÁ¹Am|ĔĕsķÆF´N}ćUÕ@Áĳſmuçuð^ÊýowFzØÎĕNőǏȎôªÌŒǄàĀÄ˄ĞŀƒʀĀƘŸˮȬƬĊ°Uzouxe]}AyÈW¯ÌmKQ]Īºif¸ÄX|sZt|½ÚUÎ lk^p{f¤lºlÆW A²PVÜPHÊâ]ÎĈÌÜk´\\@qàsĔÄQºpRij¼èi`¶bXrBgxfv»uUi^v~J¬mVp´£´VWrnP½ì¢BX¬hðX¹^TjVriªjtŊÄmtPGx¸bgRsT`ZozÆO]ÒFôÒOÆŊvÅpcGêsx´DR{AEOr°x|íb³Wm~DVjºéNNËÜ˛ɶ­GxŷCSt}]ûōSmtuÇÃĕNāg»íT«u}ç½BĵÞʣ¥ëÊ¡MÛ³ãȅ¡ƋaǩÈÉQG¢·lG|tvgrrf«ptęŘnÅĢrI²¯LiØsPf_vĠdxM prʹL¤¤eËÀđKïÙVY§]Ióáĥ]ķK¥j|pŇ\\kzţ¦šnņäÔVĂîĪ¬|vW®l¤èØrxm¶ă~lÄƯĄ̈́öȄEÔ¤ØQĄĄ»ƢjȦOǺ¨ìSŖÆƬyQv`cwZSÌ®ü±Ǆ]ŀç¬B¬©ńzƺŷɄeeOĨSfm ĊƀP̎ēz©ĊÄÕÊmgÇsJ¥ƔŊśæÎÑqv¿íUOµªÂnĦÁ_½ä@êí£P}Ġ[@gġ}gɊ×ûÏWXá¢užƻÌsNÍ½ƎÁ§čŐAēeL³àydl¦ĘVçŁpśǆĽĺſÊQíÜçÛġÔsĕ¬Ǹ¯YßċġHµ ¡eå`ļrĉŘóƢFìĎWøxÊkƈdƬv|I|·©NqńRŀ¤éeŊŀàŀU²ŕƀBQ£Ď}L¹Îk@©ĈuǰųǨÚ§ƈnTËÇéƟÊcfčŤ^XmHĊĕË«W·ċëx³ǔķÐċJāwİ_ĸȀ^ôWr­°oú¬ĦŨK~ȰCĐ´Ƕ£fNÎèâw¢XnŮeÂÆĶ¾¾xäLĴĘlļO¤ÒĨA¢Êɚ¨®ØCÔ ŬGƠƦYĜĘÜƬDJg_ͥœ@čŅĻA¶¯@wÎqC½Ĉ»NăëKďÍQÙƫ[«ÃígßÔÇOÝáWñuZ¯ĥŕā¡ÑķJu¤E å¯°WKÉ±_d_}}vyõu¬ï¹ÓU±½@gÏ¿rÃ½DgCdµ°MFYxw¿CG£Rƛ½Õ{]L§{qqą¿BÇƻğëܭǊË|c²}Fµ}ÙRsÓpg±QNqǫŋRwŕnéÑÉK«SeYRŋ@{¤SJ}D Ûǖ֍]gr¡µŷjqWÛham³~S«Ü[","@@ƨĶTLÇyqpÇÛqe{~oyen}s`qiXGù]Ëp½©lÉÁp]Þñ´FĂ^fäîºkàz¼BUv¬D"]],"encodeOffsets":[[[134456,44547],[127123,51780]]]},"properties":{"cp":[126.642464,45.756967],"name":"黑龙江","childNum":2}},{"id":"320000","geometry":{"type":"Polygon","coordinates":["@@Õg^vÁbnÀ`Jnĝ¬òM¶ĘTÖŒbe¦¦{¸ZâćNp©Hp|`mjhSEb\\afv`sz^lkljÄtg¤D­¾X¿À|ĐiZȀåB·î}GL¢õcßjayBFµÏC^ĭcÙt¿sğH]j{s©HM¢QnDÀ©DaÜÞ·jgàiDbPufjDk`dPOîhw¡ĥ¥GP²ĐobºrYî¶aHŢ´ ]´rılw³r_{£DB_Ûdåuk|Ũ¯F Cºyr{XFye³Þċ¿ÂkĭB¿MvÛpm`rÚã@Ę¹hågËÖƿxnlč¶Åì½Ot¾dJlVJĂǀŞqvnO^JZż·Q}êÍÅmµÒ]ƍ¦Dq}¬R^èĂ´ŀĻĊIÔtĲyQŐĠMNtR®òLhĚs©»}OÓGZz¶A\\jĨFäOĤHYJvÞHNiÜaĎÉnFQlNM¤B´ĄNöɂtpŬdZÅglmuÇUšŞÚb¤uŃJŴu»¹ĄlȖħŴw̌ŵ²ǹǠ͛hĭłƕrçü±Yrřl¥i`ã__¢ćSÅr[Çq^ùzWmOĈaŐÝɞï²ʯʊáĘĳĒǭPħ͍ôƋÄÄÍīçÛɈǥ£­ÛmY`ó£Z«§°Ó³QafusNıǅ_k}¢m[ÝóDµ¡RLčiXyÅNïă¡¸iĔÏNÌķoıdōîåŤûHcs}~Ûwbù¹£¦ÓCtOPrE^ÒogĉIµÛÅʹK¤½phMú`mR¸¦PƚgÉLRs`£¯ãhD¨|³¤C"],"encodeOffsets":[[121451,32518]]},"properties":{"cp":[118.767413,32.041544],"name":"江苏","childNum":1}},{"id":"330000","geometry":{"type":"MultiPolygon","coordinates":[["@@jX^n","@@sfdM","@@qP\\xz[_i","@@o\\VzRZ}mECy","@@R¢FX}°[m]","@@Cb\\}","@@e|v\\laus","@@v~s{","@@QxÂF©}","@@¹nvÞs©m","@@rQgYIh","@@bi«ZX","@@p[}ILd","@@À¿|","@@¹dnb","@@rS}[Kl","@@g~h}","@@FlCk","@@ůTG°ĄLHm°UF","@@OdRe","@@v[u\\","@@FjâL~wyoo~sµLZ","@@¬e¹aH","@@\\nÔ¡q]L³ë\\ÿ®QÌ","@@ÊA­©]ª","@@Kxv{­","@@@hlIk_","@@pWcrxp","@@Md|_iA","@@¢X£½z\\ðpN","@@hlÜ[LykAvyfw^E ","@@fp¤MusH","@@®_ma~LÁ¬`","@@@°¡mÛGĕ¨§Ianá[ýƤjfæÐNäGp","@@iMt\\","@@Zc[b","@@X®±GrÆ°Zæĉm","@@Z~dOSo|A¿qZv","@@@`EN£p","@@|s","@@@nDi","@@na£¾uYL¯QªmĉÅdMgÇjcº«ę¬­K­´B«Âącoċ\\xK`cįŧ«®á[~ıxu·ÅKsËÉc¢Ù\\ĭƛëbf¹­ģSĜkáƉÔ­ĈZB{aMµfzŉfÓÔŹŁƋǝÊĉ{ğč±g³ne{ç­ií´S¬\\ßðK¦w\\iqªĭiAuA­µ_W¥ƣO\\lċĢttC¨£t`PZäuXßBsĻyekOđġĵHuXBµ]×­­\\°®¬F¢¾pµ¼kŘó¬Wät¸|@L¨¸µrºù³Ù~§WIZW®±Ð¨ÒÉx`²pĜrOògtÁZ{üÙ[|ûKwsPlU[}¦Rvn`hsª^nQ´ĘRWb_ rtČFIÖkĦPJ¶ÖÀÖJĈĄTĚòC ²@PúØz©Pî¢£CÈÚĒ±hŖl¬â~nm¨f©iļ«mntqÒTÜÄjL®EÌFª²iÊxØ¨IÈhhst[Ôx}dtüGæţŔïĬaĸpMËÐjē¢·ðĄÆMzjWKĎ¢Q¶À_ê_@ıi«pZgf¤Nrq]§ĂN®«H±yƳí¾×ŊďŀĐÏŴǝĂíÀBŖÕªÁŐTFqĉ¯³ËCĕģi¨hÜ·ñt»¯Ï","@@ºwZRkĕWK "]],"encodeOffsets":[[[125785,31436],[125729,31431],[125513,31380],[125329,30690],[125223,30438],[125115,30114],[124815,29155],[124419,28746],[124095,28635],[124005,28609],[125000,30713],[125111,30698],[125078,30682],[125150,30684],[124014,28103],[125008,31331],[125411,31468],[125329,31479],[125369,31139],[125626,30916],[125417,30956],[125254,30976],[125199,30997],[125095,31058],[125083,30915],[124885,31015],[125218,30798],[124867,30838],[124755,30788],[124802,30809],[125267,30657],[125218,30578],[125200,30562],[125192,30787],[124968,30474],[125167,30396],[125115,30363],[124955,29879],[124714,29781],[124762,29462],[124325,28754],[124863,30077],[125366,31477]]]},"properties":{"cp":[120.153576,30.287459],"name":"浙江","childNum":43}},{"id":"340000","geometry":{"type":"MultiPolygon","coordinates":[["@@^iuLV\\","@@e©Edh","@@´CE¶zAXêeödK¡~H¸íæAȽd{ďÅÀ½W®£ChÃsikkly]_teu[bFaTign{]GqªoĈMYá|·¥f¥őaSÕėNµñĞ«Im_m¿Âa]uĜp Z_§{Cäg¤°r[_YjÆOdý[I[á·¥Q_nùgL¾mzˆDÜÆ¶ĊJhpc¹O]iŠ]¥ jtsggDÑ¡w×jÉ©±EFË­KiÛÃÕYvsm¬njĻª§emná}k«ŕgđ²ÙDÇ¤í¡ªOy×Où±@DñSęćăÕIÕ¿IµĥOlJÕÍRÍ|JìĻÒåyķrĕq§ÄĩsWÆßF¶X®¿mwRIÞfßoG³¾©uyHį{Ɓħ¯AFnuPÍÔzVdàôº^Ðæd´oG¤{S¬ćxã}ŧ×Kǥĩ«ÕOEÐ·ÖdÖsƘÑ¨[Û^Xr¢¼§xvÄÆµ`K§ tÒ´Cvlo¸fzŨð¾NY´ı~ÉĔēßúLÃÃ_ÈÏ|]ÂÏHlg`ben¾¢pUh~ƴĖ¶_r sĄ~cƈ]|r c~`¼{À{ȒiJjz`îÀT¥Û³]u}fïQl{skloNdjäËzDvčoQďHI¦rbrHĖ~BmlNRaĥTX\\{fÁKÁ®TLÂÄMtÊgĀDĄXƔvDcÎJbt[¤D@®hh~kt°ǾzÖ@¾ªdbYhüóV´ŮŒ¨Üc±r@J|àuYÇÔG·ĚąĐlŪÚpSJ¨ĸLvÞcPæķŨ®mÐálsgd×mQ¨ųÆ©Þ¤IÎs°KZpĄ|XwWdĎµmkǀwÌÕæhºgBĝâqÙĊzÖgņtÀÁĂÆáhEz|WzqD¹°Eŧl{ævÜcA`¤C`|´qxĲkq^³³GšµbíZ¹qpa±ď OH¦Ħx¢gPícOl_iCveaOjChß¸iÝbÛªCC¿mRV§¢A|tbkĜEÀtîm^g´fÄ"]],"encodeOffsets":[[[121722,32278],[119475,30423],[121606,33646]]]},"properties":{"cp":[117.283042,31.86119],"name":"安徽","childNum":3}},{"id":"350000","geometry":{"type":"MultiPolygon","coordinates":[["@@zht´}[","@@aj^~ĆGå","@@edHse","@@@vPGsyQ","@@sBzddW[O","@@S¨Qy","@@NVucW","@@qptB@q","@@¸[iu","@@Q\\pD[_","@@jSwUappI","@@eXª~","@@AjvFoo","@@fT_Çí\\v|ba¦jZÆy|®","@@IjLg","@@wJIx«¼AoNe{M¥","@@K±¡ÓČ~N¾","@@k¡¹Eh~c®uDqZì¡I~Māe£bN¨gZý¡a±Öcp©PhI¢QqÇGj|¥U g[Ky¬ŏv@OptÉEF\\@ åA¬V{XģĐBycpě¼³Ăp·¤¥ohqqÚ¡ŅLs^Ã¡§qlÀhH¨MCe»åÇGD¥zPO£čÙkJA¼ßėuĕeûÒiÁŧS[¡Uûŗ½ùěcÝ§SùĩąSWó«íęACµeRåǃRCÒÇZÍ¢ź±^dlstjD¸ZpuÔâÃH¾oLUêÃÔjjēò´ĄWƛ^Ñ¥Ħ@ÇòmOw¡õyJyD}¢ďÑÈġfZda©º²z£NjD°Ötj¶¬ZSÎ~¾c°¶ÐmxO¸¢Pl´SL|¥AȪĖMņĲg®áIJČĒü` QF¬h|ĂJ@zµ |ê³È ¸UÖŬŬÀCtrĸr]ðM¤ĶĲHtÏ AĬkvsq^aÎbvdfÊòSD´Z^xPsĂrvƞŀjJd×ŘÉ ®AÎ¦ĤdxĆqAZRÀMźnĊ»İÐZ YXæJyĊ²·¶q§·K@·{sXãô«lŗ¶»o½E¡­«¢±¨Y®Ø¶^AvWĶGĒĢPlzfļtàAvWYãO_¤sD§ssČġ[kƤPX¦`¶®BBvĪjv©jx[L¥àï[F¼ÍË»ğV`«Ip}ccÅĥZEãoP´B@D¸m±z«Ƴ¿å³BRØ¶Wlâþäą`]Z£Tc ĹGµ¶Hm@_©k¾xĨôȉðX«½đCIbćqK³ÁÄš¬OAwã»aLŉËĥW[ÂGIÂNxĳ¤D¢îĎÎB§°_JGs¥E@¤ućPåcuMuw¢BI¿]zG¹guĮI"]],"encodeOffsets":[[[123250,27563],[122541,27268],[123020,27189],[122916,27125],[122887,26845],[122808,26762],[122568,25912],[122778,26197],[122515,26757],[122816,26587],[123388,27005],[122450,26243],[122578,25962],[121255,25103],[120987,24903],[122339,25802],[121042,25093],[122439,26024]]]},"properties":{"cp":[119.306239,26.075302],"name":"福建","childNum":18}},{"id":"360000","geometry":{"type":"Polygon","coordinates":["@@ÖP¬ǦĪØLŨä~Ĉw«|TH£pc³Ïå¹]ĉđxe{ÎÓvOEm°BƂĨİ|Gvz½ª´HàpeJÝQxnÀW­EµàXÅĪt¨ÃĖrÄwÀFÎ|Ă¡WÕ¸cf¥XaęST±m[r«_gmQu~¥V\\OkxtL E¢Ú^~ýØkbēqoě±_Êw§Ñ²ÏƟė¼mĉŹ¿NQYBąrwģcÍ¥B­ŗÊcØiIƝĿuqtāwO]³YCñTeÉcaubÍ]trluīBÐGsĵıN£ï^ķqsq¿DūūVÕ·´Ç{éĈýÿOER_đûIċâJh­ŅıNȩĕB¦K{Tk³¡OP·wnµÏd¯}½TÍ«YiµÕsC¯iM¤­¦¯P|ÿUHvhe¥oFTuõ\\OSsMòđƇiaºćXĊĵà·çhƃ÷Ç{ígu^đgm[ÙxiIN¶Õ»lđÕwZSÆv©_ÈëJbVkĔVÀ¤P¾ºÈMÖxlò~ªÚàGĂ¢B±ÌKyñ`w²¹·`gsÙfIěxŕeykpudjuTfb·hh¿Jd[\\LáƔĨƐAĈepÀÂMD~ņªe^\\^§ý©j×cZØ¨zdÒa¶lÒJìõ`oz÷@¤uŞ¸´ôęöY¼HČƶajlÞƩ¥éZ[|h}^U  ¥pĄžƦO lt¸Æ Q\\aÆ|CnÂOjt­ĚĤdÈF`¶@Ðë ¦ōÒ¨SêvHĢÛ@[ÆQoxHW[ŰîÀt¦Ǆ~NĠ¢lĄtZoCƞÔºCxrpČNpj¢{f_Y`_eq®Aot`@oDXfkp¨|s¬\\DÄSfè©Hn¬^DhÆyøJhØxĢĀLÊƠPżċĄwĮ¶"],"encodeOffsets":[[118923,30536]]},"properties":{"cp":[115.892151,28.676493],"name":"江西","childNum":1}},{"id":"370000","geometry":{"type":"MultiPolygon","coordinates":[["@@Xjd]mE","@@itnq","@@Dl@k","@@TGw","@@K¬U","@@Wd`c","@@PtMs","@@LnXlc","@@ppVu]Qn","@@cdzAU_","@@udRhnCE","@@oIpP","@@M{ĿčwbxƨîKÎMĮ]ZF½Y]â£ph¶¨râøÀÎǨ¤^ºÄGz~grĚĜlĞÆLĆǆ¢Îo¦cvKbgr°WhmZp L]LºcUÆ­nżĤÌĒbAnrOA´ȊcÀbƦUØrĆUÜøĬƞŶǬĴóò_A̈«ªdÎÉnb²ĦhņBĖįĦåXćì@L¯´ywƕCéÃµė ƿ¸lµZæyj|BíÂKNNnoƈfÈMZwnŐNàúÄsTJULîVjǎ¾ĒØDz²XPn±ŴPè¸ŔLƔÜƺ_TüÃĤBBċÈöA´faM¨{«M`¶d¡ôÖ°mȰBÔjj´PM|c^d¤u¤Û´ä«ƢfPk¶Môl]Lb}su^ke{lCMrDÇ­]NÑFsmoõľHyGă{{çrnÓEƕZGª¹Fj¢ÿ©}ÌCǷë¡ąuhÛ¡^KxC`C\\bÅxì²ĝÝ¿_NīCȽĿåB¥¢·IŖÕy\\¹kxÃ£ČáKµË¤ÁçFQ¡KtŵƋ]CgÏAùSedcÚźuYfyMmhUWpSyGwMPqŀÁ¼zK¶G­Y§Ë@´śÇµƕBm@IogZ¯uTMx}CVKï{éƵP_K«pÛÙqċtkkù]gTğwoɁsMõ³ăAN£MRkmEÊčÛbMjÝGuIZGPģãħE[iµBEuDPÔ~ª¼ęt]ûG§¡QMsğNPŏįzs£Ug{đJĿļā³]ç«Qr~¥CƎÑ^n¶ÆéÎR~Ż¸YI] PumŝrƿIā[xeÇ³L¯v¯s¬ÁY~}ťuŁgƋpÝĄ_ņī¶ÏSR´ÁP~¿Cyċßdwk´SsX|t`Ä ÈðAªìÎT°¦Dda^lĎDĶÚY°`ĪŴǒàŠv\\ebZHŖR¬ŢƱùęOÑM­³FÛaj"]],"encodeOffsets":[[[123806,39303],[123821,39266],[123742,39256],[123702,39203],[123649,39066],[123847,38933],[123580,38839],[123894,37288],[123043,36624],[123344,38676],[123522,38857],[123628,38858],[118267,36772]]]},"properties":{"cp":[117.000923,36.675807],"name":"山东","childNum":13}},{"id":"410000","geometry":{"type":"MultiPolygon","coordinates":[["@@dXD}~Hgq~ÔN~zkĘHVsǲßjŬŢ`Pûàl¢\\ÀEhİgÞē X¼`khÍLùµP³swIÓzeŠĠð´E®ÚPtºIŊÊºL«šŕQGYfa[şußǑĩų_Z¯ĵÙčC]kbc¥CS¯ëÍB©ïÇÃ_{sWTt³xlàcČzÀD}ÂOQ³ÐTĬµƑÐ¿ŸghłŦv~}ÂZ«¤lPÇ£ªÝŴÅR§ØnhctâknÏ­ľŹUÓÝdKuķI§oTũÙďkęĆH¸Ó\\Ä¿PcnS{wBIvÉĽ[GqµuŇôYgûZca©@½Õǽys¯}lgg@­C\\£asIdÍuCQñ[L±ęk·ţb¨©kK»KC²òGKmĨS`UQnk}AGēsqaJ¥ĐGRĎpCuÌy ã iMcplk|tRkðev~^´¦ÜSí¿_iyjI|ȑ|¿_»d}q^{Ƈdă}tqµ`ŷé£©V¡om½ZÙÏÁRD|JOÈpÀRsI{ùÓjuµ{t}uËRivGçJFjµåkWê´MÂHewixGw½Yŷpµú³XU½ġyłåkÚwZX·l¢Á¢KzOÎÎjc¼htoDHr|­J½}JZ_¯iPq{tę½ĕ¦Zpĵø«kQĹ¤]MÛfaQpě±ǽ¾]u­Fu÷nčÄ¯ADp}AjmcEÇaª³o³ÆÍSƇĈÙDIzçñİ^KNiÞñ[aA²zzÌ÷D|[íÄ³gfÕÞd®|`Ć~oĠƑô³ŊD×°¯CsøÂ«ìUMhTº¨¸ǝêWÔDruÂÇZ£ĆPZW~ØØv¬gèÂÒw¦X¤Ā´oŬ¬²Ês~]®tªapŎJ¨Öº_ŔfŐ\\Đ\\Ĝu~m²Ƹ¸fWĦrƔ}Î^gjdfÔ¡J}\\n C¦þWxªJRÔŠu¬ĨĨmFdM{\\d\\YÊ¢ú@@¦ª²SÜsC}fNècbpRmlØ^gd¢aÒ¢CZZxvÆ¶N¿¢T@uC¬^ĊðÄn|lIlXhun[","@@hzUq"]],"encodeOffsets":[[[116744,37216],[116480,33048]]]},"properties":{"cp":[113.665412,34.757975],"name":"河南","childNum":2}},{"id":"420000","geometry":{"type":"MultiPolygon","coordinates":[["@@ASd","@@ls{d","@@¾«}{ra®pîÃ\\{øCËyyB±b\\òÝjKL ]ĎĽÌJyÚCƈćÎT´Å´pb©ÈdFin~BCo°BĎÃømv®E^vǾ½Ĝ²RobÜeN^ĺ£R¬lĶ÷YoĖ¥Ě¾|sOr°jY`~I¾®I{GqpCgyl{£ÍÍyPLÂ¡¡¸kWxYlÙæŁĢz¾V´W¶ùŸo¾ZHxjwfxGNÁ³Xéæl¶EièIH ujÌQ~v|sv¶Ôi|ú¢FhQsğ¦SiŠBgÐE^ÁÐ{čnOÂÈUÎóĔÊēĲ}Z³½Mŧïeyp·uk³DsÑ¨L¶_ÅuÃ¨w»¡WqÜ]\\Ò§tƗcÕ¸ÕFÏǝĉăxŻČƟOKÉġÿ×wg÷IÅzCg]m«ªGeçÃTC«[t§{loWeC@ps_Bp­rf_``Z|ei¡oċMqow¹DƝÓDYpûsYkıǃ}s¥ç³[§cY§HK«Qy]¢wwö¸ïx¼ņ¾Xv®ÇÀµRĠÐHM±cÏdƒǍũȅȷ±DSyúĝ£ŤĀàtÖÿï[îb\\}pĭÉI±Ñy¿³x¯No|¹HÏÛmjúË~TuęjCöAwě¬Rđl¯ Ñb­ŇTĿ_[IčĄʿnM¦ğ\\É[T·k¹©oĕ@A¾wya¥Y\\¥Âaz¯ãÁ¡k¥ne£ÛwE©Êō¶˓uoj_U¡cF¹­[WvP©whuÕyBF`RqJUw\\i¡{jEPïÿ½fćQÑÀQ{°fLÔ~wXgītêÝ¾ĺHd³fJd]HJ²EoU¥HhwQsƐ»Xmg±çve]DmÍPoCc¾_hhøYrŊU¶eD°Č_N~øĹĚ·`z]Äþp¼äÌQv\\rCé¾TnkžŐÚÜa¼ÝƆĢ¶ÛodĔňÐ¢JqPb ¾|J¾fXƐîĨ_Z¯À}úƲN_ĒÄ^ĈaŐyp»CÇÄKñL³ġM²wrIÒŭxjb[n«øæà ^²­h¯ÚŐªÞ¸Y²ĒVø}Ā^İ´LÚm¥ÀJÞ{JVųÞŃx×sxxƈē ģMřÚðòIfĊŒ\\Ʈ±ŒdÊ§ĘDvČ_Àæ~Dċ´A®µ¨ØLV¦êHÒ¤"]],"encodeOffsets":[[[113712,34000],[115612,30507],[113649,34054]]]},"properties":{"cp":[114.298572,30.584355],"name":"湖北","childNum":3}},{"id":"430000","geometry":{"type":"MultiPolygon","coordinates":[["@@nFZw","@@ãÆá½ÔXrCOËRïÿĩ­TooQyÓ[ŅBE¬ÎÓXaį§Ã¸G °ITxpúxÚĳ¥ÏĢ¾edÄ©ĸGàGhM¤Â_U}Ċ}¢pczfþg¤ÇôAV","@@ȴÚĖÁĐiOĜ«BxDõĚivSÌ}iùÜnÐºG{p°M°yÂÒzJ²Ì ÂcXëöüiáÿñőĞ¤ùTz²CȆȸǎŪƑÐc°dPÎğË¶[È½u¯½WM¡­ÉB·rínZÒ `¨GA¾\\pēXhÃRC­üWGġuTé§ŎÑ©êLM³}_EÇģc®ęisÁPDmÅ{b[RÅs·kPŽƥóRoOV~]{g\\êYƪ¦kÝbiċƵGZ»Ěõó·³vŝ£ø@pyö_ëIkÑµbcÑ§y×dYØªiþUjŅ³C}ÁN»hĻħƏâƓKA·³CQ±µ§¿AUƑ¹AtćOwD]JUÖgk¯b£ylZFËÑ±H­}EbóľA¡»Ku¦·³åş¥ùBD^{ÌC´­¦ŷJ£^[ª¿ğ|ƅN skóā¹¿ï]ă~÷O§­@Vm¡Qđ¦¢Ĥ{ºjÔª¥nf´~Õo×ÛąGû¥cÑ[Z¶ŨĪ²SÊǔƐƀAÚŌ¦QØ¼rŭ­«}NÏürÊ¬mjr@ĘrTW ­SsdHzƓ^ÇÂyUi¯DÅYlŹu{hT}mĉ¹¥ěDÿë©ıÓ[Oº£¥ótł¹MÕƪ`PDiÛU¾ÅâìUñBÈ£ýhedy¡oċ`pfmjP~kZaZsÐd°wj§@Ĵ®w~^kÀÅKvNmX\\¨aŃqvíó¿F¤¡@ũÑVw}S@j}¾«pĂrªg àÀ²NJ¶¶DôK|^ª°LX¾ŴäPĪ±£EXd^¶ĲÞÜ~u¸ǔMRhsRe`ÄofIÔ\\Ø  ićymnú¨cj ¢»GČìƊÿÐ¨XeĈĀ¾Oð Fi ¢|[jVxrIQ_EzAN¦zLU`cªxOTu RLÄªpUĪȴ^ŎµªÉFxÜf¤ºgĲèy°Áb[¦Zb¦z½xBĖ@ªpºjS´rVźOd©ʪiĎăJP`"]],"encodeOffsets":[[[115640,30489],[112577,27316],[114113,30649]]]},"properties":{"cp":[112.982279,28.19409],"name":"湖南","childNum":3}},{"id":"440000","geometry":{"type":"MultiPolygon","coordinates":[["@@QdAsa","@@lxDRm","@@sbhNLo","@@Ă ý","@@WltOY[","@@Kr]S","@@e~AS}","@@I|Mym","@@Û³LS²Q","@@nvºBë¥cÕº","@@zdÛJm","@@°³","@@a yAª¸ËJIxØ@ĀHÉÕZofoo","@@sŗÃÔėAƁZÄ ~°ČPºb","@@¶ÝÌvmĞh¹Ĺ","@@HdSjĒ¢D}waru«ZqadY{K","@@el\\LqqO","@@~rMmX","@@f^E","@@øPªoj÷ÍÝħXČx°Q¨ıXJp","@@gÇƳmxatfu","@@EÆC½","@@¸B_¶ekWvSivc}p}Ăº¾NĎyj¦Èm th_®Ä}»âUzLË²Aā¡ßH©Ùñ}wkNÕ¹ÇO½¿£ēUlaUìIÇª`uTÅxYĒÖ¼kÖµMjJÚwn\\hĒv]îh|ÈƄøèg¸Ķß ĉĈWb¹ƀdéĘNTtP[öSvrCZaGubo´ŖÒÇĐ~¡zCIözx¢PnÈñ @ĥÒ¦]ƜX³ăĔñiiÄÓVépKG½ÄÓávYoC·sitiaÀyŧÎ¡ÈYDÑům}ý|m[węõĉZÅxUO}÷N¹³ĉo_qtăqwµŁYÙǝŕ¹tïÛUÃ¯mRCºĭ|µÕÊK½Rē ó]GªęAxNqSF|ām¡diď×YïYWªŉOeÚtĐ«zđ¹TāúEáÎÁWwíHcòßÎſ¿Çdğ·ùT×Çūʄ¡XgWÀǇğ·¿ÃOj YÇ÷Sğ³kzőõmĝ[³¡VÙæÅöMÌ³¹pÁaËýý©D©ÜJŹƕģGą¤{ÙūÇO²«BƱéAÒĥ¡«BhlmtÃPµyU¯ucd·w_bŝcīímGOGBȅŹãĻFŷŽŕ@Óoo¿ē±ß}}ÓF÷tĲWÈCőâUâǙIğŉ©IĳE×Á³AĥDĈ±ÌÜÓĨ£L]ĈÙƺZǾĆĖMĸĤfÎĵlŨnÈĐtFFĤêk¶^k°f¶g}®Faf`vXŲxl¦ÔÁ²¬Ð¦pqÊÌ²iXØRDÎ}Ä@ZĠsx®AR~®ETtĄZƈfŠŠHâÒÐAµ\\S¸^wĖkRzalŜ|E¨ÈNĀňZTpBh£\\ĎƀuXĖtKL¶G|»ĺEļĞ~ÜĢÛĊrOÙîvd]n¬VÊĜ°RÖpMƀ¬HbwEÀ©\\¤]ŸI®¥D³|Ë]CúAŠ¦æ´¥¸Lv¼¢ĽBaôF~®²GÌÒEYzk¤°ahlVÕI^CxĈPsBƒºVÀB¶¨R²´D","@@OR"]],"encodeOffsets":[[[117381,22988],[116552,22934],[116790,22617],[116973,22545],[116444,22536],[116931,22515],[116496,22490],[116453,22449],[113301,21439],[118726,21604],[118709,21486],[113210,20816],[115482,22082],[113171,21585],[113199,21590],[115232,22102],[115739,22373],[115134,22184],[113056,21175],[119573,21271],[119957,24020],[115859,22356],[116680,26053],[116561,22649]]]},"properties":{"cp":[113.280637,23.125178],"name":"广东","childNum":24}},{"id":"450000","geometry":{"type":"MultiPolygon","coordinates":[["@@H TI¡U","@@Ɣ_LÊFZgčP­kini«qÇczÍY®¬Ů»qR×ō©DÕ§ƙǃŵTÉĩ±ıdÑnYYĲvNĆĆØÜ Öp}e³¦m©iÓ|¹ħņ|ª¦QF¢Â¬ʖovg¿em^ucäāmÇÖåB¡Õçĝ}FĻ¼Ĺ{µHKsLSđƃrč¤[AgoSŇYMÿ§Ç{FśbkylQxĕ]T·¶[BÑÏGáşşƇeăYSs­FQ}­BwtYğÃ@~CÍQ ×WjË±rÉ¥oÏ ±«ÓÂ¥kwWűue_b­E~µh¯ecl¯Ïr¯EģJğ}w³Ƈē`ãògK_ÛsUʝćğ¶höO¤Ǜn³c`¡yię[ďĵűMę§]XÎ_íÛ]éÛUćİÕBƣ±dy¹T^dûÅÑŦ·PĻþÙ`K¦¢ÍeĥR¿³£[~äu¼dltW¸oRM¢ď\\z}Æzdvň{ÎXF¶°Â_ÒÂÏL©ÖTmu¼ãlīkiqéfA·Êµ\\őDc¥ÝFyÔćcűH_hLÜêĺĐ¨c}rn`½Ì@¸¶ªVLhŒ\\Ţĺk~Ġið°|gtTĭĸ^xvKVGréAébUuMJVÃO¡qĂXËSģãlýà_juYÛÒBG^éÖ¶§EGÅzěƯ¤EkN[kdåucé¬dnYpAyČ{`]þ±X\\ÞÈk¡ĬjàhÂƄ¢Hè ŔâªLĒ^Öm¶ħĊAǦė¸zÚGn£¾rªŀÜt¬@ÖÚSx~øOŒŶÐÂæȠ\\ÈÜObĖw^oÞLf¬°bI lTØBÌF£Ć¹gñĤaYt¿¤VSñK¸¤nM¼JE±½¸ñoÜCƆæĪ^ĚQÖ¦^f´QüÜÊz¯lzUĺš@ìp¶n]sxtx¶@~ÒĂJb©gk{°~c°`Ô¬rV\\la¼¤ôá`¯¹LCÆbxEræOv[H­[~|aB£ÖsºdAĐzNÂðsÞÆĤªbab`ho¡³F«èVZs\\\\ÔRzpp®SĪº¨ÖºNĳd`a¦¤F³¢@`¢ĨĀìhYvlĆº¦Ċ~nS|gźv^kGÆÀè·"]],"encodeOffsets":[[[111707,21520],[113706,26955]]]},"properties":{"cp":[108.320004,22.82402],"name":"广西","childNum":2}},{"id":"460000","geometry":{"type":"Polygon","coordinates":["@@¦Ŝil¢XƦƞòïè§ŞCêɕrŧůÇąĻõ·ĉ³œ̅kÇm@ċȧŧĥĽʉ­ƅſȓÒË¦ŝE}ºƑ[ÍĜȋ gÎfǐÏĤ¨êƺ\\Ɔ¸ĠĎvʄȀÐ¾jNðĀÒRZǆzÐĊ¢DÀɘZ"],"encodeOffsets":[[112750,20508]]},"properties":{"cp":[110.33119,20.031971],"name":"海南","childNum":1}},{"id":"510000","geometry":{"type":"MultiPolygon","coordinates":[["@@LqSn","@@ĆOìÛÐ@ĞǔNY{¤Á§di´ezÝúØãwIþËQÇ¦ÃqÉSJ»ĂéʔõÔƁİlƞ¹§ĬqtÀƄmÀêErĒtD®ċæcQE®³^ĭ¥©l}äQtoŖÜqÆkµªÔĻĴ¡@Ċ°B²Èw^^RsºTĀ£ŚæQPJvÄz^Đ¹Æ¯fLà´GC²dt­ĀRt¼¤ĦOðğfÔðDŨŁĞƘïPÈ®âbMüÀXZ ¸£@Å»»QÉ­]dsÖ×_Í_ÌêŮPrĔĐÕGĂeZÜîĘqBhtO ¤tE[h|YÔZśÎs´xº±Uñt|OĩĠºNbgþJy^dÂY Į]Řz¦gC³R`Āz¢Aj¸CL¤RÆ»@­Ŏk\\Ç´£YW}z@Z}Ã¶oû¶]´^NÒ}èNªPÍy¹`S°´ATeVamdUĐwʄvĮÕ\\uÆŗ¨Yp¹àZÂmWh{á}WØǍÉüwga§ßAYrÅÂQĀÕ¬LŐý®Xøxª½Ű¦¦[þ`ÜUÖ´òrÙŠ°²ÄkĳnDX{U~ET{ļº¦PZcjF²Ė@pg¨B{u¨ŦyhoÚD®¯¢ WòàFÎ¤¨GDäz¦kŮPġqË¥À]eâÚ´ªKxīPÖ|æ[xÃ¤JÞĥsNÖ½I¬nĨY´®ÐƐmDŝuäđđEbee_v¡}ìęǊē}qÉåT¯µRs¡M@}ůaa­¯wvƉåZw\\Z{åû`[±oiJDÅ¦]ĕãïrG réÏ·~ąSfy×Í·ºſƽĵȁŗūmHQ¡Y¡®ÁÃ×t«­T¤JJJyJÈ`Ohß¦¡uËhIyCjmÿwZGTiSsOB²fNmsPa{M{õE^Hj}gYpaeu¯oáwHjÁ½M¡pMuåmni{fk\\oÎqCwEZ¼KĝAy{m÷LwO×SimRI¯rKõBS«sFe]fµ¢óY_ÆPRcue°Cbo×bd£ŌIHgtrnyPt¦foaXďxlBowz_{ÊéWiêEGhÜ¸ºuFĈIxf®Y½ĀǙ]¤EyF²ċw¸¿@g¢§RGv»áW`ÃĵJwi]t¥wO­½a[×]`Ãi­üL¦LabbTÀåc}ÍhÆh®BHî|îºÉk­¤Sy£ia©taį·Ɖ`ō¥UhOĝLk}©Fos´JmµlŁuønÑJWÎªYÀïAetTŅÓGË«bo{ıwodƟ½OġÜÂµxàNÖ¾P²§HKv¾]|BÆåoZ`¡Ø`ÀmºĠ~ÌÐ§nÇ¿¤]wğ@srğu~Io[é±¹ ¿ſđÓ@qg¹zƱřaí°KtÇ¤V»Ã[ĩǭƑ^ÇÓ@áťsZÏÅĭƋěpwDóÖáŻneQËq·GCœýS]x·ýq³OÕ¶Qzßti{řáÍÇWŝŭñzÇWpç¿JXĩè½cFÂLiVjx}\\NŇĖ¥GeJA¼ÄHfÈu~¸Æ«dE³ÉMA|bÒćhG¬CMõƤąAvüVéŀ_VÌ³ĐwQj´·ZeÈÁ¨X´Æ¡Qu·»ÕZ³ġqDoy`L¬gdp°şp¦ėìÅĮZ°Iähzĵf²å ĚÑKpIN|Ñz]ń·FU×é»R³MÉ»GM«kiér}Ã`¹ăÞmÈnÁîRǀ³ĜoİzŔwǶVÚ£À]ɜ»ĆlƂ²ĠþTº·àUȞÏʦ¶I«dĽĢdĬ¿»Ĕ×h\\c¬ä²GêëĤł¥ÀǿżÃÆMº}BÕĢyFVvwxBèĻĒ©Ĉt@Ğû¸£B¯¨ˋäßkķ½ªôNÔ~t¼Ŵu^s¼{TA¼ø°¢İªDè¾Ň¶ÝJ®Z´ğ~Sn|ªWÚ©òzPOȸbð¢|øĞA"]],"encodeOffsets":[[[108815,30935],[100197,35028]]]},"properties":{"cp":[104.065735,30.659462],"name":"四川","childNum":2}},{"id":"520000","geometry":{"type":"MultiPolygon","coordinates":[["@@G\\lY£cj","@@q|mc¯vÏV","@@hÑ£IsNgßHHªķÃh_¹¡ĝÄ§ń¦uÙùgS¯JH|sÝÅtÁïyMDč»eÕtA¤{b\\}G®u\\åPFqwÅaDK°ºâ_£ùbµmÁÛĹM[q|hlaªāI}Ñµ@swtwm^oµDéĽŠyVky°ÉûÛR³e¥]RÕěħ[ƅåÛDpJiVÂF²I»mN·£LbÒYbWsÀbpkiTZĄă¶Hq`ĥ_J¯ae«KpÝx]aĕÛPÇȟ[ÁåŵÏő÷Pw}TÙ@Õs«ĿÛq©½m¤ÙH·yǥĘĉBµĨÕnđ]K©œáGçş§ÕßgǗĦTèƤƺ{¶ÉHÎd¾ŚÊ·OÐjXWrãLyzÉAL¾ę¢bĶėy_qMĔąro¼hĊw¶øV¤w²Ĉ]ÊKx|`ź¦ÂÈdrcÈbe¸`I¼čTF´¼Óýȃr¹ÍJ©k_șl³´_pĐ`oÒh¶pa^ÓĔ}D»^Xy`d[KvJPhèhCrĂĚÂ^Êƌ wZL­Ġ£ÁbrzOIlMMĪŐžËr×ÎeŦtw|¢mKjSǘňĂStÎŦEtqFT¾Eì¬¬ôxÌO¢ K³ŀºäYPVgŎ¦ŊmŞ¼VZwVlz¤£Tl®ctĽÚó{G­AÇge~Îd¿æaSba¥KKûj®_Ä^\\Ø¾bP®¦x^sxjĶI_Ä Xâ¼Hu¨Qh¡À@Ëô}±GNìĎlT¸`V~R°tbÕĊ`¸úÛtÏFDu[MfqGH·¥yAztMFe|R_GkChZeÚ°tov`xbDnÐ{E}ZèxNEÞREn[Pv@{~rĆAB§EO¿|UZ~ìUf¨J²ĂÝÆsªB`s¶fvö¦Õ~dÔq¨¸º»uù[[§´sb¤¢zþF¢ÆÀhÂW\\ıËIÝo±ĭŠ£þÊs}¡R]ěDg´VG¢j±®èºÃmpU[Áëº°rÜbNu¸}º¼`niºÔXĄ¤¼ÔdaµÁ_ÃftQQgR·Ǔv}Ý×ĵ]µWc¤F²OĩųãW½¯K©]{LóµCIµ±Mß¿h©āq¬o½~@i~TUxð´Đhw­ÀEîôuĶb[§nWuMÆJl½]vuıµb"]],"encodeOffsets":[[[112158,27383],[112105,27474],[112095,27476]]]},"properties":{"cp":[106.713478,26.578343],"name":"贵州","childNum":3}},{"id":"530000","geometry":{"type":"Polygon","coordinates":["@@[ùx½}ÑRHYīĺûsÍniEoã½Ya²ė{c¬ĝgĂsAØÅwďõzFjw}«Dx¿}Uũlê@HÅ­F¨ÇoJ´Ónũuą¡Ã¢pÒÅØ TF²xa²ËXcÊlHîAßËŁkŻƑŷÉ©hW­æßUËs¡¦}teèÆ¶StÇÇ}Fd£jĈZĆÆ¤Tč\\D}O÷£U§~ŃGåŃDĝ¸Tsd¶¶Bª¤u¢ŌĎo~t¾ÍŶÒtD¦ÚiôözØX²ghįh½Û±¯ÿm·zR¦Ɵ`ªŊÃh¢rOÔ´£Ym¼èêf¯ŪĽncÚbw\\zlvWªâ ¦gmĿBĹ£¢ƹřbĥkǫßeeZkÙIKueT»sVesbaĕ  ¶®dNĄÄpªy¼³BE®lGŭCǶwêżĔÂepÍÀQƞpC¼ŲÈ­AÎô¶RäQ^Øu¬°_Èôc´¹ò¨PÎ¢hlĎ¦´ĦÆ´sâÇŲPnÊD^¯°Upv}®BPÌªjǬxSöwlfòªvqĸ|`H­viļndĜ­Ćhňem·FyÞqóSį¯³X_ĞçêtryvL¤§z¦c¦¥jnŞklD¤øz½ĜàĂŧMÅ|áƆàÊcðÂFÜáŢ¥\\\\ºİøÒÐJĴîD¦zK²ǏÎEh~CD­hMn^ÌöÄ©ČZÀaüfɭyœpį´ěFűk]Ôě¢qlÅĆÙa¶~ÄqêljN¬¼HÊNQ´ê¼VØ¸E^ŃÒyM{JLoÒęæe±Ķygã¯JYÆĭĘëo¥Šo¯hcK«z_prC´ĢÖY¼ v¸¢RÅW³Â§fÇ¸Yi³xR´ďUË`êĿUûuĆBƣöNDH«ĈgÑaB{ÊNF´¬c·Åv}eÇÃGB»If¦HňĕM~[iwjUÁKE¾dĪçWIèÀoÈXòyŞŮÈXâÎŚj|àsRyµÖPr´þ ¸^wþTDŔHr¸RÌmfżÕâCôoxĜƌÆĮÐYtâŦÔ@]ÈǮƒ\\Ī¼Ä£UsÈ¯LbîƲŚºyhr@ĒÔƀÀ²º\\êpJ}ĠvqtĠ@^xÀ£È¨mËÏğ}n¹_¿¢×Y_æpÅA^{½Lu¨GO±Õ½ßM¶wÁĢÛPƢ¼pcĲx|apÌ¬HÐŊSfsðBZ¿©XÏÒKk÷Eû¿SrEFsÕūkóVǥŉiTL¡n{uxţÏhôŝ¬ğōNNJkyPaqÂğ¤K®YxÉƋÁ]āęDqçgOgILu\\_gz]W¼~CÔē]bµogpÑ_oď`´³Țkl`IªºÎȄqÔþ»E³ĎSJ»_f·adÇqÇc¥Á_Źw{L^É±ćxU£µ÷xgĉp»ĆqNē`rĘzaĵĚ¡K½ÊBzyäKXqiWPÏÉ¸½řÍcÊG|µƕƣGË÷k°_^ý|_zċBZocmø¯hhcæ\\lMFlư£ĜÆyHF¨µêÕ]HAàÓ^it `þßäkĤÎT~Wlÿ¨ÔPzUCNVv [jâôDôď[}z¿msSh¯{jïğl}šĹ[őgK©U·µË@¾m_~q¡f¹ÅË^»f³ø}Q¡ÖË³gÍ±^Ç\\ëÃA_¿bWÏ[¶ƛé£F{īZgm@|kHǭƁć¦UĔť×ëǟeċ¼ȡȘÏíBÉ£āĘPªĳ¶ŉÿy©nď£G¹¡I±LÉĺÑdĉÜW¥}gÁ{aqÃ¥aıęÏZÁ`"],"encodeOffsets":[[104636,22969]]},"properties":{"cp":[102.712251,25.040609],"name":"云南","childNum":1}},{"id":"540000","geometry":{"type":"Polygon","coordinates":["@@ÂhľxŖxÒVºÅâAĪÝȆµę¯Ňa±r_w~uSÕňqOj]ɄQ£ZUDûoY»©M[L¼qãË{VÍçWVi]ë©Ä÷àyƛhÚU°adcQ~Mx¥caÛcSyFÖk­uRýq¿ÔµQĽ³aG{¿FµëªéĜÿª@¬·K·àariĕĀ«V»ŶĴūgèLǴŇƶaftèBŚ£^âǐÝ®M¦ÁǞÿ¬LhJ¾óƾÆºcxwf]Y´¦|QLn°adĊ\\¨oǀÍŎ´ĩĀd`tÊQŞŕ|¨C^©Ĉ¦¦ÎJĊ{ëĎjª²rÐl`¼Ą[t|¦Stè¾PÜK¸dƄı]s¤î_v¹ÎVòŦj£Əsc¬_Ğ´|Ł¦Av¦w`ăaÝaa­¢e¤ı²©ªSªÈMĄwÉØŔì@T¤Ę\\õª@þo´­xA sÂtŎKzó²ÇČµ¢r^nĊ­Æ¬×üG¢³ {âĊ]G~bÀgVjzlhǶfOfdªB]pjTOtĊn¤}®¦Č¥d¢¼»ddY¼t¢eȤJ¤}Ǿ¡°§¤AÐlc@ĝsªćļđAçwxUuzEÖġ~AN¹ÄÅȀŻ¦¿ģŁéì±Hãd«g[Ø¼ēÀcīľġ¬cJµÐʥVȝ¸ßS¹ý±ğkƁ¼ą^ɛ¤Ûÿb[}¬ōõÃ]ËNm®g@Bg}ÍF±ǐyL¥íCIĳÏ÷Ñį[¹¦[âšEÛïÁÉdƅß{âNÆāŨß¾ě÷yC£k­´ÓH@Â¹TZ¥¢į·ÌAÐ§®Zcv½Z­¹|ÅWZqgW|ieZÅYVÓqdqbc²R@c¥Rã»GeeƃīQ}J[ÒK¬Ə|oėjġĠÑN¡ð¯EBčnwôɍėª²CλŹġǝʅįĭạ̃ūȹ]ΓͧgšsgȽóϧµǛęgſ¶ҍć`ĘąŌJÞä¤rÅň¥ÖÁUětęuůÞiĊÄÀ\\Æs¦ÓRb|Â^řÌkÄŷ¶½÷f±iMÝ@ĥ°G¬ÃM¥n£Øąğ¯ß§aëbéüÑOčk£{\\eµª×MÉfm«Ƒ{Å×Gŏǩãy³©WÑăû··Qòı}¯ãIéÕÂZ¨īès¶ZÈsæĔTŘvgÌsN@îá¾ó@ÙwU±ÉTå»£TđWxq¹Zobs[×¯cĩvėŧ³BM|¹kªħ¥TzNYnÝßpęrñĠĉRS~½ěVVµõ«M££µBĉ¥áºae~³AuĐh`Ü³ç@BÛïĿa©|z²Ý¼D£àč²ŸIûI āóK¥}rÝ_Á´éMaň¨~ªSĈ½½KÙóĿeƃÆB·¬ën×W|Uº}LJrƳlŒµ`bÔ`QÐÓ@s¬ñIÍ@ûws¡åQÑßÁ`ŋĴ{ĪTÚÅTSÄ³Yo|Ç[Ç¾µMW¢ĭiÕØ¿@MhpÕ]jéò¿OƇĆƇpêĉâlØwěsǩĵ¸cbU¹ř¨WavquSMzeo_^gsÏ·¥Ó@~¯¿RiīB\\qTGªÇĜçPoÿfñòą¦óQīÈáPābß{ZŗĸIæÅhnszÁCËìñÏ·ąĚÝUm®ó­L·ăUÈíoù´Êj°ŁŤ_uµ^°ìÇ@tĶĒ¡ÆM³Ģ«İĨÅ®ğRāðggheÆ¢zÊ©Ô\\°ÝĎz~ź¤PnMĪÖB£kné§żćĆKĒ°¼L¶èâz¨u¦¥LDĘz¬ýÎmĘd¾ßFzhg²Fy¦ĝ¤ċņbÎ@yĄæm°NĮZRÖíJ²öLĸÒ¨Y®ƌÐVàtt_ÚÂyĠz]ŢhzĎ{ÂĢXc|ÐqfO¢¤ögÌHNPKŖUú´xx[xvĐCûĀìÖT¬¸^}Ìsòd´_KgžLĴÀBon|H@Êx¦BpŰŌ¿fµƌA¾zǈRx¶FkĄźRzŀ~¶[´HnªVƞuĒ­È¨ƎcƽÌm¸ÁÈM¦x͊ëÀxǆBú^´W£dkɾĬpw˂ØɦļĬIŚÊnŔa¸~J°îlɌxĤÊÈðhÌ®gT´øàCÀ^ªerrƘd¢İP|Ė ŸWªĦ^¶´ÂLaT±üWƜǀRÂŶUńĖ[QhlLüAÜ\\qRĄ©"],"encodeOffsets":[[90849,37210]]},"properties":{"cp":[91.132212,29.660361],"name":"西藏","childNum":1}},{"id":"610000","geometry":{"type":"Polygon","coordinates":["@@¸ÂW¢xR­Fq§uF@N¢XLRMº[ğȣſï|¥Jkc`sŉǷ£Y³WN«ùMëï³ÛIg÷±mTșÚÒķø©þ¥yÓğęmWµÎumZyOŅƟĥÓ~sÑL¤µaÅY¦ocyZ{y c]{Ta©`U_Ěē£ωÊƍKùK¶ȱÝƷ§{û»ÅÁȹÍéuĳ|¹cÑdìUYOuFÕÈYvÁCqÓTǢí§·S¹NgV¬ë÷Át°DØ¯C´ŉƒópģ}ąiEËFéGU¥×K§­¶³BČ}C¿åċ`wġB·¤őcƭ²ő[Å^axwQOñJÙïŚĤNĔwƇÄńwĪ­o[_KÓª³ÙnKÇěÿ]ďă_d©·©Ýŏ°Ù®g]±ß×¥¬÷m\\iaǑkěX{¢|ZKlçhLtŇîŵœè[É@ƉĄEtƇÏ³­ħZ«mJ×¾MtÝĦ£IwÄå\\Õ{OwĬ©LÙ³ÙTª¿^¦rÌĢŭO¥lãyC§HÍ£ßEñX¡­°ÙCgpťzb`wIvA|¥hoĕ@E±iYd¥OÿµÇvPW|mCĴŜǂÒW¶¸AĜh^Wx{@¬­F¸¡ķn£P|ªĴ@^ĠĈæbÔc¶lYi^MicĎ°Â[ävï¶gv@ÀĬ·lJ¸sn|¼u~a]ÆÈtŌºJpþ£KKf~¦UbyäIĺãnÔ¿^­ŵMThĠÜ¤ko¼Ŏìąǜh`[tRd²Ĳ_XPrɲlXiL§à¹H°Ȧqº®QCbAŌJ¸ĕÚ³ĺ§ `d¨YjiZvRĺ±öVKkjGȊÄePĞZmļKÀ[`ösìhïÎoĬdtKÞ{¬èÒÒBÔpĲÇĬJŊ¦±J«[©ārHµàåVKe§|P²ÇÓ·vUzgnN¾yI@oHĆÛķhxen¡QQ±ƝJǖRbzy¸ËÐl¼EºpĤ¼x¼½~Ğà@ÚüdK^mÌSjp²ȮµûGĦ}Ħðǚ¶òƄjɂz°{ºØkÈęâ¦jªBg\\ċ°s¬]jú EȌǆ¬stRÆdĠİwÜ¸ôW¾ƮłÒ_{Ìû¼jº¹¢GǪÒ¯ĘZ`ºŊecņą~BÂgzpâēòYƲȐĎ"],"encodeOffsets":[[113634,40474]]},"properties":{"cp":[108.948024,34.263161],"name":"陕西","childNum":1}},{"id":"620000","geometry":{"type":"MultiPolygon","coordinates":[["@@Vu_^","@@ųEĠtt~nkh`Q¦ÅÄÜdwAb×ĠąJ¤DüègĺqBqj°lI¡Ĩ¶ĖIHdjÎB°aZ¢KJO[|A£Dx}NĂ¬HUnrk kp¼Y kMJn[aGáÚÏ[½rc}aQxOgsPMnUsncZsKúvAtÞġ£®ĀYKdnFw¢JE°Latf`¼h¬we|Æbj}GA·~W`¢MC¤tL©Ĳ°qdfObÞĬ¹ttu`^ZúE`[@Æsîz®¡CƳƜG²R¢RmfwĸgÜą G@pzJM½mhVy¸uÈÔO±¨{LfæU¶ßGĂq\\ª¬²I¥IŉÈīoıÓÑAçÑ|«LÝcspīðÍgtë_õ\\ĉñLYnĝgRǡÁiHLlõUĹ²uQjYi§Z_c¨´ĹĖÙ·ŋIaBD­R¹ȥr¯GºßK¨jWkɱOqWĳ\\a­Q\\sg_ĆǛōëp»£lğÛgSŶN®À]ÓämĹãJaz¥V}Le¤Lýo¹IsŋÅÇ^bz³tmEÁ´a¹cčecÇNĊãÁ\\č¯dNj]jZµkÓdaćå]ğĳ@ ©O{¤ĸm¢E·®«|@Xwg]Aģ±¯XǁÑǳªcwQÚŝñsÕ³ÛV_ý¥\\ů¥©¾÷w©WÕÊĩhÿÖÁRo¸V¬âDb¨hûxÊ×ǌ~Zâg|XÁnßYoº§ZÅŘv[ĭÖʃuďxcVbnUSfB¯³_TzºÎO©çMÑ~M³]µ^püµÄY~y@X~¤Z³[Èōl@®Å¼£QK·Di¡ByÿQ_´D¥hŗy^ĭÁZ]cIzýah¹MĪğPs{ò²Vw¹t³ŜË[Ñ}X\\gsF£sPAgěp×ëfYHāďÖqēŭOÏëdLü\\it^c®RÊº¶¢H°mrY£B¹čIoľu¶uI]vģSQ{UŻÅ}QÂ|Ì°ƅ¤ĩŪU ęĄÌZÒ\\v²PĔ»ƢNHĂyAmƂwVm`]ÈbH`Ì¢²ILvĜH®¤Dlt_¢JJÄämèÔDëþgºƫaʎÌrêYi~ Îİ¤NpÀA¾Ĕ¼bð÷®üszMzÖĖQdȨýv§Tè|ªHÃ¾a¸|Ð ƒwKĢx¦ivr^ÿ ¸l öæfƟĴ·PJv}n\\h¹¶v·À|\\ƁĚN´ĜçèÁz]ġ¤²¨QÒŨTIlªťØ}¼˗ƦvÄùØEÂ«FïËIqōTvāÜŏíÛßÛVj³âwGăÂíNOPìyV³ŉĖýZso§HÑiYw[ß\\X¦¥c]ÔƩÜ·«jÐqvÁ¦m^ċ±R¦΋ƈťĚgÀ»IïĨʗƮ°ƝĻþÍAƉſ±tÍEÕÞāNUÍ¡\\ſčåÒʻĘm ƭÌŹöʥëQ¤µ­ÇcƕªoIýIÉ_mkl³ăƓ¦j¡YzŇi}Msßõīʋ }ÁVm_[n}eı­Uĥ¼ªI{Î§DÓƻėojqYhĹT©oūĶ£]ďxĩǑMĝq`B´ƃ˺Чç~²ņj@¥@đ´ί}ĥtPńÇ¾V¬ufÓÉCtÓ̻¹£G³]ƖƾŎĪŪĘ̖¨ʈĢƂlɘ۪üºňUðǜȢƢż̌ȦǼĤŊɲĖÂ­KqĘŉ¼ĔǲņɾªǀÞĈĂD½ĄĎÌŗĞrôñnN¼â¾ʄľԆ|Ǆ֦ज़ȗǉ̘̭ɺƅêgV̍ʆĠ·ÌĊv|ýĖÕWĊǎÞ´õ¼cÒÒBĢ͢UĜð͒s¨ňƃLĉÕÝ@ɛƯ÷¿Ľ­ĹeȏĳëCȚDŲyê×Ŗyò¯ļcÂßYtÁƤyAã˾J@ǝrý@¤rz¸oP¹ɐÚyáHĀ[JwcVeȴÏ»ÈĖ}ƒŰŐèȭǢόĀƪÈŶë;Ñ̆ȤМľĮEŔĹŊũ~ËUă{ĻƹɁύȩþĽvĽƓÉ@ēĽɲßǐƫʾǗĒpäWÐxnsÀ^ƆwW©¦cÅ¡Ji§vúF¶¨c~c¼īeXǚ\\đ¾JwÀďksãAfÕ¦L}waoZD½Ml«]eÒÅaÉ²áo½FõÛ]ĻÒ¡wYR£¢rvÓ®y®LFLzĈôe]gx}|KK}xklL]c¦£fRtív¦PŨ£","@@M T¥"]],"encodeOffsets":[[[108619,36299],[108594,36341],[108600,36306]]]},"properties":{"cp":[103.823557,36.058039],"name":"甘肃","childNum":3}},{"id":"630000","geometry":{"type":"MultiPolygon","coordinates":[["@@InJo","@@CÆ½OŃĦsΰ~Ē³¦@@Ņi±è}ШƄ˹A³r_ĞǒNĪĐw¤^ŬĵªpĺSZgrpiƼĘÔ¨C|ÍJ©Ħ»®VĲ~f\\m `UnÂ~ʌĬàöNt~ňjy¢ZiƔ¥Ąk´nl`JÊJþ©pdƖ®È£¶ìRʦźõƮËnʼėæÑƀĎ[¢VÎĂMÖÝÎF²sƊƀÎBļýƞ¯ʘƭðħ¼Jh¿ŦęΌƇ¥²Q]Č¥nuÂÏri¸¬ƪÛ^Ó¦d¥[Wàx\\ZjÒ¨GtpþYŊĕ´zUOëPîMĄÁxH´áiÜUàîÜŐĂÛSuŎrJðÌ¬EFÁú×uÃÎkrĒ{V}İ«O_ÌËĬ©ÓŧSRÑ±§Ģ£^ÂyèçěM³Ƃę{[¸¿uºµ[gt£¸OƤĿéYõ·kĀq]juw¥DĩƍõÇPéÄ½G©ã¤GuȧþRcÕĕNyyût­øï»a½ē¿BMoį£Íj}éZËqbʍƬh¹ìÿÓAçãnIÃ¡I`ks£CG­ěUy×Cy@¶ʡÊBnāzGơMē¼±O÷õJËĚăVĪũƆ£¯{ËL½ÌzżVR|ĠTbuvJvµhĻĖHAëáa­OÇðñęNwœľ·LmI±íĠĩPÉ×®ÿscB³±JKßĊ«`ađ»·QAmOVţéÿ¤¹SQt]]Çx±¯A@ĉĳ¢Óļ©l¶ÅÛrŕspãRk~¦ª]Į­´FRåd­ČsCqđéFn¿ÅƃmÉx{W©ºƝºįkÕƂƑ¸wWūÐ©ÈF£\\tÈ¥ÄRÈýÌJ lGr^×äùyÞ³fjc¨£ÂZ|ǓMĝÏ@ëÜőRĝ÷¡{aïȷPu°ËXÙ{©TmĠ}Y³­ÞIňµç½©C¡į÷¯B»|St»]vųs»}MÓ ÿʪƟǭA¡fs»PY¼c¡»¦cċ­¥£~msĉPSi^o©AecPeǵkgyUi¿h}aHĉ^|á´¡HØûÅ«ĉ®]m¡qċ¶±ÈyôōLÁstB®wn±ă¥HSòė£Së@×œÊăxÇN©©T±ª£Ĳ¡fb®Þbb_Ą¥xu¥B{łĝ³«`dƐt¤ťiñÍUuºí`£^tƃĲc·ÛLO½sç¥Ts{ă\\_»kÏ±q©čiìĉ|ÍI¥ć¥]ª§D{ŝŖÉR_sÿc³ĪōƿÎ§p[ĉc¯bKmR¥{³Ze^wx¹dƽÅ½ôIg §Mĕ ƹĴ¿ǣÜÍ]Ý]snåA{eƭ`ǻŊĿ\\ĳŬűYÂÿ¬jĖqßb¸L«¸©@ěĀ©ê¶ìÀEH|´bRľÓ¶rÀQþvl®ÕETzÜdb hw¤{LRdcb¯ÙVgƜßzÃôì®^jUèXÎ|UäÌ»rK\\ªN¼pZCüVY¤ɃRi^rPŇTÖ}|br°qňbĚ°ªiƶGQ¾²x¦PmlŜ[Ĥ¡ΞsĦÔÏâ\\ªÚŒU\\f¢N²§x|¤§xĔsZPòʛ²SÐqF`ªVÞŜĶƨVZÌL`¢dŐIqr\\oäõFÎ·¤»Ŷ×h¹]ClÙ\\¦ďÌį¬řtTӺƙgQÇÓHţĒ´ÃbEÄlbʔC|CŮkƮ[ʼ¬ň´KŮÈΰÌĪ¶ƶlðļATUvdTGº̼ÔsÊDÔveMg"]],"encodeOffsets":[[[105308,37219],[95370,40081]]]},"properties":{"cp":[101.778916,36.623178],"name":"青海","childNum":2}},{"id":"640000","geometry":{"type":"Polygon","coordinates":["@@KëÀęĞ«Oęȿȕı]ŉ¡åįÕÔ«ǴõƪĚQÐZhv K°öqÀÑS[ÃÖHƖčËnL]ûcÙß@ĝ¾}w»»oģF¹»kÌÏ·{zP§B­¢íyÅt@@á]Yv_ssģ¼ißĻL¾ġsKD£¡N_X¸}B~HaiÅf{«x»ge_bsKF¯¡IxmELcÿZ¤­ĢÝsuBLùtYdmVtNmtOPhRw~bd¾qÐ\\âÙH\\bImlNZ»loqlVmGā§~QCw¤{A\\PKNY¯bFkC¥sks_Ã\\ă«¢ħkJi¯rrAhĹûç£CUĕĊ_ÔBixÅÙĄnªÑaM~ħpOu¥sîeQ¥¤^dkKwlL~{L~hw^ófćKyE­K­zuÔ¡qQ¤xZÑ¢^ļöÜ¾Ep±âbÊÑÆ^fk¬NC¾YpxbK~¥eÖäBlt¿Đx½I[ĒǙWf»Ĭ}d§dµùEuj¨IÆ¢¥dXªƅx¿]mtÏwßRĶX¢͎vÆzƂZò®ǢÌʆCrâºMÞzÆMÒÊÓŊZÄ¾r°Î®Ȉmª²ĈUªĚîøºĮ¦ÌĘk^FłĬhĚiĀĖ¾iİbjË"],"encodeOffsets":[[109366,40242]]},"properties":{"cp":[106.278179,38.46637],"name":"宁夏","childNum":1}},{"id":"650000","geometry":{"type":"Polygon","coordinates":["@@QØĔ²X¨~ǘBºjʐßØvKƔX¨vĊOÃ·¢i@~cĝe_«E}QxgɪëÏÃ@sÅyXoŖ{ô«ŸuXêÎf`C¹ÂÿÐGĮÕĞXŪōŸMźÈƺQèĽôe|¿ƸJR¤ĘEjcUóº¯Ĩ_ŘÁMª÷Ð¥OéÈ¿ÖğǤǷÂFÒzÉx[]­Ĥĝœ¦EP}ûƥé¿İƷTėƫœŕƅƱB»Đ±ēO¦E}`cȺrĦáŖuÒª«ĲπdƺÏØZƴwʄ¤ĖGĐǂZĶèH¶}ÚZצʥĪï|ÇĦMŔ»İĝǈì¥Βba­¯¥ǕǚkĆŵĦɑĺƯxūД̵nơʃĽá½M»òmqóŘĝčË¾ăCćāƿÝɽ©ǱŅ»ēėŊLrÁ®ɱĕģŉǻ̋ȥơŻǛȡVï¹Ň۩ûkɗġƁ§ʇė̕ĩũƽō^ƕUv£ƁQïƵkŏ½ΉÃŭÇ³LŇʻ«ƭ\\lŭD{ʓDkaFÃÄa³ŤđÔGRÈƚhSӹŚsİ«ĐË[¥ÚDkº^Øg¼ŵ¸£EÍöůŉT¡c_ËKYƧUśĵÝU_©rETÏʜ±OñtYwē¨{£¨uM³x½şL©Ùá[ÓÐĥ Νtģ¢\\śnkOw¥±T»ƷFɯàĩÞáB¹ÆÑUwŕĽw]kE½Èå~Æ÷QyěCFmĭZīŵVÁƿQƛûXS²b½KÏ½ĉS©ŷXĕ{ĕK·¥Ɨcqq©f¿]ßDõU³h­gËÇïģÉɋwk¯í}I·œbmÉřīJɥĻˁ×xoɹīlc¤³Xù]ǅA¿w͉ì¥wÇN·ÂËnƾƍdÇ§đ®ƝvUm©³G\\}µĿQyŹlăµEwǇQ½yƋBe¶ŋÀůo¥AÉw@{Gpm¿AĳŽKLh³`ñcËtW±»ÕSëüÿďDu\\wwwù³VLŕOMËGh£õP¡erÏd{ġWÁč|yšg^ğyÁzÙs`s|ÉåªÇ}m¢Ń¨`x¥ù^}Ì¥H«YªƅAÐ¹n~ź¯f¤áÀzgÇDIÔ´AňĀÒ¶ûEYospõD[{ù°]uJqU|Soċxţ[õÔĥkŋÞŭZËºóYËüċrw ÞkrťË¿XGÉbřaDü·Ē÷AÃª[ÄäIÂ®BÕĐÞ_¢āĠpÛÄȉĖġDKwbmÄNôfƫVÉviǳHQµâFù­Âœ³¦{YGd¢ĚÜO {Ö¦ÞÍÀP^bƾl[vt×ĈÍEË¨¡Đ~´î¸ùÎhuè`¸HÕŔVºwĠââWò@{ÙNÝ´ə²ȕn{¿¥{l÷eé^eďXj©î\\ªÑòÜìc\\üqÕ[Č¡xoÂċªbØ­ø|¶ȴZdÆÂońéG\\¼C°ÌÆn´nxÊOĨŪƴĸ¢¸òTxÊǪMīĞÖŲÃɎOvʦƢ~FRěò¿ġ~åŊúN¸qĘ[Ĕ¶ÂćnÒPĒÜvúĀÊbÖ{Äî¸~Ŕünp¤ÂH¾ĄYÒ©ÊfºmÔĘcDoĬMŬS¤s²ʘÚžȂVŦ èW°ªB|ĲXŔþÈJĦÆæFĚêYĂªĂ]øªŖNÞüAfɨJ¯ÎrDDĤ`mz\\§~D¬{vJÂ«lµĂb¤pŌŰNĄ¨ĊXW|ų ¿¾ɄĦƐMTòP÷fØĶK¢ȝ˔Sô¹òEð­`Ɩ½ǒÂň×äı§ĤƝ§C~¡hlåǺŦŞkâ~}FøàĲaĞfƠ¥Ŕd®U¸źXv¢aƆúŪtŠųƠjdƺƺÅìnrh\\ĺ¯äɝĦ]èpĄ¦´LƞĬ´ƤǬ˼Ēɸ¤rºǼ²¨zÌPðŀbþ¹ļD¢¹\\ĜÑŚ¶ZƄ³âjĦoâȴLÊȮĐ­ĚăÀêZǚŐ¤qȂ\\L¢ŌİfÆs|zºeªÙæ§΢{Ā´ƐÚ¬¨Ĵà²łhʺKÞºÖTiƢ¾ªì°`öøu®Ê¾ãÖ"],"encodeOffsets":[[88824,50096]]},"properties":{"cp":[87.617733,43.792818],"name":"新疆","childNum":1}},{"id":"110000","geometry":{"type":"Polygon","coordinates":["@@RºaYÕQaúÍÔiþĩȨWĢü|Ėu[qb[swP@ÅğP¿{\\¯Y²·Ñ¨j¯X\\¯MSvU¯YIŕY{[fk­VÁûtŷmiÍt_H»Ĩ±d`¹­{bwYr³S]§§o¹qGtm_SŧoaFLgQN_dV@Zom_ć\\ßW´ÕiœRcfio§ËgToÛJíĔóu|wP¤XnO¢ÉŦ¯pNÄā¤zâŖÈRpŢZÚ{GrFt¦Òx§ø¹RóäV¤XdżâºWbwŚ¨Ud®bêņ¾jnŎGŃŶnzÚScîĚZen¬"],"encodeOffsets":[[119421,42013]]},"properties":{"cp":[116.405285,39.904989],"name":"北京","childNum":1}},{"id":"120000","geometry":{"type":"Polygon","coordinates":["@@ŬgX§Ü«E¶FÌ¬O_ïlÁgz±AXeµÄĵ{¶]gitgIj·¥ì_iU¨ÐƎk}ĕ{gBqGf{¿aU^fIư³õ{YıëNĿk©ïËZukāAīlĕĥs¡bġ«@dekąI[nlPqCnp{ō³°`{PNdƗqSÄĻNNâyj]äÒD ĬH°Æ]~¡HO¾X}ÐxgpgWrDGpù^LrzWxZ^¨´T\\|~@IzbĤjeĊªz£®ĔvěLmV¾Ô_ÈNW~zbĬvG²ZmDM~~"],"encodeOffsets":[[120237,41215]]},"properties":{"cp":[117.190182,39.125596],"name":"天津","childNum":1}},{"id":"310000","geometry":{"type":"MultiPolygon","coordinates":[["@@ɧư¬EpƸÁx]","@@©²","@@MA","@@QpªKWT§¨","@@bŝÕÕEȣÚƥêImɇǦèÜĠÚÄÓŴ·ʌÇ","@@Sô¤r]ìƬįǜûȬɋŭ×^sYɍDŋŽąñCG²«ªč@h_p¯A{oloY¬j@Ĳ`gQÚpptǀ^MĲvtbe´Rh@oj¨","@@ÆLH{a}Eo¦"]],"encodeOffsets":[[[124702,32062],[124547,32200],[124808,31991],[124726,32110],[124903,32376],[124065,32166],[124870,31965]]]},"properties":{"cp":[121.472644,31.231706],"name":"上海","childNum":7}},{"id":"500000","geometry":{"type":"Polygon","coordinates":["@@TÂÛ`Ùƅően½SêqDu[RåÍ¹÷eXÍy¸_ĺę}÷`M¯ċfCVµqŉ÷Zgg^d½pDOÎCn^uf²ènh¼WtƏxRGg¦pVFI±G^Ic´ecGĹÞ½sëÆNäÌ¤KÓe¯|R¸§LÜkPoïƭNï¶}Gywdiù©nkĈzj@Óc£»Wă¹Óf§c[µo·Ó|MvÛaq½«è\\ÂoVnÓØÍ²«bq¿ehCĜ^Q~ Évýş¤²ĮpEĶyhsŊwH½¿gÅ¡ýE¡ya£³t\\¨\\vú¹¼©·Ñr_oÒý¥et³]Et©uÖ¥±ă©KVeë]}wVPÀFA¨ąB}qTjgRemfFmQFÝMyùnÑAmÑCawu_p¯sfÛ_gI_pNysB¦zG¸rHeN\\CvEsÐñÚkcDÖĉsaQ¯}_UzÁē}^R Äd^ÍĸZ¾·¶`wećJE¹vÛ·HgéFXjÉê`|ypxkAwWĐpb¥eOsmzwqChóUQl¥F^lafanòsrEvfQdÁUVfÎvÜ^eftET¬ôA\\¢sJnQTjPØxøK|nBzĞ»LYFDxÓvr[ehľvN¢o¾NiÂxGpâ¬zbfZo~hGi]öF||NbtOMn eA±tPTLjpYQ|SHYĀxinzDJÌg¢và¥Pg_ÇzIIII£®S¬ØsÎ¼¥¨^LnGĲļĲƤjÎƀƾ¹¸ØÎezĆT¸}êÐqHðqĖä¥^CÆIj²p\\_ æüY|[YxƊæu°xb®Űb@~¢NQt°¶Sæ Ê~rǉĔëĚ¢~uf`faĔJåĊnÔ]jƎćÊ@£¾a®£Ű{ŶĕFègLk{Y|¡ĜWƔtƬJÑxq±ĢN´òKLÈÃ¼D|s`ŋć]Ã`đMùƱ¿~Y°ħ`ƏíW½eI½{aOIrÏ¡ĕŇapµÜƃġ²"],"encodeOffsets":[[111728,31311]]},"properties":{"cp":[106.504962,29.533155],"name":"重庆","childNum":1}},{"id":"810000","geometry":{"type":"MultiPolygon","coordinates":[["@@AlFi","@@mp","@@EpHo","@@rMUwAS¬]","@@ea¢pl¸Eõ¹hj[]ÔCÎ@lj¡uBX´AI¹[yDU]W`çwZkmcMpÅv}IoJlcafŃK°ä¬XJmÐ đhI®æÔtSHnEÒrÄc"]],"encodeOffsets":[[[117111,23002],[117072,22876],[117045,22887],[116882,22747],[116975,23082]]]},"properties":{"cp":[114.173355,22.320048],"name":"香港","childNum":5}},{"id":"820000","geometry":{"type":"Polygon","coordinates":["@@áw{Îr"],"encodeOffsets":[[116285,22746]]},"properties":{"cp":[113.54909,22.198951],"name":"澳门","childNum":1}}],"UTF8Encoding":true});