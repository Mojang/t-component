# t-component

This package contains `<T/>` component that allows you to translate strings in React using [Jed](https://github.com/messageformat/Jed).

## Contributing

We are not accepting external contributions at this point in time.

## Install

To install this packages run:

```console
$ npm i @mojang/t-component
```

or

```console
$ yarn add @mojang/t-component
```

## Usage

### TranslationProvider

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import { TranslationProvider } from "@mojang/t-component";
import { App } from "./App";

const fetchMessages = async (path: string) => {
  return (await fetch(path)).json();
};

fetchMessages("your/translation/path").then(messages => {
  ReactDOM.render(
    <TranslationProvider translation={messages}>
      <App />
    </TranslationProvider>,
    document.getElementById("React")
  );
});
```

### T and useTranslation

```tsx
import * as React from "react";

import { T } from "@mojang/t-component";
import { App } from "./App";

export const App = () => {
  const { t } = useTranslation();
  return (
    <div>
      <p><T>This text will be translated.</T></p>
      <p>
        <T
          placeholders={[
            "https://link",
          ]}
          isHTML
        >
          {`This text <a href='%1$s'>includes a link</a> to that will also be translated`}
        </T>
      </p>
      <p>
        {t("Texts can also be translated with the t function")}
      </p>
    <div/>
  )
}

```

## Testing

To run tests, simply run the following command from the root:

```console
$ npm test
```

or

```console
$ yarn test
```

## Licence

[Licenced under MIT licence](/LICENCE).
