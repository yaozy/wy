flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: 'vertical-line',

        children: [
            
            {
                Class: 'Panel',
                border: 1,
                borderStyle: 'dashed',
                borderColor: 'red',
                width: 780,

                style: 'border-style:solid;border-color:red'
            },

            {
                Class: 'Grid',
                width: 780,
                height: 240,
                locked: '2 2',

                columns: [
                    { name: 'F1', title: 'F1', type: 'checkbox' },
                    { name: 'F2', title: 'F2', type: 'textbox', align: 'right' },
                    { name: 'F3', title: 'F3', type: 'number', digits: 2, format: '¥{0}', button: 'none', align: 'right' },
                    { name: 'F4', title: 'F4', type: 'date' },
                    { name: 'F5', title: 'F5', type: 'time' },
                    { name: 'F6', title: 'F6', type: 'combobox', checked: 'checkbox', popupWidth: 100 },
                    { name: 'F7', title: 'F7', type: 'textbox' },
                    { name: 'F8', title: 'F8', type: 'textbox' },
                    { name: 'F9', title: 'F9', type: 'textbox' },
                    { name: 'F10', title: 'F10', type: 'textbox' }
                ]
            }
        ]
    },

    created: function () {
//
    }


});