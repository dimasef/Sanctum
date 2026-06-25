import type { SvgIconProps } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/HistoryEduOutlined';
import StarIcon from '@mui/icons-material/StarBorderOutlined';
import BookIcon from '@mui/icons-material/MenuBookOutlined';
import PublicIcon from '@mui/icons-material/PublicOutlined';
import ScienceIcon from '@mui/icons-material/ScienceOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeOutlined';
import BookmarkIcon from '@mui/icons-material/BookmarkBorderOutlined';
import type { ComponentType } from 'react';
import type { ShelfIconKey } from '../shelf/operations.ts';

const ICONS: Record<ShelfIconKey, ComponentType<SvgIconProps>> = {
  favorite: FavoriteIcon,
  history: HistoryIcon,
  star: StarIcon,
  book: BookIcon,
  public: PublicIcon,
  science: ScienceIcon,
  autoAwesome: AutoAwesomeIcon,
  bookmark: BookmarkIcon,
};

export function ShelfIcon({ icon, ...props }: { icon: string } & SvgIconProps) {
  const Icon = ICONS[icon as ShelfIconKey] ?? BookIcon;
  return <Icon {...props} />;
}
