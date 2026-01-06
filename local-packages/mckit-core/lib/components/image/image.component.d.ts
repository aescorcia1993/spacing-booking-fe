import { MCCoreComponent } from '../mc-core-component';
import { MCComponent } from '../../entities/mc-component';
import * as i0 from "@angular/core";
export declare class ImageComponent extends MCCoreComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ImageComponent, "mc-image", never, {}, {}, never, never, true, never>;
}
export declare class MCImage extends MCComponent {
    constructor(url: string, width?: number);
}
