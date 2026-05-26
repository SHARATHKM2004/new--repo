import Link from "next/link";
import { BrandBar, type SignInConfig } from "./shared";

export function SignInHub({ cfg }: { cfg: SignInConfig }) {
  const submitColor = cfg.submitColor ?? "#9ca3af";
  return (
    <section
      className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-screen w-screen flex-col bg-cover bg-center"
      style={cfg.backgroundImageUrl ? { backgroundImage: `url(${cfg.backgroundImageUrl})` } : undefined}
    >
      <BrandBar cfg={cfg} />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <form className="w-full max-w-md rounded bg-white px-8 py-9 shadow-2xl">
          <h1 className="mb-6 text-2xl font-semibold text-gray-900">
            {cfg.heading ?? "Sign in"}
          </h1>

          <label className="mb-1 block text-sm font-semibold text-gray-700">
            {cfg.emailLabel ?? "Email address"}
          </label>
          <input
            type="email"
            placeholder={cfg.emailPlaceholder ?? ""}
            className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#1247ff] focus:outline-none"
          />

          <label className="mb-1 block text-sm font-semibold text-gray-700">
            {cfg.passwordLabel ?? "Password"}
          </label>
          <input
            type="password"
            placeholder={cfg.passwordPlaceholder ?? ""}
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#1247ff] focus:outline-none"
          />

          {cfg.forgotLabel ? (
            <div className="mb-4">
              <Link href={cfg.forgotUrl ?? "#"} className="text-sm text-[#1247ff] hover:underline">
                {cfg.forgotLabel}
              </Link>
            </div>
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
            {cfg.submitLabel ?? "Sign in"}
          </button>

          {cfg.helpText || cfg.supportLinkLabel ? (
            <p className="mt-6 text-sm text-gray-700">
              {cfg.helpText ? <>{cfg.helpText} </> : null}
              {cfg.supportLinkLabel ? (
                <Link href={cfg.supportLinkUrl ?? "#"} className="text-[#1247ff] hover:underline">
                  {cfg.supportLinkLabel}
                </Link>
              ) : null}
            </p>
          ) : null}

          {cfg.urgentText ? (
            <p className="mt-3 text-sm text-gray-700">{cfg.urgentText}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
