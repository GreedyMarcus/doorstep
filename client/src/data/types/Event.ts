import { ChangeEvent } from 'react'

type FakeEvent = { target: { value: string } } // This is a dumb type to use event-like objects
export type InputChangeEvent = ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | FakeEvent
