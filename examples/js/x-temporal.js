/* eslint-disable */

(function () {
    var env = window.muze();
    var DataModel = window.muze.DataModel;

    d3.json('/data/cars.json', function (data) {
        var jsonData = data,
            schema = [{
            name: 'Name',
            type: 'dimension'
        }, {
            name: 'Maker',
            type: 'dimension'
        }, {
            name: 'Miles_per_Gallon',
            type: 'measure'
        }, {
            name: 'Displacement',
            type: 'measure'
        }, {
            name: 'Horsepower',
            type: 'measure'
        }, {
            name: 'Weight_in_lbs',
            type: 'measure'
        }, {
            name: 'Acceleration',
            type: 'measure'
        }, {
            name: 'Origin',
            type: 'dimension'
        }, {
            name: 'Cylinders',
            type: 'dimension'
        }, {
            name: 'Year',
            type: 'dimension',
            subtype: 'temporal',
            format: '%Y-%m-%d'
        }];
        var dm = new DataModel(jsonData, schema);
        var canvas = env.canvas();

        canvas.data(dm).width(700).height(500).mount('#chart')
        .rows(['Acceleration'])
        .columns(['Year'])
        // .columns([['Year'], []])
        .color('Origin')
        // .title('hello 1')
        // .subtitle('hello again 1')
        .layers([{
            mark: 'area'
        }])
        .config({
            axes: {
                x: {
                    tickFormat: (value, rawValue, tickIndex, ticks) => value
                }
            }
        });
        setTimeout(function() {
            canvas
                // .title('hello')
                // .subtitle('hello again')
                // .rows([[],['Acceleration']])
                // .columns([[], ['Year']])
        }, 2000);
        // setTimeout(function () {
        //     canvas.config({
        //         axes: {
        //             x: {
        //                 labels: {
        //                     rotation: 90
        //                 }
        //             }
        //         }
        //     });
        // }, 2000);
    });
})();
