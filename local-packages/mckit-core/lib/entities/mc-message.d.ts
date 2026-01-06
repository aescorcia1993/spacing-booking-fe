export declare class MCMessage {
    /**
     * Severity level of the message.
     * @defaultValue 'info'
     * @group Props
     */
    severity: string | 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined | null;
    /**
     * Text content.
     * @group Props
     */
    text: string | undefined;
}
