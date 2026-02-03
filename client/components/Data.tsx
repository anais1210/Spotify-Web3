"use client";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
const query = gql`
  {
    artists(first: 5) {
      id
      address
      albums {
        id
      }
      totalAlbums
    }
    albums(first: 5) {
      id
      address
      name
      symbol
    }
  }
`;
const url =
  "https://api.studio.thegraph.com/query/1724437/harmony/version/latest";
const headers = { Authorization: "Bearer {5204039d99a75b77919e865715c517a5}" };
export default function Data() {
  // the data is already pre-fetched on the server and immediately available here,
  // without an additional network call
  const { data } = useQuery({
    queryKey: ["data"],
    async queryFn() {
      return await request(url, query, {}, headers);
    },
  });
  return <div>{JSON.stringify(data ?? {})}</div>;
}
