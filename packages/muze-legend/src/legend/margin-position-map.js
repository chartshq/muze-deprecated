import { TOP, RIGHT, BOTTOM, LEFT } from '../enums/constants';

export const marginPositionMap = (pos) => {
    const marginMap = {
        [TOP]: `margin-${BOTTOM}`,
        [LEFT]: `margin-${RIGHT}`,
        [BOTTOM]: `margin-${TOP}`
    };
    return marginMap[pos] || `margin-${LEFT}`;
};
