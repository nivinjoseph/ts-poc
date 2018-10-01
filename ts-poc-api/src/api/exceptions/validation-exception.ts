import { ApplicationException } from "@nivinjoseph/n-exception";


export class ValidationException extends ApplicationException
{
    private readonly _errors: any;


    public get errors(): any { return this._errors; }


    public constructor(errors: any)
    {
        super(`Validation failed; error data: ${errors ? JSON.stringify(errors) : "NONE"}`);

        this._errors = errors;
    }
}