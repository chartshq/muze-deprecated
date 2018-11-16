import { scaleMaps } from '../../enums/scale-maps';
import { getAxisType } from '../../group-helper';
/**
 *
 *
 * @param {*} axesCreators
 * @param {*} [fieldInfo=[]]
 * @return
 */
export const createRetinalAxis = (axesCreators, fieldProps = {}) => {
    const { axisType, fieldsConfig } = axesCreators;
    const field = fieldProps.field;
    const axis = [];
    const Cls = scaleMaps[axisType];

    fieldProps.type = fieldProps.type ? fieldProps.type : getAxisType(fieldsConfig, field || null);
    axis.push(new Cls(fieldProps));
    return axis;
};
