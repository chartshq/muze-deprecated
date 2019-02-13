import { mergeRecursive } from 'muze-utils';
import { hasAxesConfigChanged } from './common-helper';

export const PROPS = {
    axis: {},
    availableSpace: {},
    axisDimensions: {},
    axisComponentDimensions: {},
    config: {
        sanitization: (context, value) => {
            const oldConfig = Object.assign({}, context._config || {});
            const mockedOldConfig = mergeRecursive({}, oldConfig);
            value = mergeRecursive(mockedOldConfig, value);

            value.axisNamePadding = Math.max(value.axisNamePadding, 0);
            const shouldAxesScaleUpdate = hasAxesConfigChanged(
                value, oldConfig, ['interpolator', 'exponent', 'base', 'orientation']
            );
            const tickFormatter = context.sanitizeTickFormatter(value);

            if (shouldAxesScaleUpdate) {
                context._scale = context.createScale(value);
                context._axis = context.createAxis(value);
            }

            context._tickFormatter = ticks => tickFormatter(ticks);

            const {
                labels,
                show,
                showInnerTicks,
                showOuterTicks,
                showAxisName
            } = value;
            context.renderConfig({
                labels,
                show,
                showInnerTicks,
                showOuterTicks,
                showAxisName
            });
            return value;
        }
    },
    renderConfig: {
        sanitization: (context, value) => {
            const oldConfig = Object.assign({}, context._renderConfig || {});
            value = mergeRecursive(oldConfig, value);
            return value;
        }
    },
    logicalSpace: {},
    mount: {
    },
    range: {
        sanitization: (context, value) => {
            context.scale().range(value);
            context.logicalSpace(null);
            return value;
        }
    },
    scale: {},
    smartTicks: {},
    tickSize: {},
    maxTickSpaces: {},
    valueParser: {
        defaultValue: val => val
    }
};
