import {
    LogInterpolator,
    PowInterpolator,
    LinearInterpolator
} from '../cartesian-axis/continous-axis/interpolators';
import {
    LINEAR,
    LOG,
    POW
} from './scale-type';

export const interpolatorMap = {
    [LOG]: LogInterpolator,
    [POW]: PowInterpolator,
    [LINEAR]: LinearInterpolator
};
