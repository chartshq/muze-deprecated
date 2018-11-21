import { DEFAULT_CLASS_NAME } from '../constants/defaults'
;

export class DataPoint {
    constructor (node) {
        this._node = node;
        this._className = DEFAULT_CLASS_NAME;
    }

    node () {
        return this._node;
    }

    hasHost () {
        return this._node.model().host() !== null;
    }

    className () {
        if (this._node.model().host() && this._node.model().host() &&
                typeof (this._node.model().host()) !== 'string') {
            this._className = this._node.model().host().className();
        }
        return this._className;
    }
}
