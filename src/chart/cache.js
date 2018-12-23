const isArray = Array.isArray;

const vm = require('vm');
const sandbox = vm.createContext({}); // Empty Context

const app = require('../base/app');


let cache = null;



const templates = {

    bar: {
        legend: {},
        tooltip: {},
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: { type: 'bar' }
    },

    verticalbar: {
        legend: {},
        tooltip: {},
        xAxis: { type: 'value' },
        yAxis: { type: 'category' },
        series: { type: 'bar' }
    },

    line: {
    },

    pie: {
    }
}



function serialize(array, target) {

    if (isArray(target))
    {
        array.push('[');

        for (let i = 0, l = target.length; i < l; i++)
        {
            if (i > 0)
            {
                array.push(',');
            }

            serializeValue(array, target[i]);
        }

        array.push(']');
    }
    else
    {
        let flag;

        array.push('{');

        for (let name in target)
        {
            if (flag)
            {
                array.push(',"', name, '":');
            }
            else
            {
                flag = 1;
                array.push('"', name, '":');
            }

            serializeValue(array, target[name]);
        }

        array.push('}');
    }
}


function serializeValue(array, value) {

    if (value == null)
    {
        array.push('null');
    }
    else if (value)
    {
        switch (typeof value)
        {
            case 'boolean':
            case 'number':
                array.push(value);
                break;

            case 'string':
                array.push(JSON.stringify(value));
                break;

            case 'function':
                array.push(JSON.stringify('' + value));
                break;

            case 'object':
                serialize(array, value);
                break;
        }
    }
    else
    {
        array.push(value === '' ? '""' : value);
    }
}


function mixin(target, source) {

    for (let name in source)
    {
        let value = source[name];

        if (!value || typeof value !== 'object')
        {
            target[name] = value;
        }
        else if (isArray(value))
        {
            target[name] = copy_array(value);
        }
        else
        {
            target[name] = mixin({}, value);
        }
    }

    return target;
}


function copy_array(items) {

    let array = [];

    for (let i = items.length; i--;)
    {
        let item = items[i];

        if (!item || typeof item !== 'object')
        {
            array[i] = item;
        }
        else if (item instanceof Array)
        {
            array[i] = copy_array(item);
        }
        else
        {
            array[i] = mixin({}, item);
        }
    }

    return array;
}



function parse_computed(data) {

    data = data.computed;

    if (!data)
    {
        return null;
    }

    let array = [];

    for (let name in data)
    {
        let fn = data[name];

        if (typeof fn === 'function')
        {
            fn = '' + fn;
            fn = fn.substring(fn.indexOf('{') + 1);
            fn = fn.substring(0, fn.lastIndexOf('}'));
        }
        else
        {
            fn = '\nreturn ' + fn + ';\n';
        }

        if (array[0])
        {
            array.push(',');
        }
        else
        {
            array.push('({');
        }

        array.push(`"${name}": function (row) {with (row){${fn}}}\n\n`);
    }

    if (array[0])
    {
        array.push('})');
        return JSON.stringify(array.join(''));
    }

    return null;
}


function parse_config(data) {

    let template = data.template;
    let grid = data.grid;
    let array = data.drilldown;
    let fields = data.dataset.fields.slice(0);
    let item, any;

    if (typeof template === 'string')
    {
        template = templates[template] || templates.bar;
    }

    if (array)
    {
        if (!Array.isArray(array))
        {
            array = [array];
        }

        var value = [];

        for (let i = array.length; i--;)
        {
            item = array[i];

            item.category = item.category || data.category || [];
            item.value = (any = item.value || data.value) || [];
            item.grid = item.grid || grid || null;

            if (any)
            {
                for (let j = any.length; j--;)
                {
                    if (value.indexOf(any[j]) < 0)
                    {
                        value.push(any[j]);
                    }
                }
            }

            if (any = item.template)
            {
                if (any.extend === false)
                {
                    delete any.extend;
                }
                else
                {
                    if (typeof any === 'string')
                    {
                        any = templates[any] || templates.bar;
                    }

                    item.template = mixin(mixin({}, template), any);
                }
            }
            else if (template)
            {
                item.template = template;
            }
            else
            {
                return '';
            }
        }

        // 统计所有用到的统计字段
        array.unshift(fields, value);
        any = array;
    }
    else if (template)
    {
        any = {
            category: data.category || [],
            value: data.value || [],
            template: template,
            fields: fields,
            grid: template.grid || grid || null
        }
    }
    else
    {
        return '';
    }

    serialize(array = [], any);
    return array.join('');
}


function analysis_sql(dataset) {

    let array = [];
    let table = dataset.table;
    let fields = dataset.fields;
    let groupby = dataset.groupby;
    let groupfields = groupby && groupby.by && groupby.fields;
    let link = dataset.link;
    let exists = dataset.exists;
    let params;
    let any;

    for (let i = 0, l = fields.length; i < l; i++)
    {
        let field = fields[i];
        let name = field.field || field.expression;

        if (!name)
        {
            continue;
        }

        let sum = groupfields && groupfields[name] || '';
        let as = " as '" + field.name + "'";

        if (link && (any = link[name]) && any.table && any.field && any.output)
        {
            array.push(sum + '(select ' 
                + any.output
                + ' from ' + any.table
                + ' where ' + any.field + '=' + table + '.' + name
                + ')' + as);
        }
        else if (sum)
        {
            array.push('sum(' + name + ')' + as);
        }
        else
        {
            array.push(name + as);
        }
    }

    array = ['select ', array.join(',') || '*', ' from ', table];

    if (exists)
    {
        array.push(' where');

        for (let name in exists)
        {
            any = exists[name];

            array.push(' exists(select 1 from ', any.table,
                ' where ', any.field, '=', table, '.', name);

            if (any = any.where)
            {
                for (name in any)
                {
                    let value = any[name];

                    if (value)
                    {
                        array.push(' and ', name);

                        if (value[0] === '@')
                        {
                            (params || (params = [])).push(value.substring(1));
                            array.push('=?');
                        }
                        else if (value >= 0 || value < 0)
                        {
                            array.push('=', value);
                        }
                        else
                        {
                            array.push("='" + value.replace(/\'/g, '\\\'') + "'");
                        }
                    }
                    else
                    {
                        array.push(' and ', name, value === '' ? "=''" : ' is null');
                    }
                }
            }

            array.push(')');
        }
    }

    if (groupby && (any = groupby.by))
    {
        array.push(' group by ', any);
    }

    if (any = dataset.orderby)
    {
        array.push(' order by ', any);
    }

    return [array.join(''), params];
}



async function load() {

    let data = await app.sqlclient.query('select id, chartjson from chartinfo');
    let keys = Object.create(null);

    for (let i = data.length; i--;)
    {
        let item = data[i];
        keys[item.id] = item.chartjson;
    }

    return cache = keys;
}



exports.find = async function (chartId) {

    let keys = cache || await load();
    let data = keys[chartId];

    if (data)
    {
        if (typeof data === 'string')
        {
            data = vm.runInContext('(' + data + ')', sandbox);
            
            let dataset = data.dataset;

            if (!dataset || !dataset.table || !dataset.primarykey || !dataset.fields)
            {
                data = {};
            }
            else
            {
                let sql = analysis_sql(dataset);

                data = {
                    dataset: dataset,
                    computed: parse_computed(data),
                    config: parse_config(data),
                    sql: sql
                };
            }

            return keys[chartId] = data;
        }

        return data;
    }
}


exports.clearCache = function (chartId) {

    if (chartId)
    {
        if (cache)
        {
            delete cache[chartId];
        }
    }
    else
    {
        cache = null;
    }
}

