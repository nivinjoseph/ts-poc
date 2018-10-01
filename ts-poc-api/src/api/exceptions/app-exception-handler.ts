import { inject } from "@nivinjoseph/n-ject";
import { DefaultExceptionHandler, HttpException } from "@nivinjoseph/n-web";
import { Logger } from "@nivinjoseph/n-log";
import { ValidationException } from "./validation-exception";
import { TodoNotFoundException } from "../../data/exceptions/todo-not-found-exception";


@inject("Logger")
export class AppExceptionHandler extends DefaultExceptionHandler
{
    public constructor(logger: Logger)
    {
        super(logger, true);

        this.registerHandler(TodoNotFoundException,
            // @ts-ignore
            (exp) =>
            {
                throw new HttpException(404);
            });

        this.registerHandler(ValidationException,
            (exp: ValidationException) =>
            {
                throw new HttpException(400, exp.errors);
            });
    }
}