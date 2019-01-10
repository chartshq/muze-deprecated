import { selectElement } from 'muze-utils';
import {
     TOP, BOTTOM, CENTER, ROW_SPAN, COL_SPAN
} from '../enums/constants';

const spaceAllocationDueToSpan = (span, placeholder, borderWidth) => {
    const height = placeholder.availHeight();
    const width = placeholder.availWidth();

    return {
        [ROW_SPAN] () {
            selectElement(this).style('height', `${height + borderWidth}px`);
            if (span > 1) {
                selectElement(this).style('height', `${height * span + borderWidth * (span)}px`);
                placeholder.setAvailableSpace(width, height * span);
            }
        },
        [COL_SPAN] () {
            if (span > 1) {
                placeholder.setAvailableSpace(width * span + borderWidth * (span - 1), height);
            }
            selectElement(this).style('height', `${height}px`);
        }
    };
};

const spanApplier = (cells, spans, config, type) => {
    const borderWidth = config.border.width;

    cells.attr(type, function (cell, colIndex) {
        const span = spans[cell.rowIndex][colIndex];
        const placeholder = cell.placeholder;

        spaceAllocationDueToSpan(span, placeholder, borderWidth)[type].bind(this)();
        return span;
    });
};

const spanApplierMap = {
    [`${TOP}-0`]: null,
    [`${TOP}-1`]: (...params) => spanApplier(...params, COL_SPAN),
    [`${TOP}-2`]: null,
    [`${CENTER}-0`]: (...params) => spanApplier(...params, ROW_SPAN),
    [`${CENTER}-1`]: null,
    [`${CENTER}-2`]: (...params) => spanApplier(...params, ROW_SPAN),
    [`${BOTTOM}-0`]: null,
    [`${BOTTOM}-1`]: (...params) => spanApplier(...params, COL_SPAN),
    [`${BOTTOM}-2`]: null
};

export const applySpans = (cells, spans, config, type) => {
    const applier = spanApplierMap[type];
    if (applier) {
        applier(cells, spans, config);
    }
};

export const renderPlaceholders = (cells) => {
      // Rendering content within placeholders
    cells.each(function (cell) {
        cell.placeholder.render(this);
    });
};
