import RetinalEncoder from './retinal-encoder';
import { retriveDomainFromData } from '../../group-helper';

export default class RetinalEncoderForCartesianPlane extends RetinalEncoder {

    /**
     *
     *
     * @param {*} datamodel
     * @return
     * @memberof CartesianEncoder
     */
    getFieldsDomain (dataModels, encoding) {
        const groupedModel = dataModels.groupedModel;
        const domains = {};
        for (const key in encoding) {
            if ({}.hasOwnProperty.call(encoding, key)) {
                const encodingObj = encoding[key];
                const field = encodingObj.field;
                if (!encodingObj.domain && field) {
                    const domain = retriveDomainFromData(groupedModel, field);
                    domains[field] = domain;
                }
            }
        }
        return domains;
    }
}
