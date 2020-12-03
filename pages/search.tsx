import { flow, pipe } from 'fp-ts/lib/function';
import { Task } from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { Card, CardColumns, Col, Row } from 'react-bootstrap';
import CardTextCollapse from '../components/cardcollapse';
import { GallApi, SearchQuery } from '../libs/apitypes';
import { searchGalls } from '../libs/search';
import { handleFailure, mightFail } from '../libs/utils/util';

type Props = {
    data: GallApi[];
    query: SearchQuery;
};

const Search = ({ data }: Props): JSX.Element => {
    return (
        <div>
            <>
                <Row>
                    <Col>
                        <CardColumns className="m-2 p-2">
                            {data.map((gall) => (
                                <Card key={gall.id} className="shadow-sm">
                                    <Card.Img variant="top" width="200px" src="/images/gall.jpg" />
                                    <Card.Body>
                                        <Card.Title>
                                            <Link href={`gall/${gall.id}`}>
                                                <a>{gall.name}</a>
                                            </Link>
                                        </Card.Title>
                                        <CardTextCollapse text={gall.description} />
                                    </Card.Body>
                                </Card>
                            ))}
                        </CardColumns>
                    </Col>
                </Row>
            </>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context: { query: ParsedUrlQuery }) => {
    if (context === undefined || context.query === undefined) {
        throw new Error('Must pass a valid query object to Search!');
    }

    return {
        props: {
            data: await mightFail(searchGalls(context.query as SearchQuery)),
            query: { ...context.query },
        },
    };
};

export default Search;
