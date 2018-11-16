import { ERROR_MSG } from 'muze-utils';
/**
 *
 *
 * @export
 * @class VisualEncoder
 */
export default class VisualEncoder {

    /**
     *
     *
     * @memberof VisualEncoder
     */
    createAxis () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    /**
     *
     *
     * @memberof VisualEncoder
     */
    getLayerConfig () {
        throw new Error(ERROR_MSG.INTERFACE_IMPL);
    }

    layers (...layers) {
        if (layers.length) {
            this._layers = layers[0];
            return this;
        }
        return this._layers;
    }
}
