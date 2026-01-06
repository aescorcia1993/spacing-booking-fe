import { OperatorFunction } from "rxjs";
import { MCMessage } from "../entities/mc-message";
export declare abstract class MCBaseModelForm<T extends {
    id?: any;
}> {
    isSending: boolean;
    messages: MCMessage[];
    copyItem?: T;
    item?: T;
    abstract submit(): void;
    sending(): void;
    stopSending(): void;
    cleanForm(): void;
    addHttpErrorMessages(data: any): void;
    addErrorMessage(message: string): void;
    cleanMessages(): void;
    catchFormError(): OperatorFunction<any, any>;
}
