import { MCCoreComponent } from '../mc-core-component';
import { MCComponent } from '../../entities/mc-component';
import * as i0 from "@angular/core";
export declare class MenuComponent extends MCCoreComponent {
    onClickItem(item: MCItemMenu): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuComponent, "mc-menu", never, {}, {}, never, never, true, never>;
}
export declare class MCMenu extends MCComponent {
    constructor(items: Array<MCItemMenu>);
}
export declare class MCItemMenu {
    label: string;
    icon?: string;
    link?: string;
    externalLink?: string;
    event?: string;
    children?: Array<MCItemMenu>;
}
