import gql from "graphql-tag";

const USER_QUERY = gql`
  query getUsers($email: String) {
                users(where: {email: {_eq: $email}}) {
                  id
                }
              } 
`;
    /*let response = await this.$apollo.query({
          query: USER_QUERY,
          variables: {
            email: "sachet.singh@gmail.com",
          },
          fetchPolicy: "network-only",
        });*/
    