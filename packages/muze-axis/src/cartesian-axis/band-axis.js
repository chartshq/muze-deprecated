import SimpleAxis from './simple-axis';
import { BAND } from '../enums/scale-type';
import { TOP, BOTTOM } from '../enums/axis-orientation';
import { calculateBandSpace, setOffset, getRotatedSpaces } from './helper';
import { spaceSetter } from './space-setter';

export default class BandAxis extends SimpleAxis {

    /**
     *
     *
     * @param {*} range
     *
     * @memberof BandAxis
     */
    createScale (range) {
        const scale = super.createScale(range);
        const { padding } = this.config();
        if (typeof padding === 'number') {
            scale.padding(padding);
        }
        return scale;
    }

    /**
     *
     *
     * @static
     *
     * @memberof BandAxis
     */
    static type () {
        return BAND;
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
        let labelConfig = {};
        const {
           orientation
       } = this.config();

        this.availableSpace({ width, height, padding });

        if (orientation === TOP || orientation === BOTTOM) {
            labelConfig = spaceSetter(this, { isOffset }).band.x();
        } else {
            labelConfig = spaceSetter(this, { isOffset }).band.y();
        }

        // Set config
        this.renderConfig({
            labels: labelConfig
        });
        this.setTickConfig();
        return this;
    }

    /**
     *
     *
     *
     * @memberof BandAxis
     */
    setTickConfig () {
        let smartTicks = '';
        let smartlabel;
        const domain = this.domain();
        const { labelManager } = this._dependencies;
        const { tickValues, tickFormat } = this.config();
        const { labels } = this.renderConfig();
        const { height: availHeight, width: availWidth, noWrap } = this.maxTickSpaces();
        const { width, height } = getRotatedSpaces(labels.rotation, availWidth, availHeight);
        const tickFormatter = tickFormat || (val => val);

        tickValues && this.axis().tickValues(tickValues);
        smartTicks = tickValues || domain;
        // set the style on the shared label manager instance
        labelManager.setStyle(this._tickLabelStyle);

        if (domain && domain.length) {
            const values = tickValues || domain;
            smartTicks = values.map((d, i) => {
                labelManager.useEllipsesOnOverflow(true);

                smartlabel = labelManager.getSmartText(tickFormatter(d, i, values), width, height, noWrap);
                return labelManager.constructor.textToLines(smartlabel);
            });
        }
        this.smartTicks(smartTicks);
        return this;
    }

    /**
     * Gets the space occupied by the axis
     *
     * @return {Object} object with details about size of the axis.
     * @memberof SimpleAxis
     */
    getLogicalSpace () {
        if (!this.logicalSpace()) {
            this.logicalSpace(calculateBandSpace(this));
            setOffset(this);
            this.logicalSpace();
        }
        return this.logicalSpace();
    }

    /**
     *
     *
     * @memberof BandAxis
     */
    getTickValues () {
        return this.axis().scale().domain();
    }

    /**
     *
     *
     *
     * @memberof BandAxis
     */
    getUnitWidth () {
        return this.scale().bandwidth();
    }

    /**
     *
     *
     *
     * @memberof SimpleAxis
     */
    getTickSize () {
        const {
            showInnerTicks,
            showOuterTicks
        } = this.renderConfig();
        const axis = this.axis();

        axis.tickSizeInner(showInnerTicks ? 6 : 0);
        axis.tickSizeOuter(showOuterTicks ? 6 : 0);
        return axis.tickSize();
    }

    /**
     * Returns the value from the domain when given a value from the range.
     * @param {number} value Value from the range.
     * @return {number} Value
     */
    invert (...value) {
        const values = value.map(d => this.scale().invert(d)) || [];
        return value.length === 1 ? values[0] && values[0].toString() : values.map(d => d.toString());
    }
}