import { NumericAxis, BandAxis, TimeAxis, ColorAxis, SizeAxis, ShapeAxis } from '@chartshq/muze-axis';

export const scaleMaps = {
    linear: NumericAxis,
    band: BandAxis,
    temporal: TimeAxis,
    size: SizeAxis,
    color: ColorAxis,
    shape: ShapeAxis
};
