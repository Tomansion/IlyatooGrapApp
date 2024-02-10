# Ilyatoo graph vis

![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Enjoy a graph visualization of the [Ilyatoo](https://ilyatoo.com/) data.

## Development guide

First, clone the repo:

```bash
git clone https://github.com/Tomansion/IlyatooGraphApp.git
cd IlyatooGraphApp
```

### Backend

The backend is made with Python and requests / flask, it is based on a OpenAPI specification, check the [OpenAPI specification](./back/api.yaml) for more information.

#### Requirements

- Python v3.8
- pip v23.1.2

#### How to setup

```bash
cd backend
pip install -r requirements.txt
```

#### Configuration

Fill the [config file](./backend/config/config.ini) with your ArangoDB credentials.

#### Run the backend

```bash
python websrv.py
```

Check the SwaggerUI at [http://localhost:3000/api/ui](http://localhost:3000/api/ui)

[Testing guide](./backend/tests/README.md)

#### Good practices

Check that your code is compliant with our linter Black:

```bash
black .
```

### Frontend

The frontend is made with VueJS.

#### Requirements

- NodeJS v19.0.0c
- npm v8.19.2

#### How to setup

```bash
cd frontend
npm install
```

#### Run the frontend

```bash
npm run serve
```

The frontend is now available by connecting to the backend URL at [http://localhost:3000](http://localhost:3000)

#### Good practices

Check that your code is compliant with our linter Prettier:

```bash
npm run prettier
```

Check that your code has no spelling mistakes:

```bash
npm run spellcheck
```

### Recommended development environment

- VSCode with extensions:
  - [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
  - [Black](https://marketplace.visualstudio.com/items?itemName=lextudio.restructuredtext)
  - [Cspell](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
