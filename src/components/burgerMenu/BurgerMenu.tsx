import React from 'react';
import styled, { css } from 'styled-components';
import { burgerColor } from 'styles/Themes';
import { NodeInfo } from 'sections/navigation/nodeInfo/NodeInfo';
import { Navigation } from 'sections/navigation/Navigation';
import { SideSettings } from 'sections/navigation/sideSettings/SideSettings';

const StyledBurger = styled.div`
    padding: 16px;
    background-color: ${burgerColor};
    box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.1);
    ${({ open }: { open: boolean }) =>
        open &&
        css`
            margin-bottom: 16px;
        `}
`;

interface BurgerProps {
    open: boolean;
    setOpen: (state: boolean) => void;
}

export const BurgerMenu = ({ open, setOpen }: BurgerProps) => {
    return (
        <StyledBurger open={open}>
            <NodeInfo isBurger={true} />
            <Navigation isBurger={true} setOpen={setOpen} />
            <SideSettings isBurger={true} />
        </StyledBurger>
    );
};
