import * as i0 from "@angular/core";
export declare class MCActionsColumn {
    item: import("@angular/core").InputSignal<any>;
    hasEdit: import("@angular/core").InputSignal<boolean>;
    hasRemove: import("@angular/core").InputSignal<boolean>;
    onEdit: import("@angular/core").OutputEmitterRef<any>;
    onRemove: import("@angular/core").OutputEmitterRef<any>;
    onClickEdit(): void;
    onClickRemove(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCActionsColumn, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MCActionsColumn, "mc-actions-column", never, { "item": { "alias": "item"; "required": true; "isSignal": true; }; "hasEdit": { "alias": "hasEdit"; "required": false; "isSignal": true; }; "hasRemove": { "alias": "hasRemove"; "required": false; "isSignal": true; }; }, { "onEdit": "onEdit"; "onRemove": "onRemove"; }, never, ["*"], true, never>;
}
