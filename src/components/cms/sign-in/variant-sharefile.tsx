import Link from "next/link";
import type { SignInConfig } from "./shared";

export function SignInShareFile({ cfg }: { cfg: SignInConfig }) {
  const submitColor = cfg.submitColor ?? "#6f1ad6";
  const leftBg = cfg.leftPanelColor ?? "#1247ff";
  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-screen w-screen flex-col lg:flex-row">
      <div
        className="flex flex-1 items-center justify-center p-10 lg:flex-[1_1_45%]"
        style={{ background: leftBg }}
      >
        {cfg.leftPanelImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cfg.leftPanelImageUrl}
            alt=""
            className="max-h-[420px] w-auto max-w-full object-contain"
          />
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col bg-white p-8 lg:flex-[1_1_55%] lg:p-16">
        {cfg.logoUrl ? (
          <div className="absolute right-6 top-6 lg:right-10 lg:top-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cfg.logoUrl} alt={cfg.brandLabel ?? "logo"} className="h-6 w-auto" />
          </div>
        ) : (
          <div className="absolute right-6 top-6 text-xl font-light tracking-tight text-[#1247ff] lg:right-10 lg:top-8">
            {cfg.brandLabel ?? "WIPFLI"}
          </div>
        )}

        <div className="my-auto w-full max-w-md">
          <h1 className="mb-2 text-4xl font-light text-gray-900">{cfg.heading ?? "Welcome!"}</h1>
          {cfg.subheading ? (
            <p className="mb-8 text-sm text-gray-600">{cfg.subheading}</p>
          ) : null}

          <form>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              {cfg.emailLabel ?? "Email"}
            </label>
            <div className="relative mb-4">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder={cfg.emailPlaceholder ?? ""}
                className="w-full rounded border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-[#1247ff] focus:outline-none"
              />
            </div>

            {cfg.showPassword ? (
              <>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {cfg.passwordLabel ?? "Password"}
                </label>
                <input
                  type="password"
                  placeholder={cfg.passwordPlaceholder ?? ""}
                  className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#1247ff] focus:outline-none"
                />
              </>
            ) : null}

            {cfg.rememberLabel ? (
              <label className="mb-6 flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="h-4 w-4" />
                {cfg.rememberLabel}
              </label>
            ) : null}

            <button
              type="submit"
              className="w-full rounded px-4 py-3 text-sm font-semibold text-white"
              style={{ background: submitColor, color: cfg.submitTextColor ?? "#fff" }}
            >
              {cfg.submitLabel ?? "Continue"}
            </button>
          </form>
        </div>

        {cfg.privacyLabel ? (
          <div className="mt-10 text-sm">
            <Link href={cfg.privacyUrl ?? "#"} className="text-[#1247ff] hover:underline">
              {cfg.privacyLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
