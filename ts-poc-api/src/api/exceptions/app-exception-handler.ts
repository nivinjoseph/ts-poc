import { inject } from "@nivinjoseph/n-ject";
import { DefaultExceptionHandler, HttpException } from "@nivinjoseph/n-web";
import { Logger } from "@nivinjoseph/n-log";
import { ValidationException } from "./validation-exception";
import { TodoNotFoundException } from "../../domain/todo/exceptions/todo-not-found-exception";
import { ArgumentException, ArgumentNullException, InvalidArgumentException, InvalidOperationException, ApplicationException } from "@nivinjoseph/n-exception";


@inject("Logger")
export class AppExceptionHandler extends DefaultExceptionHandler
{
    public constructor(logger: Logger)
    {
        super(logger, true);

        this.registerHandler(ArgumentException,
            // @ts-ignore
            (exp: ArgumentException) =>
            {
                throw new HttpException(400);
            });

        this.registerHandler(ArgumentNullException,
            // @ts-ignore
            (exp: ArgumentNullException) =>
            {
                throw new HttpException(400);
            });

        this.registerHandler(InvalidArgumentException,
            // @ts-ignore
            (exp: InvalidArgumentException) =>
            {
                throw new HttpException(400);
            });

        this.registerHandler(InvalidOperationException,
            // @ts-ignore
            (exp: InvalidOperationException) =>
            {
                throw new HttpException(400);
            });

        this.registerHandler(ApplicationException,
            // @ts-ignore
            (exp: ApplicationException) =>
            {
                throw new HttpException(500);
            });
        
        
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