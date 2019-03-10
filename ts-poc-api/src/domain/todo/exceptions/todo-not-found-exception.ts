import { ApplicationException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";


export class TodoNotFoundException extends ApplicationException
{
    public constructor(id: string)
    {
        given(id, "id").ensureHasValue().ensureIsString();
        
        super(`Todo with id '${id}' was not found.`);
    }
}
