"use client";

import { useEffect } from "react";

export function BigMarkerRegistrationWidget({ conferenceId }: { conferenceId: string }) {
  const containerId = `bigmarker-conference-widget-container${conferenceId}`;
  const scriptSrc = `https://web.bigmarker.com/widget/register_widget.js?conference=${conferenceId}&club=wipfli&form_type=all_fields&enable_iframe=true&link_to_channel=true&widget_redirect_type=no_redirect&redirect_to_confirmation_page=0&cid=cec48b5ceb5c`;

  useEffect(() => {
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptSrc;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [conferenceId, scriptSrc]);

  return (
    <div
      id={containerId}
      className="[&_iframe]:!w-full [&_iframe]:!min-h-[540px] [&_iframe]:block"
    />
  );
}
