import ContinousAxis from './continous-axis';
import { BOTTOM, TOP, NUMERIC } from '../../enums/constants';
import { LINEAR, LOG, POW } from '../../enums/scale-type';
import { LogInterpolator, PowInterpolator, LinearInterpolator } from './interpolators';
import {
    getTickLabelInfo,
    getValidDomain
} from '../common-helper';
import {
    getNumberOfTicks, setContinousAxisDomain,
    setFixedBaseline
} from './helper';
import {
    renderAxis

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
        return NUMERIC;
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
     *
     * @memberof SimpleAxis
     */
    domain (domain) {
        if (domain) {
            if (Array.isArray(domain) && domain.length) {
                domain = getValidDomain(this, domain);
                domain = this._interpolator.sanitizeDomain(domain);
                setContinousAxisDomain(this, domain);
                this.setAxisComponentDimensions();
                this.logicalSpace(null);
            } else {
                this._domain = [];
            }
            return this;
        }
        return this._domain;
    }

    /**
     *
     *
     * @param {*} tickValues
     *
     * @memberof SimpleAxis
     */
    setTickConfig () {
        const {
            tickValues
        } = this.config();
        const {
            showInnerTicks
        } = this.renderConfig();
        const axis = this.axis();

        if (!showInnerTicks) {
            axis.tickValues([]);
            return this;
        }

        if (tickValues) {
            tickValues instanceof Array && this.axis().tickValues(tickValues);
            return this;
        }
        axis.tickValues(this.getTickValues());

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
            setFixedBaseline(this);

            renderAxis(this);
            // set fixed baseline
        }
        return this;
    }

}
