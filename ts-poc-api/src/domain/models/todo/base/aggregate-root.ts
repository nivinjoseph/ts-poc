import { DomainEvent } from "./domain-event";
import { AggregateState } from "./aggregate-state";
import { given } from "@nivinjoseph/n-defensive";
import { ApplicationException } from "@nivinjoseph/n-exception";


export abstract class AggregateRoot<T extends AggregateState>
{
    private readonly _state: T = {} as any;
    private readonly _retroEvents: ReadonlyArray<DomainEvent<T>>;
    private readonly _currentEvents: Array<DomainEvent<T>>; // track unit of work stuff


    public get id(): string { return this._state.id; }
    public get version(): number { return this._state.version; }
    public get retroEvents(): ReadonlyArray<DomainEvent<T>> { return this._retroEvents.orderBy(t => t.version); }
    public get currentEvents(): ReadonlyArray<DomainEvent<T>> { return this._currentEvents.orderBy(t => t.version); }
    public get events(): ReadonlyArray<DomainEvent<T>> { return [...this._retroEvents, ...this._currentEvents].orderBy(t => t.version); }
    public get updatedAt(): number { return this.events.orderByDesc(t => t.version)[0].occurredAt; }


    protected get state(): T { return this._state; }


    public constructor(events: ReadonlyArray<DomainEvent<AggregateState>>)
    {
        given(events, "events").ensureHasValue().ensureIsArray().ensure(t => t.length > 0);

        this._retroEvents = events;
        this._currentEvents = new Array<DomainEvent<T>>();
        this._retroEvents.orderBy(t => t.version).forEach(t => this.applyEventInternal(t));
    }

    public static deserialize(aggregateType: Function, eventTypes: ReadonlyArray<Function>, data: object | any): AggregateRoot<AggregateState>
    {
        given(aggregateType, "aggregateType").ensureHasValue().ensureIsFunction();
        given(eventTypes, "eventTypes").ensureHasValue().ensureIsArray().ensure(t => t.length > 0);
        given(data, "data").ensureHasValue().ensureIsObject()
            .ensureHasStructure({
                $id: "string",
                $version: "number",
                $updatedAt: "number",
                $state: "object",
                $events: [{
                    $name: "string",
                    $occurredAt: "number",
                    $version: "number"
                }]
            });
        
        const events = data.$events.map((eventData: any) =>
        {
            const name = eventData.$name;
            const event = eventTypes.find(t => (<Object>t).getTypeName() === name);
            if (!event)
                throw new ApplicationException(`No event type supplied for event with name '${name}'`);
            if (!(<any>event).deserializeEvent)
                throw new ApplicationException(`Event type '${name}' does not have a static deserializeEvent method defined.`);
            return (<any>event).deserializeEvent(eventData);
        });

        return new (<any>aggregateType)(events);
    }


    public serialize(): object
    {
        return {
            $id: this.id,
            $version: this.version,
            $updatedAt: this.updatedAt,
            $state: this.state,
            $events: this.events.map(t => t.serialize())
        };
    }


    protected applyEvent(event: DomainEvent<AggregateState>): void
    {
        event.apply(this._state);

        this._currentEvents.push(event);
    }


    private applyEventInternal(event: DomainEvent<AggregateState>): void
    {
        event.apply(this._state);
    }
}