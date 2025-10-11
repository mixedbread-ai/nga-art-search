import type { Position } from "@/lib/types";

function checkOverlap(
  rect1: { x: number; y: number; size: number },
  rect2: { x: number; y: number; width: number; height: number },
  padding = 0
): boolean {
  return !(
    rect1.x + rect1.size + padding < rect2.x ||
    rect1.x > rect2.x + rect2.width + padding ||
    rect1.y + rect1.size + padding < rect2.y ||
    rect1.y > rect2.y + rect2.height + padding
  );
}

function halton(index: number, base: number): number {
  let result = 0;
  let f = 1 / base;
  let i = index;

  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }

  return result;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function generateRandomPositions(count: number, seed = 0): Position[] {
  if (count === 0) {
    return [];
  }

  const positions: Position[] = [];
  const padding = 20; // Desired space between items
  const minSize = 180;
  const maxSize = 280;
  const marginLeft = 15;
  const marginRight = 15;
  

  const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
  const vh = typeof window !== "undefined" ? window.innerHeight : 1080;

  // Account for header height
  const pagePaddingTop = vw >= 640 ? 56 : 48;
  const marginTop = pagePaddingTop + 10;
  const marginBottom = 10;

  const availableWidth = Math.max(0, vw - marginLeft - marginRight);
  const availableHeight = Math.max(0, vh - marginTop - marginBottom);

  const exclusionZone = {
    x: vw / 2 - 225 - padding,
    y: vh / 2 - 125 - padding,
    width: 450 + padding * 2,
    height: 250 + padding * 2,
  };

  const maxAttemptMultiplier = 60;

  for (let index = 0; index < count; index++) {
    let attempt = 0;
    let candidate: Position | null = null;

    while (attempt < maxAttemptMultiplier) {
      const sequenceIndex = index * 97 + attempt + seed * 53 + 1;
      const sizeNorm = halton(sequenceIndex, 5);
      const dimensionCap = Math.max(
        1,
        Math.min(availableWidth, availableHeight)
      );
      const maxAllowedSize = Math.min(maxSize, dimensionCap);
      const minPreferredSize = Math.max(120, Math.min(minSize, maxAllowedSize));
      const minAllowedSize = Math.min(minPreferredSize, maxAllowedSize);
      const sizeRange = Math.max(0, maxAllowedSize - minAllowedSize);
      const jitterWindow =
        sizeRange > 0 ? sizeRange * 0.25 : maxAllowedSize * 0.1;
      const baseSize = minAllowedSize + sizeNorm * sizeRange;
      const size = clamp(
        baseSize + (Math.random() - 0.5) * jitterWindow,
        minAllowedSize,
        maxAllowedSize
      );

      const xNorm = halton(sequenceIndex, 2);
      const yNorm = halton(sequenceIndex, 3);

      const maxX = Math.max(0, availableWidth - size);
      const maxY = Math.max(0, availableHeight - size);

      const jitterX = (Math.random() - 0.5) * padding;
      const jitterY = (Math.random() - 0.5) * padding;

      const x = marginLeft + xNorm * maxX + jitterX;
      const y = marginTop + yNorm * maxY + jitterY;

      const proposed = {
        x: clamp(x, marginLeft, vw - marginRight - size),
        y: clamp(y, marginTop, vh - marginBottom - size),
        size,
      };

      const overlapsImages = positions.some((pos) =>
        checkOverlap(
          proposed,
          { x: pos.x, y: pos.y, width: pos.size, height: pos.size },
          padding
        )
      );

      const overlapsExclusion = checkOverlap(proposed, exclusionZone, padding);

      if (!overlapsImages && !overlapsExclusion) {
        candidate = proposed;
        break;
      }

      attempt++;
    }

    if (candidate) {
      positions.push(candidate);
      continue;
    }

    const fallbackSize = clamp(
      minSize,
      120,
      Math.min(maxSize, Math.min(availableWidth, availableHeight))
    );

    let fallbackPos: Position | null = null;
    let fallbackAttempts = 0;

    while (fallbackAttempts < 30 && !fallbackPos) {
      const testPos = {
        x:
          marginLeft +
          Math.random() * Math.max(0, availableWidth - fallbackSize),
        y:
          marginTop +
          Math.random() * Math.max(0, availableHeight - fallbackSize),
        size: fallbackSize,
      };

      const overlapsImages = positions.some((pos) =>
        checkOverlap(
          testPos,
          { x: pos.x, y: pos.y, width: pos.size, height: pos.size },
          padding
        )
      );

      if (!overlapsImages && !checkOverlap(testPos, exclusionZone, padding)) {
        fallbackPos = testPos;
      }

      fallbackAttempts++;
    }

    if (fallbackPos) {
      positions.push(fallbackPos);
    } else {
      const fallbackIndex = positions.length;
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const centerX = marginLeft + availableWidth / 2;
      const centerY = marginTop + availableHeight / 2;
      const maxRadiusX =
        Math.max(availableWidth - fallbackSize, fallbackSize) / 2;
      const maxRadiusY =
        Math.max(availableHeight - fallbackSize, fallbackSize) / 2;
      const spiralAttempts = Math.max(count * 5, 60);
      let relaxedCandidate: Position | null = null;

      for (let attempt = 0; attempt < spiralAttempts; attempt++) {
        const sequenceIndex = fallbackIndex + attempt;
        const normalized =
          count > 1 ? Math.min(1, sequenceIndex / Math.max(count - 1, 1)) : 0;
        const radiusScale = Math.sqrt(normalized);
        const angle = sequenceIndex * goldenAngle;
        const offsetX = Math.cos(angle) * maxRadiusX * radiusScale;
        const offsetY = Math.sin(angle) * maxRadiusY * radiusScale;

        const candidate = {
          x: clamp(
            centerX + offsetX - fallbackSize / 2,
            marginLeft,
            vw - marginRight - fallbackSize
          ),
          y: clamp(
            centerY + offsetY - fallbackSize / 2,
            marginTop,
            vh - marginBottom - fallbackSize
          ),
          size: fallbackSize,
        } satisfies Position;

        const overlapsExclusion = checkOverlap(
          candidate,
          exclusionZone,
          padding
        );

        if (overlapsExclusion) {
          continue;
        }

        const overlapsImages = positions.some((pos) =>
          checkOverlap(
            candidate,
            { x: pos.x, y: pos.y, width: pos.size, height: pos.size },
            padding * 0.5
          )
        );

        if (!overlapsImages) {
          fallbackPos = candidate;
          break;
        }

        if (!relaxedCandidate) {
          relaxedCandidate = candidate;
        }
      }

      const defaultFallback = (() => {
        const candidatePositions: Position[] = [
          {
            x: clamp(
              exclusionZone.x + exclusionZone.width / 2 - fallbackSize / 2,
              marginLeft,
              vw - marginRight - fallbackSize
            ),
            y: clamp(
              exclusionZone.y - fallbackSize - padding,
              marginTop,
              vh - marginBottom - fallbackSize
            ),
            size: fallbackSize,
          },
          {
            x: clamp(
              exclusionZone.x + exclusionZone.width / 2 - fallbackSize / 2,
              marginLeft,
              vw - marginRight - fallbackSize
            ),
            y: clamp(
              exclusionZone.y + exclusionZone.height + padding,
              marginTop,
              vh - marginBottom - fallbackSize
            ),
            size: fallbackSize,
          },
          {
            x: clamp(
              exclusionZone.x - fallbackSize - padding,
              marginLeft,
              vw - marginRight - fallbackSize
            ),
            y: clamp(
              exclusionZone.y + exclusionZone.height / 2 - fallbackSize / 2,
              marginTop,
              vh - marginBottom - fallbackSize
            ),
            size: fallbackSize,
          },
          {
            x: clamp(
              exclusionZone.x + exclusionZone.width + padding,
              marginLeft,
              vw - marginRight - fallbackSize
            ),
            y: clamp(
              exclusionZone.y + exclusionZone.height / 2 - fallbackSize / 2,
              marginTop,
              vh - marginBottom - fallbackSize
            ),
            size: fallbackSize,
          },
        ];

        const firstSafeCandidate = candidatePositions.find(
          (candidate) => !checkOverlap(candidate, exclusionZone, padding)
        );

        if (firstSafeCandidate) {
          return firstSafeCandidate;
        }

        return {
          x: clamp(marginLeft, marginLeft, vw - marginRight - fallbackSize),
          y: clamp(marginTop, marginTop, vh - marginBottom - fallbackSize),
          size: fallbackSize,
        } satisfies Position;
      })();

      positions.push(fallbackPos ?? relaxedCandidate ?? defaultFallback);
    }
  }

  return positions;
}
