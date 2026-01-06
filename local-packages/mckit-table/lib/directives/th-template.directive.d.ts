import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MCThTemplateDirective {
    template: TemplateRef<any>;
    mcThTemplate: import("@angular/core").InputSignal<string>;
    constructor(template: TemplateRef<any>);
    getFieldName(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCThTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MCThTemplateDirective, "[mcThTemplate]", never, { "mcThTemplate": { "alias": "mcThTemplate"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}
