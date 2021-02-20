import fetch from '../src/main';

describe('fetch request', () => {
  test('request', async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos/1',
    );
    expect(response.ok).toBe(true);
    const result = (await response.json()) as { id: number };
    expect(result.id).toBe(1);
    const textResult = (await response.text()) as string;
    expect(textResult).toBe(
      JSON.stringify(
        {
          userId: 1,
          id: 1,
          title: 'delectus aut autem',
          completed: false,
        },
        null,
        2,
      ),
    );
  }, 20000);
  test('request with root path', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com');
    expect(response.ok).toBe(true);
  }, 20000);
  test('request with 404', async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts1111111',
    );
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  }, 20000);
  test('request with error', async () => {
    await expect(fetch('1341')).rejects.toThrow(Error);
  }, 20000);
  test('request without url', async () => {
    await expect(fetch('')).rejects.toThrow('Miss required param url');
  }, 20000);
  test('request with config', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    expect(response.ok).toBe(true);
    const result = (await response.json()) as { id: number };

    expect(result.id).toBe(101);
  }, 20000);

  test('request with puppeteer config', async () => {
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1';
    const referer = 'https://www.google.com';
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        body: JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
      {
        puppeteerConfig: {
          launchOptions: {
            slowMo: 250,
          },
          viewPort: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
          },
          userAgent: userAgent,

          extraHTTPHeaders: {
            Referer: referer,
          },
        },
      },
    );
    expect(response.ok).toBe(true);

    const result = (await response.json()) as { id: number };
    expect(result.id).toBe(101);
    const request = response._request;

    expect(request.method).toBe('POST');
    expect(request.headers['user-agent']).toBe(userAgent);
    expect(request.headers.referer).toBe(referer);
  }, 20000);
});
