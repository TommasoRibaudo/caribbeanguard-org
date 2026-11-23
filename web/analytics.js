/* Explicit analytics only. Configuration is compiled into hosted builds. */
(function () {
  "use strict";
  const script = document.currentScript;
  const token = script?.dataset.projectToken || "";
  const region = script?.dataset.region;
  const surface = script?.dataset.surface;
  const enabled = /^phc_[a-zA-Z0-9]{12,}$/.test(token)
    && ["us", "eu"].includes(region) && ["website", "coastal_map"].includes(surface)
    && location.protocol === "https:" && navigator.globalPrivacyControl !== true
    && navigator.doNotTrack !== "1" && typeof crypto.randomUUID === "function";
  if (!enabled) return;

  const pageId = crypto.randomUUID();
  const endpoint = `https://${region}.i.posthog.com/i/v0/e/`;
  const actions = new Set(["beach", "forecast", "legend", "rescue", "medical", "access", "reference", "language", "map_link", "donate_link"]);
  function capture(event, action) {
    const properties = {
      distinct_id: pageId, $process_person_profile: false, $geoip_disable: true,
      surface, ...(action ? {action} : {}),
      ...(event === "$pageview" ? {$current_url: location.origin + location.pathname, $pathname: location.pathname} : {})
    };
    fetch(endpoint, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({api_key: token, event, properties}),
      credentials: "omit", referrerPolicy: "no-referrer", keepalive: true
    }).catch(() => {});
  }
  window.CGAnalytics = Object.freeze({
    track(action) { if (actions.has(action)) capture("cg_interaction", action); }
  });

  if (surface === "coastal_map" && window.parent !== window) {
    capture("cg_map_loaded");
  } else if (surface === "website") {
    // Next client navigations use the History API. Strip query and fragment.
    let lastPath;
    const page = () => {
      if (lastPath === location.pathname) return;
      lastPath = location.pathname;
      capture("$pageview");
    };
    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function (...args) {
        const result = original.apply(this, args);
        page();
        return result;
      };
    }
    addEventListener("popstate", page);
    document.addEventListener("click", event => {
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const pathname = new URL(link.href, location.origin).pathname;
      if (link.origin === location.origin && /^\/mapa\/?$/.test(pathname)) capture("cg_interaction", "map_link");
      if (link.origin === location.origin && /^\/(?:donar|donate)\/?$/.test(pathname)) capture("cg_interaction", "donate_link");
    });
    page();
  } else {
    capture("$pageview");
  }
})();
