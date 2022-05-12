var { reactive, computed, effect } = require('./reactivity.cjs.js')
//使用pnpm build reactivity打包reactivity模块



let product = reactive({ price: 5, quantity: 2 })
let salePrice = computed(() => product.price * 0.9)
let total = computed(() => salePrice.value * product.quantity)


product.name = 'Shoes'
effect(() => {
    console.log(`Product name is now ${product.name}`)
})
product.name = 'Socks'

console.log(
    `Before updated total (should be 9) = ${total.value} salePrice (should be 4.5) = ${salePrice.value}`
)

product.quantity = 3
console.log(
    `After update total (should be 13.5) = ${total.value} salePrice (should be 4.5) = ${salePrice.value}`
)

product.price = 10
console.log(
    `After update total (should be 27) = ${total.value} salePrice (should be 9) = ${salePrice.value}`
)
