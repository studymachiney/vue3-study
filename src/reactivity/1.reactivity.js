const targetMap = new WeakMap()

//收集effect依赖
function track(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    dep.add(effect)
}

//执行依赖
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

let product = { price: 5, quantity: 2 }
let total = 0
let effect = () => {
    total = product.price * product.quantity
}
track(product, 'quantity')
effect()
console.log('total:', total)

product.quantity = 3
trigger(product, 'quantity')
console.log('total:', total)
