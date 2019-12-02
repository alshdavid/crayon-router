import crayon from 'crayon'
import {
	SvelteComponent,
	create_component,
	destroy_component,
	init,
    noop,
	mount_component,
	not_equal,
	transition_in,
	transition_out
} from "svelte/internal";
import { setContext } from "svelte";

function createFragment(Target: any) {
    return function(ctx: any) {
        let current: any;
        const noel = document.createElement('div')
        const t = new Target({ target: noel });
        return {
            c() {
                create_component(t.$$.fragment);
            },
            m(target$1: any, anchor: any) {
                mount_component(t, target$1, anchor);
                current = true;
            },
            p: noop,
            i(local: any) {
                if (current) return;
                transition_in(t.$$.fragment, local);
                current = true;
            },
            o(local: any) {
                (transition_out as any)(t.$$.fragment, local);
                current = false;
            },
            d(detaching: any) {
                destroy_component(t, detaching);
            }
        };
    }
}    

function instanceFactory(key: any, value: any) {
    return function($$self: any) {
        setContext(key, value);
        return [];
    }
}

const contextFactory = (Target: any, key: any, value: any) => {
    return class extends SvelteComponent {
        constructor(options: any) {
            super();
            init(
                this, 
                options, 
                instanceFactory(key, value), 
                createFragment(Target), 
                not_equal,
                {}
            );
        }
    }
}

export const withContext = (key: any, value: any): crayon.handlerFunc =>
  (req, res) => {
    const _mount = res.mount
    res.mount = Target => _mount(contextFactory(Target, key, value))
  }
