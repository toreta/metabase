/*global analytics*/
/* @flow */

import MetabaseSettings from "metabase/lib/settings";

import { DEBUG } from "metabase/lib/debug";

// Simple module for in-app analytics.  Currently sends data to Segment.com but could be extended to anything else.
const MetabaseAnalytics = {
  // track a pageview (a.k.a. route change)
  trackPageView: function(url: string) {
    if (url) {
      analytics.page();
    }
  },

  identify: function(
    id: string
  ) {
    const { tag } = MetabaseSettings.get("version")
    analytics.identify(id, {
      version: tag
    })
  },

  reset: function() {
    analytics.reset()
  },

  // track an event
  trackEvent: function(
    category: string,
    action?: ?string,
    label?: ?(string | number | boolean),
    value?: ?number,
  ) {
    // category & action are required, rest are optional
    if (category && action) {
      analytics.track(action, { category, label, value });
    }
    if (DEBUG) {
      console.log("trackEvent", { category, action, label, value });
    }
  },
};

export default MetabaseAnalytics;

export function registerAnalyticsClickListener() {
  // $FlowFixMe
  document.body.addEventListener(
    "click",
    function(e) {
      let node = e.target;

      // check the target and all parent elements
      while (node) {
        if (node.dataset && node.dataset.metabaseEvent) {
          // we expect our event to be a semicolon delimited string
          const parts = node.dataset.metabaseEvent
            .split(";")
            .map(p => p.trim());
          MetabaseAnalytics.trackEvent(...parts);
        }
        node = node.parentNode;
      }
    },
    true,
  );
}
