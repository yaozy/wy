module.exports = {
    dataset: {
        //-- 公司总览
        gszl: `select 
            (select count(1) from orginfo where 1=1 and isuse=1) as '物业项目数',
            round(sum(feerec) / 10000,2) as '总应收(万元)',
            round(sum(feepaid) / 10000,2) as '总已收(万元)',
            round(sum(feerec) / 10000,2) as '总欠收(万元)'
        from t_hp_feetrend
        where 1=1`,


        //-- 出租率
        czl: `select 
                round(d1.arearent*100.00 / d1.areatotal,2) as '出租率' ,
                d1.arearent as '出租面积'
            from (select  
                            sum(areatotal) as areatotal, 
                            sum(arearent) as arearent 
                    from t_hp_rentrate 
                    where 1=1
            ) d1`,

        //-- 租金预测分析
        zjycfx: `select 
                month,
                sum(rentfor) as '月租金预测', 
                sum(rentrec) as '月租金应收',
                sum(rentarea) as '月总出租面积'
            from t_hp_rentfore
            where 1=1
            group by MONTH 
            order by MONTH`,

        //-- 月支出分析
        yzcfx: `select 
                d1.feetype as '物业分类',
                round(d1.fee*100.00 / (select sum(fee) as sumfee from t_hp_expendfeelist where 1=1 and month = MONTH(CURDATE())),2) as '占比' 
            from (select
                    feetype,
                    sum(fee) as fee
                from t_hp_expendfeelist
                where 1=1
                    and month = MONTH(CURDATE())
                group by feetype) d1
            order by d1.fee desc`,

        //-- 月支出分析 --本年支出
        yzcfx_bn: `select sum(fee) as '本年支出' 
            from t_hp_expendfeelist
            where 1=1`,

        //-- 月支出分析 --本月支出
        yzcfx_by: `select sum(fee) as '本月支出' 
            from t_hp_expendfeelist
            where 1=1
                and month = MONTH(CURDATE())`,

        //-- 客服工单数统计
        khgdstj: `select 
                d1.总数,
                concat(cast(round(d1.完成数*100.00 / d1.总数,2) as CHAR),'%') as '完成率' ,
                concat(cast(round(d1.满意数*100.00 / d1.总数,2) as CHAR),'%') as '满意率' ,
                concat(cast(round(d1.投诉数*100.00 / d1.总数,2) as CHAR),'%') as '投诉率' 
            from (select 
                    sum(wototal) as '总数',
                    sum(wofinish) as '完成数',
                    sum(wodegree) as '满意数',
                    sum(worecall) as '投诉数'
                from t_hp_cstcount
                where 1=1) d1`,

        //-- 月应收趋势
        yysqs: `select 
            d1.month as '月份',
            round(d1.应收 / 10000,2) as '应收',
            round(d1.已收 / 10000,2) as '已收',
            round(d1.欠收 / 10000,2) as '欠收'
        from (select 
                month,
                sum(feerec) as '应收',
                sum(feepaid) as '已收',
                sum(feerec) as '欠收'
            from t_hp_feetrend
            where 1=1
            group by MONTH
            order by MONTH) d1`,

        //-- 收缴率排行榜（-- 前10名，收缴率倒排）
        sjlphb: `select 
                (select orgname from orginfo where orgcode = d2.orgcode) as '物业项目名称',
                d2.收缴率
            from (select 
                    orgcode,
                    round(d1.已收*100.00 / d1.应收,2) as '收缴率' 
                from (select 
                            orgcode,
                            sum(feerec) as '应收',
                            sum(feepaid) as '已收',
                            sum(feerec) as '欠收'
                    from t_hp_feetrend
                    where 1=1
                    group by orgcode) d1  
                )d2
            order by d2.收缴率 desc
            LIMIT 10  `,

        //-- 财务收入排名
        cwsrzb: `select 
                    d1.feetype as '收入分类',
                    round(d1.fee / 10000,2) as '收入(万元)',
                    round(d1.fee*100.00 / (select sum(fee) as sumfee from t_hp_incomefeelist where 1=1),2) as '收入占比' 
                from (select
                        feetype,
                        sum(fee) as fee
                    from t_hp_incomefeelist
                    where 1=1
                    group by feetype) d1
                order by d1.fee desc `

    },
    controls: [
        //左边
        {
            Class: 'Panel',
            dock: 'left',
            width: '25%',
            padding: 5,
            layout: {
                type: 'table',
                spacingY: 10,
                data: '* * *'
            },
            children: [
                {
                    Class: 'ChartPanel',
                    title: '出租率和出租总面积',
                    url: 'chart/6',
                    children: [
                        {
                            Class: 'HomeChart',
                            table: 'sjl',
                            width: '100%',
                            height: '100%',
                            template: {
                                category: '项目名称',
                                value: ['收缴率'],
                                legend: {},
                                tooltip: {},
                                xAxis: {
                                    type: 'category'
                                },
                                yAxis: [
                                    { name: '收缴率', type: 'value' }
                                ],
                                series: [
                                    { name: '收缴率', type: 'bar' }
                                ]
                            }
                        }
                    ]
                },
                {
                    Class: 'ChartPanel',
                    title: '合同平均单价和租金预测分析',
                    url: 'chart/6'
                },
                {
                    Class: 'ChartPanel',
                    title: '月支出分析',
                    url: 'chart/6'
                }
            ]
        },

        //右边
        {
            Class: 'Panel',
            dock: 'right',
            width: '25%',
            padding: 5,
            layout: {
                type: 'table',
                spacingY: 10,
                data: '* * *'
            },
            children: [
                {
                    Class: 'ChartPanel',
                    title: '月应收趋势',
                    url: 'chart/6',
                    children: [
                        {
                            Class: 'HomeChart',
                            width: '100%',
                            height: '100%',
                            table: 'sjl',
                            template: {
                                category: ['项目名称'],
                                value: ['收缴率'],
                                legend: {},
                                tooltip: {},
                                xAxis: {
                                    type: 'category'
                                },
                                yAxis: [
                                    { name: '收缴率', type: 'value' }
                                ]
                            }
                        }
                    ]
                },
                {
                    Class: 'ChartPanel',
                    title: '收缴率排行榜',
                    url: 'chart/6'
                },
                {
                    Class: 'ChartPanel',
                    title: '财务收入排名',
                    url: 'chart/6'
                }
            ]
        },

        //中间，底边
        {
            Class: 'Panel',
            dock: 'fill',
            padding: 5,
            layout: 'dock',
            children: [
                {
                    Class: 'Panel',
                    dock: 'bottom',
                    height: 80,
                    padding: '2 20',
                    layout: {
                        type: 'table',
                        spacingX: 10,
                        data: '*[* * * *]'
                    },
                    children: [
                        //客服工单：总数
                        {
                            Class: 'HomeBox',
                            //url: 'chart/6',
                            padding: '10 0',
                            layout: {
                                type: 'table',
                                data: '*[40 *[* *]]'
                            },
                            children: [
                                {
                                    Class: 'HomeIcon',
                                    icon: 'icon-charttype',
                                    height: 30,
                                    alignY: 'middle',
                                    color: 'skyblue'
                                },
                                {
                                    Class: 'HomeText',
                                    text: '工单数',
                                    color: 'DarkGray'
                                },
                                {
                                    Class: 'HomeText',
                                    table: 'khgdstj',
                                    field: '总数',
                                    textShadow: '0 0 4px red',
                                    fontSize: '20px'
                                }
                            ]
                        },
                        //客服工单：完成率
                        {
                            Class: 'HomeBox',
                            //url: 'chart/6',
                            padding: '10 0',
                            layout: {
                                type: 'table',
                                data: '*[40 *[* *]]'
                            },
                            children: [
                                {
                                    Class: 'HomeIcon',
                                    icon: 'icon-charttype',
                                    height: 30,
                                    alignY: 'middle',
                                    color: 'skyblue'
                                },
                                {
                                    Class: 'HomeText',
                                    text: '完成率',
                                    color: 'DarkGray'
                                },
                                {
                                    Class: 'HomeText',
                                    table: 'khgdstj',
                                    field: '完成率',
                                    textShadow: '0 0 4px red',
                                    fontSize: '20px'
                                }
                            ]
                        },
                        //客服工单：满意率
                        {
                            Class: 'HomeBox',
                            //url: 'chart/6',
                            padding: '10 0',
                            layout: {
                                type: 'table',
                                data: '*[40 *[* *]]'
                            },
                            children: [
                                {
                                    Class: 'HomeIcon',
                                    icon: 'icon-charttype',
                                    //height: 30,
                                    alignY: 'middle',
                                    color: 'skyblue'
                                },
                                {
                                    Class: 'HomeText',
                                    text: '满意率',
                                    color: 'DarkGray'
                                },
                                {
                                    Class: 'HomeText',
                                    table: 'khgdstj',
                                    field: '满意率',
                                    textShadow: '0 0 4px red',
                                    fontSize: '20px'
                                }
                            ]
                        },
                        //客服工单：投诉率
                        {
                            Class: 'HomeBox',
                            //url: 'chart/6',
                            padding: '10 0',
                            layout: {
                                type: 'table',
                                data: '*[40 *[* *]]'
                            },
                            children: [
                                {
                                    Class: 'HomeIcon',
                                    icon: 'icon-charttype',
                                    //height: 30,
                                    alignY: 'middle',
                                    color: 'skyblue'
                                },
                                {
                                    Class: 'HomeText',
                                    text: '投诉率',
                                    color: 'DarkGray'
                                },
                                {
                                    Class: 'HomeText',
                                    table: 'khgdstj',
                                    field: '投诉率',
                                    textShadow: '0 0 4px red',
                                    fontSize: '20px',
                                    fontFamily:'digital'
                                }
                            ]
                        }
                    ]
                },
                {
                    Class: 'HomeMap',
                    dock: 'fill'
                }
            ]
        }
    ]
};

