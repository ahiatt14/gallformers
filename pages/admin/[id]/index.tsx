import { GetServerSideProps } from 'next';
import * as O from 'fp-ts/lib/Option';
import Head from 'next/head';
import React from 'react';
import Auth from '../../../components/auth';
import { allHosts } from '../../../libs/db/host';
import { allFamilyIds, getAllSpeciesForSection, getFamiliesWithSpecies, taxonomyTreeForId } from '../../../libs/db/taxonomy';
import { getStaticPropsWith, getStaticPropsWithContext } from '../../../libs/pages/nextPageHelpers';
import { mightFail, mightFailWithArray } from '../../../libs/utils/util';
import { allGalls } from '../../../libs/db/gall';

type Props = {
    data: unknown[];
};

const Tester = ({ data }: Props): JSX.Element => {
    return (
        <Auth>
            <>
                <Head>
                    <title>Tester</title>
                </Head>
                <p>Count: {data.length}</p>
                <pre>{JSON.stringify(data, null, '  ')}</pre>
            </>
        </Auth>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    // const data = await getStaticPropsWithContext(context, allFamilyIds, 'TEST', true, true);
    const data = await getStaticPropsWith(getFamiliesWithSpecies(true), 'gall families');
    // const data = await mightFail(() => O.none)(taxonomyTreeForId(55));
    return {
        props: {
            data: data,
        },
    };
};

export default Tester;