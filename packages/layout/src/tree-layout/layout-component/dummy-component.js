import LayoutComponent from './layoutComponent';

class DummyComponent extends LayoutComponent {
    getLogicalSpace () {
        return {
            width: this.boundBox.width - (2 * this.seed),
            height: this.boundBox.height - (2 * this.seed)
        };
    }

    setSpatialConfig (conf) {
        this.boundBox({ top: conf.y, left: conf.x });
        this.newDimensions = {
            width: conf.width,
            height: conf.height
        };
        this.renderAt(conf.renderAt);
    }

    draw () {
        if (!this.component) {
            throw new Error(`Component not set for ${this.componentName}`);
        }
        this.component.mount(document.getElementById(this.renderAt)); // Change the draw method to component draw
    }
}

export default DummyComponent;
