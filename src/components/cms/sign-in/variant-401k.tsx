import Link from "next/link";
import { BrandBar, type SignInConfig } from "./shared";

export function SignIn401k({ cfg }: { cfg: SignInConfig }) {
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
