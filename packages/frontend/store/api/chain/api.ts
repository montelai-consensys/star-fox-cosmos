import { Tally, TallyResponse } from '@consensys/star-fox-sdk';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chainApi = createApi({
  reducerPath: 'chainApi',
  //leaving out base query because it is dynamic depending on the chain
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    getTally: builder.query<
      Tally,
      { restEndpoint: string; proposalId: string }
    >({
      query: ({
        restEndpoint,
        proposalId,
      }: {
        restEndpoint: string;
        proposalId: string;
      }) => {
        console.debug(
          `[chainApi/getTally] endpoint: ${restEndpoint} id: ${proposalId}`
        );
        return `${restEndpoint}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`;
      },
      transformResponse: (rawResponse: TallyResponse): Tally =>
        rawResponse.tally,
    }),
  }),
});

export const { useGetTallyQuery } = chainApi;
