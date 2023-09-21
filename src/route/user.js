// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: { list, isEmpty: list.length === 0 },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
router.get('/product-list', function (req, res) {
  const list = Product.getList()
  res.render('product-list', {
    style: 'product-list',

    data: {
      products: { list, isEmpty: list.length === 0 },
    },
  })
})
// ================================================================
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }
  verifyPassword = (password) => this.password === password
  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user.data)
      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ++++++===============================
class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
  }
  static add = (product) => {
    this.#list.push(product)
    return true
  }
  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static addDone = (id) =>
    this.#list.some((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product.data)
      return true
    } else {
      return false
    }
  }
  static update = (product, name, price, description) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
}

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)
  User.add(user)

  console.log(User.getList())

  res.render('succes-info', {
    style: 'succes-info',
    info: 'Користувач створений',
  })
})
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('succes-info', {
    style: 'succes-info',
    info: 'Користувач видалений',
  })
})
router.post('/user-update', function (req, res) {
  const { id, email, password } = req.body
  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  console.log(email, password, id)

  res.render('succes-info', {
    style: 'succes-info',
    info: result
      ? 'Інформація про користувача оновленна'
      : 'Сталася помилка',
  })
})
router.get('/product-create', function (req, res) {
  const list = Product.getList()

  res.render('product-create', {
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  const result = Product.add(product)

  res.render('alert', {
    style: 'alert	',
    info: result
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    text: result
      ? 'Товар успішко був створений'
      : 'Товар не був створений',
  })
})
router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',
  })
})
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))

  res.render('product-edit', {
    style: 'product-edit',
    product: product,
    id: product.id,
  })
})
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const product = Product.getById(Number(id))

  Product.update(product, name, price, description)
  const result = product
  console.log(result)
  res.render('alert', {
    style: 'alert	',
    info: result
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    text: result ? 'Товар оновленно' : 'Сталася помилка',
  })
})
router.get('/product-delete', function (req, res) {
  const { id } = req.query
  const product = Product.deleteById(Number(id))
  const result = product

  res.render('alert', {
    style: 'alert	',
    info: result
      ? 'Успішне виконання дії'
      : 'Сталася помилка',
    text: result ? 'Товар Видалено' : 'Сталася помилка',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
