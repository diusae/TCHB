// bridge.js — Sayfa dünyasında çalışır, oyunun trafiğini dinler
(function () {
  'use strict';
  if (window.__MINI_BRIDGE__) return;
  window.__MINI_BRIDGE__ = true;

  const REQ = 'CRIMS_MINI_REQ';
  const RES = 'CRIMS_MINI_RES';
  const nativeFetch = window.fetch.bind(window);

  const auth = { xRequest: '', xsrf: '', capturedAt: 0 };

  function observeHeader(name, value) {
    const k = String(name || '').toLowerCase();
    const v = String(value || '');
    if (k === 'x-request' && v.length >= 20) { auth.xRequest = v; auth.capturedAt = Date.now(); }
    if (k === 'x-xsrf-token' && v.length >= 20) auth.xsrf = v;
  }

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  const origSet  = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__req = { method: String(method || 'GET').toUpperCase(), url: String(url || '') };
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    observeHeader(name, value);
    return origSet.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    if (this.__req && !this.__hooked) {
      this.__hooked = true;
      this.addEventListener('loadend', () => {
        try {
          const refresh = this.getResponseHeader && this.getResponseHeader('x-request-refresh');
          if (refresh && refresh.length >= 20) { auth.xRequest = refresh; auth.capturedAt = Date.now(); }
        } catch (_) {}
      }, { once: true });
    }
    return origSend.apply(this, arguments);
  };

  window.fetch = function (input, init) {
    try {
      const h = init && init.headers;
      if (h instanceof Headers) h.forEach((v, k) => observeHeader(k, v));
      else if (Array.isArray(h)) h.forEach(([k, v]) => observeHeader(k, v));
      else if (h) Object.entries(h).forEach(([k, v]) => observeHeader(k, v));
    } catch (_) {}
    return nativeFetch(input, init);
  };

  function readCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function getVue() {
    return document.querySelector('#app')?.__vue_app__?.config?.globalProperties || null;
  }
  function getRouter() { return getVue()?.$router || null; }
  function getEvents() { return getVue()?.$events || null; }

  async function waitForToken(timeoutMs = 8000) {
    const start = Date.now();
    while (!auth.xRequest && Date.now() - start < timeoutMs) {
      await new Promise(r => setTimeout(r, 150));
    }
    if (!auth.xRequest) throw new Error('E_NO_TOKEN');
  }

  // Error codes: E_BRIDGE_TIMEOUT, E_NO_TOKEN, E_FOREIGN_ORIGIN,
  // E_API_ONLY, E_NO_EVENTS, E_NO_ROUTER, E_UNKNOWN_MSG
  // Bunlar content.js tarafında çevrilir.

  window.addEventListener('message', async (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    const msg = event.data;
    if (!msg || msg.source !== REQ) return;

    const reply = (payload) => window.postMessage({ source: RES, id: msg.id, ...payload }, location.origin);

    if (msg.type === 'ping') {
      reply({ payload: { ok: true, hasToken: !!auth.xRequest } });
      return;
    }

    if (msg.type === 'fetch') {
      try {
        await waitForToken();

        const url = new URL(msg.url, location.origin).href;
        if (new URL(url).origin !== location.origin) throw new Error('E_FOREIGN_ORIGIN');
        if (!new URL(url).pathname.startsWith('/api/v1/')) throw new Error('E_API_ONLY');

        const method = String(msg.options?.method || 'GET').toUpperCase();
        const headers = new Headers(msg.options?.headers || {});
        headers.set('Accept', 'application/json, text/plain, */*');
        if (method !== 'GET' && method !== 'HEAD') headers.set('Content-Type', 'application/json');
        if (auth.xRequest) headers.set('x-request', auth.xRequest);
        const xsrf = readCookie('XSRF-TOKEN') || auth.xsrf;
        if (xsrf) headers.set('x-xsrf-token', xsrf);

        let body = msg.options?.body;
        if (body && typeof body === 'string' && method !== 'GET') {
          try {
            const parsed = JSON.parse(body);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              if (!Number.isFinite(Number(parsed.action_timestamp))) parsed.action_timestamp = Date.now();
              body = JSON.stringify(parsed);
            }
          } catch (_) {}
        }

        const res = await nativeFetch(url, {
          method,
          headers,
          credentials: 'include',
          cache: 'no-store',
          referrer: location.href,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: method === 'GET' || method === 'HEAD' ? undefined : body,
        });

        const refresh = res.headers.get('x-request-refresh');
        if (refresh && refresh.length >= 20) { auth.xRequest = refresh; auth.capturedAt = Date.now(); }

        const ct = res.headers.get('content-type') || '';
        const data = ct.includes('json')
          ? await res.json().catch(() => ({}))
          : { raw: await res.text().catch(() => '') };

        reply({ payload: { ...data, _status: res.status, _ok: res.ok } });
      } catch (e) {
        reply({ error: String(e?.message || e) });
      }
      return;
    }

    if (msg.type === 'exit-nightclub') {
      try {
        const events = getEvents();
        if (!events) throw new Error('E_NO_EVENTS');
        events.emit('exit-nightclub', 'bot-exit');
        reply({ payload: { ok: true } });
      } catch (e) {
        reply({ error: String(e?.message || e) });
      }
      return;
    }

    if (msg.type === 'navigate') {
      try {
        const router = getRouter();
        if (!router) throw new Error('E_NO_ROUTER');
        await router.push(String(msg.path || '/'));
        reply({ payload: { ok: true, path: msg.path } });
      } catch (e) {
        reply({ error: String(e?.message || e) });
      }
      return;
    }

    reply({ error: 'E_UNKNOWN_MSG:' + msg.type });
  });

  console.log('[Crims Mini Bridge] MAIN world ready.');
})();