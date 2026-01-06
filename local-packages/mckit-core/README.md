# Core - MC Kit

Core de todo el paquete de librerias de MC Kit, incluye servicios, componentes y herramientas para facilitar el uso.

## Table of Contents

- [Installation](#installation)
  - [1. Install libraries](#1-install-libraries)
  - [2. Add Styles](#2-add-styles)
- [Components](#components)
  - [Loaded Object](#loaded-object)

## Installation

### Auto install with Schematics

```bash
ng g @mckit/schematics:init
```

Esto se encarga de ejecutar todos los pasos, si no hubo error, ya ha dejado todo listo.

### 1. Install libraries

```bash
npm install --save @mckit/core primeng @primeng/themes primeicons @ngx-pwa/local-storage@19
npm install tailwindcss @tailwindcss/postcss postcss --force
npm i tailwindcss-primeui --save
```

Configure PostCSS Plugins: ".postcssrc.json"
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 2. Add Styles

**File**: ./src/styles.scss

```scss
@use "tailwindcss";
@use "primeicons/primeicons.css";

body, html {
    height: 100%;
    margin: 0;
    min-height: 100%;
}
```

### 3. Configure your template paths
Add the paths to all of your template files in your tailwind.config.js file.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
    // ...
    plugins: [require('tailwindcss-primeui')]
};
```

### 4. Configure PrimeNg

Open the "app.config.ts" and add lines:

```ts

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    // Others providers
    // ....

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.my-app-dark',
          cssLayer: false
        }
      }
    })
  ]
};


```

## Components

### Loaded Object

Componente para implementar facilmente que obtenga un item a traves de un endpoint, se puede asignar el nombre del parametro a tener en cuenta desde el path.

#### - Import component

```ts
imports: [MCLoadedObject],
```

#### - Init service

```ts
itemService = inject(ItemService);

onLoaded(item: any) {
  // Set in signal
  // ...
}
```

#### - HTML

```html
<mc-loaded-object [key]="'id'" [httpService]="itemService" (onLoaded)="onLoaded($event)">

  <h1>Title item</h1>

</mc-loaded-object>
```