import { getEvent } from 'muze-utils';
import { generatePayloadFromEvent } from './helpers';

/**
 * Adds mouse interactions to target element.
 * @param {Firebolt} instance instance of firebolt.
 * @param {SVGElement} targetEl Element on which the event listeners will be attached.
 * @param {Array} behaviours Array of behaviours
 */
const hover = firebolt => (targetEl, behaviours) => {
    /* This assumes that the context has a generateHoverPayload fn which
    invokes the callback function with required params */
    const dispatchBehaviour = function (args) {
        const event = getEvent();
        const context = firebolt.context;
        const payload = context.generateHoverPayload(args, firebolt, generatePayloadFromEvent);

        behaviours.forEach(beh => firebolt.dispatchBehaviour(beh, payload));
        event.stopPropagation();
    };

    targetEl
        .on('mouseover', dispatchBehaviour)
        .on('mousemove', dispatchBehaviour)
        .on('mouseout', () => {
            behaviours.forEach(beh => firebolt.dispatchBehaviour(beh, {
                criteria: null
            }));
        });
};

export default hover;
