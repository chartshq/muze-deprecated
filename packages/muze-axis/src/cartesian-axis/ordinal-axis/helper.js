import { TOP, BOTTOM } from '../../enums/axis-orientation';
import { getHorizontalAxisSpace, getVerticalAxisSpace } from '../common-helper';

/**
 * Calculates the logical space of the axis
 * @return {Object} Width and height occupied by the axis.
 */
export const calculateBandSpace = (context) => {
    const range = context.range();
    const config = context.config();
    const {
            orientation,
            show
        } = config;
    const axisDimensions = context.getAxisDimensions();
    const {
            largestLabelDim,
            axisTickLabels
        } = axisDimensions;
    const { height: largestDimHeight, width: largestDimWidth } = largestLabelDim;

    if (orientation === TOP || orientation === BOTTOM) {
        let { width, height } = getHorizontalAxisSpace(context, axisDimensions, config, range);
        if (!width || width === 0) {
            width = axisTickLabels.length * (Math.min(largestDimWidth + context._minTickDistance.width,
                             largestDimHeight + context._minTickDistance.width));
        }
        if (show === false) {
            height = 0;
        }
        return {
            width,
            height
        };
    }

    let { width, height } = getVerticalAxisSpace(context, axisDimensions, config, range);

    if (!height || height === 0) {
        height = axisTickLabels.length * (largestDimHeight + largestDimHeight / 2) + largestDimHeight;
    }
    if (show === false) {
        width = 0;
    }
    return {
        width,
        height
    };
};
