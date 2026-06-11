import type { ReactNode } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { BookCover } from './BookCover.tsx';
import {
  BackFace,
  ClampedText,
  Face,
  Inner,
  Perspective,
  Spine,
  TitleStrip,
} from './BookFlipCard.styles.ts';

function stripHtml(html: string | null): string | null {
  if (!html) return null;
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent;
  return text?.trim() || null;
}

interface BookFlipCardProps {
  coverUrl: string | null;
  title: string;
  authors: string[];
  publishedYear: number | null;
  description: string | null;
  action?: ReactNode;
}

export function BookFlipCard({
  coverUrl,
  title,
  authors,
  publishedYear,
  description,
  action,
}: BookFlipCardProps) {
  const authorLine = authors.length > 0 ? authors.join(', ') : 'Unknown author';
  const blurb = stripHtml(description) ?? 'No description available.';

  return (
    <Perspective tabIndex={0} aria-label={title}>
      <Inner className="book-inner">
        <Face>
          <BookCover coverUrl={coverUrl} alt={title} />
          <Spine />
          <TitleStrip>
            <ClampedText
              variant="caption"
              lines={2}
              sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.25 }}
            >
              {title}
            </ClampedText>
          </TitleStrip>
        </Face>

        <BackFace>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }} gutterBottom>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {authorLine}
          </Typography>
          {publishedYear !== null && (
            <Chip label={publishedYear} size="small" sx={{ alignSelf: 'flex-start', mt: 1 }} />
          )}

          <ClampedText
            variant="caption"
            color="text.secondary"
            lines={5}
            sx={{ mt: 1.5, flexGrow: 1, minHeight: 0 }}
          >
            {blurb}
          </ClampedText>

          {action && <Box sx={{ mt: 1.5, flexShrink: 0 }}>{action}</Box>}
        </BackFace>
      </Inner>
    </Perspective>
  );
}
