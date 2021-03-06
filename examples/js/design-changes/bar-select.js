/* eslint-disable */

(function () {
    let env = window.muze();
    const DataModel = window.muze.DataModel;

    d3.json('/data/cars.json', (data) => {
        const schema = [{
            name: 'Name',
            type: 'dimension'
        },
        {
            name: 'Maker',
            type: 'dimension'
        },
        {
            name: 'Miles_per_Gallon',
            type: 'measure'
        },
        {
            name: 'Displacement',
            type: 'measure',
            defAggFn: 'min'
        },
        {
            name: 'Horsepower',
            type: 'measure'
        },
        {
            name: 'Weight_in_lbs',
            type: 'measure'
        },
        {
            name: 'Acceleration',
            type: 'measure',
        },
        {
            name: 'Origin',
            type: 'dimension',
            displayName: "Origin2"
        },
        {
            name: 'Cylinders',
            type: 'dimension'
        },
        {
            name: 'Year',
            type: 'dimension',
            // subtype: 'temporal',
            // format: '%Y-%m-%d'
        }
        ];

    let rootData = new DataModel(data, schema)
    const canvas = env.canvas();
    
    canvas
        .data(rootData)
        .rows(['Acceleration'])
        .columns(['Maker'])
        .layers([{
            mark: 'bar'
        }])
        // .size('Maker')
        .color('Origin')
        .size('Acceleration')
        .mount('#chart')
        .height(450)
        .width(650)
        .title('Charts');

        setTimeout(() => {
            var element = document.getElementById('chart');
            canvas.firebolt().dispatchBehaviour('select', {
                criteria: {
                    // Acceleration: [400, 500],
                    Maker: ['ford', 'toyota', 'mercury']
                }
            });
            canvas.firebolt().dispatchBehaviour('highlight', {
                criteria: {
                    // Acceleration: [400, 500],
                    Maker: ['volkswagen']
                }
            });
            element.classList.add('animateon');
        }, 2000);
    })
})();