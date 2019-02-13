/**
 * @module Axis
 * This file declares a class that is used to render an axis to add  meaning to
 * plots.
 */
import { getSymbol, generateGetterSetters, mergeRecursive, InvalidAwareTypes } from 'muze-utils';
import { createScale } from '../../scale-creator';
import { DEFAULT_CONFIG } from './defaults';
import { SHAPE } from '../../enums/constants';
import { shapeGenerator } from './helper';
import { PROPS } from './props';
import RetinalAxis from '../retinal-axis';

/**
* This class is used to instantiate a SimpleAxis.
* @class SimpleAxis
*/
export default class ShapeAxis extends RetinalAxis {
    /**
    * Creates an instance of SimpleAxis.
    * @param {Object} params input parameters.
    * @param {Object | undefined} params.range Type of color scheme.
    * @memberof ShapeAxis
    */
    constructor (config) {
        super();
        generateGetterSetters(this, PROPS);

        this._config = Object.assign({}, this.constructor.defaultConfig());
        this._config = mergeRecursive(this._config, config);

        this._scale = this.createScale();
        this.updateDomain(config.domain);
    }

    createScale () {
        return createScale({
            type: 'ordinal',
            range: this._config.range
        });
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
        return SHAPE;
    }

    /**
     *
     *
     * @param {*} value
     *
     * @memberof ShapeAxis
     */
    getShape (value) {
        if (!this.scale() || !this.domain() || !value || value instanceof InvalidAwareTypes) {
            return this.config().value;
        }

        if (this._generatedShapes) {
            return this._generatedShapes[domainVal];
        }

        const shapeType = this.scale()(domainVal);
        if (shapeType === 'string') {
            return getSymbol(shapeType);
        }

        return shapeType;
    }

    /**
     * This method is used to assign a domain to the axis.
     *
     * @param {Array} domain the domain of the scale
     * @memberof ShapeAxis
     */
    updateDomain (domain = []) {
        if (domain.length) {
            this.uniqueValues(domain);
            this.domain(domain);
            this.scale().domain(domain);

            if (this.config().generator) {
                this._generatedShapes = shapeGenerator(domain, this.config().generator);
            }
        }
        return this;
    }
}
