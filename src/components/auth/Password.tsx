import React from 'react';
import { SingleLine, Sub4Title, SubTitle } from '../generic/Styled';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import { progressBackground } from '../../styles/Themes';
import { Loader } from '../generic/Icons';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { Input } from 'components/input/Input';

const Progress = styled.div`
    width: 80%;
    margin: 10px 10px 10px 15px;
    padding: 3px;
    border-radius: 15px;
    background: ${progressBackground};
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25),
        0 1px rgba(255, 255, 255, 0.08);
`;

interface ProgressBar {
    percent: number;
    barColor?: string;
}

const ProgressBar = styled.div`
    height: 10px;
    border-radius: 15px;
    background-image: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.3),
        rgba(0, 0, 0, 0.05)
    );
    background-color: ${({ barColor }: ProgressBar) =>
        barColor ? barColor : 'blue'};
    width: ${({ percent }: ProgressBar) => `${percent}%`};
`;

const getColor = (percent: number) => {
    switch (true) {
        case percent < 20:
            return '#ff4d4f';
        case percent < 40:
            return '#ff7a45';
        case percent < 60:
            return '#ffa940';
        case percent < 80:
            return '#bae637';
        case percent <= 100:
            return '#73d13d';
        default:
            return '';
    }
};

interface PasswordProps {
    isPass: string;
    setPass: (pass: string) => void;
    callback: () => void;
    loading: boolean;
}

export const PasswordInput = ({
    isPass,
    setPass,
    callback,
    loading = false,
}: PasswordProps) => {
    const strength = (100 * Math.min(zxcvbn(isPass).guesses_log10, 40)) / 40;
    const needed = 1;
    return (
        <>
            <SubTitle>Please Input a Password</SubTitle>
            <SingleLine>
                <Sub4Title>Password:</Sub4Title>
                <Input onChange={e => setPass(e.target.value)} />
            </SingleLine>
            <SingleLine>
                <Sub4Title>Strength:</Sub4Title>
                <Progress>
                    <ProgressBar
                        percent={strength}
                        barColor={getColor(strength)}
                    />
                </Progress>
            </SingleLine>
            {strength >= needed && !loading && (
                <ColorButton
                    disabled={strength < needed}
                    onClick={callback}
                    withMargin={'16px 0 0'}
                    fullWidth={true}
                    arrow={true}
                >
                    Connect
                </ColorButton>
            )}
            {loading && (
                <ColorButton disabled={true} color={'grey'}>
                    <Loader />
                </ColorButton>
            )}
        </>
    );
};
