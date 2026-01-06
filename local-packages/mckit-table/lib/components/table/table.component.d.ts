import { TemplateRef } from '@angular/core';
import { MCColumn, MCListResponse } from '@mckit/core';
import { TablePageEvent } from 'primeng/table';
import { MCThTemplateDirective } from '../../directives/th-template.directive';
import { MCTdTemplateDirective } from '../../directives/td-template.directive';
import * as i0 from "@angular/core";
export declare class MCTable {
    columns: import("@angular/core").InputSignal<MCColumn[]>;
    columnsPrinted: import("@angular/core").Signal<MCColumn[]>;
    response: import("@angular/core").InputSignal<MCListResponse<any> | undefined>;
    items: import("@angular/core").Signal<any[]>;
    thTemplates: import("@angular/core").Signal<readonly MCThTemplateDirective[]>;
    tdTemplates: import("@angular/core").Signal<readonly MCTdTemplateDirective[]>;
    paginator: import("@angular/core").InputSignal<boolean>;
    onPage: import("@angular/core").OutputEmitterRef<TablePageEvent>;
    onSort: import("@angular/core").OutputEmitterRef<any>;
    sortField: import("@angular/core").InputSignal<string | undefined>;
    sortOrder: import("@angular/core").InputSignal<number>;
    onSortChange(event: any): void;
    customSort(event: any): void;
    onPageChange(event: TablePageEvent): void;
    isThTemplate(field: string): boolean;
    getThTemplate(field: string): TemplateRef<any> | null;
    isTdTemplate(field: string): boolean;
    getTdTemplate(field: string): TemplateRef<any> | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCTable, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MCTable, "mc-table", never, { "columns": { "alias": "columns"; "required": true; "isSignal": true; }; "response": { "alias": "response"; "required": false; "isSignal": true; }; "paginator": { "alias": "paginator"; "required": false; "isSignal": true; }; "sortField": { "alias": "sortField"; "required": false; "isSignal": true; }; "sortOrder": { "alias": "sortOrder"; "required": false; "isSignal": true; }; }, { "onPage": "onPage"; "onSort": "onSort"; }, ["thTemplates", "tdTemplates"], never, true, never>;
}
