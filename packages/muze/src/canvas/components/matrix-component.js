import { makeElement } from 'muze-utils';
import { applySpans, renderPlaceholders } from '../../../../layout/src/grid-layout/renderer';
import { cellSpanMaker } from '../../../../layout/src/grid-layout/span-maker';
import {
     TOP, LEFT, RIGHT, BOTTOM, CENTER
} from '../../../../layout/src/enums/constants';
import { BLANK_BORDERS } from '../../../../layout/src/grid-layout/defaults';
import MuzeComponent from './muze-chart-component';

export default class MatrixComponent extends MuzeComponent {

    constructor (params) {
        super(params.name, params.config.dimensions, 0);
        this.setParams(params);
        this.className(params.config.className);
    }

    renderMatrix (mountPoint) {
        // // Creating containers for each matrix individually
        const classPrefix = this.params.config.classPrefix;
        const row = this.params.config.row;
        const column = this.params.config.column;
        const dimensions = this.params.config.dimensions;
        const border = this.params.config.border;

          // Creating containers for each matrix individually
        const containerForMatrix = makeElement(mountPoint, 'div', [1], `${classPrefix}-grid-${row}-${column + 1}`)
          .classed(`${classPrefix}-grid-${row}`, true)
          .classed(`${classPrefix}-grid`, true);

        const {
              viewMatrix,
              spans
          } = cellSpanMaker(this.component, row, column);

          // Rendering the table components
        const { cells } = this.renderTable(containerForMatrix, `${classPrefix}-grid`, viewMatrix);

        applySpans(cells, spans, { dimensions, border }, `${row}-${column}`);
        renderPlaceholders(cells);

        cells.exit().each((cell) => {
            cell.placeholder.remove();
        });

        this.applyBorders(cells, border, row, column);
    }

    applyBorders (cells, border, type, index) {
        const {
          width,
          style,
          color,
          showRowBorders,
          showColBorders,
          showValueBorders
      } = border;
        const borderStyle = `${width}px ${style}`;

        if (type === CENTER && index === 1) {
            [TOP, BOTTOM, LEFT, RIGHT].forEach((borderType) => {
                cells.style(`border-${borderType}`, `${borderStyle} ${showValueBorders[borderType] ?
                  color : BLANK_BORDERS}`);
            });
        } else if (type === CENTER) {
            this.applyRowBorders(cells, borderStyle, showRowBorders, color);
        } else if (index === 1) {
            this.applyColBorders(cells, borderStyle, showColBorders, color);
        }
    }

    renderTable (mount, className, rowData) {
        const table = makeElement(mount, 'table', ['layout'], `${className}-table`);
        const body = makeElement(table, 'tbody', ['layout'], `${className}-body`);
        const rows = makeElement(body, 'tr', rowData, `${className}-tr`);
        const cells = makeElement(rows, 'td', (d, i) => d.filter(e => e !== null).map(e =>
                                  ({ placeholder: e, rowIndex: i })), `${className}-td`, {}, key => key.placeholder.id);

        return { table, body, rows, cells };
    }

    applyRowBorders (cells, borderStyle, showBorders, color) {
        [TOP, BOTTOM].forEach((borderType) => {
            const style = `${borderStyle} ${showBorders[borderType] ? color : BLANK_BORDERS}`;
            cells.style(`border-${borderType}`, style);
        });
    }

    applyColBorders (cells, borderStyle, showBorders, color) {
        [LEFT, RIGHT].forEach((borderType) => {
            const style = `${borderStyle} ${showBorders[borderType] ? color : BLANK_BORDERS}`;
            cells.style(`border-${borderType}`, style);
        });
    }

    draw (container) {
        this.renderMatrix(container || document.getElementById(this.renderAt()));
    }

    updateWrapper (params) {
        this.name(params.name);
        this.boundBox(params.config.dimensions);
        this.setParams(params);
        return this;
    }

    setParams (params) {
        this.component = params.component;
        this.params = params;
        this.target(params.config.target);
        this.position(TOP);
        this.className(params.config.className);
    }
}
