
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.5' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const projects = writable([]);
    // export const projID: Writable<number> = writable(null)

    function createSeparators(parent, n_children, mode) {
        const anchor_size = "20px";
        if (n_children === 0)
            return [];
        const separators = Array(n_children - 1)
            .fill("")
            .map((_) => {
            const element = createSep(mode, anchor_size);
            const onHighlightCallbacks = new Set();
            let state = "idle";
            function update(loc) {
                if (mode === "horizontal") {
                    element.style.left = `calc(${loc})`;
                }
                else {
                    element.style.top = `calc(${loc})`;
                }
            }
            function setState(new_state) {
                state = new_state;
            }
            function setHighlight(yes = true) {
                onHighlightCallbacks.forEach((c) => c(yes));
                element.children[0].classList.toggle("sr-separator-highlight", yes);
            }
            element.addEventListener("pointerenter", () => {
                if (state === "idle")
                    setHighlight(true);
            });
            element.addEventListener("pointerleave", () => {
                if (state === "idle")
                    setHighlight(false);
            });
            return {
                element,
                position: 0,
                initial_position: 0,
                update,
                setState,
                setHighlight,
                on(event, callback) {
                    if (event === "highlight") {
                        onHighlightCallbacks.add(callback);
                    }
                    else {
                        console.warn(`'${event}' is an unknown event name for a separator. Ignored.`);
                    }
                },
                off(event, callback = null) {
                    if (event === "highlight") {
                        if (callback === null) {
                            onHighlightCallbacks.clear();
                        }
                        else {
                            onHighlightCallbacks.delete(callback);
                        }
                    }
                    else {
                        console.warn(`'${event}' is an unknown event name for a separator. Ignored.`);
                    }
                },
            };
        });
        separators.forEach((e) => parent.append(e.element));
        return separators;
    }
    function createSep(mode, anchor_size) {
        const sep = document.createElement("div");
        sep.classList.add("sr-separator-anchor");
        sep.style.position = "absolute";
        sep.style.display = "flex";
        sep.style.justifyContent = "center";
        sep.style.top = "0px";
        sep.style.left = "0px";
        // sep.style.backgroundColor = "rgb(255, 0, 0, 0.1)";
        if (mode === "horizontal") {
            sep.style.height = "100%";
            sep.style.width = anchor_size;
            sep.style.flexDirection = "row";
            sep.style.transform = `translateX(calc(-${anchor_size} / 2))`;
            sep.style.cursor = "e-resize";
        }
        else if (mode === "vertical") {
            sep.style.width = "100%";
            sep.style.height = anchor_size;
            sep.style.flexDirection = "column";
            sep.style.transform = `translateY(calc(-${anchor_size} / 2))`;
            sep.style.cursor = "n-resize";
        }
        const handle = document.createElement("div");
        handle.classList.add("sr-separator");
        if (mode === "horizontal") {
            handle.style.height = "100%";
        }
        else if (mode === "vertical") {
            handle.style.width = "100%";
        }
        sep.append(handle);
        return sep;
    }

    function sum(array) {
        return array.reduce((a, c) => a + c, 0);
    }
    function updateSectionSizes(sections, new_sizes, container_size) {
        // make sure that the new sizes are larger than min sizes
        new_sizes = new_sizes.map((e, i) => e === null ? null : Math.max(sections[i].min_size, e));
        // make sure that the new sizes are smaller than max sizes
        new_sizes = new_sizes.map((e, i) => e === null ? null : Math.min(sections[i].max_size, e));
        // compute the reference space i.e. the available
        // space to place the sections
        const reference_space = Math.max(Math.min(container_size, sum(sections.map((e) => e.max_size))), sum(sections.map((e) => e.min_size)));
        // at the stage, we know:
        // sum(min_sizes)<=reference_space<=sum(max_sizes)
        // min_size[i] <= new_sizes[i] <= max_size[i]
        // ... except when new_sizes[i] === null (=0)
        // therefore:
        // sum(new_size) <= sum(max_size) but sum(new_size) can be greater than reference_space...
        // get the indices of unknown new sizes
        // and set unknwon new sizes to minimum sizes
        const unknown_indices = [];
        new_sizes = new_sizes.map((e, i) => {
            if (e === null) {
                unknown_indices.push(i);
                return sections[i].min_size;
            }
            else {
                return e;
            }
        });
        if (unknown_indices.length > 0) {
            // if there is unknown new sizes
            let sum_new_sizes = sum(new_sizes);
            if (sum_new_sizes < reference_space) {
                // if the sum of the new sizes below the reference space, we try to grow the unkown sizes as much as possible
                const growth_to_distribute = reference_space - sum_new_sizes;
                const unknown_new_sizes = scaleUpSizes(new_sizes.filter((_, i) => unknown_indices.includes(i)), sections
                    .map((e, i) => e.max_size - new_sizes[i])
                    .filter((_, i) => unknown_indices.includes(i)), growth_to_distribute);
                let k = 0;
                new_sizes = new_sizes.map((e, i) => {
                    if (unknown_indices.includes(i)) {
                        k++;
                        return unknown_new_sizes[k - 1];
                    }
                    return e;
                });
            }
        }
        // If needed, adjuste the new sizes by scaling down or up
        // the new_sizes while enforcing the min and max sizes specified
        const space_to_adjust = sum(new_sizes) - reference_space;
        if (space_to_adjust > 0) {
            new_sizes = scaleDownSizes(new_sizes, new_sizes.map((e, i) => e - sections[i].min_size), space_to_adjust);
        }
        else if (space_to_adjust < 0) {
            new_sizes = scaleUpSizes(new_sizes, new_sizes.map((e, i) => sections[i].max_size - e), -space_to_adjust);
        }
        // update the sections
        return sections.map((e, i) => (Object.assign(Object.assign({}, e), { cur_size: new_sizes[i] })));
    }
    function scaleUpSizes(new_sizes, max_growth, space_to_fill) {
        // let's try and grow everything equally
        let avg_growth = space_to_fill / max_growth.length;
        let n_infinite_max = 0;
        let growth = max_growth.map((e) => {
            if (isFinite(e)) {
                return Math.min(avg_growth, e);
            }
            else {
                n_infinite_max++;
                return avg_growth;
            }
        });
        let remaining_space_to_fill = space_to_fill - sum(growth);
        // in case there are some elements with no finite maximum
        // and there is still some space to fill, distribute the
        // remaining space between these elements
        if (n_infinite_max > 0 && remaining_space_to_fill !== 0) {
            avg_growth = remaining_space_to_fill / n_infinite_max;
            growth = growth.map((e, i) => {
                if (isFinite(max_growth[i]))
                    return e;
                return e + avg_growth;
            });
            remaining_space_to_fill = space_to_fill - sum(growth);
        }
        return new_sizes.map((e, i) => e + growth[i]);
    }
    function scaleDownSizes(new_sizes, max_shrink, space_to_gain) {
        //max_shrink can be used as weight to distribute space_to_gain
        const sum_max_shrink = sum(max_shrink);
        const spaces_to_remove = max_shrink.map((e) => space_to_gain * (e / sum_max_shrink));
        return new_sizes.map((e, i) => e - spaces_to_remove[i]);
    }

    function propagateSectionSizeChange(sections, change, backward) {
        if (sections.length === 0)
            return { remaining: 0, sections };
        // when change > 0, we try to grow the sections
        // when chnage < 0, we try to shrink the sections
        let i = backward ? sections.length - 1 : 0;
        while (change != 0 && (backward ? i >= 0 : i < sections.length)) {
            // const max_growth = Number.POSITIVE_INFINITY; // how much it can grow
            const max_growth = sections[i].max_size - sections[i].ini_size; // how much it can grow
            const max_shrink = sections[i].ini_size - sections[i].min_size; // how much it can shrink
            if (change > 0) {
                // growing scenario
                if (change < max_growth) {
                    // in case the current element i can absorbe all the growth
                    sections[i].cur_size = sections[i].ini_size + change;
                    change = 0;
                }
                else {
                    sections[i].cur_size = sections[i].ini_size + max_growth;
                    change -= max_growth;
                }
            }
            else {
                // skrinking scenario
                if (-change < max_shrink) {
                    // in case the current element can absorve all the shrinking
                    sections[i].cur_size = sections[i].ini_size + change;
                    change = 0;
                }
                else {
                    sections[i].cur_size = sections[i].ini_size - max_shrink;
                    change += max_shrink;
                }
            }
            i += backward ? -1 : 1;
        }
        return { remaining: change, sections };
    }
    function updateSectionSizesOnResize(sections, index, delta) {
        let old_sections = sections.map((e) => (Object.assign(Object.assign({}, e), { cur_size: e.ini_size })));
        let new_sections = old_sections;
        let remaining = delta;
        let k = 0;
        const max_iteration = 3;
        // console.log("-----------------------------------------------");
        // console.log("sections", sections);
        // console.log("old_sections", old_sections);
        while (remaining !== 0 && k < max_iteration) {
            // console.log("remaining", remaining);
            // console.log("delta", delta);
            k++;
            // handle the resizing of the elements placed before the separator
            const result_before = propagateSectionSizeChange(
            // old_sections.slice(0, index + 1).reverse(),
            old_sections.slice(0, index + 1), delta, true);
            // console.log("result_before", result_before);
            // handle the resizing of the elements placed after the separator
            const result_after = propagateSectionSizeChange(old_sections.slice(index + 1), -delta, false);
            // console.log("result_after", result_after);
            // compute the new sections
            new_sections = [...result_before.sections, ...result_after.sections].map((e) => (Object.assign({}, e)));
            // check that the change was propagated completly
            remaining =
                Math.abs(result_before.remaining) >= Math.abs(result_after.remaining)
                    ? result_before.remaining
                    : -result_after.remaining;
            // update delta
            delta -= remaining;
            // reset old_sections in case the loop restart
            old_sections = sections.map((e) => (Object.assign(Object.assign({}, e), { cur_size: e.ini_size })));
        }
        return new_sections;
    }

    // export type sectionsConfig
    const warn = console.warn;
    /**
     * This function makes an HTMLElement a sectionResizer where all its children
     * can be resized by dragging separators. Each child can have
     * two attributes [data-min] and [data-init] which expect pixels values (with no unit)
     * that are used to define its minimum and initial size respectively.
     *
     * @param container  Container where the children to be resized are
     * @param config Main configuration options for the section resizer.
     * @returns A sectionResizer object.
     */
    function sectionResizer(container, config = {
        mode: "horizontal",
        resizeMode: "distributed",
    }) {
        const default_config = {
            mode: "horizontal",
            resizeMode: "distributed",
        };
        config = Object.assign(Object.assign({}, default_config), config);
        const mode = config.mode;
        const resizeMode = config.resizeMode;
        let x_y = "x";
        let w_h = "width";
        if (mode === "vertical") {
            x_y = "y";
            w_h = "height";
        }
        else if (mode !== "horizontal") {
            warn(`mode '${mode}' is unknwon. Defaulting to 'horizontal'`);
        }
        let container_size;
        let initial_container_size;
        let sections;
        let separators;
        let resize_observer;
        let mutation_observer;
        init();
        function init() {
            // store the current container size
            container_size = container.getBoundingClientRect()[w_h];
            initial_container_size = container_size;
            // set needed style attributes to the container
            const current_position_style = window.getComputedStyle(container).getPropertyValue("position");
            if (!["absolute", "relative"].includes(current_position_style)) {
                container.style.position = "relative";
            }
            container.style.overflow = "auto";
            container.style.display = "grid";
            //FIXME: I should get rid of these conditions on padding and margin...
            container.style.padding = "0";
            container.style.margin = "0";
            // create the event listeners attached to the document element
            // that handle the resizing of the children by dragging the separators
            document.addEventListener("pointerdown", handleResizeStart);
            document.addEventListener("pointermove", handleResizeMove);
            document.addEventListener("pointerup", handleResizeEnd);
            // retrieve the children
            const children = Array.from(container.children);
            // create the sections
            sections = children.map(buildDefaultSection);
            // create the separators
            separators = createSeparators(container, children.length, mode);
            // update the sections sizes
            sections = updateSectionSizes(sections, sections.map((e) => e.cur_size), container_size);
            // sections.forEach((s) => (s.ini_size = s.cur_size));
            setInitialSize();
            // update the grid template
            update();
            // create a ResizeObserver which is run whenever the container
            // changes sizes (e.g. if the window is resized)
            resize_observer = new ResizeObserver((entries) => {
                const new_container_size = container.getBoundingClientRect()[w_h];
                if (new_container_size !== container_size) {
                    container_size = new_container_size;
                    if (resizeMode !== "left" && resizeMode !== "right") {
                        sections = updateSectionSizes(sections, sections.map((e) => (e.ini_size / container_size) * new_container_size), new_container_size);
                    }
                    else {
                        const change_delta = container_size - initial_container_size;
                        if (resizeMode === "left") {
                            sections = updateSectionSizesOnResize(sections, -1, -change_delta);
                        }
                        else if (resizeMode === "right") {
                            sections = updateSectionSizesOnResize(sections, sections.length, change_delta);
                        }
                    }
                }
                update();
                window.requestAnimationFrame(() => {
                    update();
                });
            });
            resize_observer.observe(container);
            // create a MutationObserver which is run whenever elements are added to
            // the sectionResizer container or removed from it
            mutation_observer = new MutationObserver(() => {
                // stop listening for changes
                mutation_observer.disconnect();
                // remove the existing separators
                separators.forEach((e) => e.element.remove());
                // retrieve the children
                const children = Array.from(container.children);
                // re-build sections
                const sections_size_sum = sections.reduce((a, c) => a + c.cur_size, 0) / sections.length;
                sections = children.map((e) => {
                    const i = sections.findIndex((s) => s.element === e);
                    if (i === -1) {
                        const default_section = buildDefaultSection(e);
                        if (!isNaN(sections_size_sum))
                            default_section.cur_size = sections_size_sum;
                        return default_section;
                    }
                    else {
                        return Object.assign({}, sections[i]);
                    }
                });
                // create the separators
                separators = createSeparators(container, children.length, mode);
                // update the sections sizes
                sections = updateSectionSizes(sections, sections.map((e) => e.cur_size), container_size);
                // update the grid template
                update();
                // re-observe the container for changes
                mutation_observer.observe(container, { childList: true, subtree: false });
            });
            mutation_observer.observe(container, { childList: true, subtree: false });
        }
        function update() {
            // const container_size = container.getBoundingClientRect()[w_h];
            const gridTemplate = sections
                .map((e) => `${(e.cur_size / container_size) * 100}%`)
                .join(" ");
            if (mode === "vertical") {
                container.style.gridTemplateColumns = "auto";
                container.style.gridTemplateRows = gridTemplate;
            }
            else {
                container.style.gridTemplateRows = "auto";
                container.style.gridTemplateColumns = gridTemplate;
            }
            // updateSeparators();
            const position = sections
                .reduce((a, c) => [...a, a[a.length - 1] + c.cur_size], [0])
                .slice(1);
            separators.forEach((s, i) => s.update(`${(position[i] / container_size) * 100}%`));
        }
        function buildDefaultSection(element) {
            const min_size = "min" in element.dataset
                ? Math.max(parseFloat(element.dataset.min), 50)
                : 50;
            const def_size = "init" in element.dataset
                ? Math.max(min_size, parseFloat(element.dataset.init))
                : null;
            const max_size = "max" in element.dataset
                ? Math.max(min_size, parseFloat(element.dataset.max))
                : Number.POSITIVE_INFINITY;
            return {
                element: element,
                min_size: min_size,
                max_size: max_size,
                def_size: def_size,
                cur_size: def_size,
                ini_size: def_size,
            };
        }
        const styleTag = document.createElement("style");
        styleTag.media = "screen";
        styleTag.textContent = `* {cursor: ${mode === "vertical" ? "n-resize" : "e-resize"} !important}`;
        function setInitialSize() {
            sections = sections.map((e) => (Object.assign(Object.assign({}, e), { 
                // ini_size: e.element.getBoundingClientRect()[w_h],
                ini_size: e.cur_size })));
            separators = separators.map((e, i) => {
                e.initial_position = e.element.getBoundingClientRect()[x_y];
                return e;
            });
            initial_container_size = container_size;
        }
        let index;
        function handleResizeStart(event) {
            setInitialSize();
            index = separators.findIndex((s) => s.element === event.target || s.element.children[0] === event.target);
            separators.forEach((s) => s.setState("silent"));
            if (index >= 0) {
                event.preventDefault();
                separators[index].setState("resizing");
                separators[index].setHighlight(true);
                document.head.appendChild(styleTag);
            }
        }
        function handleResizeMove(event) {
            if (index >= 0) {
                const mouse_position = event[x_y];
                const change_delta = mouse_position - (separators[index].initial_position + 10);
                sections = updateSectionSizesOnResize(sections, index, change_delta);
                update();
            }
        }
        function handleResizeEnd() {
            if (index >= 0) {
                setInitialSize();
                separators[index].setHighlight(false);
                index = -1;
                styleTag.remove();
            }
            separators.forEach((s) => s.setState("idle"));
        }
        function requestAnimationFramePromise() {
            return new Promise((resolve) => {
                requestAnimationFrame(() => {
                    resolve();
                });
            });
        }
        /**
         * Configure min and/or max sizes of all sections, or specific sections
         *
         * @param {object[]} config - configuration object
         * @returns A promise that resolve at the next animation frame.
         */
        function configure(config) {
            if (!Array.isArray(config)) {
                config = sections.map((_, index) => (Object.assign({ index }, config)));
            }
            config.forEach((e) => {
                if (e.index !== undefined && e.index >= 0 && e.index < sections.length) {
                    if (e.min)
                        sections[e.index].min_size = Math.max(50, e.min); // I enforce 50px as a minimum size to prevent weird behavior with scrollbars and overlapping separators
                    if (e.max)
                        sections[e.index].max_size = Math.max(0, e.max);
                }
            });
            sections = updateSectionSizes(sections, sections.map((e) => e.cur_size), container_size);
            update();
            setInitialSize();
            return requestAnimationFramePromise();
        }
        function resize(config) {
            // requestAnimationFrame(() => {
            const new_sizes = sections.map((e) => null);
            config.forEach((e) => {
                if (e.index !== undefined &&
                    e.index >= 0 &&
                    e.index < sections.length &&
                    e.size !== undefined) {
                    new_sizes[e.index] = e.size;
                }
            });
            console.log("new_sizes", new_sizes);
            sections = updateSectionSizes(sections, new_sizes, container_size);
            update();
            setInitialSize();
            // });
            return requestAnimationFramePromise();
        }
        function getSections() {
            return sections;
        }
        return {
            configure,
            resize,
            getSections,
        };
    }

    /* src\front\src\Components\Tasks.svelte generated by Svelte v3.46.5 */

    const file$5 = "src\\front\\src\\Components\\Tasks.svelte";

    function create_fragment$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Tasks";
    			attr_dev(div, "class", "container");
    			add_location(div, file$5, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tasks', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tasks> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tasks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tasks",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\front\src\Components\Tags.svelte generated by Svelte v3.46.5 */

    const file$4 = "src\\front\\src\\Components\\Tags.svelte";

    function create_fragment$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Tags";
    			attr_dev(div, "class", "container");
    			add_location(div, file$4, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tags', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tags> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tags extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tags",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\src\Components\Timer.svelte generated by Svelte v3.46.5 */

    const file$3 = "src\\front\\src\\Components\\Timer.svelte";

    function create_fragment$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Timer";
    			attr_dev(div, "class", "container");
    			add_location(div, file$3, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Timer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Timer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Timer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timer",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\front\src\Components\Project.svelte generated by Svelte v3.46.5 */
    const file$2 = "src\\front\\src\\Components\\Project.svelte";

    // (47:6) {#if taskPanel}
    function create_if_block_2(ctx) {
    	let tasks;
    	let current;
    	tasks = new Tasks({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tasks.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tasks, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tasks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tasks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tasks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(47:6) {#if taskPanel}",
    		ctx
    	});

    	return block;
    }

    // (50:6) {#if tagPanel}
    function create_if_block_1$1(ctx) {
    	let tags;
    	let current;
    	tags = new Tags({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(tags.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tags, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tags.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tags.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tags, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(50:6) {#if tagPanel}",
    		ctx
    	});

    	return block;
    }

    // (53:6) {#if timerPanel}
    function create_if_block$1(ctx) {
    	let timer;
    	let current;
    	timer = new Timer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(timer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(timer, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(timer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(53:6) {#if timerPanel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t0_value = /*project*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*project*/ ctx[0].description + "";
    	let t2;
    	let t3;
    	let div5;
    	let div3;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let button2;
    	let t9;
    	let div4;
    	let t10;
    	let t11;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*taskPanel*/ ctx[1] && create_if_block_2(ctx);
    	let if_block1 = /*tagPanel*/ ctx[2] && create_if_block_1$1(ctx);
    	let if_block2 = /*timerPanel*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div5 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "task";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "tag";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "timer";
    			t9 = space();
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t10 = space();
    			if (if_block1) if_block1.c();
    			t11 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "name svelte-oq904v");
    			add_location(div0, file$2, 26, 4, 883);
    			attr_dev(div1, "class", "desc");
    			add_location(div1, file$2, 29, 4, 941);
    			attr_dev(div2, "class", "info svelte-oq904v");
    			add_location(div2, file$2, 25, 2, 859);
    			attr_dev(button0, "class", "svelte-oq904v");
    			toggle_class(button0, "selected", /*taskPanel*/ ctx[1]);
    			add_location(button0, file$2, 33, 6, 1056);
    			attr_dev(button1, "class", "svelte-oq904v");
    			toggle_class(button1, "selected", /*tagPanel*/ ctx[2]);
    			add_location(button1, file$2, 37, 6, 1180);
    			attr_dev(button2, "class", "svelte-oq904v");
    			toggle_class(button2, "selected", /*timerPanel*/ ctx[3]);
    			add_location(button2, file$2, 40, 6, 1292);
    			attr_dev(div3, "class", "sidebar svelte-oq904v");
    			add_location(div3, file$2, 32, 4, 1027);
    			attr_dev(div4, "class", "main");
    			add_location(div4, file$2, 45, 4, 1430);
    			attr_dev(div5, "class", "content svelte-oq904v");
    			add_location(div5, file$2, 31, 2, 1000);
    			attr_dev(div6, "class", "project svelte-oq904v");
    			add_location(div6, file$2, 24, 0, 807);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t5);
    			append_dev(div3, button1);
    			append_dev(div3, t7);
    			append_dev(div3, button2);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t10);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t11);
    			if (if_block2) if_block2.m(div4, null);
    			/*div4_binding*/ ctx[9](div4);
    			/*div6_binding*/ ctx[10](div6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*project*/ 1) && t0_value !== (t0_value = /*project*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*project*/ 1) && t2_value !== (t2_value = /*project*/ ctx[0].description + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*taskPanel*/ 2) {
    				toggle_class(button0, "selected", /*taskPanel*/ ctx[1]);
    			}

    			if (dirty & /*tagPanel*/ 4) {
    				toggle_class(button1, "selected", /*tagPanel*/ ctx[2]);
    			}

    			if (dirty & /*timerPanel*/ 8) {
    				toggle_class(button2, "selected", /*timerPanel*/ ctx[3]);
    			}

    			if (/*taskPanel*/ ctx[1]) {
    				if (if_block0) {
    					if (dirty & /*taskPanel*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div4, t10);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*tagPanel*/ ctx[2]) {
    				if (if_block1) {
    					if (dirty & /*tagPanel*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, t11);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*timerPanel*/ ctx[3]) {
    				if (if_block2) {
    					if (dirty & /*timerPanel*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div4, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			/*div4_binding*/ ctx[9](null);
    			/*div6_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);
    	let { project } = $$props;

    	onMount(() => {
    		projectElementResizer = sectionResizer(projectElement, { mode: "vertical" });
    		projectElementResizer.configure([{ index: 0, min: 25, max: 300 }]);
    		projectElementResizer.resize([{ index: 1, size: 10000 }]);
    		mainElementResizer = sectionResizer(mainElement, { mode: "horizontal" });
    		mainElementResizer.configure({ min: 200 });
    	});

    	let taskPanel = true;
    	let tagPanel = true;
    	let timerPanel = true;
    	let projectElement, projectElementResizer;
    	let mainElement, mainElementResizer;
    	const writable_props = ['project'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, taskPanel = !taskPanel);
    	const click_handler_1 = () => $$invalidate(2, tagPanel = !tagPanel);
    	const click_handler_2 = () => $$invalidate(3, timerPanel = !timerPanel);

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			mainElement = $$value;
    			$$invalidate(5, mainElement);
    		});
    	}

    	function div6_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			projectElement = $$value;
    			$$invalidate(4, projectElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	$$self.$capture_state = () => ({
    		sectionResizer,
    		Tasks,
    		Tags,
    		Timer,
    		onMount,
    		project,
    		taskPanel,
    		tagPanel,
    		timerPanel,
    		projectElement,
    		projectElementResizer,
    		mainElement,
    		mainElementResizer
    	});

    	$$self.$inject_state = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    		if ('taskPanel' in $$props) $$invalidate(1, taskPanel = $$props.taskPanel);
    		if ('tagPanel' in $$props) $$invalidate(2, tagPanel = $$props.tagPanel);
    		if ('timerPanel' in $$props) $$invalidate(3, timerPanel = $$props.timerPanel);
    		if ('projectElement' in $$props) $$invalidate(4, projectElement = $$props.projectElement);
    		if ('projectElementResizer' in $$props) projectElementResizer = $$props.projectElementResizer;
    		if ('mainElement' in $$props) $$invalidate(5, mainElement = $$props.mainElement);
    		if ('mainElementResizer' in $$props) mainElementResizer = $$props.mainElementResizer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		project,
    		taskPanel,
    		tagPanel,
    		timerPanel,
    		projectElement,
    		mainElement,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		div4_binding,
    		div6_binding
    	];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { project: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*project*/ ctx[0] === undefined && !('project' in props)) {
    			console.warn("<Project> was created without expected prop 'project'");
    		}
    	}

    	get project() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\src\Components\NewProject.svelte generated by Svelte v3.46.5 */
    const file$1 = "src\\front\\src\\Components\\NewProject.svelte";

    function create_fragment$2(ctx) {
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let div1;
    	let t2;
    	let label0;
    	let t4;
    	let input;
    	let t5;
    	let label1;
    	let t7;
    	let textarea;
    	let t8;
    	let div2;
    	let button0;
    	let t10;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "Create a new project";
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "Project name:";
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Project description:";
    			t7 = space();
    			textarea = element("textarea");
    			t8 = space();
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t10 = space();
    			button1 = element("button");
    			button1.textContent = "Create project";
    			attr_dev(div0, "class", "disabling-overlay");
    			add_location(div0, file$1, 32, 0, 899);
    			attr_dev(div1, "class", "title svelte-1niyrga");
    			add_location(div1, file$1, 36, 4, 1050);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$1, 37, 4, 1101);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "name");
    			attr_dev(input, "id", "name");
    			attr_dev(input, "placeholder", "Write the project name here");
    			add_location(input, file$1, 38, 4, 1146);
    			attr_dev(label1, "for", "description");
    			add_location(label1, file$1, 51, 4, 1458);
    			attr_dev(textarea, "rows", "5");
    			attr_dev(textarea, "cols", "33");
    			attr_dev(textarea, "name", "description");
    			attr_dev(textarea, "id", "description");
    			attr_dev(textarea, "placeholder", "Write a project description here");
    			add_location(textarea, file$1, 52, 4, 1517);
    			attr_dev(button0, "id", "cancel");
    			add_location(button0, file$1, 61, 6, 1738);
    			attr_dev(button1, "id", "create");
    			add_location(button1, file$1, 67, 6, 1873);
    			attr_dev(div2, "class", "actions svelte-1niyrga");
    			add_location(div2, file$1, 60, 4, 1709);
    			attr_dev(div3, "class", "inside svelte-1niyrga");
    			add_location(div3, file$1, 34, 2, 959);
    			attr_dev(div4, "class", "outside svelte-1niyrga");
    			add_location(div4, file$1, 33, 0, 934);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, label0);
    			append_dev(div3, t4);
    			append_dev(div3, input);
    			set_input_value(input, /*name*/ ctx[0]);
    			/*input_binding*/ ctx[7](input);
    			append_dev(div3, t5);
    			append_dev(div3, label1);
    			append_dev(div3, t7);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*description*/ ctx[1]);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t10);
    			append_dev(div2, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[6], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[8]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(button1, "click", /*createNewProject*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}

    			if (dirty & /*description*/ 2) {
    				set_input_value(textarea, /*description*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			/*input_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewProject', slots, []);
    	const eventDispatcher = createEventDispatcher();

    	function createNewProject() {
    		projects.update(prevProjects => {
    			newProject = {
    				id,
    				name,
    				description,
    				filePath: null,
    				state: "unsaved",
    				tasks: [],
    				tags: [],
    				timer: null,
    				created: new Date(),
    				updated: new Date()
    			};

    			return [...prevProjects, newProject];
    		});

    		eventDispatcher("done", newProject);
    	}

    	onMount(() => {
    		projectNameInputElement.focus();
    	});

    	const id = Math.random().toString().slice(2);
    	let newProject;

    	// let name = `Untitled-${id}`;
    	let name = "";

    	let description = "";
    	let projectNameInputElement;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NewProject> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	const keyup_handler = event => {
    		if (event.key === "Enter") {
    			createNewProject();
    		}
    	};

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			projectNameInputElement = $$value;
    			$$invalidate(2, projectNameInputElement);
    		});
    	}

    	function textarea_input_handler() {
    		description = this.value;
    		$$invalidate(1, description);
    	}

    	const click_handler = () => {
    		eventDispatcher("done");
    	};

    	$$self.$capture_state = () => ({
    		projects,
    		createEventDispatcher,
    		onMount,
    		eventDispatcher,
    		createNewProject,
    		id,
    		newProject,
    		name,
    		description,
    		projectNameInputElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('newProject' in $$props) newProject = $$props.newProject;
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('description' in $$props) $$invalidate(1, description = $$props.description);
    		if ('projectNameInputElement' in $$props) $$invalidate(2, projectNameInputElement = $$props.projectNameInputElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		description,
    		projectNameInputElement,
    		eventDispatcher,
    		createNewProject,
    		input_input_handler,
    		keyup_handler,
    		input_binding,
    		textarea_input_handler,
    		click_handler
    	];
    }

    class NewProject extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewProject",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\src\Components\Projects.svelte generated by Svelte v3.46.5 */

    const { console: console_1 } = globals;
    const file = "src\\front\\src\\Components\\Projects.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (12:0) {#if newProject}
    function create_if_block_1(ctx) {
    	let newproject;
    	let current;
    	newproject = new NewProject({ $$inline: true });
    	newproject.$on("done", /*done_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(newproject.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(newproject, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newproject.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newproject.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(newproject, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:0) {#if newProject}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#each $projects as project}
    function create_each_block(ctx) {
    	let button;

    	let t_value = (/*project*/ ctx[6].state === "saved"
    	? /*project*/ ctx[6].name
    	: `${/*project*/ ctx[6].name}*`) + "";

    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*project*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "title svelte-1da688f");
    			toggle_class(button, "selected", /*currentProject*/ ctx[0] === /*project*/ ctx[6]);
    			add_location(button, file, 26, 6, 602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$projects*/ 4 && t_value !== (t_value = (/*project*/ ctx[6].state === "saved"
    			? /*project*/ ctx[6].name
    			: `${/*project*/ ctx[6].name}*`) + "")) set_data_dev(t, t_value);

    			if (dirty & /*currentProject, $projects*/ 5) {
    				toggle_class(button, "selected", /*currentProject*/ ctx[0] === /*project*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(26:4) {#each $projects as project}",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if currentProject !== null}
    function create_if_block(ctx) {
    	let project;
    	let current;

    	project = new Project({
    			props: { project: /*currentProject*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(project.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const project_changes = {};
    			if (dirty & /*currentProject*/ 1) project_changes.project = /*currentProject*/ ctx[0];
    			project.$set(project_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:4) {#if currentProject !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let button;
    	let t3;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*newProject*/ ctx[1] && create_if_block_1(ctx);
    	let each_value = /*$projects*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block1 = /*currentProject*/ ctx[0] !== null && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			button = element("button");
    			button.textContent = "+ New Project";
    			t3 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(button, "class", "svelte-1da688f");
    			add_location(button, file, 36, 4, 879);
    			attr_dev(div0, "class", "header svelte-1da688f");
    			add_location(div0, file, 24, 2, 540);
    			attr_dev(div1, "class", "content svelte-1da688f");
    			add_location(div1, file, 38, 2, 951);
    			attr_dev(div2, "class", "projects svelte-1da688f");
    			add_location(div2, file, 23, 0, 514);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*createNewProject*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*newProject*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*newProject*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*currentProject, $projects*/ 5) {
    				each_value = /*$projects*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, t1);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*currentProject*/ ctx[0] !== null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*currentProject*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $projects;
    	validate_store(projects, 'projects');
    	component_subscribe($$self, projects, $$value => $$invalidate(2, $projects = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	let currentProject = null;

    	function createNewProject() {
    		$$invalidate(1, newProject = true);
    	}

    	let newProject = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	const done_handler = event => {
    		console.log(event.detail);

    		if (event.detail) {
    			$$invalidate(0, currentProject = event.detail);
    		}

    		$$invalidate(1, newProject = false);
    	};

    	const click_handler = project => {
    		$$invalidate(0, currentProject = project);
    	};

    	$$self.$capture_state = () => ({
    		projects,
    		Project,
    		NewProject,
    		currentProject,
    		createNewProject,
    		newProject,
    		$projects
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentProject' in $$props) $$invalidate(0, currentProject = $$props.currentProject);
    		if ('newProject' in $$props) $$invalidate(1, newProject = $$props.newProject);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentProject,
    		newProject,
    		$projects,
    		createNewProject,
    		done_handler,
    		click_handler
    	];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\front\src\App.svelte generated by Svelte v3.46.5 */

    function create_fragment(ctx) {
    	let projects;
    	let current;
    	projects = new Projects({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(projects.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(projects, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		document.documentElement.setAttribute("data-theme", "dark" );
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Projects, onMount });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
