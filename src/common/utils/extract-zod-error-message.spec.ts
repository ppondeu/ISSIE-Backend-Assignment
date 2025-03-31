import { ZodError, z } from 'zod';
import { extractZodErrorMessage } from './extract-zod-error-message';

describe('extractZodErrorMessage', () => {
    it('should return formatted error messages for a single error', () => {
        const schema = z.object({
            name: z.string().min(3, "Name must be at least 3 characters long"),
        });

        try {
            schema.parse({ name: 'Jo' });
        } catch (err) {
            const zodError = err as ZodError;
            const result = extractZodErrorMessage(zodError);

            expect(result).toEqual(['name: Name must be at least 3 characters long']);
        }
    });

    it('should return formatted error messages for multiple errors', () => {
        const schema = z.object({
            name: z.string().min(3, "Name must be at least 3 characters long"),
            age: z.number().min(18, "Age must be at least 18"),
        });

        try {
            schema.parse({ name: 'Jo', age: 15 });
        } catch (err) {
            const zodError = err as ZodError;
            const result = extractZodErrorMessage(zodError);

            expect(result).toEqual([
                'name: Name must be at least 3 characters long',
                'age: Age must be at least 18',
            ]);
        }
    });

    it('should handle nested objects correctly', () => {
        const schema = z.object({
            user: z.object({
                name: z.string().min(3, "Name must be at least 3 characters long"),
                age: z.number().min(18, "Age must be at least 18"),
            }),
        });

        try {
            schema.parse({ user: { name: 'Jo', age: 15 } });
        } catch (err) {
            const zodError = err as ZodError;
            const result = extractZodErrorMessage(zodError);

            expect(result).toEqual([
                'user.name: Name must be at least 3 characters long',
                'user.age: Age must be at least 18',
            ]);
        }
    });

    it('should return an empty array if no errors exist', () => {
        const schema = z.object({
            name: z.string().min(3),
        });

        try {
            schema.parse({ name: 'John' });
        } catch (err) {
            const zodError = err as ZodError;
            const result = extractZodErrorMessage(zodError);

            expect(result).toEqual([]);
        }
    });

    it('should handle empty object without any errors gracefully', () => {
        const schema = z.object({
            firstName: z.string().min(3, 'First name is too short'),
            lastName: z.string().min(3, 'Last name is too short'),
        });

        try {
            schema.parse({});
        } catch (err) {
            const zodError = err as ZodError;
            const result = extractZodErrorMessage(zodError);

            expect(result).toEqual([
                'firstName: Required',
                'lastName: Required',
            ]);
        }
    });

});
