import { HttpStatus } from '@nestjs/common';

export class Exception {
    public code: HttpStatus;
    public timestamp: string;
    public message: string;

    constructor(code: HttpStatus, message: string) {
        this.code = code;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
}
