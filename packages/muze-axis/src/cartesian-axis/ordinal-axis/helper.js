import { TOP, BOTTOM } from '../../enums/axis-orientation';
import { getHorizontalAxisSpace, getVerticalAxisSpace } from '../common-helper';

/**
 * Calculates the logical space of the axis
 * @return {Object} Width and height occupied by the axis.
 */
export const calculateBandSpace = (context) => {
    const range = context.range();
    const axisDimensions = context.getAxisDimensions();
    const { orientation } = context.config();
    const { show } = context.renderConfig();
    const { largestTickDimensions, axisTicks, allTickDimensions } = axisDimensions;
    const { height: largestDimHeight } = largestTickDimensions;
    const minTickWidth = context._minTickDistance.width;
    if (orientation === TOP || orientation === BOTTOM) {
        let {
            width,
            height
        } = getHorizontalAxisSpace(context, axisDimensions, range);

        if (!width || width === 0) {
            width = allTickDimensions.reduce((t, n) =>
                t + Math.min(n.width, n.height) + minTickWidth, 0);
        }
        if (show === false) {
            height = 0;
            width = 0;
        }

        return {
            width,
            height
        };
    }

    let {
        width,
        height
    } = getVerticalAxisSpace(context, axisDimensions, range);

    if (!height || height === 0) {
        height = axisTicks.length * (largestDimHeight + context._minTickDistance.height) + largestDimHeight;
    }
    if (show === false) {
        width = 0;
    }

    return {
        width,
        height
    };
};
