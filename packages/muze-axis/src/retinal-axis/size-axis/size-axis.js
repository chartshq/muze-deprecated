/**
 * @module Axis
 * This file declares a class that is used to render an axis to add  meaning to
 * plots.
 */
import { generateGetterSetters } from 'muze-utils';
import { createScale } from '../../scale-creator';
import { DEFAULT_CONFIG } from './defaults';
import { SIZE, CONTINOUS, DISCRETE } from '../../enums/constants';
import { strategyGetter } from './size-strategy';
import { PROPS } from './props';
import RetinalAxis from '../retinal-axis';

/**
* This class is used to instantiate a SimpleAxis.
* @class SimpleAxis
*/
export default class SizeAxis extends RetinalAxis {

    /**
     * Creates an instance of SimpleAxis.
     * @param {Object} config input parameters.
     * @memberof SizeAxis
     */
    constructor (config) {
        super();
        generateGetterSetters(this, PROPS);

        this._config = Object.assign({}, this.constructor.defaultConfig(), config);
        // @todo: Will use configuration override using scale decorator
        this._domainType = this._config.type === 'linear' ? CONTINOUS : DISCRETE;
        this._rangeType = CONTINOUS;

        this.setStrategy(this._domainType, this._rangeType);
        this._scale = this.createScale(this._sizeStrategy);
        this._range = this._config.range;

        this.updateDomain(config.domain);
    }

     /**
     *
     *
     * @param {*} domainType
     * @param {*} rangeType
     * @param {*} schemeType
     * @returns
     * @memberof ColorAxis
     */
    setStrategy (domainType, rangeType) {
        this.strategy(strategyGetter(domainType, rangeType));
    }

    /**
     *
     *
     * @returns
     * @memberof SizeAxis
     */
    createScale () {
        const {
            range
        } = this.config();
        return createScale({
            type: this.strategy().scale,
            range
        });
    }

    /**
     *
     *
     * @static
     * @returns
     * @memberof ColorAxis
     */
    static defaultConfig () {
        return DEFAULT_CONFIG;
    }

     /**
     *
     *
     * @static
     * @returns
     * @memberof ColorAxis
     */
    static type () {
        return SIZE;
    }

    /**
     *
     *
     * @param {*} domainVal
     * @returns
     * @memberof SizeAxis
     */
    getSize (domainVal = 0) {
        let sizeVal = 1;
        const {
            value
        } = this.config();
        const scale = this.scale();
        const domain = this.domain() || [1, 1];

        if (!scale || domain[0] === domain[1]) {
            sizeVal = value;
        } else {
            return this._sizeStrategy.range(domainVal, scale, this.domain(), this.uniqueValues());
        }
        return sizeVal;
    }

    /**
     * This method is used to assign a domain to the axis.
     *
     * @param {Array} domain the domain of the scale
     * @memberof SizeAxis
     */
    updateDomain (domain) {
        if (domain) {
            const domainFn = this._sizeStrategy.domain;

            const domainInfo = domainFn(domain, this.config().intervals);

            this.domain(domainInfo.domain);
            this.uniqueValues(domainInfo.uniqueVals);

            this.scale().domain(domainInfo.scaleDomain || this.domain());
        }
        return this;
    }
}
