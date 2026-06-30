"use client";

import Script from "next/script";

export function BigMarkerRegistrationWidget({ conferenceId }: { conferenceId: string }) {
  const containerId = `bigmarker-conference-widget-container${conferenceId}`;
  const scriptSrc = `https://web.bigmarker.com/widget/register_widget.js?club=wipfli&conference=${conferenceId}&widget_type=form_register&series_register=&upcoming_sub_title=&live_sub_title=&rec_sub_title=&upcoming_button_text=&live_button_text=&rec_button_text=&link_to_channel=false&form_type=all_fields&widget_width=265&widget_height=0&enable_iframe=false&background_color=&btext_color=&link_color=0050ff&ltext_color=ffffff&redirect_to_confirmation_page=1&widget_button_registered_content=&widget_webinar_descriptions=&widget_redirect_type=redirect&cid=cec48b5ceb5c`;

  return (
    <>
      {/* Compact overrides for BigMarker inline form */}
      <style>{`
        #${containerId} .bigmarker-widget-out-box {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
        }
        #${containerId} .bigmarker-widget-form-title {
          display: none !important;
        }
        #${containerId} .bigmarker-widget-form-list {
          margin-bottom: 8px !important;
          padding: 0 !important;
        }
        #${containerId} .bigmarker-widget-form-list-name {
          font-size: 12px !important;
          font-weight: 600 !important;
          margin-bottom: 3px !important;
          padding: 0 !important;
          line-height: 1.3 !important;
        }
        #${containerId} .bigmarker-widget-form-list-input input,
        #${containerId} .bigmarker-widget-form-list-input select,
        #${containerId} .bigmarker-widget-form-list-input textarea {
          font-size: 13px !important;
          padding: 6px 8px !important;
          height: auto !important;
          min-height: unset !important;
          width: 100% !important;
          box-sizing: border-box !important;
          border-radius: 4px !important;
          line-height: 1.4 !important;
        }
        #${containerId} input[type="submit"],
        #${containerId} button[type="submit"],
        #${containerId} .bigmarker-widget-register-btn,
        #${containerId} .register-btn {
          font-size: 12px !important;
          padding: 9px 16px !important;
          height: auto !important;
          border-radius: 4px !important;
          width: 100% !important;
          margin-top: 4px !important;
          letter-spacing: 0.05em !important;
        }
        #${containerId} .bigmarker-widget-form-list-box {
          padding: 0 !important;
        }
        #${containerId} .bigmarker-widget-legal,
        #${containerId} .bm-legal-text {
          font-size: 10px !important;
          line-height: 1.4 !important;
          margin-top: 8px !important;
        }
      `}</style>
      <div id={containerId} />
      <Script src={scriptSrc} strategy="afterInteractive" />
    </>
  );
}
