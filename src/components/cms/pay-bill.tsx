"use client";

import Link from "next/link";
import type { PayBillBlock } from "@/lib/cms/types";

type Props = {
  block: PayBillBlock;
  locale: "en" | "es";
};

export function PayBill({ block, locale }: Props) {
  const heading = block.heading ?? (locale === "en" ? "Sign In" : "Iniciar sesion");
  const introParagraphs = (block.introText ?? "").split(/\r?\n+/).filter((p) => p.trim());
  const usernameLabel = block.usernameLabel ?? (locale === "en" ? "Username" : "Usuario");
  const usernameHelper =
    block.usernameHelper ?? (locale === "en" ? "Username created at registration" : "");
  const passwordLabel = block.passwordLabel ?? (locale === "en" ? "Password" : "Contrasena");
  const passwordHelper =
    block.passwordHelper ?? (locale === "en" ? "Password created at registration" : "");
  const loginLabel = block.loginLabel ?? "Login";
  const forgotPasswordLabel =
    block.forgotPasswordLabel ?? (locale === "en" ? "Forgot your password?" : "Olvido contrasena?");
  const needHelpLabel = block.needHelpLabel ?? (locale === "en" ? "Need help?" : "Necesita ayuda?");
  const oneTimePaymentLabel = block.oneTimePaymentLabel ?? "One Time Payment";
  const registerLabel = block.registerLabel ?? "Register Now";

  return (
    <div
      data-chromeless="true"
      className="fixed inset-0 z-[100] overflow-y-auto bg-white"
    >
      <div className="border-b border-[#d1d5db] bg-white py-6">
        <div className="mx-auto max-w-[1100px] px-6">
          {block.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.logoUrl} alt={block.brandLabel ?? "Brand"} className="h-14" />
          ) : (
            <div className="inline-block bg-[#1554ff] px-8 py-3 text-xl font-bold uppercase tracking-wider text-white">
              {block.brandLabel ?? "SUMMIT ADVISORY GROUP"}
            </div>
          )}
        </div>
      </div>

      <div className="min-h-[calc(100vh-110px)] bg-[#ededed] px-6 py-10">
        <div className="mx-auto max-w-[360px]">
          <h1 className="mb-6 text-center text-[22px] font-normal text-[#374151]">{heading}</h1>

          {introParagraphs.length > 0 ? (
            <div className="mb-8 space-y-3 text-center text-[13px] leading-5 text-[#374151]">
              {introParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="paybill-username" className="block text-[13px] font-semibold text-[#0b1220]">
                {usernameLabel}
              </label>
              <input
                id="paybill-username"
                type="text"
                placeholder={usernameLabel}
                className="mt-1 w-full border border-[#9ca3af] bg-white px-3 py-2 text-sm focus:border-[#1554ff] focus:outline-none"
                autoComplete="username"
              />
              {usernameHelper ? (
                <p className="mt-1 text-[11px] italic text-[#6b7280]">{usernameHelper}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="paybill-password" className="block text-[13px] font-semibold text-[#0b1220]">
                {passwordLabel}
              </label>
              <input
                id="paybill-password"
                type="password"
                placeholder={passwordLabel}
                className="mt-1 w-full border border-[#9ca3af] bg-white px-3 py-2 text-sm focus:border-[#1554ff] focus:outline-none"
                autoComplete="current-password"
              />
              {passwordHelper ? (
                <p className="mt-1 text-[11px] italic text-[#6b7280]">{passwordHelper}</p>
              ) : null}
            </div>

            <div className="flex justify-center pt-3">
              <button
                type="submit"
                className="bg-[#f4791f] px-8 py-2 text-sm font-semibold text-white hover:bg-[#d96512]"
              >
                {loginLabel}
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-2 text-center text-[13px]">
            <Link
              href={block.forgotPasswordUrl ?? "#"}
              className="block !text-[#f4791f] underline hover:!text-[#d96512]"
              style={{ color: "#f4791f" }}
            >
              {forgotPasswordLabel}
            </Link>
            <Link
              href={block.needHelpUrl ?? "#"}
              className="block !text-[#f4791f] underline hover:!text-[#d96512]"
              style={{ color: "#f4791f" }}
            >
              {needHelpLabel}
            </Link>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={block.oneTimePaymentUrl ?? "#"}
              className="bg-[#f4791f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d96512]"
            >
              {oneTimePaymentLabel}
            </Link>
            <Link
              href={block.registerUrl ?? "#"}
              className="bg-[#f4791f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d96512]"
            >
              {registerLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
