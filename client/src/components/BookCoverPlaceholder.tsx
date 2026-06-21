import { Cloth, Mark, Rule, Title } from './BookCoverPlaceholder.styles.ts';

export function BookCoverPlaceholder({ title }: { title: string }) {
  return (
    <Cloth>
      <Mark>✦</Mark>
      <Title>{title}</Title>
      <Rule />
    </Cloth>
  );
}
