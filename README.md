# Содержание

- [Деплой](#деплой)
- [Проблемы совместимости](#проблемы-совместимости)
- [Стандартная конфигурация](#стандартная-конфигурация)
- [Подход к конфигам](#подход-к-конфигам)
- [Архитектура папок](#архитектура-папок)
- [Выход к adminjs](#выход-к-adminjs)
- [Мультиязычность](#мультиязычность)
- [Загрузка плагинов в Express](#загрузка-плагинов-в-express)
- [Подход к тестированию](#подход-к-тестированию)

# Деплой

```bash
git clone https://github.com/Unkown496/next-admin-ts.git <folder-name>
cd <folder-name>
git remote remove origin # Отвязка от исходного репозитория либо удалить папку .git
cp .env.example .env # Заполните .env
npm i
npm run dev|start # Перед start сделать npm run build
```

# Проблемы совместимости

`adminjs` адаптер для `prisma`, не умеет работать с свежими версиями `prisma`, а работает только с версией `5.0.0`. Но это создает баги только при установке зависимостей, т.к `Npm` ругается на несовместимость версий, поэтому в этом прокте пример для `prisma@5.0.0`

### Использование с другими orm

# Стандартная конфигурация

1. tailwindCss + scss
2. prisma
3. eslint + styleLint (опционально)
4. cross-env|dotenv - для запуска в разных `NODE_ENV` и импорта env в стартер
5. Helmet, [Swagger](https://www.npmjs.com/package/express-jsdoc-swagger)
6. svgr

# Подход к конфигам

`.env` - Конфиги без префикса `NEXT_` относятся к серверу `express`

#### Предустановленные .env

```env
# Jwt setup
JWT_SECRET=
JWT_EXPIRES=

# Cookie setup
COOKIE_SECRET=
```

Эти `env` обязательные к заполению, чтобы админку можно было поднять

# Архитектура папок

`utils` - Папка для серверных утилит, сюда пойдут любые утилиты для express сервера <br />
`generate` - Папка для генерирования различных вещей при помощи node.js <br />
`/src/app` -

- `/tests`
  - `/browser` - Для тестирование `next/react` компонентов, страниц (интеграционное/unit)
    - `/async` - Для тестирования асинхронных компонентов и страниц [подробнее](#подход-к-тестированию)
  - `/server` - Для тестирование `API routes` `next` (интеграционное/unit), тестирование мокированное
  - `/__mocks__` - Файлы для компонентов общих моков
  - `/seeds` - Файлы для запуска сидирования при помощи [faker.js](https://fakerjs.dev/)
- `/actions` - [Server action next](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- `/helpers` - Папка с переиспользуемыми функциями по всему проекту

`lib` - Самописные плагины для `next`

# Выход к adminjs

```ts
const app = new App(['Admin'], {
  isProduction: process.env.NODE_ENV === 'production',
  port: +process.env.PORT || 3000,

  cookieSecret: process.env.COOKIE_SECRET || 'secret',

  adminOptions: {}, // Выход к AdminJSOptions
});
```

`Admin`

```prisma
model Admin {
  id Int @id @default(autoincrement())
  email     String   @unique
  password  String
}
```

Спец модель для администратора, если нужно менять под специфику проекта, то затронуть аунтетификацию
Для смены способа аунтетификации (сейчас jwt+hash password argon2id)

```js
  async singIn({ email, password }) {
        const admin = await client.admin.findUnique({
          where: {
            email,
          },
        });

        if (!admin) return null;

        const passwordVerify = await argon2.verify(admin.password, password);
        if (!passwordVerify) return null;

        const token = jwt.sign(
          {
            id: admin.id,
            email: admin.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES || '1h' },
        );

        return token;
      },
```

Переписывается этот метод в `orm/index.ts`

# Мультиязычность

Чтобы добавить свой перевод, нужно загрузить `.json` в папку `locales`, где ключом языка станет название файла по методу `localName.json`
Вводить только короткий ключ языка

# Загрузка плагинов в Express

Плагин `express-swagger` теперь нужно иниализировать в ручную

Это прямой выход к обьекту `Express`

```js
new App(['SomeModels'], {
  usePlugins(server) {
    server.use(someExpressPlugin());
  },
});
```

Поэтому помимо запуска плагинов, возможно обьявление роутов, и прочие вещи с `Express`. **БЫТЬ АККУРАТНЕЕ**

# Подход к тестированию

Тестирование выполенено при помощи `vitest`, и разделено на несколько слоев. <br />
`browser` - Сюда будут помещены все клиентские части, поэтому здесь применено минимальное мокирование, а состояния часто не проверяются (сюда помещаются только синхронные компоненты) <br />
`server` - Здесь будут тестироваться все вызовы внутреннего апи <br />
`async` - Здесь тестируются и мокируются отдельно во вне вызова `vitest.setup.jsx`, асинхронные компоненты/страницы и прочее <br />
`seeds` - Здесь находятся все генераторы данных <br />
`__mocks__` - Общие мок файлы <br/>
`vitest.setup.jsx` - Общий сетап для `browser`
