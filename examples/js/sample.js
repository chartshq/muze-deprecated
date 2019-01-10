/* global muze, d3 */

const env = muze();
const SpawnableSideEffect = muze.SideEffects.standards.SpawnableSideEffect;
const DataModel = muze.DataModel;

d3.json('../data/by-election.json', (data) => {
    const schema = [
        {
            name: 'No.',
            type: 'measure',
            defAggFn: 'count'
        },
        {
            name: 'Date',
            type: 'dimension',
            subtype: 'temporal',
            format: '%d.%m.%Y'
        },
        {
            name: 'Reason for Vacancy',
            type: 'dimension'
        }
    ];
    const env = muze();
    const DataModel = muze.DataModel;

    let rootData = new DataModel(data, schema);

    rootData = rootData.calculateVariable(
        {
            name: 'Binned_Year',
            type: 'dimension'
        },
        ['Date', (date) => {
            const years = new Date(date).getFullYear();
            const start = Math.ceil(+years / 10) * 10;
            return `${start - 9}-${start}`;
        }]
    );
    rootData = rootData.calculateVariable(
        {
            name: 'Binned_Year_axis',
            type: 'dimension'
        },
        ['Binned_Year', () => 1]
    );
    rootData = rootData.calculateVariable(
        {
            name: 'counter',
            type: 'measure',
            defAggFn: 'sum'
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
            type: 'dimension'
            // subtype: 'temporal',
            // format: '%Y-%m-%d'
        }
    ];

    const DataModel = muze.DataModel;

        // Create a new DataModel instance with data and schema
    const dm = new DataModel(data, schema);
    window.rootData = dm;
        // Create a global environment to share common configs across charts
    const env = muze();
        // Create a canvas from the global environment
    const canvas = env.canvas();
   // DataModel instance is created from https://www.charts.com/static/cars.json data,
// https://www.charts.com/static/cars-schema.json schema and assigned to variable dm.

    // DataModel instance is created from https://www.charts.com/static/cars.json data,
// https://www.charts.com/static/cars-schema.json schema and assigned to variable dm.

// DataModel instance is created from https://www.charts.com/static/cars.json data,
// https://www.charts.com/static/cars-schema.json schema and assigned to variable dm.

// DataModel instance is created from https://www.charts.com/static/cars.json data,
// https://www.charts.com/static/cars-schema.json schema and assigned to variable dm.

    window.canvas = canvas
  	.data(dm)
  	.minUnitHeight(30)
  	.minUnitWidth(10)
  	.width(1000)
      .height(2400)
      .config({
          facet: {
              rows: {
                  verticalAlign: 'middle'
              }
          }
        //   showHeaders: true
      })
                    .rows([['Origin', 'Cylinders', 'Acceleration', 'Horsepower']])
                    .color('Origin')
  	.columns(['Origin', 'Acceleration']) /* Year is a temporal field */
  	.mount('#chart-container'); /* Attaching the canvas to DOM element */
});

                    // setTimeout(() => {
                    //     canvas.layers([{
                    //         mark: 'bar'
                    //     }]);
                    //     setTimeout(() => {
                    //         canvas.layers([{
                    //             mark: 'point',
                    //             encoding: {
                    //                 y: 'Horsepower',
                    //                 color: {
                    //                     value: '#000'
                    //                 }
                    //             }
                    //         }]);
                    //     }, 5000);
                    // }, 5000);
