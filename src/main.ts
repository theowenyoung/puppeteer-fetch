import * as puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { IOptions, IResponse } from './interface';
import { getFixContent } from './util';
export * from './interface';
let globalBrowser: puppeteer.Browser;
let globalReject: (e: Error) => void;
const fetch = async (
  url: string,
  config?: RequestInit,
  options?: IOptions,
): Promise<IResponse> => {
  if (!url) {
    return Promise.reject(new Error('Miss required param url'));
  }
  if (!config) {
    config = {};
    options = {
      puppeteerConfig: {},
    };
  } else if (config && !options) {
    options = {
      puppeteerConfig: {},
    };
  }
  const puppeteerConfig = options.puppeteerConfig || {};
  const timeout = options.timeout || 60000;

  return new Promise((resolve, reject) => {
    globalReject = reject;
    const userAgent = puppeteerConfig.userAgent;
    puppeteer
      .launch({
        // headless: false,
        // slowMo: 250,
        // devtools: true,
        args: ['--disable-web-security'],
        ...puppeteerConfig.launchOptions,
      })
      .then((browser) => {
        globalBrowser = browser;
        const timer: NodeJS.Timeout = setTimeout(() => {
          const alive = browser && browser.isConnected();

          if (alive) {
            browser
              .close()
              .then(() => {
                reject(new Error(`Timeout ${timeout}ms`));
              })
              .catch((e) => {
                reject(
                  new Error(`Timeout ${timeout}ms with broser error: ${e}`),
                );
              });
          } else {
            reject(new Error(`Timeout ${timeout}ms`));
          }
        }, timeout);
        const rejectFinally = (e) => {
          if (timer) {
            clearTimeout(timer);
          }
          const alive = browser && browser.isConnected();
          if (alive) {
            browser
              .close()
              .then(() => {
                reject(e);
              })
              .catch((e) => reject(e));
          } else {
            reject(e);
          }
        };
        const resolveFinally = (e: IResponse): void => {
          if (timer) {
            clearTimeout(timer);
          }
          const alive = browser && browser.isConnected();
          if (alive) {
            browser
              .close()
              .then(() => {
                resolve(e);
              })
              .catch(() => resolve(e));
          } else {
            resolve(e);
          }
        };

        browser
          .newPage()
          .then(async (page) => {
            try {
              if (userAgent) {
                await page.setUserAgent(userAgent);
              }
              if (puppeteerConfig.viewPort) {
                await page.setViewport(puppeteerConfig.viewPort);
              }

              if (puppeteerConfig.extraHTTPHeaders) {
                await page.setExtraHTTPHeaders(
                  puppeteerConfig.extraHTTPHeaders,
                );
              }
              page.on('error', async (e) => {
                rejectFinally(e);
              });

              page.on('pageerror', async (e) => {
                rejectFinally(e);
              });
              page.on('response', async (response) => {
                const responseUrl = response.url();
                // fix url ,if url do not have slash /
                const urlObj = new URL(url);
                if (urlObj.pathname === '/' && !url.endsWith('/')) {
                  url += '/';
                }
                if (responseUrl === url) {
                  const text = await response.text();
                  const request = response.request();

                  const newIResponse: IResponse = {
                    status: response.status(),
                    ok: response.ok(),
                    headers: response.headers(),
                    statusText: response.statusText(),
                    url: response.url(),
                    json: async () => {
                      return JSON.parse(text);
                    },
                    text: async () => {
                      return text;
                    },
                    _request: {
                      headers: request.headers(),
                      url: request.url(),
                      method: request.method(),
                      body: request.postData(),
                    },
                  };

                  resolveFinally(newIResponse);
                }
              });
              const content = await getFixContent('puppeteer.hbs');
              const template = Handlebars.compile(content);
              const htmlContent = template({
                fetchUrl: url,
                fetchConfig: config ? JSON.stringify(config, null, 2) : '{}',
              });
              await page.setContent(htmlContent, {
                timeout: timeout,
                ...puppeteerConfig.waitFor,
              });
            } catch (error) {
              rejectFinally(error);
            }
          })
          .catch((e) => rejectFinally(e));
      })
      .catch((e) => reject(e));
  });
};
const checkClosed = async () => {
  const alive = globalBrowser && globalBrowser.isConnected();
  if (alive) {
    // browser.disconnect()
    await globalBrowser.close();
    globalBrowser = null;
  }
  if (globalReject) {
    globalReject(new Error('Something interrupt'));
  }
};
process.on('beforeExit', checkClosed);
process.on('SIGTERM', checkClosed);
process.on('SIGINT', checkClosed);
export default fetch;
