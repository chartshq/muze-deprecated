/**
 * @module Axis
 * This file exports all the public methods and classes in the axis module.
 */
import * as AxisOrientation from './enums/axis-orientation';
import * as ScaleType from './enums/scale-type';
import './styles.scss';

export { SimpleAxis, ContinousAxis, NumericAxis, BandAxis, TimeAxis } from './cartesian-axis';
export { RetinalAxis, ColorAxis, SizeAxis, ShapeAxis } from './retinal-axis';
export { dataTypeScaleMap } from './data-type-scale-map';
export { AxisOrientation, ScaleType };
