import { getSmallestDiff, ERROR_MSG } from 'muze-utils';
import SimpleAxis from '../simple-axis';
import { setOffset } from '../common-helper';
import { calculateContinousSpace } from './helper';

export default class ContinousAxis extends SimpleAxis {

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
     * Gets the space occupied by the axis
     *
     * @return {Object} object with details about size of the axis.
     * @memberof SimpleAxis
     */
    getLogicalSpace () {
        if (!this.logicalSpace()) {
            this.logicalSpace(calculateContinousSpace(this));
            setOffset(this);
            this.logicalSpace();
        }
        return this.logicalSpace();
    }

     /**
     *
     *
     * @returns
     * @memberof SimpleAxis
     */
    getTickSize () {
        const {
            showInnerTicks,
            showOuterTicks
        } = this.config();
        const axis = this.axis();

        axis.tickSizeInner(showInnerTicks === false ? 0 : 6);
        axis.tickSizeOuter(showOuterTicks === false ? 0 : 6);
        return axis.tickSize();
    }

    getMinTickDifference () {
        return getSmallestDiff(this.config().tickValues);
    }

    /**
     * This method is used to assign a domain to the axis.
     *
     * @param {Array} domain the domain of the scale
     * @memberof SimpleAxis
     */
    updateDomainBounds (domain) {
        let currentDomain = this.domain();
        if (this.config().domain) {
            currentDomain = this.config().domain;
        } else {
            if (currentDomain.length === 0) {
                currentDomain = domain;
            }
            if (domain.length) {
                currentDomain = [Math.min(currentDomain[0], domain[0]), Math.max(currentDomain[1], domain[1])];
            }
        }

        return this.domain(currentDomain);
    }
}

