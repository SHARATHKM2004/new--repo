import type { Block } from "@/lib/cms/types";
import type { OptimizelyJsonBlock } from "./optimizely-block-type";
import {
  getImageAlt,
  getImageSource,
  getPlaceholderCardHref,
  getRichTextValue,
  getVideoSource,
  inferVideoMode,
  toSlugSegment,
} from "./text-helpers";

export function mapMarketingBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  switch (block.__typename) {
    case "StoryBlock": {
      const body = [block.story, ...(block.highlights ?? []).map((item) => `- ${item}`)].filter(
        (value): value is string => Boolean(value?.trim()),
      );

      return body.length
        ? {
            type: "richText",
            title: block._metadata?.displayName?.trim() || undefined,
            body,
          }
        : null;
    }
    case "ServicesBlock": {
      const cards = (block.services ?? [])
        .map((item) => {
          const title = item.title?.trim();
          const body = item.description?.trim();
          const icon = item.icon?.trim();

          if (!title || !body) {
            return null;
          }

          return {
            eyebrow: icon,
            title,
            body,
            href: item.href?.trim() || getPlaceholderCardHref(title, icon),
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      return cards.length
        ? {
            type: "cardGrid",
            title: block.title ?? "Services",
            cards,
          }
        : null;
    }
    case "TestimonialsBlock": {
      const cards = (block.testimonials ?? [])
        .map((item) => {
          const body = item.content?.trim();
          if (!body) {
            return null;
          }

          return {
            eyebrow: item.fullName?.trim(),
            title: item.position?.trim() || "Testimonial",
            body,
            href: "/en",
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      return cards.length
        ? {
            type: "cardGrid",
            title: block.title ?? "Testimonials",
            cards,
          }
        : null;
    }
    case "PortfolioGridBlock": {
      const cards = (block.items ?? [])
        .map((item) => {
          const title = item.title?.trim();
          const body = item.description?.trim();

          if (!title || !body) {
            return null;
          }

          return {
            title,
            body,
            href: item.link?.trim() || "/en",
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      return cards.length
        ? {
            type: "cardGrid",
            title: block.title ?? "Portfolio",
            cards,
          }
        : null;
    }
    case "ProfileBlock": {
      const body = [block.bio?.trim()].filter((value): value is string => Boolean(value));

      return body.length
        ? {
            type: "richText",
            body: [`${block.name ?? "Profile"}${block.title ? ` - ${block.title}` : ""}`, ...body],
          }
        : null;
    }
    case "ParagraphTextElement": {
      const html = block.paragraph_text?.html?.trim();
      if (!html) {
        return null;
      }

      return {
        type: "html",
        html,
      };
    }
    case "ImageBlock":
    case "MediaImageBlock":
    case "ImageSectionBlock": {
      const src = getImageSource(block);

      if (!src) {
        return null;
      }

      return {
        type: "image",
        src,
        alt: getImageAlt(block, block.title?.trim() || fallbackTitle),
        caption: block.caption?.trim() || block.description?.trim() || undefined,
      };
    }
    case "VideoBlock":
    case "VideoEmbedBlock":
    case "MediaVideoBlock": {
      const src = getVideoSource(block);

      if (!src) {
        return null;
      }

      return {
        type: "video",
        src,
        title: block.title?.trim() || fallbackTitle || "Video",
        caption: block.caption?.trim() || block.description?.trim() || undefined,
        poster: block.posterImageUrl?.trim() || undefined,
        mode: inferVideoMode(src),
      };
    }
    default: {
      const imageSrc = getImageSource(block);

      if (imageSrc) {
        return {
          type: "image",
          src: imageSrc,
          alt: getImageAlt(block, block.title?.trim() || fallbackTitle),
          caption: block.caption?.trim() || block.description?.trim() || undefined,
        };
      }

      const videoSrc = getVideoSource(block);

      if (videoSrc) {
        return {
          type: "video",
          src: videoSrc,
          title: block.title?.trim() || fallbackTitle || "Video",
          caption: block.caption?.trim() || block.description?.trim() || undefined,
          poster: block.posterImageUrl?.trim() || undefined,
          mode: inferVideoMode(videoSrc),
        };
      }

      const html = block.html?.trim();

      if (html) {
        return {
          type: "html",
          html,
        };
      }

      // Fallback: any block carrying rich text / body / text fields becomes a richText block
      const richCandidates = [
        block.richText,
        block.RichText,
        block.body,
        block.Body,
        block.text,
        block.Text,
        block.description,
        block.content,
      ];
      for (const candidate of richCandidates) {
        const value = getRichTextValue(candidate);
        if (value) {
          const paragraphs = value
            .split(/\r?\n+/)
            .map((p) => p.trim())
            .filter(Boolean);
          if (paragraphs.length) {
            return {
              type: "richText",
              title: block.title?.trim() || block._metadata?.displayName?.trim() || undefined,
              body: paragraphs,
            };
          }
        }
      }

      return null;
    }
  }
}
