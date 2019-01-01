var host = flyingon.view({

    host: document.body,

    template: {

        Class: 'Panel',
        backgroundColor: '#134f73',
        layout: {
            type: 'dock',
            spacingX: 0,
            spacingY: 1
        },
        children: [
            {
                Class: 'Panel',
                layout: {
                    type: 'dock',
                    spacingX: 10
                },
                dock: 'top',
                height: 50,
                border: 1,
                padding: 10,
                backgroundColor: 'rgb(7, 5, 26)',
                color: 'white',
                children: [
                    {
                        Class: 'Label',
                        dock: 'left',
                        width: 200,
                        height: '100%',
                        text: '顺彩BI智能分析系统',
                        fontSize: '20px'
                    },
                    {
                        Class: 'Label',
                        id: 'changeuser',
                        dock: 'right',
                        width: 100,
                        text: '<span class="icon-changeuser" style="font-family:iconfont;font-size:16px;padding:0 4px;"></span><span>切换账号</span>',
                        html: true,
                        fontSize: '14px',
                        color: 'white',
                        cursor: 'pointer'
                    },
                    {
                        Class: 'Label',
                        id: 'modifypwd',
                        dock: 'right',
                        width: 100,
                        text: '<span class="icon-modifypwd" style="font-family:iconfont;font-size:16px;padding:0 4px;"></span><span>修改密码</span>',
                        html: true,
                        fontSize: '14px',
                        color: 'white',
                        cursor: 'pointer'
                    }
                ]
            },
            {
                Class: 'Tree',
                id: 'menu',
                dock: 'left',
                width: 200,
                maxWidth: 300,
                border: 0,
                fontSize: '14px',
                backgroundColor: 'rgb(7, 5, 26)',
                color: 'white'
                //树上结节的图标颜色如何设置？
                
            },
            {
                Class: 'Splitter',
                dock: 'left'
            },
            {
                Class: 'Tab',
                id: 'host',
                dock: 'fill',
                header: 0,
                border: 0,
                size: 'auto',
                selected: 0,
                backgroundColor: 'white'// 'rgb(7, 5, 26)'
            }
        ]
    },

    created: function () {


        var menu = this.findById('menu')[0];

        var tab = this.findByType('Tab')[0];

        var doc = document;

        var user = localStorage.getItem('user');

        var logon = doc.querySelector('.logon-host');

        var pwdSet = this.findById('modifypwd')[0];

        var changeuser = this.findById('changeuser')[0];


        this.findById('import').on('change', function (event) {

            flyingon.importXlsx(event.dom.files[0], function (data) {
               
                debugger
            });
        });


        if (user) {
            doc.getElementById('user').value = user;
            loadMain();
        }
        else {
            logon.style.display = 'block';
        }


        menu.on('node-click', function (event) {

            var node = event.node;
            openPlugin(node, node.get('url'), false);
        });



        function loadMain() {

            var sUserAccount = '';

            flyingon.http.get('main').json(function (data) {

                if (data) {
                    var globals = window.globals || (window.globals = {});

                    // 侦听路由地址变化
                    flyingon.route.listen(loadPlugin);

                    globals.user = data[1];
                    // 
                    sUserAccount = '<span class="icon-changeuser" style="font-family:iconfont;font-size:16px;padding:0 4px;"></span><span>' + globals.user.useraccount + '</span>';
                    changeuser.text(sUserAccount);

                    menu.splice(0);
                    menu.push.apply(menu, globals.menutree = data[0]);
                    menu.expandTo(2); // 展开第2级

                    // 加载默认插件
                    loadPlugin(location.hash.replace(/^[#!]+/, ''));

                    logon.style.display = 'none';
                    logon.querySelector('input[type="password"]').value = '';
                }
                else {
                    logon.style.display = 'block';
                }
            });
        }


        function loadPlugin(url) {

            // 根据url查找树节点
            var node = url && menu.findNode(function (node) {

                var any = node.get('url');

                if (any === url) {
                    return node;
                }

                if (any && url.indexOf(any) === 0) {
                    // 节点url与原始url不同则同步(多级路由时可能会不同)
                    node.set('url', url);
                    return node;
                }
            });

            if (node) {
                openPlugin(node, url);
            }
            else {
                menu.current(null);
            }
        }


        // 打开指定节点对应的插件页
        function openPlugin(node, url, current) {

            if (node && url && node.length <= 0) {

                var text = node.text(),
                    options = {
                        key: text, // text作为打开的key
                        text: text,
                        icon: node.icon()
                    };

                if (url === 'pages/home.js') {
                    options.plugin = flyingon.HomePlugin;
                }
                else if (url.indexOf('pages') < 0) {
                    options.plugin = flyingon.ChartPlugin;
                    options.data = node.storage();
                }

                // 路由到节点对应的插件
                flyingon.route(tab, url, options);

                // 设置当前树节点
                if (current !== false) {
                    menu.current(node);
                    menu.scrollTo(node);
                }
            }
        }


        logon.querySelector('#logon').onclick = function () {

            var txtUser = doc.getElementById('user'),
                txtPwd = doc.getElementById('password'),
                user = txtUser.value,
                pwd = txtPwd.value;

            if (!user) {
                alert('请输入用户名!');
                txtUser.focus();
                return;
            }

            if (!pwd) {
                alert('密码不能为空!');
                txtPwd.focus();
                return;
            }

            user = user.toLowerCase();

            //const encrypt
            flyingon.http.get('logon?user=' + user + '&password=' + md5('s0c7k5j5@' + pwd)).json(function (data) {

                if (data) {
                    localStorage.setItem('user', user);
                    loadMain();
                }
                else {
                    alert("帐号或密码错误!");
                    txtPwd.focus();
                }
            });
        }


        pwdSet.on('click', function (event) {

            //alert("修改密码");

            var dialog = window.dialog = new flyingon.Dialog();

            // dialog.resizable(true);
            dialog.text('修改密码');
            dialog.padding(8);
            dialog.layout('dock');
            dialog.width(380);
            dialog.height(200);


            dialog.push(
                {
                    Class: 'Panel',
                    height: 34,
                    layout: 'dock',
                    dock: 'bottom',
                    children: [
                        { Class: 'Button', id: 'cancel', text: '取消', height: 28, width: 85, dock: 'right', icon: 'icon-cancel' },
                        { Class: 'Button', id: 'ok', text: '确定', height: 28, width: 85, dock: 'right', icon: 'icon-ok' }
                    ]
                },
                {
                    Class: 'Panel', dock: 'fill', layout: 'vertical-line',
                    children: [
                        {
                            Class: 'Box',
                            width: 360,
                            height: 'auto',
                            children: [
                                { Class: 'Title', text: '旧密码', width: 100 },
                                { Class: 'Password', id: 'oldpwd', width: 200, placeholder: '请输入旧密码', required: true },
                                { Class: 'Hint', width: 210, textAlign: 'right', line: true }
                            ]
                        },

                        {
                            Class: 'Box',
                            width: 360,
                            height: 'auto',
                            children: [
                                { Class: 'Title', text: '新密码', width: 100 },
                                { Class: 'Password', id: 'newpwd', width: 200, placeholder: '请输入新密码', required: true },
                                { Class: 'Hint', width: 210, textAlign: 'right', line: true }
                            ]
                        },
                        {
                            Class: 'Box',
                            width: 360,
                            height: 'auto',
                            children: [
                                { Class: 'Title', text: '确定新密码', width: 100 },
                                { Class: 'Password', id: 'newpwd2', width: 200, placeholder: '请再次输入新密码', required: true },
                                { Class: 'Hint', width: 210, textAlign: 'right', line: true }
                            ]
                        },
                    ]

                }

            );

            dialog.showDialog();

            dialog.on('click', function (event) {

                switch (event.target.id()) {
                    case 'ok':
                        pwdSetOKclick();
                        break;

                    case 'cancel':
                        this.close();
                        break;
                }
            });

        });

        //切换账号，重刷登录页
        changeuser.on('click', function (event) {

            localStorage.removeItem('user');
            location.hash = '';
            location.reload();
        });


        function pwdSetOKclick() {

            var txtOldpwd = dialog.findById('oldpwd')[0];
            var txtnewpwd = dialog.findById('newpwd')[0];
            var txtnewpwd2 = dialog.findById('newpwd2')[0];

            if (txtOldpwd.value() === '') {
                flyingon.toast('请输入旧密码！');
                return false;
            }
            if (txtnewpwd.value() === '') {
                flyingon.toast('新密码不能为空！');
                return false;
            }
            if (txtnewpwd2.value() === '') {
                flyingon.toast('确定新密码不能为空！');
                return false;
            }
            if (txtOldpwd.value() === txtnewpwd2.value()) {
                flyingon.toast('新密码不能与旧密码相同，请重新输入！');
                return false;
            }
            if (txtnewpwd.value() !== txtnewpwd2.value()) {
                flyingon.toast('两次l输入的新密码不相同，请重新输入！');
                return false;
            }

            var keys = [], logs = [];

            keys.push(user);
            keys.push(md5('s0c7k5j5@' + txtOldpwd.value()));
            keys.push(md5('s0c7k5j5@' + txtnewpwd.value()));
            logs.push('用户 修改数据:{"密码修改"}');


            flyingon.http.post('mainsetpwd', JSON.stringify({ data: keys, log: logs })).then(function (result) {

                if (result > 0) {
                    flyingon.showMessage('修改密码失败', '旧密码输入不对，请重新输入！', 'warn', 'ok');
                    return false;
                }
                else {
                    dialog.close();
                    flyingon.toast('修改密码成功！');
                };
            });
        };




        // 窗口变化时自动调整内容
        flyingon.dom_on(window, 'resize', function () {

            host && host.update();
        });

        // md5
        var hexcase = 0;
        var chrsz = 8;

        function md5(s) {
            return binl2hex(core_md5(str2binl(s), s.length * chrsz))
        };

        function core_md5(x, len) {

            x[len >> 5] |= 128 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd)
            }

            return Array(a, b, c, d)
        }

        function md5_cmn(q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t)
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
        }

        function safe_add(x, y) {
            var lsw = (x & 65535) + (y & 65535);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 65535)
        }

        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt))
        }

        function str2binl(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
            }
            return bin
        }

        function binl2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
            }
            return str
        }


    }

});
