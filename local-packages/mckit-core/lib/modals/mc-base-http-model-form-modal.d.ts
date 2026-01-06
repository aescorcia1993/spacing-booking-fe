import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { OnInit } from "@angular/core";
import { MCApiRestHttpService } from "../services/api-rest-http.service";
import { Observable } from "rxjs";
import { MCBaseModelForm } from "../components/mc-base-model-form";
import * as i0 from "@angular/core";
export declare abstract class MCBaseHttpModelFormModal<T extends {
    id?: any;
}> extends MCBaseModelForm<T> implements OnInit {
    dialogService: DialogService;
    dialogRef: DynamicDialogRef<any>;
    httpService?: MCApiRestHttpService<T>;
    ngOnInit(): void;
    setItem(item: T): void;
    submit(): void;
    onSubmit(obs: Observable<T>): void;
    onClose(): void;
    initData(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MCBaseHttpModelFormModal<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MCBaseHttpModelFormModal<any>, "mc-base-http-model-form-modal", never, {}, {}, never, never, true, never>;
}
