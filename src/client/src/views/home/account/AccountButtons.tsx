import { useState } from 'react';
import { Link, X, Zap, Sun } from 'react-feather';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Card } from '../../../components/generic/Styled';
import { mediaWidths } from '../../../styles/Themes';
import styled from 'styled-components';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/Payment';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';
import { PegInEcashCard } from './pegInEcash/PegInEcash';
import { PegOutEcashCard } from './pegOutEcash/PegOutEcash';
import { useGatewayState } from '../../../context/GatewayContext';

const SECTION_COLOR = '#FFD300';

const S = {
  grid: styled.div<{ federations: number }>`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: ${({ federations }) =>
      federations > 0 ? '1fr 1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr'};
    margin-bottom: 32px;

    @media (${mediaWidths.modifiedMobile}) {
      grid-template-columns: 1fr 1fr;
    }
  `,
};

export const AccountButtons = () => {
  const [state, setState] = useState<string>('none');
  const { gatewayInfo } = useGatewayState();

  const renderContent = () => {
    switch (state) {
      case 'send_ln':
        return <PayCard setOpen={() => setState('none')} />;
      case 'receive_ln':
        return <CreateInvoiceCard color={SECTION_COLOR} />;
      case 'send_chain':
        return <SendOnChainCard setOpen={() => setState('none')} />;
      case 'receive_chain':
        return <ReceiveOnChainCard />;
      case 'pegout_ecash':
        return <PegOutEcashCard setOpen={() => setState('none')} />;
      case 'pegin_ecash':
        return <PegInEcashCard />;
      default:
        return null;
    }
  };

  return (
    <>
      <S.grid federations={gatewayInfo?.federations.length || 0}>
        <ColorButton
          withBorder={state === 'send_ln'}
          onClick={() => setState(state === 'send_ln' ? 'none' : 'send_ln')}
        >
          {state === 'send_ln' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Zap size={18} color={SECTION_COLOR} />
          )}
          Send
        </ColorButton>
        <ColorButton
          withBorder={state === 'receive_ln'}
          onClick={() =>
            setState(state === 'receive_ln' ? 'none' : 'receive_ln')
          }
        >
          {state === 'receive_ln' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Zap size={18} color={SECTION_COLOR} />
          )}
          Receive
        </ColorButton>
        <ColorButton
          withBorder={state === 'send_chain'}
          onClick={() =>
            setState(state === 'send_chain' ? 'none' : 'send_chain')
          }
        >
          {state === 'send_chain' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Link size={18} color={SECTION_COLOR} />
          )}
          Send
        </ColorButton>
        <ColorButton
          withBorder={state === 'receive_chain'}
          onClick={() =>
            setState(state === 'receive_chain' ? 'none' : 'receive_chain')
          }
        >
          {state === 'receive_chain' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Link size={18} color={SECTION_COLOR} />
          )}
          Receive
        </ColorButton>
        {gatewayInfo?.federations && gatewayInfo?.federations.length > 0 && (
          <ColorButton
            withBorder={state === 'pegout_ecash'}
            onClick={() =>
              setState(state === 'pegout_ecash' ? 'none' : 'pegout_ecash')
            }
          >
            {state === 'pegout_ecash' ? (
              <X size={18} color={SECTION_COLOR} />
            ) : (
              <Sun size={18} color={SECTION_COLOR} />
            )}
            Peg Out
          </ColorButton>
        )}
        {gatewayInfo?.federations && gatewayInfo?.federations.length > 0 && (
          <ColorButton
            withBorder={state === 'pegin_ecash'}
            onClick={() =>
              setState(state === 'pegin_ecash' ? 'none' : 'pegin_ecash')
            }
          >
            {state === 'pegin_ecash' ? (
              <X size={18} color={SECTION_COLOR} />
            ) : (
              <Sun size={18} color={SECTION_COLOR} />
            )}
            Peg In
          </ColorButton>
        )}
      </S.grid>
      {state !== 'none' && <Card>{renderContent()}</Card>}
    </>
  );
};
