import { OnInit } from '@angular/core';
import { MCColumn } from '@mckit/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { MultiSelectChangeEvent } from 'primeng/multiselect';
import * as i0 from "@angular/core";
export declare class ShowColumnsButton implements OnInit {
    key: import("@angular/core").InputSignal<string | undefined>;
    hasStorage: import("@angular/core").InputSignal<boolean>;
    initialColumns: import("@angular/core").InputSignal<MCColumn[]>;
    onSelected: import("@angular/core").OutputEmitterRef<MCColumn[]>;
    storageService: StorageMap;
    selectedColumns?: Array<MCColumn>;
    ngOnInit(): void;
    setSelectedColumns(columnsSelected: Array<MCColumn>): void;
    columnsChange(event: MultiSelectChangeEvent): void;
    saveStorage(): void;
    loadStorage(): void;
    getKey(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ShowColumnsButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ShowColumnsButton, "mc-show-columns-button", never, { "key": { "alias": "key"; "required": false; "isSignal": true; }; "hasStorage": { "alias": "hasStorage"; "required": false; "isSignal": true; }; "initialColumns": { "alias": "initialColumns"; "required": true; "isSignal": true; }; }, { "onSelected": "onSelected"; }, never, never, true, never>;
}
