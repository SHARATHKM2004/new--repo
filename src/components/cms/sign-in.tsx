import Link from "next/link";
import type { Locale } from "@/lib/cms/types";
import type { SignInBlock } from "@/lib/cms/types";

type Props = { block: SignInBlock; locale: Locale };

type SignInConfig = {
  brandLabel?: string;
  brandSecondaryLabel?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  leftPanelColor?: string;
  leftPanelImageUrl?: string;
  topText?: string;
  mobileGuideLabel?: string;
  mobileGuideUrl?: string;
  appStoreImageUrl?: string;
  appStoreUrl?: string;
  googlePlayImageUrl?: string;
  googlePlayUrl?: string;
  heading?: string;
  subheading?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  showPassword?: boolean;
  forgotLabel?: string;
  forgotUrl?: string;
  roleLabel?: string;
  roleOptions?: string[];
  rememberLabel?: string;
  infoParagraphs?: string[];
  submitLabel?: string;
  submitColor?: string;
  submitTextColor?: string;
  footerText?: string;
  footerHighlight?: string;
  helpText?: string;
  supportLinkLabel?: string;
  supportLinkUrl?: string;
  urgentText?: string;
  privacyLabel?: string;
  privacyUrl?: string;
};

function parseConfig(raw?: string): SignInConfig {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as SignInConfig) : {};
  } catch {
    return {};
  }
}

export function SignIn({ block }: Props) {
  const cfg = parseConfig(block.configJson);
  if (block.variant === "hub") return <SignInHub cfg={cfg} />;
  if (block.variant === "sharefile") return <SignInShareFile cfg={cfg} />;
  return <SignIn401k cfg={cfg} />;
}

function BrandBar({ cfg }: { cfg: SignInConfig }) {
  return (
    <div className="flex h-16 w-full items-center bg-[#1247ff] px-6 lg:px-10">
      {cfg.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cfg.logoUrl} alt={cfg.brandLabel ?? "logo"} className="h-7 w-auto" />
      ) : (
        <span className="text-2xl font-light tracking-tight text-white">
          {cfg.brandLabel ?? "WIPFLI"}
        </span>
      )}
      {cfg.brandSecondaryLabel ? (
        <>
          <span className="mx-4 h-6 w-px bg-white/40" aria-hidden />
          <span className="text-xl font-semibold tracking-tight text-white">
            {cfg.brandSecondaryLabel}
          </span>
        </>
      ) : null}
    </div>
  );
}

function SignIn401k({ cfg }: { cfg: SignInConfig }) {
  const submitColor = cfg.submitColor ?? "#1247ff";
  return (
    <section
      className="relative left-1/2 right-1/2 -mx-[50vw] flex min-h-screen w-screen flex-col bg-cover bg-center"
      style={cfg.backgroundImageUrl ? { backgroundImage: `url(${cfg.backgroundImageUrl})` } : undefined}
    >
      <BrandBar cfg={cfg} />

      {cfg.topText || cfg.mobileGuideLabel || cfg.appStoreImageUrl || cfg.googlePlayImageUrl ? (
        <div className="bg-white/85 px-6 py-3 text-center text-sm text-[#1247ff] backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
            {cfg.topText ? <span className="font-semibold">{cfg.topText}</span> : null}
            {cfg.mobileGuideLabel ? (
              <Link href={cfg.mobileGuideUrl ?? "#"} className="underline">
                {cfg.mobileGuideLabel}
              </Link>
            ) : null}
            <span className="flex items-center gap-3">
              {cfg.appStoreImageUrl ? (
                <Link href={cfg.appStoreUrl ?? "#"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cfg.appStoreImageUrl} alt="App Store" className="h-10 w-auto" />
                </Link>
              ) : null}
              {cfg.googlePlayImageUrl ? (
                <Link href={cfg.googlePlayUrl ?? "#"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cfg.googlePlayImageUrl} alt="Google Play" className="h-10 w-auto" />
                </Link>
              ) : null}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <form className="w-full max-w-md rounded-md bg-white/90 px-8 py-9 shadow-xl backdrop-blur">
          <h1 className="mb-6 text-3xl font-light text-[#1247ff]">{cfg.heading ?? "Welcome"}</h1>

          <label className="mb-1 block text-sm font-semibold text-gray-700">
            {cfg.emailLabel ?? "Username"}
          </label>
          <input
            type="text"
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
            <div className="mb-4 text-right">
              <Link href={cfg.forgotUrl ?? "#"} className="text-sm text-[#1247ff] hover:underline">
                {cfg.forgotLabel}
              </Link>
            </div>
          ) : null}

          {cfg.roleOptions && cfg.roleOptions.length > 0 ? (
            <>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                {cfg.roleLabel ?? "Role"}
              </label>
              <select
                className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#1247ff] focus:outline-none"
                defaultValue={cfg.roleOptions[0]}
              >
                {cfg.roleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </>
          ) : null}

          {cfg.rememberLabel ? (
            <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-4 w-4" />
              {cfg.rememberLabel}
            </label>
          ) : null}

          {cfg.infoParagraphs && cfg.infoParagraphs.length > 0 ? (
            <div className="mb-5 space-y-3 text-xs leading-5 text-gray-700">
              {cfg.infoParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white"
            style={{ background: submitColor, color: cfg.submitTextColor ?? "#fff" }}
          >
            {cfg.submitLabel ?? "LOGIN"}
          </button>
        </form>
      </div>

      {cfg.footerText ? (
        <div className="bg-[#1247ff] px-6 py-4 text-center text-sm text-white">
          {cfg.footerText}
        </div>
      ) : null}
    </section>
  );
}

function SignInHub({ cfg }: { cfg: SignInConfig }) {
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

function SignInShareFile({ cfg }: { cfg: SignInConfig }) {
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
