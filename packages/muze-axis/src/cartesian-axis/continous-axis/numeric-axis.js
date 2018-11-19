import ContinousAxis from './continous-axis';
import { BOTTOM, TOP, LEFT, RIGHT } from '../../enums/axis-orientation';
import { LINEAR, LOG, POW } from '../../enums/scale-type';
import { LogInterpolator, PowInterpolator, LinearInterpolator } from './interpolators';
import { DOMAIN } from '../../enums/constants';
import {
    getTickLabelInfo
} from '../common-helper';
import {
    getNumberOfTicks
} from './helper';
import {
    renderAxis,
    setFixedBaseline
} from '../../axis-renderer';

export const interpolatorMap = {
    [LOG]: LogInterpolator,
    [POW]: PowInterpolator,
    [LINEAR]: LinearInterpolator
};

export default class NumericAxis extends ContinousAxis {
    constructor (config, dependencies) {
        config.tickFormat = config.tickFormat || (val => val);
        super(config, dependencies);
    }

     /**
     *
     *
     * @static
     * @returns
     * @memberof ContinousAxis
     */
    static type () {
        return LINEAR;
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    createScale (config) {
        const {
            base,
            padding,
            interpolator,
            exponent
        } = config;
        const range = this.range();
        const InterpolatorCls = interpolatorMap[interpolator];

        this._interpolator = new InterpolatorCls();
        let scale = this._interpolator.createScale({
            padding,
            exponent,
            base,
            range
        });

        scale = scale.nice();
        return scale;
    }

    getScaleValue (domainVal) {
        if (domainVal === null || domainVal === undefined) {
            return undefined;
        }
        return this._interpolator.getScaleValue(domainVal);
    }

    /**
     *
     *
     * @param {*} d
     * @returns
     * @memberof SimpleAxis
     */
    domain (domain) {
        if (domain && domain.length) {
            const { nice } = this.config();
            if (domain.length && domain[0] === domain[1]) {
                domain = [0, +domain[0] * 2];
            }
            this.scale().domain(domain);
            nice && this.scale().nice();
            this._domain = this.scale().domain();
            this.store().commit(DOMAIN, this._domain);
            this.logicalSpace(null);
            return this;
        } return this._domain;
    }

    /**
     * This method is used to set the space availiable to render
     * the SimpleCell.
     *
     * @param {number} width The width of SimpleCell.
     * @param {number} height The height of SimpleCell.
     * @memberof AxisCell
     */
    setAvailableSpace (width = 0, height, padding, isOffset) {
        const {
            left,
            right,
            top,
            bottom
        } = padding;
        const {
            orientation,
            fixedBaseline
        } = this.config();
        const { tickLabelDim } = this.getAxisDimensions();
        this.availableSpace({ width, height });

        if (orientation === TOP || orientation === BOTTOM) {
            const labelSpace = tickLabelDim.width;
            this.range([(fixedBaseline ? 0 : (labelSpace / 2)) + left, width - right - labelSpace / 2]);
            const axisHeight = this.getLogicalSpace().height;
            isOffset && this.config({ yOffset: Math.max(axisHeight, height) });
        } else {
            const labelSpace = tickLabelDim.height;
            this.range([height - bottom - (fixedBaseline ? 1 : (labelSpace / 2)), labelSpace / 2 + top]);
            const axisWidth = this.getLogicalSpace().width;
            isOffset && this.config({ xOffset: Math.max(axisWidth, width) });
        }
        return this;
    }

 /**
     *
     *
     * @param {*} axisTickLabels
     * @param {*} labelWidth
     * @returns
     * @memberof SimpleAxis
     */
    setRotationConfig (axisTickLabels, labelWidth) {
        const { orientation } = this.config();

        if (orientation === TOP || orientation === BOTTOM) {
            const range = this.range();
            const length = Math.abs(range[0] - range[1]);
            this.config({ labels: { rotation: 0 } });
            if (length > 0 && axisTickLabels.length * (labelWidth + this._minTickDistance.width) > length) {
                this.config({ labels: { rotation: -90 } });
            }
        }
        return this;
    }

    /**
     *
     *
     * @param {*} tickValues
     * @returns
     * @memberof SimpleAxis
     */
    setTickValues () {
        const {
            tickValues
        } = this.config();
        const axis = this.axis();

        if (tickValues) {
            tickValues instanceof Array && this.axis().tickValues(tickValues);
            return this;
        }
        axis.tickValues(this.getTickValues());
        return this;
    }

    getTickFormatter (tickFormat) {
        const numberFormat = this.config().numberFormat;
        if (tickFormat) {
            return ticks => (val, i) => tickFormat(numberFormat(val), i, ticks);
        }
        return () => val => numberFormat(val);
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    getTickValues () {
        let labelDim = 0;
        const {
            orientation,
            tickValues
        } = this.config();
        const range = this.range();
        const axis = this.axis();

        const availableSpace = Math.abs(range[0] - range[1]);

        const labelProps = getTickLabelInfo(this).largestLabelDim;

        if (tickValues) {
            return axis.scale().ticks(tickValues);
        }
        labelDim = labelProps[orientation === BOTTOM || orientation === TOP ? 'width' : 'height'];

        return getNumberOfTicks(availableSpace, labelDim, axis, this);
    }

    /**
     * This method is used to render the axis inside
     * the supplied svg container.
     *
     * @param {SVGElement} svg the svg element in which to render the path
     * @memberof SimpleAxis
     */
    /* istanbul ignore next */render () {
        if (this.mount()) {
            renderAxis(this);
            // set fixed baseline
            setFixedBaseline(this);
        }
        return this;
    }

}
