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

    setAvailableSpace (...params) {
        super.setAvailableSpace(...params);
        this.getTickSize();
        return this;
    }

}

