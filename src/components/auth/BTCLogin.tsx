import React, { useState, useEffect } from 'react';
import { SingleLine, Sub4Title } from '../../components/generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getConfigLnd, saveUserAuth, getAuthString } from '../../utils/auth';
import CryptoJS from 'crypto-js';
import { PasswordInput } from './Password';
import { toast } from 'react-toastify';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_CAN_CONNECT } from '../../graphql/query';
import { getErrorContent } from '../../utils/error';
import { useHistory } from 'react-router-dom';
import { ColorButton } from '../buttons/colorButton/ColorButton';
import { Input } from 'components/input/Input';

interface AuthProps {
    available: number;
    callback?: () => void;
    withRedirect?: boolean;
}

export const BTCLoginForm = ({
    available,
    callback,
    withRedirect,
}: AuthProps) => {
    const { setAccount } = useAccount();
    const { push } = useHistory();

    const [isName, setName] = useState('');
    const [isJson, setJson] = useState('');

    const [hasInfo, setHasInfo] = useState(false);
    const [isPass, setPass] = useState('');

    const [tryToConnect, { data, loading }] = useLazyQuery(GET_CAN_CONNECT, {
        onError: error => {
            setHasInfo(false);
            toast.error(getErrorContent(error));
        },
    });

    useEffect(() => {
        if (!loading && data && data.getNodeInfo && data.getNodeInfo.alias) {
            const { cert, macaroon, readMacaroon, host } = getConfigLnd(isJson);

            if (!host) {
                toast.error('Invalid connection credentials');
                return;
            }

            const encryptedAdmin =
                macaroon && isPass !== ''
                    ? CryptoJS.AES.encrypt(macaroon, isPass).toString()
                    : undefined;

            saveUserAuth({
                available,
                name: isName,
                host,
                admin: encryptedAdmin,
                read: readMacaroon,
                cert,
            });

            setAccount({
                loggedIn: true,
                host,
                admin: macaroon,
                read: readMacaroon,
                cert,
            });

            toast.success('Connected!');
            callback && callback();
            withRedirect && push('/');
        }
    }, [
        data,
        loading,
        available,
        callback,
        isJson,
        isName,
        isPass,
        setAccount,
        withRedirect,
        push,
    ]);

    const handleClick = () => {
        try {
            JSON.parse(isJson);
            setHasInfo(true);
        } catch (error) {
            toast.error('Invalid JSON Object');
        }
    };

    const handleConnect = () => {
        const { cert, readMacaroon, host } = getConfigLnd(isJson);

        if (!host) {
            toast.error('Invalid connection credentials');
            return;
        }

        tryToConnect({
            variables: { auth: getAuthString(host, readMacaroon, cert) },
        });
    };

    const renderContent = () => {
        const canConnect = isJson !== '' && !!available;
        return (
            <>
                <SingleLine>
                    <Sub4Title>Name:</Sub4Title>
                    <Input onChange={e => setName(e.target.value)} />
                </SingleLine>
                <SingleLine>
                    <Sub4Title>BTCPay Connect Url:</Sub4Title>
                    <Input onChange={e => setJson(e.target.value)} />
                </SingleLine>
                {canConnect && (
                    <ColorButton
                        disabled={!canConnect}
                        onClick={handleClick}
                        withMargin={'16px 0 0'}
                        fullWidth={true}
                        arrow={true}
                    >
                        Connect
                    </ColorButton>
                )}
            </>
        );
    };

    return hasInfo ? (
        <PasswordInput
            isPass={isPass}
            setPass={setPass}
            callback={handleConnect}
            loading={loading}
        />
    ) : (
        renderContent()
    );
};
