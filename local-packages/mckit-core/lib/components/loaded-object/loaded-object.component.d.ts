import { OnDestroy, OnInit } from '@angular/core';
import { MCApiRestHttpService } from '../../services/api-rest-http.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
export declare class MCLoadedObject implements OnInit, OnDestroy {
    key: import("@angular/core").InputSignal<string>;
    onLoaded: import("@angular/core").OutputEmitterRef<any>;
    onNoData: import("@angular/core").OutputEmitterRef<void>;
    httpService: import("@angular/core").InputSignal<MCApiRestHttpService<any>>;
    route: ActivatedRoute;
    subscription?: Subscription;
    isLoading: import("@angular/core").WritableSignal<boolean>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    processRoute(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCLoadedObject, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MCLoadedObject, "mc-loaded-object", never, { "key": { "alias": "key"; "required": false; "isSignal": true; }; "httpService": { "alias": "httpService"; "required": true; "isSignal": true; }; }, { "onLoaded": "onLoaded"; "onNoData": "onNoData"; }, never, ["*"], true, never>;
}
