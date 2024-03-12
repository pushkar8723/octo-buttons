import React, { useEffect, useState } from 'react';
import { GithubResp } from 'types/apidata';
import styled from 'styled-components';
import Exclamation from '../icons/Exclamation';
import Loading from '../icons/Loading';
import Github from '../icons/Github';

/** Formats number as per user's locale. If user locale is not available then defaults to English-US. */
const defaultFormatter = (count: number) => new Intl.NumberFormat(navigator?.language || 'en-US').format(count);

/** Props definitions */
type StarButtonProps = {
    /** Github Repository */
    repo: string;
    /** Font size for the text */
    fontSize?: number;
    /** Custom number formatter */
    formatter?: (count: number) => string;
    /** Width of the button */
    width?: number;
} & typeof defaultProps;

/** Default Props */
const defaultProps = {
    fontSize: 14,
    formatter: defaultFormatter,
    width: 130,
};

enum State {
    LOADING,
    SUCCESS,
    ERROR,
}

const Base = styled.span`
    padding: 5px;
    display: flex;
    align-items: center;
    background-color: var(--octo-btn-dark-highlight, rgb(55, 62, 71));
    transition: all 0.2s ease-in-out;
`;

const BtnLabel = styled(Base)`
    padding-left: 0;
    background-color: var(--octo-btn-dark-highlight, rgb(55, 62, 71));
    border-right: 1px solid var(--octo-btn-dark-border, #464e57);
    transition: all 0.2s ease-in-out;
    font-weight: bold;
    color: var(--octo-btn-dark-label-color, rgb(173, 186, 199));

    @media (prefers-color-scheme: light) {
        & {
            background-color: var(--octo-btn-light-highlight, rgb(246, 248, 250));
            border-color: var(--octo-btn-light-border, rgb(208, 215, 222));
            color: var(--octo-btn-light-label-color, #000);
        }
    }
`;

const BtnText = styled(Base)`
    background-color: transparent;
    text-align: center;
    flex: 1;
    justify-content: center;
    transition: all 0.2s ease-in-out;
`;

const Icon = styled(Base)`
    @media (prefers-color-scheme: light) {
        & {
            background-color: var(--octo-btn-light-highlight, rgb(246, 248, 250));
        }
    }
`;

const Btn = styled.a<{ fontSize: number; width: number }>`
    display: flex;
    padding: 0;
    background-color: var(--octo-btn-dark-bg, #333);
    border: 1px solid var(--octo-btn-dark-border, #464e57);
    color: var(--octo-btn-dark-color, rgb(173, 186, 199));
    border-radius: 0.375rem;
    font-size: ${(props) => props.fontSize}px;
    line-height: 1.5;
    overflow: hidden;
    width: ${(props) => props.width}px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    outline: none;

    &:focus,
    &:hover {
        outline: 2px solid var(--octo-btn-dark-outline, rgba(255, 255, 255, 0.5));
        color: var(--octo-btn-dark-color, rgb(173, 186, 199));
    }

    @media (prefers-color-scheme: light) {
        & {
            background-color: var(--octo-btn-light-bg, #fff);
            border-color: var(--octo-btn-light-border, rgb(208, 215, 222));
            color: var(--octo-btn-light-color, #000);
        }

        &:focus,
        &:hover {
            outline: 2px solid var(--octo-btn-light-outline, rgba(0, 0, 0, 0.2));
            color: var(--octo-btn-light-color, #000);
        }
    }
`;

/**
 * Github Star Button Component
 */
export default function StarButton(props: StarButtonProps) {
    const { repo, fontSize, formatter, width } = props;

    const [state, setState] = useState(State.LOADING);
    const [starCount, setStarCount] = useState('');

    useEffect(() => {
        if (repo) {
            fetch(`https://api.github.com/repos/${repo}`)
                .then((resp) => {
                    if (resp.ok) {
                        return resp.json();
                    }
                    throw new Error(`${resp.status} ${resp.statusText}`);
                })
                .then((data: GithubResp) => {
                    setStarCount(formatter(data.stargazers_count));
                    setState(State.SUCCESS);
                })
                .catch(() => {
                    setStarCount('Error');
                    setState(State.ERROR);
                });
        }
    }, [repo]);

    const renderCount = (count: string, currentState: State) => {
        switch (currentState) {
            case State.LOADING:
                return <Loading width={fontSize} height={fontSize} />;
            case State.ERROR:
                return <Exclamation width={fontSize} height={fontSize} />;
            default:
                return count;
        }
    };

    return (
        <Btn href={`https://github.com/${repo}`} target="_blank" type="button" rel="noreferrer noopener" fontSize={fontSize} width={width}>
            <Icon>
                <Github width={Math.floor(fontSize * 1.5)} height={Math.floor(fontSize * 1.5)} />
            </Icon>
            <BtnLabel>Star</BtnLabel>
            <BtnText>{renderCount(starCount, state)}</BtnText>
        </Btn>
    );
}

StarButton.defaultProps = defaultProps;
