const targetMap = new WeakMap()

let activeEffect = null

function effect(eff) {
    activeEffect = eff
    activeEffect()
    activeEffect = null
}

function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, (dep = new Set()))
        }
        dep.add(activeEffect)
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    let dep = depsMap.get(key)
    if (dep) {
        dep.forEach(effect => {
            effect()
        })
    }
}

function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            let result = Reflect.get(target, key, receiver)
            track(target, key)
            return result
        },
        set(target, key, value, receiver) {
            let oldValue = target[key]
            let result = Reflect.set(target, key, value, receiver)
            if (result && oldValue !== value) {
                trigger(target, key)
            }
            return result
        }
    }
    return new Proxy(target, handler)
}

function ref(raw) {
    const r = {
        get value() {
            track(r, 'value')
            return raw
        },
        set value(newValue) {
            // if (raw !== newValue) {
            raw = newValue
            trigger(r, 'value')
            // }
        }
    }
    return r
}

let product = reactive({ price: 5, quantity: 2 })
let salePrice = ref(0)
let total = 0
effect(() => {
    salePrice.value = product.price * 0.9
})
effect(() => {
    total = salePrice.value * product.quantity
})

console.log(
    `Before updated total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
)

product.quantity = 3
console.log(
    `After update total (should be 13.5) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
)

product.price = 10
console.log(
    `After update total (should be 27) = ${total} salePrice (should be 9) = ${salePrice.value}`
)
