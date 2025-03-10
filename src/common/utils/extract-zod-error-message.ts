import { ZodError } from "zod";

export function extractZodErrorMessage(error: ZodError): string[] {
    return error.errors.map(err => {
        const path = err.path.join(".");
        return `${path}: ${err.message}`;
    });
}