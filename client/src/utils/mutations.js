import { gql } from '@apollo/client';

export const CREATE_USER = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            username
            email
        }
    }
}
`;

export const LOGIN_USER = gql`
mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
}
`;

export const SAVE_BOOK = gql`
mutation Mutation($authors: [String]!, $description: String!, $bookId: String!, $image: String!, $link: String!, $title: String!) {
    saveBook(authors: $authors, description: $description, bookId: $bookId, image: $image, link: $link, title: $title) {
      _id
      username
      email
      password
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
}
`;

export const REMOVE_BOOK = gql`
mutation Mutation($bookId: String!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      email
      password
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
}
`;