import { gql, useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import { GET_USER } from "../App";
import { client } from "../lib/apollo";

const CREATE_USER = gql`
    mutation ($name: String!) {
        createUser(name: $name) {
            id
            name
        }
    }
`

export function NewUserForm() {
    const [name, setName] = useState('');
    const [createUser, { data, loading, error}] = useMutation(CREATE_USER);

    async function handleCreateUser(event: FormEvent) {
        event.preventDefault();

        if (!name) {
            return;
        }

        await createUser({
            variables: {
                name,
            },


            // refetchQueries: [GET_USER], < -- Nova chamada HTTP para dar refetch na lista de inserts

            // Manipulando cache da página para atualizar valores
            update: (cache, { data: { createUser } }) => {
                const { users } = client.readQuery({ query: GET_USER })

                cache.writeQuery({
                    query: GET_USER,
                    data: {
                        users: [
                            ...users,
                            createUser,
                        ]
                    }
                })
            }
        })

        console.log(data)
    }

    return (
        <form onSubmit={handleCreateUser}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    )
}