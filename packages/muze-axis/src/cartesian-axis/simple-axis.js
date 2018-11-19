import {
    ERROR_MSG,
    Store,
    mergeRecursive,
    getSmartComputedStyle,
    selectElement,
    generateGetterSetters,
    getUniqueId
} from 'muze-utils';
import { createScale } from '../scale-creator';
import { axisOrientationMap } from '../enums/axis-orientation';
import { defaultConfig } from '../cartesian-axis/default-config';
import { renderAxis } from '../axis-renderer';
import {
    computeAxisDimensions,
    registerChangeListeners
} from './common-helper';
import { PROPS } from '../cartesian-axis/props';

export default class SimpleAxis {

    /**
     * Creates an instance of SimpleAxis.
     * @memberof SimpleAxis
     */
    constructor (config, dependencies) {
        this._id = getUniqueId();

        this._dependencies = dependencies;
        this._mount = null;
        this._range = [];
        this._domain = [];
        this._domainLock = false;
        this._rotationLock = false;
        this._axisDimensions = {};
        this._eventList = [];

        const defCon = mergeRecursive({}, this.constructor.defaultConfig());
        const simpleConfig = mergeRecursive(defCon, config);

        const bodyElem = selectElement('body');
        const classPrefix = simpleConfig.classPrefix;
        this._tickLabelStyle = getSmartComputedStyle(bodyElem, `${classPrefix}-ticks`);
        this._axisNameStyle = getSmartComputedStyle(bodyElem, `${classPrefix}-axis-name`);
        dependencies.labelManager.setStyle(this._tickLabelStyle);
        this._minTickDistance = dependencies.labelManager.getOriSize('ww');

        generateGetterSetters(this, PROPS);
        this.store(new Store({
            domain: this.domain(),
            range: this.range(),
            config: simpleConfig,
            mount: this.mount()
        }));
        this.config(simpleConfig);

        this._scale = this.createScale(this._config);
        this._axis = this.createAxis(this._config);

        registerChangeListeners(this);
    }

    /**
     * Returns the default configuration of simple axis
     *  @return {Object} default configurations
     */
    static defaultConfig () {
        return defaultConfig;
    }

     /**
     *
     *
     * @param {*} axisTickLabels
     * @param {*} labelWidth
     * @returns
     * @memberof SimpleAxis
     */
    setRotationConfig () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    getTickValues () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    setAvailableSpace () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    getTickSize () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    getMinTickDifference () {

    }

    setFixedBaseline () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    dependencies () {
        return this._dependencies;
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
        const scale = createScale({
            padding,
            interpolator,
            exponent,
            base,
            range,
            type: this.constructor.type()
        });

        return scale;
    }

    getTickFormatter (tickFormat) {
        if (tickFormat) {
            return ticks => (val, i) => tickFormat(val, i, ticks);
        }
        return null;
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    createAxis () {
        const {
            tickFormat,
            numberFormat,
            orientation
        } = this.config();
        const axisClass = axisOrientationMap[orientation];

        if (axisClass) {
            const axis = axisClass(this.scale());
            this.formatter = this.getTickFormatter(tickFormat, numberFormat);

            return axis;
        }
        return null;
    }

    getScaleValue (domainVal) {
        if (domainVal === null || domainVal === undefined) {
            return undefined;
        }
        return this.scale()(domainVal);
    }

    /**
     * Gets the space occupied by the parts of an axis
     *
     * @return {Object} object with details about sizes of the axis.
     * @memberof SimpleAxis
     */
    getAxisDimensions () {
        this.axisDimensions(computeAxisDimensions(this));
        return this.axisDimensions();
    }

    /**
     * Gets the space occupied by the axis
     *
     * @return {Object} object with details about size of the axis.
     * @memberof SimpleAxis
     */
    getLogicalSpace () {
        return this.logicalSpace();
    }

    /**
     * Returns the value from the domain when given a value from the range.
     * @param {number} value Value from the range.
     * @return {number} Value
     */
    invert (...value) {
        const values = value.map(d => this.scale().invert(d)) || [];
        return value.length === 1 ? values[0] : values;
    }

    /**
     * Gets the nearest range value from the given range values.
     * @param {number} v1 Start range value
     * @param {number} v2 End range value
     * @return {Array} range values
     */
    getNearestRange (rangeStart, rangeEnd) {
        return [rangeStart, rangeEnd];
    }

    // /**
    //  * This method is used to assign a domain to the axis.
    //  *
    //  * @param {Array} domain the domain of the scale
    //  * @memberof SimpleAxis
    //  */
    // updateDomainBounds (domain) {
    //     let currentDomain = this.domain();
    //     if (this.config().domain) {
    //         currentDomain = this.config().domain;
    //     } else {
    //         if (currentDomain.length === 0) {
    //             currentDomain = domain;
    //         }
    //         if (domain.length) {
    //             currentDomain = [Math.min(currentDomain[0], domain[0]), Math.max(currentDomain[1], domain[1])];
    //         }
    //     }

    //     return this.domain(currentDomain);
    // }

    /**
     *
     *
     * @param {*} domain
     * @returns
     * @memberof SimpleAxis
     */
    updateDomainCache (domain) {
        if (this._domainLock === false) {
            this.domain([]);
            this._domainLock = true;
        }
        const cachedDomain = [];
        domain && domain.forEach((d) => {
            d !== undefined && d !== null && cachedDomain.push(d);
        });
        return this.updateDomainBounds(cachedDomain);
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

        if (tickValues) {
            tickValues instanceof Array && this.axis().tickValues(tickValues);
            return this;
        }
        return this;
    }

    /**
     * This method returns the width in pixels for one
     * unit along the axis. It is only applicable to band scale
     * and returns undefined for other scale type.
     *
     * @return {number} the width of one band along band scale axis
     * @memberof SimpleAxis
     */
    getUnitWidth () {
        return 0;
    }

    /**
     * Returns the id of the axis.
     * @return {string} Unique identifier of the axis.
     */
    get id () {
        return this._id;
    }

    registerEvent (event, fn) {
        this._eventList.push({ name: event, action: fn });
        return this;
    }

    /**
     *
     *
     * @param {*} fn
     * @memberof SimpleAxis
     */
    on (event, fn) {
        event = event || 'update';
        return this.registerEvent(event, fn);
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
        }
        return this;
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    remove () {
        this.store().unsubscribeAll();
        selectElement(this.mount()).remove();
        return this;
    }

    /**
     *
     *
     * @memberof SimpleAxis
     */
    unsubscribe () {
        this.store().unsubscribeAll();
        return this;
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    isReverse () {
        const range = this.range();
        return range[0] > range[1];
    }

    /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    getPixelToValueRatio () {
        const scale = this.scale();
        const range = scale.range();
        const domain = scale.domain();

        return Math.abs(range[1] - range[0]) / (domain[1] - domain[0]);
    }
}

