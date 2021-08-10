# puppeteer-fetch

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

Fetch with Puppeteer, just like node-fetch, but use [puppeteer](https://pptr.dev/) as the driver.

## Getting Started <a name = "getting_started"></a>

```javascript
const fetch = require("puppeteer-fetch").default;

(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: "foo",
      body: "bar",
      userId: 1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const ok = response.ok;
  if (ok) {
    const result = await response.json();
    console.log("result", result);
    // print { title: 'foo', body: 'bar', userId: 1, id: 101 }
  }
})();
```

### Installing

```
npm i puppeteer-fetch
```

## Usage <a name = "usage"></a>

> fetchOptions see [Fetch_API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

> puppeteerConfig see [puppeteer](https://pptr.dev/)

```typescript
const fetch = require('puppeteer-fetch');

fetch('<url>', fetchOptions, {
  puppeteerConfig: IPuppeteerConfig,
  timeout: number,
  puppeteer: PuppeteerNode
});

// you can pass a puppeteer instant, like puppeteer-extra

interface IPuppeteerConfig {
  launchOptions?: LaunchOptions & ChromeArgOptions & BrowserOptions;
  userAgent?: string;
  viewPort?: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    isLandscape?: boolean;
    hasTouch?: boolean;
  };
  waitFor?: WaitForOptions;
  extraHTTPHeaders?: Record<string, string>;
}
```
