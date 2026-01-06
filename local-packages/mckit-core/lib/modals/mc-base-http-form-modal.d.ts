import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { OnInit } from "@angular/core";
import { MCApiRestHttpService } from "../services/api-rest-http.service";
import { Observable } from "rxjs";
import { MCBaseForm } from "../components/mc-base-form";
import * as i0 from "@angular/core";
export declare abstract class MCBaseHttpFormModal<T extends {
    id?: any;
}> extends MCBaseForm implements OnInit {
    dialogService: DialogService;
    dialogRef: DynamicDialogRef<any>;
    httpService?: MCApiRestHttpService<T>;
    ngOnInit(): void;
    setItem(item: T): void;
    submit(): void;
    onSubmit(obs: Observable<T>): void;
    onClose(): void;
    initData(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCBaseHttpFormModal<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MCBaseHttpFormModal<any>, "mc-base-http-form-modal", never, {}, {}, never, never, true, never>;
}
