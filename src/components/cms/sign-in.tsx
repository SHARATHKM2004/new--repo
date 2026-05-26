import dynamic from "next/dynamic";
import type { Locale, SignInBlock } from "@/lib/cms/types";
import { parseConfig } from "./sign-in/shared";

type Props = { block: SignInBlock; locale: Locale };

// Lazy-load each variant so only the one being rendered ships to the client.
const SignIn401k = dynamic(() =>
  import("./sign-in/variant-401k").then((m) => m.SignIn401k),
);
const SignInHub = dynamic(() =>
  import("./sign-in/variant-hub").then((m) => m.SignInHub),
);
const SignInShareFile = dynamic(() =>
  import("./sign-in/variant-sharefile").then((m) => m.SignInShareFile),
);

export function SignIn({ block }: Props) {
  const cfg = parseConfig(block.configJson);
  if (block.variant === "hub") return <SignInHub cfg={cfg} />;
  if (block.variant === "sharefile") return <SignInShareFile cfg={cfg} />;
  return <SignIn401k cfg={cfg} />;
}
