import { ApplicationException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";


export class RpcException extends ApplicationException
{
    private readonly _httpStatusCode: number;
    private readonly _rpcExceptionCode: number;
    private readonly _data: any;


    public get statusCode(): number { return this._httpStatusCode; }
    public get exceptionCode(): number { return this._rpcExceptionCode; }
    public get data(): any { return this._data; }


    public constructor(httpStatusCode: number, data: any)
    {
        given(httpStatusCode, "httpStatus").ensureHasValue().ensureIsNumber();

        const rpcExceptionCode: number = (data && data.exceptionCode) || 0;

        super(`HTTP status code = ${httpStatusCode}; RPC exception code = ${rpcExceptionCode};`);

        this._httpStatusCode = httpStatusCode;
        this._rpcExceptionCode = rpcExceptionCode;
        this._data = data || null;
    }
}