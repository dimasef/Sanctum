import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { Avatar, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCameraOutlined';
import { ACCEPTED_IMAGE_TYPES } from '../lib/imageUpload.ts';
import { AvatarFrame, Overlay, Ring } from './AvatarUploader.styles.ts';

interface AvatarUploaderProps {
  src: string | null;
  name: string;
  uploading: boolean;
  onFileSelected: (file: File) => void;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function AvatarUploader({ src, name, uploading, onFileSelected }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    if (!uploading) inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  return (
    <AvatarFrame
      role="button"
      tabIndex={0}
      aria-label="Change avatar"
      aria-busy={uploading}
      onClick={open}
      onKeyDown={handleKeyDown}
    >
      <Ring />
      <Avatar
        src={src ?? undefined}
        alt={name}
        sx={{
          position: 'absolute',
          inset: 3,
          width: 'calc(100% - 6px)',
          height: 'calc(100% - 6px)',
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: '2.4rem',
          bgcolor: 'background.default',
          color: 'gilt.main',
        }}
      >
        {initials(name) || '?'}
      </Avatar>
      <Overlay>
        {uploading ? (
          <CircularProgress size={26} sx={{ color: '#f6ecd8' }} />
        ) : (
          <>
            <PhotoCameraIcon fontSize="small" />
            Change
          </>
        )}
      </Overlay>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        hidden
        onChange={handleChange}
      />
    </AvatarFrame>
  );
}
