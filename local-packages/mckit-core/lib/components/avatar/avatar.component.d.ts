import { MCCoreComponent } from '../mc-core-component';
import { MCComponent } from '../../entities/mc-component';
import * as i0 from "@angular/core";
export declare class AvatarComponent extends MCCoreComponent {
    static ɵfac: i0.ɵɵFactoryDeclaration<AvatarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AvatarComponent, "mc-avatar", never, {}, {}, never, never, true, never>;
}
export declare class MCAvatar extends MCComponent {
    constructor(config: {
        label?: string;
        image?: string;
        size?: 'large' | 'xlarge';
        shape?: 'circle' | 'square';
        class?: string;
    });
}
