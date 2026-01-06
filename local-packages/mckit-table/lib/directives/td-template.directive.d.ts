import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MCTdTemplateDirective {
    template: TemplateRef<any>;
    mcTdTemplate: import("@angular/core").InputSignal<string>;
    constructor(template: TemplateRef<any>);
    getFieldName(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCTdTemplateDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MCTdTemplateDirective, "[mcTdTemplate]", never, { "mcTdTemplate": { "alias": "mcTdTemplate"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}
