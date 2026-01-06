import * as i0 from '@angular/core';
import { Injectable, inject, Input, Component, input, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import * as i2 from '@angular/router';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { catchError, take, takeWhile, map, tap, switchMap } from 'rxjs';
import * as i1$1 from 'primeng/avatar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import * as i1$2 from 'primeng/progressspinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

class MCComponent {
    id;
    component;
    config;
    constructor(comp) {
        this.component = comp;
    }
}

class MCListResponse {
    current_page;
    data;
    total;
    from;
    last_page;
    to;
    per_page;
}

class MCColumn {
    field = '';
    title = '';
    isShow;
    isSortable;
    isSortDefault;
    isSortDescDefault;
}

class MCMessage {
    /**
     * Severity level of the message.
     * @defaultValue 'info'
     * @group Props
     */
    severity;
    /**
     * Text content.
     * @group Props
     */
    text;
}

class McComponentService {
    inMemory = {};
    constructor() { }
    getComponents(id) {
        return this.inMemory[id];
    }
    addComponent(id, component) {
        // verify if exist id
        if (!this.inMemory[id]) {
            this.inMemory[id] = [];
        }
        this.inMemory[id].push(component);
    }
    setComponents(id, components) {
        this.inMemory[id] = components;
    }
    deleteComponents(id) {
        delete this.inMemory[id];
    }
    clear() {
        this.inMemory = {};
    }
    getIds() {
        return Object.keys(this.inMemory);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: McComponentService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: McComponentService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: McComponentService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class MCApiRestHttpService {
    http = inject(HttpClient);
    /**
     * Assign path model to use in the service
     */
    pathModel = '';
    /**
     * Assign base url to use in the service
     */
    baseUrl = '';
    create(item) {
        return this.http.post(`${this.baseUrl}${this.pathModel}`, item);
    }
    update(item) {
        return this.http.put(`${this.baseUrl}${this.pathModel}/${item.id}`, item);
    }
    list(queryParams) {
        const queries = queryParams ? `?${queryParams}` : '';
        return this.http.get(`${this.baseUrl}${this.pathModel}${queries}`);
    }
    get(id) {
        return this.http.get(`${this.baseUrl}${this.pathModel}/${id}`);
    }
    delete(id) {
        return this.http.delete(`${this.baseUrl}${this.pathModel}/${id}`);
    }
}

class MCCoreComponent {
    component;
}

class PrintComponent {
    viewContainerRef;
    component;
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    ngOnInit() {
        let view = this.viewContainerRef.createComponent(this.component.component);
        view.instance.component = this.component;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: PrintComponent, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.13", type: PrintComponent, isStandalone: true, selector: "mc-print", inputs: { component: "component" }, ngImport: i0, template: '<div #contentColumn></div>', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: PrintComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mc-print',
                    imports: [],
                    template: '<div #contentColumn></div>'
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }], propDecorators: { component: [{
                type: Input
            }] } });

class PrintListComponent {
    components = [];
    isFlexRow = false;
    classes = input('');
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: PrintListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.13", type: PrintListComponent, isStandalone: true, selector: "mc-print-list", inputs: { components: { classPropertyName: "components", publicName: "components", isSignal: false, isRequired: false, transformFunction: null }, isFlexRow: { classPropertyName: "isFlexRow", publicName: "isFlexRow", isSignal: false, isRequired: false, transformFunction: null }, classes: { classPropertyName: "classes", publicName: "classes", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"{{classes()}}\" [class]=\"{'mc-print-list': true, 'mc-print-list-row': isFlexRow }\">\r\n  @for (comp of components; track $index) {\r\n    <div class=\"mc-print-component\">\r\n      <mc-print [component]=\"comp\"></mc-print>\r\n    </div>\r\n  }\r\n\r\n</div>\r\n", styles: [".mc-print-list-row{display:flex;flex-direction:row}\n"], dependencies: [{ kind: "component", type: PrintComponent, selector: "mc-print", inputs: ["component"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: PrintListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mc-print-list', imports: [PrintComponent], template: "<div class=\"{{classes()}}\" [class]=\"{'mc-print-list': true, 'mc-print-list-row': isFlexRow }\">\r\n  @for (comp of components; track $index) {\r\n    <div class=\"mc-print-component\">\r\n      <mc-print [component]=\"comp\"></mc-print>\r\n    </div>\r\n  }\r\n\r\n</div>\r\n", styles: [".mc-print-list-row{display:flex;flex-direction:row}\n"] }]
        }], propDecorators: { components: [{
                type: Input
            }], isFlexRow: [{
                type: Input
            }] } });

class PrintServiceComponent {
    componentService;
    id = '';
    isFlexRow = false;
    classes = input('');
    components = [];
    constructor(componentService) {
        this.componentService = componentService;
    }
    ngOnInit() {
        this.loadComponents();
    }
    loadComponents() {
        this.components = this.componentService.getComponents(this.id);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: PrintServiceComponent, deps: [{ token: McComponentService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "19.2.13", type: PrintServiceComponent, isStandalone: true, selector: "mc-print-service", inputs: { id: { classPropertyName: "id", publicName: "id", isSignal: false, isRequired: false, transformFunction: null }, isFlexRow: { classPropertyName: "isFlexRow", publicName: "isFlexRow", isSignal: false, isRequired: false, transformFunction: null }, classes: { classPropertyName: "classes", publicName: "classes", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<mc-print-list [components]=\"components\" [isFlexRow]=\"isFlexRow\" [classes]=\"classes()\"></mc-print-list>\r\n", styles: [""], dependencies: [{ kind: "component", type: PrintListComponent, selector: "mc-print-list", inputs: ["components", "isFlexRow", "classes"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: PrintServiceComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mc-print-service', imports: [PrintListComponent], template: "<mc-print-list [components]=\"components\" [isFlexRow]=\"isFlexRow\" [classes]=\"classes()\"></mc-print-list>\r\n" }]
        }], ctorParameters: () => [{ type: McComponentService }], propDecorators: { id: [{
                type: Input
            }], isFlexRow: [{
                type: Input
            }] } });

class SubtitleComponent extends MCCoreComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: SubtitleComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.13", type: SubtitleComponent, isStandalone: true, selector: "mc-subtitle", usesInheritance: true, ngImport: i0, template: "<h2>{{component.config.text}}</h2>\r\n", styles: ["h2{font-size:small;padding:1rem 2rem;margin:0;text-transform:uppercase}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: SubtitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mc-subtitle', imports: [], template: "<h2>{{component.config.text}}</h2>\r\n", styles: ["h2{font-size:small;padding:1rem 2rem;margin:0;text-transform:uppercase}\n"] }]
        }] });
class MCSubtitle extends MCComponent {
    constructor(text) {
        super(SubtitleComponent);
        this.config = {
            text: text
        };
    }
}

class ImageComponent extends MCCoreComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: ImageComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.13", type: ImageComponent, isStandalone: true, selector: "mc-image", usesInheritance: true, ngImport: i0, template: "<div class=\"mc-image-container\">\r\n  <img [src]=\"component.config.url\" [style]=\"{ 'width': component.config.width != undefined ? (component.config.width + 'px') : '100%' }\" />\r\n</div>\r\n", styles: [".mc-image-container{display:flex;justify-content:center;padding:1rem 0}.mc-image-container img{object-fit:contain}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: ImageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mc-image', imports: [], template: "<div class=\"mc-image-container\">\r\n  <img [src]=\"component.config.url\" [style]=\"{ 'width': component.config.width != undefined ? (component.config.width + 'px') : '100%' }\" />\r\n</div>\r\n", styles: [".mc-image-container{display:flex;justify-content:center;padding:1rem 0}.mc-image-container img{object-fit:contain}\n"] }]
        }] });
class MCImage extends MCComponent {
    constructor(url, width) {
        super(ImageComponent);
        this.config = {
            url: url,
            width: width
        };
    }
}

// TODO: Complete the implementation
class MenuComponent extends MCCoreComponent {
    onClickItem(item) {
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MenuComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.13", type: MenuComponent, isStandalone: true, selector: "mc-menu", usesInheritance: true, ngImport: i0, template: "<ul class=\"mc-menu-container\">\r\n  <ng-container *ngFor=\"let item of component.config.items; let i = index;\">\r\n      <li>\r\n        <ng-container [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{item}\"></ng-container>\r\n      </li>\r\n      <!--<li app-menuitem *ngIf=\"!item.separator\" [item]=\"item\" [index]=\"i\" [root]=\"true\"></li>-->\r\n      <li *ngIf=\"item.separator\" class=\"menu-separator\"></li>\r\n  </ng-container>\r\n</ul>\r\n\r\n<ng-template #itemTemplate let-item=\"item\">\r\n  <a *ngIf=\"item.externalLink != undefined\" [attr.href]=\"item.externalLink\" (click)=\"onClickItem(item)\" pRipple class=\"block p-3 dark:text-white text-gray-950 hover:bg-gray-100 dark:hover:bg-white/5 w-full items-center text-md\">\r\n    <i [ngClass]=\"item.icon\" class=\"pr-3 layout-menuitem-icon\"></i>\r\n    <span class=\"layout-menuitem-text\">{{item.label}}</span>\r\n    <i class=\"pi pi-fw pi-angle-down layout-submenu-toggler\" *ngIf=\"item.children\"></i>\r\n  </a>\r\n\r\n  <a *ngIf=\"item.link\" (click)=\"onClickItem(item)\" [routerLink]=\"item.link\" routerLinkActive=\"active-route\" pRipple  class=\"block p-3 dark:text-white text-gray-950 hover:bg-gray-100 dark:hover:bg-white/5 w-full items-center text-md\">\r\n    <i [ngClass]=\"item.icon\" class=\"pr-3 layout-menuitem-icon\"></i>\r\n    <span class=\"layout-menuitem-text\">{{item.label}}</span>\r\n    <i class=\"pi pi-fw pi-angle-down layout-submenu-toggler\" *ngIf=\"item.children\"></i>\r\n  </a>\r\n\r\n</ng-template>\r\n", styles: [".mc-menu-container{padding:0;margin:0;list-style-type:none;width:100%}.mc-menu-container .active-route{font-weight:700}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "ngmodule", type: RouterModule }, { kind: "directive", type: i2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "ngmodule", type: RippleModule }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mc-menu', imports: [CommonModule, RouterModule, RippleModule], template: "<ul class=\"mc-menu-container\">\r\n  <ng-container *ngFor=\"let item of component.config.items; let i = index;\">\r\n      <li>\r\n        <ng-container [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{item}\"></ng-container>\r\n      </li>\r\n      <!--<li app-menuitem *ngIf=\"!item.separator\" [item]=\"item\" [index]=\"i\" [root]=\"true\"></li>-->\r\n      <li *ngIf=\"item.separator\" class=\"menu-separator\"></li>\r\n  </ng-container>\r\n</ul>\r\n\r\n<ng-template #itemTemplate let-item=\"item\">\r\n  <a *ngIf=\"item.externalLink != undefined\" [attr.href]=\"item.externalLink\" (click)=\"onClickItem(item)\" pRipple class=\"block p-3 dark:text-white text-gray-950 hover:bg-gray-100 dark:hover:bg-white/5 w-full items-center text-md\">\r\n    <i [ngClass]=\"item.icon\" class=\"pr-3 layout-menuitem-icon\"></i>\r\n    <span class=\"layout-menuitem-text\">{{item.label}}</span>\r\n    <i class=\"pi pi-fw pi-angle-down layout-submenu-toggler\" *ngIf=\"item.children\"></i>\r\n  </a>\r\n\r\n  <a *ngIf=\"item.link\" (click)=\"onClickItem(item)\" [routerLink]=\"item.link\" routerLinkActive=\"active-route\" pRipple  class=\"block p-3 dark:text-white text-gray-950 hover:bg-gray-100 dark:hover:bg-white/5 w-full items-center text-md\">\r\n    <i [ngClass]=\"item.icon\" class=\"pr-3 layout-menuitem-icon\"></i>\r\n    <span class=\"layout-menuitem-text\">{{item.label}}</span>\r\n    <i class=\"pi pi-fw pi-angle-down layout-submenu-toggler\" *ngIf=\"item.children\"></i>\r\n  </a>\r\n\r\n</ng-template>\r\n", styles: [".mc-menu-container{padding:0;margin:0;list-style-type:none;width:100%}.mc-menu-container .active-route{font-weight:700}\n"] }]
        }] });
class MCMenu extends MCComponent {
    constructor(items) {
        super(MenuComponent);
        this.config = {
            items: items
        };
    }
}
class MCItemMenu {
    label = '';
    icon;
    link;
    externalLink;
    event;
    children;
}

class MCBaseForm {
    formGroup;
    isSending = false;
    messages = [];
    sending() {
        this.formGroup?.disable();
        this.isSending = true;
    }
    stopSending() {
        this.formGroup?.enable();
        this.isSending = false;
    }
    cleanForm() {
        this.stopSending();
        this.formGroup?.reset();
    }
    addHttpErrorMessages(data) {
        this.addErrorMessage(data.error.message || data.message || 'Unknown error');
    }
    addErrorMessage(message) {
        this.messages = [{ severity: 'error', text: message }];
    }
    cleanMessages() {
        this.messages = [];
    }
    catchFormError() {
        return catchError(error => {
            this.addHttpErrorMessages(error);
            this.stopSending();
            throw error;
        });
    }
}

class MCBaseModelForm {
    isSending = false;
    messages = [];
    copyItem;
    item;
    sending() {
        this.isSending = true;
    }
    stopSending() {
        this.isSending = false;
    }
    cleanForm() {
        this.stopSending();
        if (this.copyItem != undefined) {
            this.item = this.copyItem;
        }
    }
    addHttpErrorMessages(data) {
        this.addErrorMessage(data.error.message || data.message || 'Unknown error');
    }
    addErrorMessage(message) {
        this.messages = [{ severity: 'error', text: message }];
    }
    cleanMessages() {
        this.messages = [];
    }
    catchFormError() {
        return catchError(error => {
            this.addHttpErrorMessages(error);
            this.stopSending();
            throw error;
        });
    }
}

class AvatarComponent extends MCCoreComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: AvatarComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.13", type: AvatarComponent, isStandalone: true, selector: "mc-avatar", usesInheritance: true, ngImport: i0, template: "@if (component.config.image != undefined ) {\r\n\r\n} @else {\r\n  <p-avatar label=\"{{component.config.label}}\" styleClass=\"{{component.config.class}}\" [size]=\"component.config.size\" [shape]=\"component.config.shape\" />\r\n}\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: AvatarModule }, { kind: "component", type: i1$1.Avatar, selector: "p-avatar", inputs: ["label", "icon", "image", "size", "shape", "style", "styleClass", "ariaLabel", "ariaLabelledBy"], outputs: ["onImageError"] }, { kind: "ngmodule", type: AvatarGroupModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: AvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mc-avatar', imports: [CommonModule, AvatarModule, AvatarGroupModule], template: "@if (component.config.image != undefined ) {\r\n\r\n} @else {\r\n  <p-avatar label=\"{{component.config.label}}\" styleClass=\"{{component.config.class}}\" [size]=\"component.config.size\" [shape]=\"component.config.shape\" />\r\n}\r\n" }]
        }] });
class MCAvatar extends MCComponent {
    constructor(config) {
        super(AvatarComponent);
        this.config = {
            label: config.label,
            image: config.image,
            size: config.size ?? 'large',
            shape: config.shape ?? 'square',
            class: config.class ?? '',
        };
    }
}

class MCLoadedObject {
    key = input('id');
    onLoaded = output();
    onNoData = output();
    httpService = input.required();
    route = inject(ActivatedRoute);
    subscription;
    isLoading = signal(false);
    ngOnInit() {
        this.processRoute();
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    processRoute() {
        this.subscription = this.route.params
            .pipe(take(1), takeWhile((params) => {
            if (params[this.key()] == undefined) {
                this.onNoData.emit();
            }
            return params[this.key()] != undefined;
        }), map(params => params[this.key()]), tap(() => this.isLoading.set(true)), switchMap(objId => this.httpService().get(objId).pipe(take(1))))
            .subscribe(objRes => {
            this.onLoaded.emit(objRes);
            this.isLoading.set(false);
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCLoadedObject, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.13", type: MCLoadedObject, isStandalone: true, selector: "mc-loaded-object", inputs: { key: { classPropertyName: "key", publicName: "key", isSignal: true, isRequired: false, transformFunction: null }, httpService: { classPropertyName: "httpService", publicName: "httpService", isSignal: true, isRequired: true, transformFunction: null } }, outputs: { onLoaded: "onLoaded", onNoData: "onNoData" }, ngImport: i0, template: "@if (isLoading()) {\r\n  <div class=\"card flex justify-center\">\r\n    <p-progress-spinner ariaLabel=\"loading\"/>\r\n  </div>\r\n} @else {\r\n  <ng-content></ng-content>\r\n}\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: ProgressSpinnerModule }, { kind: "component", type: i1$2.ProgressSpinner, selector: "p-progressSpinner, p-progress-spinner, p-progressspinner", inputs: ["styleClass", "style", "strokeWidth", "fill", "animationDuration", "ariaLabel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCLoadedObject, decorators: [{
            type: Component,
            args: [{ selector: 'mc-loaded-object', imports: [CommonModule, ProgressSpinnerModule], template: "@if (isLoading()) {\r\n  <div class=\"card flex justify-center\">\r\n    <p-progress-spinner ariaLabel=\"loading\"/>\r\n  </div>\r\n} @else {\r\n  <ng-content></ng-content>\r\n}\r\n" }]
        }] });

class MCBaseFormModal {
    visible = false;
    formGroup;
    isSending = false;
    sending() {
        this.formGroup?.disable();
        this.isSending = true;
    }
    stopSending() {
        this.formGroup?.enable();
        this.isSending = false;
    }
    close() {
        this.visible = false;
    }
    cleanForm() {
        this.stopSending();
        this.formGroup?.reset();
    }
}

class MCBaseHttpModelFormModal extends MCBaseModelForm {
    dialogService = inject(DialogService);
    dialogRef = inject(DynamicDialogRef);
    httpService;
    ngOnInit() {
        this.initData();
    }
    setItem(item) {
        this.item = item;
    }
    submit() {
        if (this.item == undefined) {
            return;
        }
        this.cleanMessages();
        this.sending();
        if (this.item.id) {
            this.onSubmit(this.httpService.update(this.item));
        }
        else {
            this.onSubmit(this.httpService.create(this.item));
        }
    }
    onSubmit(obs) {
        obs.pipe(this.catchFormError(), tap((result) => {
            this.cleanForm();
            this.dialogRef.close(result);
        }))
            .subscribe();
    }
    onClose() {
        this.dialogRef.close();
    }
    initData() {
        let instance = this.dialogService.getInstance(this.dialogRef);
        if (instance.data != undefined) {
            this.setItem(instance.data);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCBaseHttpModelFormModal, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.13", type: MCBaseHttpModelFormModal, isStandalone: true, selector: "mc-base-http-model-form-modal", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCBaseHttpModelFormModal, decorators: [{
            type: Component,
            args: [{
                    selector: 'mc-base-http-model-form-modal',
                    standalone: true,
                    template: '',
                }]
        }] });

class MCBaseHttpFormModal extends MCBaseForm {
    dialogService = inject(DialogService);
    dialogRef = inject(DynamicDialogRef);
    httpService;
    ngOnInit() {
        this.initForm();
        this.initData();
    }
    setItem(item) {
        this.formGroup?.patchValue(item);
    }
    submit() {
        if (this.formGroup.invalid) {
            return;
        }
        this.cleanMessages();
        this.sending();
        const item = this.formGroup.value;
        if (item.id) {
            this.onSubmit(this.httpService.update(item));
        }
        else {
            this.onSubmit(this.httpService.create(item));
        }
    }
    onSubmit(obs) {
        obs.pipe(this.catchFormError(), tap((result) => {
            this.cleanForm();
            this.dialogRef.close(result);
        }))
            .subscribe();
    }
    onClose() {
        this.cleanForm();
        this.dialogRef.close();
    }
    initData() {
        let instance = this.dialogService.getInstance(this.dialogRef);
        if (instance.data != undefined) {
            this.setItem(instance.data);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCBaseHttpFormModal, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.13", type: MCBaseHttpFormModal, isStandalone: true, selector: "mc-base-http-form-modal", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.13", ngImport: i0, type: MCBaseHttpFormModal, decorators: [{
            type: Component,
            args: [{
                    selector: 'mc-base-http-form-modal',
                    standalone: true,
                    template: '',
                }]
        }] });

/*
 * Public API Surface of core
 */
/**
 * Entities
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AvatarComponent, ImageComponent, MCApiRestHttpService, MCAvatar, MCBaseForm, MCBaseFormModal, MCBaseHttpFormModal, MCBaseHttpModelFormModal, MCBaseModelForm, MCColumn, MCComponent, MCCoreComponent, MCImage, MCItemMenu, MCListResponse, MCLoadedObject, MCMenu, MCMessage, MCSubtitle, McComponentService, MenuComponent, PrintComponent, PrintListComponent, PrintServiceComponent, SubtitleComponent };
//# sourceMappingURL=mckit-core.mjs.map
