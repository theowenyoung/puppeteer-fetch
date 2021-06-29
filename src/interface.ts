import puppeteer from 'puppeteer';

export type Product = 'chrome' | 'firefox';

export interface IPuppeteerConfig {
  launchOptions?: puppeteer.LaunchOptions & puppeteer.BrowserLaunchArgumentOptions & puppeteer.BrowserConnectOptions & {
    product?: Product;
    extraPrefsFirefox?: Record<string, unknown>;
}
  userAgent?: string;
  viewPort?: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    isLandscape?: boolean;
    hasTouch?: boolean;
  };
  waitFor?: puppeteer.WaitForOptions;
  extraHTTPHeaders?: Record<string, string>;
}
export interface IOptions {
  puppeteerConfig?: IPuppeteerConfig;
  timeout?: number;
  puppeteer?:puppeteer.PuppeteerNode
}
export interface IRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}
export interface IResponse {
  readonly headers:  Record<string, string>;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  json(): Promise<unknown>;
  text(): Promise<string>;
  _request: IRequest;
}
