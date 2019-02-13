/**
 * @module Axis
 * This file declares a class that is used to render an axis to add  meaning to
 * plots.
 */
import { generateGetterSetters, rgbToHsv } from 'muze-utils';
import { createScale, getScheme, getSchemeType } from '../../scale-creator';
import { CONTINOUS, DISCRETE, COLOR } from '../../enums/constants';
import { strategyGetter } from './color-strategy';
import { DEFAULT_CONFIG } from './defaults';
import { PROPS, getHslString } from './props';
import RetinalAxis from '../retinal-axis';

/**
* This class is used to instantiate a SimpleAxis.
* @class SimpleAxis
*/
export default class ColorAxis extends RetinalAxis {

    /**
    * Creates an instance of SimpleAxis.
    * @param {Object} config input parameters.
    * @param {Object | undefined} params.range Type of color range.
    * @param {string} params.name the label to show on axis.
    * @param {string} params.type The type of scale to handle.
    * @memberof ColorAxis
    */
    constructor (config) {
        super();
        generateGetterSetters(this, PROPS);
        this.config(config);

        this._domainType = this._config.type === 'linear' ? CONTINOUS : DISCRETE;
        this._rangeType = (this._config.type === 'linear' && !this._config.step) ? CONTINOUS : DISCRETE;

        this._schemeType = getSchemeType(this._config.range);

        this.setStrategy(this._domainType, this._rangeType, this._schemeType);
        this._scale = this.createScale();

        this.updateDomain(config.domain);
    }

    /**
     *
     *
     * @static
     *
     * @memberof ColorAxis
     */
    static defaultConfig () {
        return DEFAULT_CONFIG;
    }

    /**
     *
     *
     * @static
     *
     * @memberof ColorAxis
     */
    static type () {
        return COLOR;
    }

    /**
     *
     *
     * @param {*} colorStrategy
     *
     * @memberof ColorAxis
     */
    createScale () {
        const { range } = this.config();
        if (range && typeof (range) === 'string') {
            return getScheme(range);
        }
        return createScale({
            type: this.strategy().scale,
            range
        });
    }

    /**
     *
     *
     * @param {*} domainType
     * @param {*} rangeType
     * @param {*} schemeType
     *
     * @memberof ColorAxis
     */
    setStrategy (domainType, rangeType, schemeType) {
        const { stops } = this.config();

        this.strategy(strategyGetter(domainType, rangeType, schemeType, stops));
        return this;
    }

    /**
     *
     *
     * @param {*} domainVal
     *
     * @memberof ColorAxis
     */
    getHslString (hslColorArray) {
        return getHslString(hslColorArray);
    }

    /**
     *
     *
     * @param {*} domainVal
     *
     * @memberof ColorAxis
     */
    getColor (domainVal) {
        return this.getHslString(this.getRawColor(domainVal));
    }

    /**
     *
     *
     * @param {*} domainVal
     *
     * @memberof ColorAxis
     */
    getRawColor (domainVal) {
        if (this.domain() && domainVal !== undefined) {
            const scale = this.scale();
            const range = scale.range ? scale.range() : null;
            const color = this.strategy().value(range)(domainVal, scale, this.domain(), this.uniqueValues());

            if (typeof color === 'string') {
                const col = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/);
                return rgbToHsv(...col);
            }
        }
        return [...this.config().value];
    }

    /**
     *
     *
     * @param {*} [domain=[]]
     *
     * @memberof ColorAxis
     */
    updateDomain (domain = []) {
        if (domain.length) {
            const scale = this.scale();
            const range = scale.range ? scale.range() : null;
            const domainRangeFn = this.strategy().domainRange();
            const scaleInfo = domainRangeFn(domain, this.config().stops, range);

            this.domain(scaleInfo.domain);
            scaleInfo.range && this.scale().range(scaleInfo.range);
            this.uniqueValues(scaleInfo.uniqueVals);
            this.scale().domain(scaleInfo.scaleDomain || this.domain());
        }
        return this;
    }

    transformColor (colorArray, transformationArray) {
        const h = colorArray[0] * 360;
        const s = colorArray[1] * 100;
        const l = colorArray[2] * 100;
        const a = colorArray[3] || 1;
        const newH = h + transformationArray[0];
        const newS = s + transformationArray[1];
        const newL = l + transformationArray[2];
        const newA = a + transformationArray[3] || 0;

        return { color: `hsla(${newH},${newS}%,${newL}%,${newA})`, hsla: [newH / 360, newS / 100, newL / 100, newA] };
    }
}
