import { BehaviorSubject } from "rxjs";

const makeID = () => Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);

export interface Item {
    id: string
    title: string
    done: boolean
}

export interface Store {
    items: BehaviorSubject<Item[]>
    add: (item: Item) => void
    remove: (id: string) => void
    update: (id:string , item: Item) => void
}

export const createStore = (): Store => {
    let items: Item[] = []

    const items$ = new BehaviorSubject(items)

    const add = (item: Item) => {
        items = [...items, item]
        items$.next(items)
    }

    const remove = (id: string) => {
        items = [...items.filter(x => x.id !== id)]
        items$.next(items)
    }

    const update = (id: string, item: Item) => {
        const i = items.findIndex(item => item.id == id)
        if (!i) {
            return
        }
        items[i] = item
        items = [...items]
        items$.next(items)
    }

    return {
        items: items$,
        add,
        remove,
        update
    }
}

export const create = (title: string): Item => ({ 
    title,
    id: makeID(), 
    done: false 
})