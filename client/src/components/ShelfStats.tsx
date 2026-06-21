import { Fragment } from 'react';
import { Typography } from '@mui/material';
import { Divider, Stat, StatNumber, Strip } from './ShelfStats.styles.ts';

interface ShelfStatsProps {
  reading: number;
  wantToRead: number;
  read: number;
}

export function ShelfStats({ reading, wantToRead, read }: ShelfStatsProps) {
  const cells = [
    { label: 'Reading', value: reading },
    { label: 'Want to read', value: wantToRead },
    { label: 'Read', value: read },
    { label: 'Volumes', value: reading + wantToRead + read },
  ];

  return (
    <Strip>
      {cells.map((cell, index) => (
        <Fragment key={cell.label}>
          {index > 0 && <Divider />}
          <Stat>
            <StatNumber>{cell.value}</StatNumber>
            <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
              {cell.label}
            </Typography>
          </Stat>
        </Fragment>
      ))}
    </Strip>
  );
}
