import {
    ERROR_MSG,
    getUniqueId
} from 'muze-utils';
import { RETINAL } from '../enums/constants';

export default class RetinalAxis {

     /**
     * Creates an instance of SimpleAxis.
     * @memberof SizeAxis
     */
    constructor () {
        this._id = getUniqueId();
    }

    /**
     *
     *
     * @static
     * @returns
     * @memberof RetinalAxis
     */
    static type () {
        return RETINAL;
    }

    /**
     * This method is used to assign a domain to the axis.
     *
     * @param {Array} domain the domain of the scale
     * @memberof RetinalAxis
     */
    createScale () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    /**
     * This method is used to assign a domain to the axis.
     *
     * @param {Array} domain the domain of the scale
     * @memberof RetinalAxis
     */
    updateDomain () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    /**
     * This method is used to assign a domain to the axis.
     *
     * @param {Array} domain the domain of the scale
     * @memberof RetinalAxis
     */
    setStrategy () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    /**
     * This method returns an object that can be used to
     * reconstruct this instance.
     *
     * @return {Object} the serializable props of axis
     * @memberof RetinalAxis
     */
    serialize () {
        return {
            type: this.constructor.type(),
            scale: this.scale(),
            domain: this.domain(),
            config: this.config()
        };
    }

    /**
     * Returns the id of the axis.
     * @return {string} Unique identifier of the axis.
     */
    id () {
        return this._id;
    }
}

