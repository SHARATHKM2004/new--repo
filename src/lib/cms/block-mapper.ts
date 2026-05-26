import type { Block } from "@/lib/cms/types";
import { mapContentBlock } from "./block-mapper-content";
import { mapMarketingBlock } from "./block-mapper-marketing";
import type { OptimizelyJsonBlock } from "./optimizely-block-type";

export function mapOptimizelyBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  return (
    mapContentBlock(block, fallbackTitle) ??
    mapMarketingBlock(block, fallbackTitle)
  );
}

export function mapOptimizelyBlocks(
  blocks: OptimizelyJsonBlock[] | undefined,
  fallbackTitle?: string,
) {
  return (blocks ?? [])
    .map((block) => mapOptimizelyBlock(block, fallbackTitle))
    .filter((block): block is Block => Boolean(block));
}
