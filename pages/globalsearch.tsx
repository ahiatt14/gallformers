import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { Card, CardColumns, ListGroup } from 'react-bootstrap';
import CardTextCollapse from '../components/cardcollapse';
import { GallTaxon, SpeciesApi } from '../libs/apitypes';
import { getSpecies } from '../libs/db/species';
import { entriesWithLinkedDefs, EntryLinked } from '../libs/glossary';
import { deserialize } from '../libs/utils/reactserialize';
import { mightFail } from '../libs/utils/util';

type Props = {
    species: SpeciesApi[];
    glossary: EntryLinked[];
};

const speciesLink = (species: SpeciesApi) => {
    if (species.taxoncode === GallTaxon) {
        return (
            <Link href={`gall/${species.id}`}>
                <a>{species.name}</a>
            </Link>
        );
    } else {
        return (
            <Link href={`host/${species.id}`}>
                <a>{species.name}</a>
            </Link>
        );
    }
};

const glossaryEntries = (entries: EntryLinked[]) => {
    if (entries.length > 0) {
        return (
            <ListGroup>
                {entries.map((e) => (
                    <ListGroup.Item key={e.word}>
                        {e.word} - {deserialize(e.linkedDefinition)}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    } else {
        return undefined;
    }
};

const GlobalSearch = ({ species, glossary }: Props): JSX.Element => {
    if (species.length == 0 && glossary.length == 0) {
        return <h1>No results</h1>;
    }

    return (
        <div>
            {glossaryEntries(glossary)}
            <CardColumns className="m-2 p-2">
                {species.map((species) => (
                    <Card key={species.id} className="shadow-sm">
                        <Card.Img variant="top" width="200px" src="/images/gall.jpg" />
                        <Card.Body>
                            <Card.Title>{speciesLink(species)}</Card.Title>
                            <CardTextCollapse text={species.description === null ? '' : species.description} />
                        </Card.Body>
                    </Card>
                ))}
            </CardColumns>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context: { query: ParsedUrlQuery }) => {
    const search = context.query.searchText as string;
    // add wildcards to search phrase
    const q = `%${search}%`;

    const species = () =>
        getSpecies(
            [
                { name: { contains: q } },
                { speciessource: { some: { description: { contains: q } } } },
                { commonnames: { contains: q } },
                { synonyms: { contains: q } },
            ],
            false,
        );

    const filterDefinitions = (entries: readonly EntryLinked[]): EntryLinked[] =>
        entries.filter((e) => e.word === search || e.definition.includes(search));

    // eslint-disable-next-line prettier/prettier
    const glossary = await pipe(
        entriesWithLinkedDefs(),
        TE.map(filterDefinitions),
    )();

    return {
        props: {
            species: await mightFail(species()),
            glossary: glossary,
        },
    };
};

export default GlobalSearch;
