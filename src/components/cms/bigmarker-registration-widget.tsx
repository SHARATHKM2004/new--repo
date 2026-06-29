"use client";

import Script from "next/script";

export function BigMarkerRegistrationWidget({ conferenceId }: { conferenceId: string }) {
  const containerId = `bigmarker-conference-widget-container${conferenceId}`;
  const scriptSrc = `https://web.bigmarker.com/widget/register_widget.js?club=wipfli&conference=${conferenceId}&widget_type=form_register&series_register=&upcoming_sub_title=&live_sub_title=&rec_sub_title=&upcoming_button_text=&live_button_text=&rec_button_text=&link_to_channel=false&form_type=all_fields&widget_width=&widget_height=0&enable_iframe=false&background_color=&btext_color=&link_color=0050ff&ltext_color=ffffff&redirect_to_confirmation_page=1&widget_button_registered_content=&widget_webinar_descriptions=&widget_redirect_type=redirect&cid=cec48b5ceb5c`;

  return (
    <>
      <div id={containerId} />
      <Script src={scriptSrc} strategy="afterInteractive" />
    </>
  );
}
