import RetinalEncoder from './retinal-encoder';
import { RADIUS, ANGLE, SIZE, MEASURE, COLOR } from '../../enums/constants';

export default class RetinalEncoderForPolarPlane extends RetinalEncoder {

    getFieldsDomain (dataModels, encoding, facetFields, groupBy) {
        let sizeField;
        let colorField;
        const fields = [];
        const layers = this.layers();
        const dataModel = dataModels.parentModel;
        const fieldsConfig = dataModel.getFieldsConfig();
        const domains = {};
        if (layers && layers[0]) {
            const layer = layers[0];
            const layerEncoding = layer.def.encoding || {};

            [RADIUS, ANGLE, SIZE, COLOR].forEach((encType) => {
                const field = layerEncoding[encType] ? layerEncoding[encType].field : '';
                const measureField = fieldsConfig[field] && fieldsConfig[field].def.type === MEASURE;
                if (encType === SIZE && measureField) {
                    sizeField = field;
                }
                if (encType === COLOR) {
                    colorField = field;
                }
                fieldsConfig[field] && !measureField && fields.push(field);
            });
        }

        if (sizeField) {
            domains[sizeField] = dataModel.groupBy(facetFields, {
                [sizeField]: 'sum'
            }).getFieldspace().fieldsObj()[sizeField].domain();
        }

        if (colorField) {
            const dm = dataModel.groupBy([...facetFields, ...fields], groupBy.measures);
            domains[colorField] = dm.getFieldspace().fieldsObj()[colorField].domain();
        }
        return domains;
    }
}
