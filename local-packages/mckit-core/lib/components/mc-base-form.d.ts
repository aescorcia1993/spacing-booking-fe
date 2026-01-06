import { FormGroup } from "@angular/forms";
import { OperatorFunction } from "rxjs";
import { MCMessage } from "../entities/mc-message";
export declare abstract class MCBaseForm {
    formGroup: FormGroup | undefined;
    isSending: boolean;
    messages: MCMessage[];
    abstract initForm(): void;
    abstract submit(): void;
    sending(): void;
    stopSending(): void;
    cleanForm(): void;
    addHttpErrorMessages(data: any): void;
    addErrorMessage(message: string): void;
    cleanMessages(): void;
    catchFormError(): OperatorFunction<any, any>;
}
