import {
    CartesianEncoder,
    PolarEncoder,
    RetinalEncoderForCartesianPlane,
    RetinalEncoderForPolarPlane
} from '../encoders';

export const planarEncoderMap = {
    cartesian: CartesianEncoder,
    polar: PolarEncoder
};

export const retinalEncoderMap = {
    cartesian: RetinalEncoderForCartesianPlane,
    polar: RetinalEncoderForPolarPlane
};
