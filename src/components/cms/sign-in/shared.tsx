export type SignInConfig = {
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

export function parseConfig(raw?: string): SignInConfig {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as SignInConfig) : {};
  } catch {
    return {};
  }
}

export function BrandBar({ cfg }: { cfg: SignInConfig }) {
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
