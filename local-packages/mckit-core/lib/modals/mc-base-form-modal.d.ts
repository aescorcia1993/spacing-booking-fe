import { FormGroup } from "@angular/forms";
export declare abstract class MCBaseFormModal {
    visible: boolean;
    formGroup: FormGroup | undefined;
    isSending: boolean;
    abstract initForm(): void;
    abstract submit(): void;
    sending(): void;
    stopSending(): void;
    close(): void;
    cleanForm(): void;
}
