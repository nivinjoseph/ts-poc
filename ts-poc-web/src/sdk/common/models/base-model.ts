import { given } from "@nivinjoseph/n-defensive";


export abstract class BaseModel
{
    private _dto: object;
    private readonly _dtoStructure: object | undefined;


    protected get dto(): any { return this._dto; }
    protected set dto(value: any)
    {
        given(value, "value").ensureHasValue().ensureIsObject();
        if (this._dtoStructure)
            given(value, "value").ensureHasStructure(this._dtoStructure);
        this._dto = value;
    }


    protected constructor(dto: object, dtoStructure?: object)
    {
        given(dto, "dto").ensureHasValue().ensureIsObject();
        given(dtoStructure, "dtoStructure").ensureIsObject();
        if (dtoStructure)
            given(dto, "dto").ensureHasStructure(dtoStructure);
        
        this._dto = dto;
        this._dtoStructure = dtoStructure;
    }
}