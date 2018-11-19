import { TOP, BOTTOM } from '../../enums/axis-orientation';
import { getHorizontalAxisSpace, getVerticalAxisSpace } from '../common-helper';

/**
     * Calculates the logical space of the axis
     * @return {Object} Width and height occupied by the axis.
     */
export const calculateContinousSpace = (context) => {
    const range = context.range();
    const config = context.config();
    const axisDimensions = context.getAxisDimensions();

    const {
        orientation,
        show,
        showAxisName
    } = config;
    const {
            axisLabelDim
        } = axisDimensions;

    if (show === false) {
        return {
            width: 0,
            height: 0
        };
    }

    const { width: axisDimWidth } = axisLabelDim;

    if (orientation === TOP || orientation === BOTTOM) {
        const { width, height } = getHorizontalAxisSpace(context, axisDimensions, config);
        const axisWidth = Math.max(width, axisDimWidth);

        return {
            width: axisWidth,
            height
        };
    }

    const { width, height } = getVerticalAxisSpace(context, axisDimensions, config, range);

    const effHeight = Math.max(height, showAxisName ? axisDimWidth : 0);

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

    numberOfValues = Math.min(numberOfTicks, Math.max(1, numberOfValues));
    return axis.scale().ticks(numberOfValues);
};

