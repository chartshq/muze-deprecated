const env = muze();
const DataModel = muze.DataModel;
const html = muze.Operators.html;

d3.csv('../data/wildfires.csv', (data) => {
    const schema = [
        {
            name: 'year',
            type: 'dimension'
        },
        {
            name: 'gis_acres',
            type: 'measure',
            defAggFn: 'avg'
        },
        {
            name: 'fire_name',
            type: 'dimension'
        },
        {
            name: 'alarm_date',
            type: 'dimension'
        }
    ];

    let rootData = new DataModel(data, schema);

    rootData = rootData.calculateVariable({
        name: 'Months of Fire',
        type: 'dimension',
        subtype: 'temporal',
        format: '%Y-%m-%d'
    }, ['alarm_date', function (date) {
        return `1970-${date.substring(5, date.length)}`;
    }]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const canvas = env.canvas().rows(['year']).columns(['Months of Fire']).data(rootData).width(600).height(600).detail(['fire_name']).color({ value: 'rgba(255, 156, 25, 0.5)' }).size({
        field: 'gis_acres',
        range: [1, 450]
    }).layers([{ mark: 'point' }])
    // .title('Wildfires over the year for different months')
    .title('The car acceleration respective to origin', { position: 'bottom', align: 'center' }).subtitle('Use data operators to transform data and visualize it and size (retinal) encoding channel to encode more information').config({
        sort: {
            year: 'desc'
        },
        autoGroupBy: { disabled: true },
        gridLines: {
            y: { show: true }
        },
        border: {
            showValueBorders: { left: false, bottom: false }
        },
        axes: {
            y: {
                tickValues: [1950, 1970, 1990, 2010],
                showAxisName: false
            },
            x: {
                tickFormat: function tickFormat (val) {
                    return months[new Date(val).getMonth()];
                },
                showInnerTicks: false,
                showAxisName: false
            }
        },
        interaction: {
            tooltip: {
                formatter: function formatter (dataModel, context) {
                    const tooltipData = dataModel.getData().data;
                    const fieldConfig = dataModel.getFieldsConfig();

                    let tooltipContent = '';
                    tooltipData.forEach((dataArray, i) => {
                        const fireName = dataArray[fieldConfig.fire_name.index];
                        const monthsOfFire = new Date(dataArray[fieldConfig['Months of Fire'].index]);
                        const year = dataArray[fieldConfig.year.index];
                        const acres = dataArray[fieldConfig.gis_acres.index];

                        const date = monthsOfFire.getDate();
                        const month = months[monthsOfFire.getMonth()];

                        tooltipContent += `<p>The <b>${fireName}</b> fire on <b>${date} ${month}, ${year}</b> \n                                        affected <b>${acres.toFixed(2)}</b> acres of land</p>`;
                    });
                    return html`${tooltipContent}`;
                }
            }
        },
        legend: {
            size: { show: false }
        }
    }).mount('#chart');
});
