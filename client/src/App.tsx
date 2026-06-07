import { gql, type TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import './App.css';

type BooksData = { books: { id: string; title: string }[] };

const BOOKS: TypedDocumentNode<BooksData> = gql`
  query Books {
    books {
      id
      title
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(BOOKS);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Books
      </Typography>
      <List>
        {data?.books.map((b) => (
          <ListItem key={b.id}>
            <ListItemText primary={b.title} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
