import * as Assert from "assert";


suite("Dummy", () =>
{
    test("this is a dummy test", () =>
    {   
        const foo = "Hello world";
        Assert.strictEqual(foo, "Hello world");
    });
});