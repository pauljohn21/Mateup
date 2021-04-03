/* eslint-disable no-case-declarations */
import { ApplicationPaths, LoginActions, QueryParameterNames } from '@/constants/ApiAuthorizationConstants';
import authService, { AuthenticationResultStatus } from '@/services/authorize';
import React from 'react';



export type LoginActionType = 'login' | 'login-callback' | 'login-failed' | 'profile' | 'register';

export interface LoginContainerProps {
    action: LoginActionType;
}

export interface LoginContainerState {
    message?: string | null;
}


class LoginContainer extends React.Component<LoginContainerProps, LoginContainerState>{
    constructor(props: LoginContainerProps) {
        super(props);
        this.state = {
            message: null
        };
    }

    componentDidMount() {
        const { action } = this.props;
        switch (action) {
            case LoginActions.Login:
                this.login(this.getReturnUrl());
                break;
            case LoginActions.LoginCallback:
                this.processLoginCallback();
                break;
            case LoginActions.LoginFailed:
                const params = new URLSearchParams(window.location.search);
                const error = params.get(QueryParameterNames.Message);
                this.setState({ message: error });
                break;
            case LoginActions.Profile:
                this.redirectToProfile();
                break;
            case LoginActions.Register:
                this.redirectToRegister();
                break;
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }

    async login(returnUrl: string) {
        const state = { returnUrl };
        const result = await authService.signIn(state);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                break;
            case AuthenticationResultStatus.Success:
                await this.navigateToReturnUrl(returnUrl);
                break;
            case AuthenticationResultStatus.Fail:
                this.setState({ message: result.message });
                break;
            default:
                throw new Error(`Invalid status result ${result.status}.`);
        }
    }

    async processLoginCallback() {
        const url = window.location.href;
        const result = await authService.completeSignIn(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeSignIn finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                await this.navigateToReturnUrl(this.getReturnUrl(result.state));
                break;
            case AuthenticationResultStatus.Fail:
                this.setState({ message: result.message });
                break;
            default:
                throw new Error(`Invalid authentication result status '${result.status}'.`);
        }
    }

    getReturnUrl(state?: { returnUrl: string }) {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get(QueryParameterNames.ReturnUrl);
        if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
        }
        return (state && state.returnUrl) || fromQuery || `${window.location.origin}/`;
    }

    redirectToRegister() {
        this.redirectToApiAuthorizationPath(`${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`);
    }

    redirectToProfile() {
        this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);
    }

    redirectToApiAuthorizationPath(apiAuthorizationPath: string) {
        const redirectUrl = `${window.location.origin}/${apiAuthorizationPath}`;
        // It's important that we do a replace here so that when the user hits the back arrow on the
        // browser they get sent back to where it was on the app instead of to an endpoint on this
        // component.
        window.location.replace(redirectUrl);
    }

    navigateToReturnUrl(returnUrl: string) {
        // It's important that we do a replace here so that we remove the callback uri with the
        // fragment containing the tokens from the browser history.
        window.location.replace(returnUrl);
    }

    render() {
        const { action } = this.props;
        const { message } = this.state;
        if (message) {
            return <div>{message}</div>
        }
        switch (action) {
            case LoginActions.Login:
                return (<div>Processing login</div>);
            case LoginActions.LoginCallback:
                return (<div>Processing login callback</div>);
            case LoginActions.Profile:
            case LoginActions.Register:
                return (<div></div>);
            default:
                throw new Error(`Invalid action '${action}'`);
        }

    }
}

export default LoginContainer;