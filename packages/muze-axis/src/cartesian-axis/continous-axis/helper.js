import { getHorizontalAxisSpace, getVerticalAxisSpace } from '../common-helper';
import { TOP, BOTTOM, LEFT, RIGHT } from '../../enums/constants';

/**
 * Calculates the logical space of the axis
 * @return {Object} Width and height occupied by the axis.
 */
export const calculateContinousSpace = (context) => {
    const range = context.range();
    const axisDimensions = context.getAxisDimensions();
    const { orientation } = context.config();
    const { show, showAxisName } = context.renderConfig();
    const { axisNameDimensions } = axisDimensions;

    if (show === false) {
        return {
            width: 0,
            height: 0
        };
    }

    const { width: axisNameWidth } = axisNameDimensions;

    if (orientation === TOP || orientation === BOTTOM) {
        const {
            width,
            height
        } = getHorizontalAxisSpace(context, axisDimensions, range);
        const axisWidth = Math.max(width, axisNameWidth);

        return {
            width: axisWidth,
            height
        };
    }
    const {
        width,
        height
    } = getVerticalAxisSpace(context, axisDimensions, range);

    const effHeight = Math.max(height, showAxisName ? axisNameWidth : 0);

    return {
        width,
        height: effHeight
    };
};

export const getNumberOfTicks = (availableSpace, labelDim, axis, axisInstance) => {
    const ticks = axis.scale().ticks();
    const { numberOfTicks } = axisInstance.config();
    const tickLength = ticks.length;
    let numberOfValues = tickLength;

    if (tickLength * (labelDim * 1.5) > availableSpace) {
        numberOfValues = Math.floor(availableSpace / (labelDim * 1.5));
    }

    numberOfValues = Math.min(numberOfTicks, Math.max(2, numberOfValues));
    let tickValues = axis.scale().ticks(numberOfValues);

    if (numberOfValues === 2) {
        tickValues = axis.scale().ticks(10);
        tickValues = [tickValues[0], tickValues[tickValues.length - 1]];
    }
    return tickValues;
};

export const setContinousAxisDomain = (context, domain) => {
    const { nice } = context.config();
    const scale = context.scale.bind(context);

    scale().domain(domain);
    nice && scale().nice();
    context._domain = scale().domain();
};

export const setFixedBaseline = (axisInstance) => {
    const {
        orientation,
        labels
    } = axisInstance.config();
    const {
        rotation
    } = labels;
    const axis = axisInstance.axis();
    const { width, height } = axisInstance._axisDimensions.allTickDimensions[0];
    const ticks = axis.scale().ticks();
    axis.tickTransform((d) => {
        if (d === ticks[0]) {
            if ((orientation === LEFT || orientation === RIGHT)) {
                return `translate(0, -${(height) / 3}px)`;
            }
            if ((orientation === TOP || orientation === BOTTOM) && !rotation) {
                return `translate(${width / 2}px,  ${0}px)`;
            }
        } return '';
    });
};
