import React, { useEffect, useId, useState } from 'react';
import { GithubResp } from 'types/apidata';
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

/**
 * Github Star Button Component
 */
export default function StarButton(props: StarButtonProps) {
    const { repo, fontSize, formatter, width } = props;

    const styles: React.CSSProperties = {};

    const [state, setState] = useState(State.LOADING);
    const [starCount, setStarCount] = useState('');
    const id = useId();

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
        <a href={`https://github.com/${repo}`} target="_blank" id={id} type="button" style={styles} rel="noreferrer noopener">
            <style>
                {`
                #${CSS.escape(id)} {
                    display: flex;
                    justify-content: stretch;
                    align-items: center;
                    padding: 0;
                    background-color: #333;
                    border: 1px solid #464e57;
                    color: rgb(173, 186, 199);
                    border-radius: 0.375rem;
                    font-size: ${fontSize}px;
                    line-height: 1.5;
                    overflow: hidden;
                    width: ${width}px;
                    text-decoration: none;
                }

                #${CSS.escape(id)} > span {
                    padding: 5px;
                    display: flex;
                    align-items: center;
                    background-color: rgb(55, 62, 71);
                }
                
                #${CSS.escape(id)} > .btn-label {
                    padding-left: 0;
                    background-color: rgb(55, 62, 71);
                    border-right: 1px solid #464e57;
                }
                
                #${CSS.escape(id)} > .btn-text {
                    background-color: transparent;
                    text-align: center;
                    flex: 1;
                    justify-content: center;
                }

                @media (prefers-color-scheme: light) {
                    #${CSS.escape(id)} {
                        background-color: #fff;
                        border-color: rgb(208, 215, 222);
                        color: #000;
                    }

                    #${CSS.escape(id)} > span {
                        background-color: rgb(246, 248, 250);
                    }
                    
                    #${CSS.escape(id)} > .btn-label {
                        background-color: rgb(246, 248, 250);
                        border-color: rgb(208, 215, 222);
                    }
                }
                `}
            </style>
            <span className="btn-icon">
                <Github width={Math.floor(fontSize * 1.5)} height={Math.floor(fontSize * 1.5)} />
            </span>
            <span className="btn-label">Star</span>
            <span className="btn-text">{renderCount(starCount, state)}</span>
        </a>
    );
}

StarButton.defaultProps = defaultProps;
