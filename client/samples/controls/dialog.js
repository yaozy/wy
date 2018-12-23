flyingon.widget({

    template: {

        Class: 'Plugin',
        padding: 8,
        layout: 'vertical-line',

        children: [
            { Class: 'Button', height: 40 }
        ]
    },

    created: function () {

        // function createControls(parent) {

        //     flyingon.each('show,showDialog', function (item) {

        //         parent.push(new flyingon.Button().text(item).on('click', onclick));
        //     });
        // };

        function onclick(e) {

            var dialog = window.dialog = new flyingon.Dialog();

            dialog.resizable(true);
            dialog.text('演示窗口');
            dialog.padding(8);

            dialog.push({
                Class: 'Button', text: 'text'
            });
            dialog.showDialog();

            // createControls(dialog);
            // dialog[e.target.text()]();
        };

        this[0].on('click', onclick)

        // createControls(this[0]);
    }


});
