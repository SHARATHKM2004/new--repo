"use client";

import Script from "next/script";

export function BigMarkerRegistrationWidget({ conferenceId }: { conferenceId: string }) {
  const containerId = `bigmarker-conference-widget-container${conferenceId}`;
  const scriptSrc = `https://web.bigmarker.com/widget/register_widget.js?club=wipfli&conference=${conferenceId}&widget_type=form_register&series_register=&upcoming_sub_title=&live_sub_title=&rec_sub_title=&upcoming_button_text=&live_button_text=&rec_button_text=&link_to_channel=false&form_type=all_fields&widget_width=265&widget_height=0&enable_iframe=false&background_color=&btext_color=&link_color=0050ff&ltext_color=ffffff&redirect_to_confirmation_page=1&widget_button_registered_content=&widget_webinar_descriptions=&widget_redirect_type=redirect&cid=cec48b5ceb5c`;

  return (
    <>
      {/* Compact overrides for BigMarker inline form */}
      <style>{`
        #${containerId} label,
        #${containerId} .bm-widget-field-label {
          font-size: 12px !important;
          margin-bottom: 2px !important;
          font-weight: 600 !important;
        }
        #${containerId} input,
        #${containerId} select,
        #${containerId} textarea {
          font-size: 12px !important;
          padding: 6px 8px !important;
          height: auto !important;
          min-height: unset !important;
          border-radius: 4px !important;
        }
        #${containerId} .bm-widget-field,
        #${containerId} .bm-register-field {
          margin-bottom: 8px !important;
        }
        #${containerId} button,
        #${containerId} input[type="submit"] {
          font-size: 12px !important;
          padding: 8px 16px !important;
          height: auto !important;
          border-radius: 4px !important;
          margin-top: 6px !important;
        }
        #${containerId} .bm-register-legal,
        #${containerId} .bm-widget-legal {
          font-size: 10px !important;
          margin-top: 8px !important;
          line-height: 1.4 !important;
        }
      `}</style>
      <div id={containerId} />
      <Script src={scriptSrc} strategy="afterInteractive" />
    </>
  );
}
