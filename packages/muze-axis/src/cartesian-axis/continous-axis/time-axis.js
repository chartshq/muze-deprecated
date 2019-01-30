import { TIME } from '../../enums/scale-type';
import { BOTTOM, TOP } from '../../enums/constants';
import ContinousAxis from './continous-axis';
import { getValidDomain, getRotatedSpaces } from '../common-helper';
import { setContinousAxisDomain } from './helper';

/**
 *
 *
 * @param {*} timeDiff
 * @param {*} range
 * @param {*} domain
 * @returns
 */
const getAxisOffset = (timeDiff, range, domain) => {
    const pvr = Math.abs(range[1] - range[0]) / (domain[1] - domain[0]);
    const width = (pvr * timeDiff);
    const avWidth = (range[1] - range[0]);
    const bars = avWidth / width;
    const barWidth = avWidth / (bars + 1);
    const diff = avWidth - barWidth * bars;

    return diff / 2;
};

export const adjustRange = (minDiff, range, domain, orientation) => {
    const diff = getAxisOffset(minDiff, range, domain);

    if (orientation === TOP || orientation === BOTTOM) {
        range[0] += diff;
        range[1] -= diff;
    } else {
        range[0] -= diff;
        range[1] += diff;
    }
    return range;
};

/**
 *
 *
 * @export
 * @class TimeAxis
 * @extends {SimpleAxis}
 */
export default class TimeAxis extends ContinousAxis {

    constructor (...params) {
        super(...params);
        this._minDiff = Infinity;
    }

    /**
     *
     *
     * @static
     * @returns
     * @memberof TimeAxis
     */
    static type () {
        return TIME;
    }

    /**
     *
     *
     * @param {*} range
     * @returns
     * @memberof TimeAxis
     */
    createScale (range) {
        let scale = super.createScale(range);

        scale = scale.nice();
        return scale;
    }

    /**
     *
     *
     * @returns
     * @memberof BandAxis
     */
    setTickConfig () {
        let smartTicks;
        let smartlabel;
        const { tickValues } = this.config();
        const { labels } = this.renderConfig();
        const { height: availHeight, width: availWidth, noWrap } = this.maxTickSpaces();
        const { labelManager } = this._dependencies;
        const domain = this.getTickValues();

        tickValues && this.axis().tickValues(tickValues);

        const { width, height } = getRotatedSpaces(labels.rotation, availWidth, availHeight);

        smartTicks = tickValues || domain;

        // set the style on the shared label manager instance
        labelManager.setStyle(this._tickLabelStyle);

        if (domain && domain.length) {
            const values = tickValues || domain;
            const tickFormatter = this._tickFormatter(values);
            smartTicks = values.map((d, i) => {
                labelManager.useEllipsesOnOverflow(true);

                smartlabel = labelManager.getSmartText(tickFormatter(d, i), width, height, noWrap);
                return labelManager.constructor.textToLines(smartlabel);
            });
        }
        this.smartTicks(smartTicks);
        return this;
    }

    /**
     *
     *
     * @param {*} diff
     *
     * @memberof TimeAxis
     */
    minDiff (diff) {
        this._minDiff = Math.min(this._minDiff, diff);
        return this;
    }

    /**
     *
     *
     * @returns
     * @memberof TimeAxis
     */
    getTickValues () {
        return this.scale().ticks();
    }

    getTickFormatter (value) {
        const { tickFormat } = value;

        if (tickFormat) {
            return (ticks) => {
                const rawTicks = ticks.map(t => t.getTime());
                return (val, i) => tickFormat(val, val.getTime(), i, rawTicks);
            };
        }
        return () => text => this.scale().tickFormat()(text);
    }

    /**
     *
     *
     * @param {*} diff
     * @returns
     * @memberof TimeAxis
     */
    setMinDiff (diff) {
        this._minDiff = Math.min(this._minDiff, diff);
        return this;
    }

    /**
     *
     *
     * @param {*} axisTickLabels
     * @param {*} labelWidth
     * @returns
     * @memberof BandAxis
     */
    setRotationConfig (axisTickLabels, labelWidth) {
        const { orientation } = this.config();
        const range = this.range();
        const availSpace = Math.abs(range[0] - range[1]);

        this.config({ labels: { rotation: 0, smartTicks: false } });
        if (orientation === TOP || orientation === BOTTOM) {
            const smartWidth = this.smartTicks().reduce((acc, n) => acc + n.width, 0);
            // set multiline config
            if (availSpace > 0 && axisTickLabels.length * labelWidth > availSpace) {
                if (availSpace && smartWidth * 1.25 < availSpace) {
                    this.config({ labels: { smartTicks: true } });
                }
                this.config({ labels: { rotation: -90 } });
            }
        }
        return this;
    }

        /**
     *
     *
     * @param {*} d
     *
     * @memberof SimpleAxis
     */
    domain (domain) {
        if (domain) {
            domain = getValidDomain(this, domain);
            setContinousAxisDomain(this, domain);
            this.setAxisComponentDimensions();
            this.logicalSpace(null);
            return this;
        }
        return this._domain;
    }

}
