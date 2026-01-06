import { OnInit } from '@angular/core';
import { McComponentService } from '../../services/mc-component.service';
import { MCComponent } from '../../entities/mc-component';
import * as i0 from "@angular/core";
export declare class PrintServiceComponent implements OnInit {
    protected componentService: McComponentService;
    id: string;
    isFlexRow: boolean;
    classes: import("@angular/core").InputSignal<string>;
    components: Array<MCComponent>;
    constructor(componentService: McComponentService);
    ngOnInit(): void;
    loadComponents(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PrintServiceComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PrintServiceComponent, "mc-print-service", never, { "id": { "alias": "id"; "required": false; }; "isFlexRow": { "alias": "isFlexRow"; "required": false; }; "classes": { "alias": "classes"; "required": false; "isSignal": true; }; }, {}, never, never, true, never>;
}
