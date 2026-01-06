import { MCComponent } from '../entities/mc-component';
import * as i0 from "@angular/core";
export declare class McComponentService {
    private inMemory;
    constructor();
    getComponents(id: string): any;
    addComponent(id: string, component: MCComponent): void;
    setComponents(id: string, components: Array<MCComponent>): void;
    deleteComponents(id: string): void;
    clear(): void;
    getIds(): string[];
    static ɵfac: i0.ɵɵFactoryDeclaration<McComponentService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<McComponentService>;
}
