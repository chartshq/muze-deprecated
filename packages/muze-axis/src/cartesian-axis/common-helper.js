import { TOP, LEFT, BOTTOM } from '../enums/axis-orientation';
import { LOG } from '../enums/scale-type';

export const sanitizeDomain = (domain, context) => {
    const interpolator = context.config().interpolator;
    // @todo: Get from scale decorator
    if (interpolator === LOG && domain[0] >= 0) {
        return [Math.max(1, domain[0]), Math.max(1, domain[1])];
    }
    return domain;
};

export const getRotatedSpaces = (rotation = 0, width, height) => {
    let rotatedHeight = height;
    let rotatedWidth = width;
    if (rotation) {
        const angle = ((rotation || 0) * Math.PI) / 180;
        rotatedWidth = Math.abs(height * Math.sin(angle)) + Math.abs(width * Math.cos(angle));
        rotatedHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
    }
    return { width: rotatedWidth, height: rotatedHeight };
};

export const getTickFormatter = (tickFormat, numberFormat) => {
    if (tickFormat) {
        return ticks => (val, i) => tickFormat(numberFormat(val), i, ticks);
    }
    return () => val => numberFormat(val);
};

/**
 *
 *
 * @returns
 * @memberof SimpleAxis
 */
export const getTickLabelInfo = (context) => {
    let largestLabel = '';
    let labelProps;
    let smartTick = {};
    let axisTickLabels;
    const scale = context.scale();
    const allLabelLengths = [];
    const { tickFormat, tickValues, numberFormat } = context.config();
    const labelFunc = scale.ticks || scale.quantile || scale.domain;
    // set the style on the shared label manager instance
    const { labelManager } = context.dependencies();

    labelManager.setStyle(context._tickLabelStyle);
    // get the values along the domain

    axisTickLabels = tickValues || labelFunc();
    // Get the tick labels
    axisTickLabels = axisTickLabels.map((originalLabel, i) => {
        const formattedLabel = numberFormat(originalLabel);

        //  get formats of tick if any
        const label = tickFormat ? tickFormat(formattedLabel, i, axisTickLabels) : (scale.tickFormat ?
            numberFormat(scale.tickFormat()(originalLabel)) : formattedLabel);

        // convert to string for quant values
        const temp = label.toString();
        // Get spaces for all labels
        allLabelLengths.push(labelManager.getOriSize(temp));
        // Getting largest label
        if (temp.length > largestLabel.length) {
            largestLabel = temp;
            smartTick = context.smartTicks().length ? context.smartTicks()[i] : allLabelLengths[i];
            labelProps = allLabelLengths[i];
        }
        return label;
    });

    labelProps = labelManager.getOriSize(largestLabel);

    return { largestLabel, largestLabelDim: labelProps, axisTickLabels, allLabelLengths, smartTick };
};

/**
 *
 *
 * @returns
 * @memberof SimpleAxis
 */
export const computeAxisDimensions = (context) => {
    let tickLabelDim = {};
    const {
        name,
        labels,
        tickValues
    } = context.config();
    const angle = ((labels.smartTicks) ? 0 : labels.rotation) * Math.PI / 180;
    const { labelManager } = context.dependencies();
    const {
        largestLabelDim,
        axisTickLabels,
        smartTick,
        allLabelLengths
    } = getTickLabelInfo(context);
    const { height: labelHeight, width: labelWidth } = largestLabelDim;
    // get the domain of axis
    const domain = context.domain();

    if (domain.length === 0) {
        return null;
    }
    if (context._rotationLock === false) {
        context.setRotationConfig(tickValues || axisTickLabels, largestLabelDim.width);
        context._rotationLock = false;
    }
    if (labels.smartTicks) {
        tickLabelDim = smartTick;
    } else {
        tickLabelDim = {
            width: Math.abs(labelHeight * Math.sin(angle)) + Math.abs(labelWidth * Math.cos(angle)),
            height: Math.abs(labelWidth * Math.sin(angle)) + Math.abs(labelHeight * Math.cos(angle))
        };
    }

    labelManager.setStyle(context._axisNameStyle);
    return {
        tickSize: context.getTickSize(),
        tickLabelDim,
        axisLabelDim: labelManager.getOriSize(name),
        largestLabelDim,
        axisTickLabels,
        allTickDimensions: allLabelLengths
    };
};

/**
*
*
* @memberof SimpleAxis
*/
export const setOffset = (context) => {
    let x = 0;
    let y = 0;
    const logicalSpace = context.logicalSpace();
    const config = context.config();
    const {
        orientation,
        xOffset,
        yOffset
    } = config;
    if (orientation === LEFT) {
        x = xOffset === undefined ? logicalSpace.width : xOffset;
    }
    if (orientation === TOP) {
        y = yOffset === undefined ? logicalSpace.height : yOffset;
    }
    context.config({ xOffset: x, yOffset: y });
};

 /**
 * Listener attached to the axis on change of parameters.
 *
 * @param {Function} callback to be excuted on change of domain range etc
 * @memberof SimpleAxis
 */
export const registerChangeListeners = (context) => {
    const store = context.store();

    store.model.next(['domain', 'range', 'mount', 'config'], (...params) => {
        context.render();
        context._domainLock = false;
        context._eventList.forEach((e) => {
            e.action instanceof Function && e.action(...params);
        });
    }, true);
    return context;
};

/**
 *
 *
 * @param {*} axisDimensions
 * @param {*} config
 * @param {*} range
 * @returns
 */
export const getHorizontalAxisSpace = (context, axisDimensions, config, range) => {
    let width;
    let height;
    const {
        tickSize,
        tickLabelDim,
        axisLabelDim
    } = axisDimensions;
    const {
        axisNamePadding,
        showAxisName,
        tickValues
   } = config;
    const domain = context.domain();
    const { height: axisDimHeight } = axisLabelDim;
    const { height: tickDimHeight, width: tickDimWidth } = tickLabelDim;

    width = range && range.length ? range[1] - range[0] : 0;

    height = 0;
    if (tickValues) {
        const minTickDiff = context.getMinTickDifference();
        const [min, max] = [Math.min(...tickValues, ...domain), Math.max(...tickValues, ...domain)];

        width = ((max - min) / Math.abs(minTickDiff)) * (tickDimWidth + context._minTickDistance.width);
    }
    if (!width || width === 0) {
        height = Math.max(tickDimWidth, tickDimHeight);
    } else {
        height = tickDimHeight;
    }
    height += (showAxisName ? (axisDimHeight + axisNamePadding) : 0) + tickSize;
    return {
        width,
        height
    };
};

/**
 *
 *
 * @param {*} axisDimensions
 * @param {*} config
 * @param {*} range
 * @returns
 */
export const getVerticalAxisSpace = (context, axisDimensions, config) => {
    let height;
    let width;
    const {
        tickSize,
        tickLabelDim,
        axisLabelDim
    } = axisDimensions;
    const {
        axisNamePadding,
        showAxisName,
        tickValues
   } = config;
    const domain = context.domain();
    const { height: axisDimHeight } = axisLabelDim;
    const { height: tickDimHeight, width: tickDimWidth } = tickLabelDim;

    height = 0;
    width = tickDimWidth;
    if (tickValues) {
        const minTickDiff = context.getMinTickDifference();
        const [min, max] = [Math.min(...tickValues, ...domain), Math.max(...tickValues, ...domain)];

        height = ((max - min) / Math.abs(minTickDiff)) * (tickDimHeight);
    }
    width += (showAxisName ? axisDimHeight : 0) + tickSize + axisNamePadding;

    return {
        height,
        width
    };
};

export const getAxisComponentDimensions = (context) => {
    let largestTick = '';
    let largestTickDimensions = { width: 0, height: 0 };
    let smartTick = {};
    let axisTicks;
    const allTickDimensions = [];
    const scale = context.scale();
    const { showAxisName } = context.renderConfig();
    const { tickValues, name } = context.config();
    const { labelManager } = context.dependencies();
    const labelFunc = scale.ticks || scale.quantile || scale.domain;

    // set the style on the shared label manager instance
    labelManager.setStyle(context._tickLabelStyle);

    // get the values along the domain
    axisTicks = tickValues || labelFunc();

    // Get the tick labels
    axisTicks = axisTicks.map((originalLabel, i) => {
        const label = context.getFormattedText(originalLabel, i, axisTicks);

    // convert to string for quant values
        const tickDimensions = labelManager.getOriSize(label);

    // Get spaces for all labels
        allTickDimensions.push(tickDimensions);

    // Getting largest label
        if (tickDimensions.width > largestTickDimensions.width) {
            largestTick = label;
            smartTick = context.smartTicks() ? context.smartTicks()[i] : {};
            largestTickDimensions = tickDimensions;
        }
        return label;
    });

    labelManager.setStyle(context._axisNameStyle);
    const axisNameDimensions = showAxisName ? labelManager.getOriSize(name) : { width: 0, height: 0 };

    return {
        axisNameDimensions,
        largestTick,
        largestTickDimensions,
        allTickDimensions,
        axisTicks,
        smartTick,
        tickSize: context.getTickSize()
    };
};

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

/**
 * Checks if any of the properties have changed between two objects
 * @param {Object} obj first object
 * @param {Object} obj1 second object
 * @param {Array} properties properties to be compared between two objects
 *
 * @return {Boolean} boolean value
 */
export const hasAxesConfigChanged = (obj = {}, obj1 = {}, properties) => {
    if (!Object.keys(obj).length || !Object.keys(obj1).length) {
        return false;
    }
    return properties.some(key => obj[key] !== obj1[key]);
};

/**
 * Overwrites domain with user defined domain (if present)
 * @param {Object} context reference to current axes
 * @param {Array} domain default domain
 *
 * @return {Array} domain
 */
export const getValidDomain = (context, domain) => {
    const { domain: userDom } = context.config();

    if (userDom) {
        domain = userDom;
    }

    return domain;
};

