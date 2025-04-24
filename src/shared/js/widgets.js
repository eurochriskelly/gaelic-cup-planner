class WidgetMaker {
    constructor() {
        this.widgets = [];
    }

    addWidget(widget) {
        this.widgets.push(widget);
    }

    getWidgets() {
        return this.widgets;
    }
}