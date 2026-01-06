import * as i0 from '@angular/core';
import { input, Directive, computed, contentChildren, output, Component, inject } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from 'primeng/table';
import { TableModule } from 'primeng/table';
import * as i1$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as i2$1 from 'primeng/multiselect';
import { MultiSelectModule } from 'primeng/multiselect';
import * as i1$2 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import * as i2$2 from 'primeng/tooltip';
import { TooltipModule } from 'primeng/tooltip';

class MCThTemplateDirective {
    template;
    mcThTemplate = input.required();
    constructor(template) {
        this.template = template;
    }
    getFieldName() {
        return this.mcThTemplate();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCThTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "19.2.13", type: MCThTemplateDirective, isStandalone: true, selector: "[mcThTemplate]", inputs: { mcThTemplate: { classPropertyName: "mcThTemplate", publicName: "mcThTemplate", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCThTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mcThTemplate]'
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });

class MCTdTemplateDirective {
    template;
    mcTdTemplate = input.required();
    constructor(template) {
        this.template = template;
    }
    getFieldName() {
        return this.mcTdTemplate();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCTdTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "17.1.0", version: "19.2.13", type: MCTdTemplateDirective, isStandalone: true, selector: "[mcTdTemplate]", inputs: { mcTdTemplate: { classPropertyName: "mcTdTemplate", publicName: "mcTdTemplate", isSignal: true, isRequired: true, transformFunction: null } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCTdTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mcTdTemplate]'
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }] });

class MCTable {
    columns = input.required();
    columnsPrinted = computed(() => this.columns().filter((column) => column.isShow == undefined || column.isShow));
    response = input();
    items = computed(() => this.response()?.data ?? []);
    thTemplates = contentChildren(MCThTemplateDirective);
    tdTemplates = contentChildren(MCTdTemplateDirective);
    paginator = input(true);
    onPage = output();
    onSort = output();
    sortField = input();
    sortOrder = input(-1);
    onSortChange(event) {
        this.onSort.emit(event);
    }
    customSort(event) { }
    onPageChange(event) {
        this.onPage.emit(event);
    }
    isThTemplate(field) {
        return this.thTemplates().some(template => template.getFieldName() === field);
    }
    getThTemplate(field) {
        return this.thTemplates().find(template => template.getFieldName() === field)?.template ?? null;
    }
    isTdTemplate(field) {
        return this.tdTemplates().some(template => template.getFieldName() === field);
    }
    getTdTemplate(field) {
        return this.tdTemplates().find(template => template.getFieldName() === field)?.template ?? null;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCTable, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.13", type: MCTable, isStandalone: true, selector: "mc-table", inputs: { columns: { classPropertyName: "columns", publicName: "columns", isSignal: true, isRequired: true, transformFunction: null }, response: { classPropertyName: "response", publicName: "response", isSignal: true, isRequired: false, transformFunction: null }, paginator: { classPropertyName: "paginator", publicName: "paginator", isSignal: true, isRequired: false, transformFunction: null }, sortField: { classPropertyName: "sortField", publicName: "sortField", isSignal: true, isRequired: false, transformFunction: null }, sortOrder: { classPropertyName: "sortOrder", publicName: "sortOrder", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { onPage: "onPage", onSort: "onSort" }, queries: [{ propertyName: "thTemplates", predicate: MCThTemplateDirective, isSignal: true }, { propertyName: "tdTemplates", predicate: MCTdTemplateDirective, isSignal: true }], ngImport: i0, template: "<p-table [value]=\"items()\" [paginator]=\"paginator()\" [rows]=\"response()?.per_page ?? 50\" [totalRecords]=\"response()?.total ?? 0\" [rowsPerPageOptions]=\"[5, 10, 20, 50]\" (onPage)=\"onPageChange($event)\" [sortField]=\"sortField()\" [sortOrder]=\"sortOrder()\" (onSort)=\"onSortChange($event)\" [customSort]=\"true\" (sortFunction)=\"customSort($event)\" [lazy]=\"true\" styleClass=\"w-full\">\r\n  <ng-template #header>\r\n      <tr>\r\n        @for (column of columnsPrinted(); track column) {\r\n          @if (isThTemplate(column.field)) {\r\n            <th [pSortableColumn]=\"column.isSortable ? column.field : undefined\"><ng-container [ngTemplateOutlet]=\"getThTemplate(column.field)\"></ng-container></th>\r\n          } @else {\r\n            <th [pSortableColumn]=\"column.isSortable ? column.field : undefined\">\r\n              {{column.title}}\r\n\r\n              @if (column.isSortable) {\r\n                <p-sortIcon [field]=\"column.field\" />\r\n              }\r\n\r\n            </th>\r\n          }\r\n        }\r\n      </tr>\r\n  </ng-template>\r\n  <ng-template #body let-row let-rowIndex=\"rowIndex\">\r\n      <tr>\r\n        @for (column of columnsPrinted(); track column) {\r\n          @if (isTdTemplate(column.field)) {\r\n            <td><ng-container [ngTemplateOutlet]=\"getTdTemplate(column.field)\" [ngTemplateOutletContext]=\"{ $implicit: row, row: row, rowIndex: rowIndex }\"></ng-container></td>\r\n          } @else {\r\n            <td>{{ row[column.field] }}</td>\r\n          }\r\n        }\r\n      </tr>\r\n  </ng-template>\r\n</p-table>\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: TableModule }, { kind: "component", type: i2.Table, selector: "p-table", inputs: ["frozenColumns", "frozenValue", "style", "styleClass", "tableStyle", "tableStyleClass", "paginator", "pageLinks", "rowsPerPageOptions", "alwaysShowPaginator", "paginatorPosition", "paginatorStyleClass", "paginatorDropdownAppendTo", "paginatorDropdownScrollHeight", "currentPageReportTemplate", "showCurrentPageReport", "showJumpToPageDropdown", "showJumpToPageInput", "showFirstLastIcon", "showPageLinks", "defaultSortOrder", "sortMode", "resetPageOnSort", "selectionMode", "selectionPageOnly", "contextMenuSelection", "contextMenuSelectionMode", "dataKey", "metaKeySelection", "rowSelectable", "rowTrackBy", "lazy", "lazyLoadOnInit", "compareSelectionBy", "csvSeparator", "exportFilename", "filters", "globalFilterFields", "filterDelay", "filterLocale", "expandedRowKeys", "editingRowKeys", "rowExpandMode", "scrollable", "scrollDirection", "rowGroupMode", "scrollHeight", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "virtualScrollDelay", "frozenWidth", "responsive", "contextMenu", "resizableColumns", "columnResizeMode", "reorderableColumns", "loading", "loadingIcon", "showLoader", "rowHover", "customSort", "showInitialSortBadge", "autoLayout", "exportFunction", "exportHeader", "stateKey", "stateStorage", "editMode", "groupRowsBy", "size", "showGridlines", "stripedRows", "groupRowsByOrder", "responsiveLayout", "breakpoint", "paginatorLocale", "value", "columns", "first", "rows", "totalRecords", "sortField", "sortOrder", "multiSortMeta", "selection", "virtualRowHeight", "selectAll"], outputs: ["contextMenuSelectionChange", "selectAllChange", "selectionChange", "onRowSelect", "onRowUnselect", "onPage", "onSort", "onFilter", "onLazyLoad", "onRowExpand", "onRowCollapse", "onContextMenuSelect", "onColResize", "onColReorder", "onRowReorder", "onEditInit", "onEditComplete", "onEditCancel", "onHeaderCheckboxToggle", "sortFunction", "firstChange", "rowsChange", "onStateSave", "onStateRestore"] }, { kind: "directive", type: i2.SortableColumn, selector: "[pSortableColumn]", inputs: ["pSortableColumn", "pSortableColumnDisabled"] }, { kind: "component", type: i2.SortIcon, selector: "p-sortIcon", inputs: ["field"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCTable, decorators: [{
            type: Component,
            args: [{ selector: 'mc-table', imports: [CommonModule, TableModule], template: "<p-table [value]=\"items()\" [paginator]=\"paginator()\" [rows]=\"response()?.per_page ?? 50\" [totalRecords]=\"response()?.total ?? 0\" [rowsPerPageOptions]=\"[5, 10, 20, 50]\" (onPage)=\"onPageChange($event)\" [sortField]=\"sortField()\" [sortOrder]=\"sortOrder()\" (onSort)=\"onSortChange($event)\" [customSort]=\"true\" (sortFunction)=\"customSort($event)\" [lazy]=\"true\" styleClass=\"w-full\">\r\n  <ng-template #header>\r\n      <tr>\r\n        @for (column of columnsPrinted(); track column) {\r\n          @if (isThTemplate(column.field)) {\r\n            <th [pSortableColumn]=\"column.isSortable ? column.field : undefined\"><ng-container [ngTemplateOutlet]=\"getThTemplate(column.field)\"></ng-container></th>\r\n          } @else {\r\n            <th [pSortableColumn]=\"column.isSortable ? column.field : undefined\">\r\n              {{column.title}}\r\n\r\n              @if (column.isSortable) {\r\n                <p-sortIcon [field]=\"column.field\" />\r\n              }\r\n\r\n            </th>\r\n          }\r\n        }\r\n      </tr>\r\n  </ng-template>\r\n  <ng-template #body let-row let-rowIndex=\"rowIndex\">\r\n      <tr>\r\n        @for (column of columnsPrinted(); track column) {\r\n          @if (isTdTemplate(column.field)) {\r\n            <td><ng-container [ngTemplateOutlet]=\"getTdTemplate(column.field)\" [ngTemplateOutletContext]=\"{ $implicit: row, row: row, rowIndex: rowIndex }\"></ng-container></td>\r\n          } @else {\r\n            <td>{{ row[column.field] }}</td>\r\n          }\r\n        }\r\n      </tr>\r\n  </ng-template>\r\n</p-table>\r\n" }]
        }] });

class ShowColumnsButton {
    key = input();
    hasStorage = input(true);
    initialColumns = input.required();
    onSelected = output();
    storageService = inject(StorageMap);
    selectedColumns;
    ngOnInit() {
        this.selectedColumns = this.initialColumns().filter(column => column.isShow);
        this.onSelected.emit(this.selectedColumns ?? []);
        this.loadStorage();
    }
    setSelectedColumns(columnsSelected) {
        this.selectedColumns = this.initialColumns().filter(column => columnsSelected.some(c => c.field == column.field));
    }
    columnsChange(event) {
        this.saveStorage();
        this.onSelected.emit(this.selectedColumns ?? []);
    }
    saveStorage() {
        if (this.key() == undefined || this.key() == '' || this.hasStorage() == false) {
            return;
        }
        this.storageService.set(this.getKey(), JSON.stringify(this.selectedColumns), { type: 'string' }).subscribe(() => { });
    }
    loadStorage() {
        if (this.key() == undefined || this.key() == '' || this.hasStorage() == false) {
            return;
        }
        this.storageService.get(this.getKey(), { type: 'string' })
            .subscribe((value) => {
            if (value) {
                this.setSelectedColumns(JSON.parse(value));
                this.onSelected.emit(this.selectedColumns ?? []);
            }
        });
    }
    getKey() {
        return this.key() + '_selected_columns';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: ShowColumnsButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "19.2.13", type: ShowColumnsButton, isStandalone: true, selector: "mc-show-columns-button", inputs: { key: { classPropertyName: "key", publicName: "key", isSignal: true, isRequired: false, transformFunction: null }, hasStorage: { classPropertyName: "hasStorage", publicName: "hasStorage", isSignal: true, isRequired: false, transformFunction: null }, initialColumns: { classPropertyName: "initialColumns", publicName: "initialColumns", isSignal: true, isRequired: true, transformFunction: null } }, outputs: { onSelected: "onSelected" }, ngImport: i0, template: "<p-multiSelect [options]=\"initialColumns()\" [(ngModel)]=\"selectedColumns\" optionLabel=\"title\" placeholder=\"Columns\" filter=\"false\" (onChange)=\"columnsChange($event)\" [appendTo]=\"'body'\" />\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: MultiSelectModule }, { kind: "component", type: i2$1.MultiSelect, selector: "p-multiSelect, p-multiselect, p-multi-select", inputs: ["id", "ariaLabel", "style", "styleClass", "panelStyle", "panelStyleClass", "inputId", "disabled", "fluid", "readonly", "group", "filter", "filterPlaceHolder", "filterLocale", "overlayVisible", "tabindex", "variant", "appendTo", "dataKey", "name", "ariaLabelledBy", "displaySelectedLabel", "maxSelectedLabels", "selectionLimit", "selectedItemsLabel", "showToggleAll", "emptyFilterMessage", "emptyMessage", "resetFilterOnHide", "dropdownIcon", "chipIcon", "optionLabel", "optionValue", "optionDisabled", "optionGroupLabel", "optionGroupChildren", "showHeader", "filterBy", "scrollHeight", "lazy", "virtualScroll", "loading", "virtualScrollItemSize", "loadingIcon", "virtualScrollOptions", "overlayOptions", "ariaFilterLabel", "filterMatchMode", "tooltip", "tooltipPosition", "tooltipPositionStyle", "tooltipStyleClass", "autofocusFilter", "display", "autocomplete", "size", "showClear", "autofocus", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "defaultLabel", "placeholder", "options", "filterValue", "itemSize", "selectAll", "focusOnHover", "filterFields", "selectOnFocus", "autoOptionFocus", "highlightOnSelect"], outputs: ["onChange", "onFilter", "onFocus", "onBlur", "onClick", "onClear", "onPanelShow", "onPanelHide", "onLazyLoad", "onRemove", "onSelectAllChange"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: ShowColumnsButton, decorators: [{
            type: Component,
            args: [{ selector: 'mc-show-columns-button', imports: [CommonModule, FormsModule, MultiSelectModule], template: "<p-multiSelect [options]=\"initialColumns()\" [(ngModel)]=\"selectedColumns\" optionLabel=\"title\" placeholder=\"Columns\" filter=\"false\" (onChange)=\"columnsChange($event)\" [appendTo]=\"'body'\" />\r\n" }]
        }] });

class MCActionsColumn {
    item = input.required();
    hasEdit = input(true);
    hasRemove = input(true);
    onEdit = output();
    onRemove = output();
    onClickEdit() {
        this.onEdit.emit(this.item());
    }
    onClickRemove() {
        this.onRemove.emit(this.item());
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCActionsColumn, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.13", type: MCActionsColumn, isStandalone: true, selector: "mc-actions-column", inputs: { item: { classPropertyName: "item", publicName: "item", isSignal: true, isRequired: true, transformFunction: null }, hasEdit: { classPropertyName: "hasEdit", publicName: "hasEdit", isSignal: true, isRequired: false, transformFunction: null }, hasRemove: { classPropertyName: "hasRemove", publicName: "hasRemove", isSignal: true, isRequired: false, transformFunction: null } }, outputs: { onEdit: "onEdit", onRemove: "onRemove" }, ngImport: i0, template: "<div class=\"mc-actions-column\">\r\n  <ng-content></ng-content>\r\n  @if (hasEdit()) {\r\n    <p-button icon=\"pi pi-pencil\" class=\"mr-2\" [rounded]=\"true\" [outlined]=\"true\" severity=\"success\" (onClick)=\"onClickEdit()\" pTooltip=\"Edit\" />\r\n  }\r\n  @if (hasRemove()) {\r\n    <p-button icon=\"pi pi-trash\" severity=\"danger\" [rounded]=\"true\" [outlined]=\"true\" (onClick)=\"onClickRemove()\" pTooltip=\"Remove\" />\r\n  }\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: ButtonModule }, { kind: "component", type: i1$2.Button, selector: "p-button", inputs: ["type", "iconPos", "icon", "badge", "label", "disabled", "loading", "loadingIcon", "raised", "rounded", "text", "plain", "severity", "outlined", "link", "tabindex", "size", "variant", "style", "styleClass", "badgeClass", "badgeSeverity", "ariaLabel", "autofocus", "fluid", "buttonProps"], outputs: ["onClick", "onFocus", "onBlur"] }, { kind: "ngmodule", type: TooltipModule }, { kind: "directive", type: i2$2.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCActionsColumn, decorators: [{
            type: Component,
            args: [{ selector: 'mc-actions-column', imports: [CommonModule, ButtonModule, TooltipModule], template: "<div class=\"mc-actions-column\">\r\n  <ng-content></ng-content>\r\n  @if (hasEdit()) {\r\n    <p-button icon=\"pi pi-pencil\" class=\"mr-2\" [rounded]=\"true\" [outlined]=\"true\" severity=\"success\" (onClick)=\"onClickEdit()\" pTooltip=\"Edit\" />\r\n  }\r\n  @if (hasRemove()) {\r\n    <p-button icon=\"pi pi-trash\" severity=\"danger\" [rounded]=\"true\" [outlined]=\"true\" (onClick)=\"onClickRemove()\" pTooltip=\"Remove\" />\r\n  }\r\n</div>\r\n" }]
        }] });

/*
 * Public API Surface of table
 */
/**
 * Directives
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MCActionsColumn, MCTable, MCTdTemplateDirective, MCThTemplateDirective, ShowColumnsButton };
//# sourceMappingURL=mckit-table.mjs.map
