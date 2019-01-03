module.exports = {
    dataset: {
        sjl: `select
                xmmc as 项目名称,
                sum(fysq_ssje) * 100 / sum(fysq_ysje) as 收缴率
            from t_sjlvxx
            group by xmmc
            order by 收缴率`,
        qjl: `select
                xmmc as 项目名称,
                sum(fysq_qsje) * 100 / sum(fysq_ysje) as 欠缴率
            from t_sjlvxx
            group by xmmc
            order by 欠缴率`
    },
    controls: [
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
                    title: 'test test test 1',
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
                    title: 'test test test',
                    url: 'chart/6'
                },
                {
                    Class: 'ChartPanel',
                    title: 'test test test',
                    url: 'chart/6'
                }
            ]
        },
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
                    title: 'test test test 1',
                    url: 'chart/6',
                    children: [
                        {
                            Class: 'HomeChart',
                            dock: 'top',
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
                    title: 'test test test 1',
                    url: 'chart/6'
                },
                {
                    Class: 'ChartPanel',
                    title: 'test test test 1',
                    url: 'chart/6'
                }
            ]
        },
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
                    padding: '0 20',
                    layout: {
                        type: 'table',
                        spacingX: 10,
                        data: '*[* * *]'
                    },
                    children: [
                        {
                            Class: 'HomeBox',
                            url: 'chart/6'
                        },
                        {
                            Class: 'HomeBox',
                            url: 'chart/6'
                        },
                        {
                            Class: 'HomeBox',
                            url: 'chart/6'
                        }
                    ]
                },
                {
                    Class: 'Panel',
                    dock: 'fill'
                }
            ]
        }
    ]
};

