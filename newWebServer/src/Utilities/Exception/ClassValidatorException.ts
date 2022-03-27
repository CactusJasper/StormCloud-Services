import { ValidationError } from '@nestjs/common';
export class ClassValidatorException {
    public formattedValidationErrors: Array<string>;

    constructor(validationErrors: Array<ValidationError>) {
        this.formattedValidationErrors = validationErrors.map(e => this.SortArrayOfErrors(e));
    }

    /**
     * Formats a ValidationError into a readable string
     * @param error
     * @constructor
     */
    private static ValidationErrorToString(error: ValidationError): string {
        return `'${error.value}' is not valid for property '${error.property}'`;
    }

    /**
     * Combines all of the class validation errors into one big array and returns
     * @param error
     * @constructor
     */
    private SortArrayOfErrors(error: ValidationError): string {
        const allErrors: Array<ValidationError> = this.FlattenValidationErrors(error, []);
        return allErrors.map(e => ClassValidatorException.ValidationErrorToString(e)).join(', ');
    }

    /**
     * Takes an error and adds it to the allErrors, it will then add all of its child errors to the array and merge it with
     * allErrors
     * @param error
     * @param allErrors
     * @constructor
     */
    private FlattenValidationErrors(error: ValidationError, allErrors: Array<ValidationError>): Array<ValidationError> {
        allErrors.push(error); // Add this error to all errors
        if (error.children) {
            // If the error has children, run this method on it and combine all child errors into one array
            const childsErrors: Array<ValidationError> = error.children.reduce(
                (acc, curr) => acc.concat(this.FlattenValidationErrors(curr, allErrors)),
                [],
            );
            allErrors.concat(childsErrors); // Add all of the errors on the children to the main errors array
        }
        return allErrors;
    }
}
