import type { IconType } from "react-icons";
import {FaFacebookF,FaInstagram,FaLinkedinIn,FaTiktok,FaWhatsapp,FaXTwitter,FaYoutube,} from "react-icons/fa6";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "x"
  | "whatsapp";

export interface SocialPlatformOption {
  value: SocialPlatform;
  label: string;
  icon: IconType;
  brandColor: string;
  iconColor: string;
}

export const socialPlatformOptions: readonly SocialPlatformOption[] = [
  {
    value: "facebook",
    label: "Facebook",
    icon: FaFacebookF,
    brandColor: "#1877f2",
    iconColor: "#ffffff",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    brandColor: "#c13584",
    iconColor: "#ffffff",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedinIn,
    brandColor: "#0a66c2",
    iconColor: "#ffffff",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: FaYoutube,
    brandColor: "#ff0000",
    iconColor: "#ffffff",
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    brandColor: "#111111",
    iconColor: "#ffffff",
  },
  {
    value: "x",
    label: "X / Twitter",
    icon: FaXTwitter,
    brandColor: "#111111",
    iconColor: "#ffffff",
  },
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    brandColor: "#25d366",
    iconColor: "#ffffff",
  },
] as const;

const aliases: Record<string, SocialPlatform> = {
  twitter: "x",
  "x/twitter": "x",
  "x / twitter": "x",
  linkedinIn: "linkedin",
};

export const normalizeSocialPlatform = (
  value?: string | null,
): SocialPlatform | null => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  const aliased = aliases[normalized] ?? normalized;
  return socialPlatformOptions.some((option) => option.value === aliased)
    ? (aliased as SocialPlatform)
    : null;
};

export const getSocialPlatform = (value?: string | null) => {
  const platform = normalizeSocialPlatform(value);
  return platform
    ? (socialPlatformOptions.find((option) => option.value === platform) ??
        null)
    : null;
};
