const style = `body,
html {
    font-family: 'Source Sans Pro', "Helvetica Neue", Helvetica, Arial, sans-serif;
    width: 100%;
    height: 100%;
}

.chart {
    margin-left: 20px;
}

.muze-grid-lines path {
    opacity: 0.1;
}

.muze-grid .muze-text-cell {
    font-size: 12px !important;
}

.muze-layer-text text {
    alignment-baseline: central;
}

.chart-div {
    float: left;
    padding: 15px;
}

.muze-layer-point {
    fill-opacity: 1 !important;
}

#chart-container {
    overflow-y: auto !important;
    text-align: center;
    padding: 0px 10px 10px 10px;
    height: auto;
    min-height: 350px;
}

.twitter-link {
    text-decoration: none;
    color: #3182bd;
    font-weight: 700;
}

.twitter-link:hover {
    text-decoration: underline;
}

.chart-header {
    font-size: 24px !important;
    margin-bottom: 10px;
    color: #5f5f5f !important;
}`;
const node = document.createElement('style');
node.innerHTML = style;
document.body.appendChild(node);

d3.json('/data/twitter-purge.json', (data) => { // load data and schema from url
    const schema = [{
        name: 'user',
        type: 'dimension'
    }, {
        name: 'followers',
        type: 'measure',
        defAggFn: 'avg'
    }, {
        name: 'time',
        type: 'dimension',
        subtype: 'temporal'
    }];
    const users = [
        'aplusk',
        'barackobama',
        'c_nyakundih',
        'd_copperfield',
        'elonmusk',
        'hilaryr',
        'hillaryclinton',
        'iamcardib',
        'jack',
        'jashkenas',
        'johnleguizamo',
        'kathyireland',
        'katyperry',
        'kyliejenner',
        'lucaspeterson',
        'marthalanefox',
        'michaeldell',
        'nickconfessore',
        'nickywhelan',
        'nytimes',
        'paulhollywood',
        'paulkagame',
        'poppy',
        'porszag',
        'rambodonkeykong',
        'realalexjones',
        'realdonaldtrump',
        'samiralrifai',
        'seanhannity',
        'senjohnmccain',
        'taylorswift13',
        'twitter'
    ];
    const env = window.muze();
    const DataModel = window.muze.DataModel;
    const html = muze.Operators.html;
    const require = muze.utils.require;

    const formatter = (val) => {
        if (val > 1000000) {
            return `${(val / 1000000).toFixed(2)} M`;
        } else if (val > 1000) {
            return `${(val / 1000).toFixed(2)} K`;
        } return val.toFixed(2);
    };

    const rootData = new DataModel(data, schema);
    const canvases = [];

    const div = document.createElement('div');
    div.className = 'chart-header muze-header-cell';
    div.innerHTML = 'Charting the Great Twitter Bot Purge of 2018 (A Trellis Example)';
    document.getElementById('chart').appendChild(div);

    users.forEach((user, i) => {
        const newDomNode = document.createElement('div');
        newDomNode.className = 'chart-div';
        newDomNode.id = `chart${i + 1}`;
        newDomNode.style.overflow = 'auto';
        document.getElementById('chart').appendChild(newDomNode);

        const canvas = env.canvas()
            .rows([[], ['followers']])
            .columns(['time'])
            .data(rootData.select(f => f.user.value === user))
            .width(250)
            .height(200)
            .transform({
                lastPoint: (dt) => {
                    const dataLength = dt.getData().data.length;
                    return dt.select((fields, i) => {
                        if (i === dataLength - 1) {
                            return true;
                        } return false;
                    });
                }
            })
            .layers([{
                mark: 'line',
                name: 'lineLayer'
            }, {
                mark: 'point',
                source: 'lastPoint'
            }, {
                mark: 'text',
                encoding: {
                    text: {
                        field: 'followers',
                        formatter: val => formatter(val)
                    },
                    color: {
                        value: () => '#858585'
                    }
                },
                encodingTransform: require('layers', ['lineLayer', () => (points, layer, dep) => {
                    const width = layer.measurement().width;
                    const height = layer.measurement().height;
                    const smartlabel = dep.smartLabel;

                    return points.map((point) => {
                        const size = smartlabel.getOriSize(point.text);
                        if (point.update.y + size.height > height) {
                            point.update.y -= size.height / 2;
                        } else {
                            point.update.y += size.height / 2;
                        }
                        if (point.update.x + size.width / 2 > width) {
                            point.update.x -= size.width / 2 + 1;
                        }
                        return point;
                    });
                }]),
                source: 'lastPoint'
            }])
            .config({
                border: {
                    showValueBorders: {
                        right: false,
                        bottom: false
                    }
                },
                gridLines: {
                    y: {
                        show: false
                    }
                },
                axes: {
                    y: {
                        tickFormat: (val, parsedVal, j, labels) => {
                            if (j === 0 || j === labels.length - 1) {
                                return formatter(val);
                            } return '';
                        },
                        showAxisName: false
                    },
                    x: {
                        show: false
                    }
                }
            })
            .title('The car acceleration respective to origin', { position: 'bottom', align: 'center' })
            .subtitle(html`<a href = "https://www.twitter.com/@${user}" class= "twitter-link">@${user}</a>`,
            { position: 'bottom', align: 'center' })
            .mount(`#chart${i + 1}`);
        canvases.push(canvas);
        Promise.all(canvases.map(cnvs => cnvs.once('canvas.animationend'))).then(() => {
            const element = document.getElementById('chart');
            element.classList.add('animateon');
        });
    });
});
