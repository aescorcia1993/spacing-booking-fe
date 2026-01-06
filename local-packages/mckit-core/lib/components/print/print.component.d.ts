import { OnInit, ViewContainerRef } from '@angular/core';
import { MCComponent } from '../../entities/mc-component';
import * as i0 from "@angular/core";
export declare class PrintComponent implements OnInit {
    protected viewContainerRef: ViewContainerRef;
    component: MCComponent;
    constructor(viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PrintComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PrintComponent, "mc-print", never, { "component": { "alias": "component"; "required": false; }; }, {}, never, never, true, never>;
}
