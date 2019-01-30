/* eslint disable */
const env = muze();
const DataModel = muze.DataModel;

d3.json('../../data/cars.json', (data) => {
    const jsonData = data;
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
        type: 'measure'
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
        type: 'measure'
    },
    {
        name: 'Origin',
        type: 'dimension'
    },
    {
        name: 'Cylinders',
        type: 'dimension'
    },
    {
        name: 'Year',
        type: 'dimension',
        subtype: 'temporal',
        format: '%Y-%m-%d'
    }
    ];

    const rootData = new DataModel(jsonData, schema);
    const rows = ['Cylinders', 'Horsepower'];
    const columns = ['Year'];
    const canvas = env.canvas()
.rows(rows)
.columns(columns)
.height(800)
.width(500)
.data(rootData)
.color('Origin')

.mount('#chart');

    setTimeout(() => {
        canvas
.config({
    axes: {
        y: {
            tickFormat: val => `${val}$$`
        },
        x: {
            tickFormat: val => `${val}%%`
        }
    }
});
// .width(400)
// .height(300);
    }, 2000);
});

