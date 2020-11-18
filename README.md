# Aii

this is the backend of Aii

## Setup

Clone this project

```bash
git clone https://github.com/MriDx/Aii.git
```

```bash
cd Aii
```

```bash
npm i
```

copy .env.example and rename to .env

```bash
adonis key:generate
```

create database and set database credentials in .env file

```bash
adonis migration:run
```

and finally

```bash
adonis serve --dev
```
