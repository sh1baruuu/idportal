

export class FirebaseCustomError extends Error {
    code: string

    constructor(code: string) {
        let message = `Firebase: Error (${code})`
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        // Ensure stack trace is properly captured for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}
