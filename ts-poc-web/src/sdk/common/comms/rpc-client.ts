import * as Axios from "axios";
import { given } from "@nivinjoseph/n-defensive";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { RpcException } from "./rpc-exception";


export class RpcClient
{
    private readonly _baseUrl: string;
    private readonly _headers: { [index: string]: string };
    private readonly _api: Axios.AxiosInstance;
    

    public constructor(baseUrl?: string)
    {
        given(baseUrl, "baseUrl").ensureIsString();
        baseUrl = baseUrl || ConfigurationManager.getConfig<string>("apiUrl");
        baseUrl = baseUrl.trim();
        if (baseUrl.endsWith("/"))
            baseUrl = baseUrl.substr(0, baseUrl.length - 1);
        this._baseUrl = baseUrl;
        
        this._headers = {};
        
        this._api = Axios.default.create({});
    }


    public setHeader(key: string, value: any): void
    {
        given(key, "key").ensureHasValue().ensureIsString();
        given(value, "value").ensureHasValue();

        this._headers[key] = value;
    }
    
    public clearHeader(key: string): void
    {
        given(key, "key").ensureHasValue().ensureIsString();
        
        delete this._headers[key];
    }

    public async query<T>(url: string): Promise<T>
    {
        given(url, "url").ensureHasValue().ensureIsString()
            .ensure(t => t.trim().startsWith("/"), "must start with '/'");

        url = url.trim();

        let response: Axios.AxiosResponse<T> = null as any;
        try 
        {
            response = await this._api.get(url, {
                baseURL: this._baseUrl,
                headers: this._headers
            });
        }
        catch (error)
        {
            console.warn("RPC ERROR", error.response.status, error.response.data);
            throw new RpcException(error.response.status, error.response.data);
        }

        return response.data;
    }

    public async command<T>(url: string, command: object): Promise<T>
    {
        given(url, "url").ensureHasValue().ensureIsString()
            .ensure(t => t.trim().startsWith("/"), "must start with '/'");

        url = url.trim();

        given(command, "command").ensureHasValue().ensureIsObject();

        let response: Axios.AxiosResponse<T> = null as any;
        try 
        {
            response = await this._api.post(url, command, {
                baseURL: this._baseUrl,
                headers: this._headers
            });
        }
        catch (error)
        {
            console.warn("RPC ERROR", error.response.status, error.response.data);
            throw new RpcException(error.response.status, error.response.data);
        }

        return response.data;
    }
}