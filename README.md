copycat-worker
--------------

> Screenshot worker script for
> [copycat](https://github.com/prestonp/copycat).

Install
-------

Clone this project

```
git clone git@github.com:prestonp/copycat-worker.git
```

Install dependencies

```
npm install
```

Then override `config.js` with your custom application
settings like postgres connection and output directory.


Run
---

Start your redis server and then run
the workers via

```
npm start
```
