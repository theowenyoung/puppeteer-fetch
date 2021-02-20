import {
  LaunchOptions,
  ChromeArgOptions,
  BrowserOptions,
  WaitForOptions,
} from 'puppeteer';
export interface IPuppeteerConfig {
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
export interface IOptions {
  puppeteerConfig?: IPuppeteerConfig;
  timeout?: number;
}
export interface IRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}
export interface IResponse {
  readonly headers: Headers;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  json(): Promise<unknown>;
  text(): Promise<string>;
  _request: IRequest;
}
