import { Controller, route, httpGet, view } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";


@route("/*")
@httpGet
@view("~/src/client/dist/index-view.html")
export class IndexController extends Controller
{
    public execute(): Promise<any>
    {
        return Promise.resolve({
            config: {
                apiUrl: ConfigurationManager.getConfig<string>("apiUrl")
            }
        });
    }
}