/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type { User, UserManagerSettings } from 'oidc-client';
import { UserManager, WebStorageStateStore } from 'oidc-client';
import { ApplicationName } from '@/constants/ApiAuthorizationConstants';
import { setAuthority } from '@/utils/authority';

type Action = {
    callback: () => void,
    subscription: number
}

export type AuthorizeState = {
    returnUrl: string;
    message?: string;
}

type SignInResponse = {
    state?: AuthorizeState;
    status: string;
    message?: string;
}

export class AuthorizeService {
    callbacks: Action[] = [];
    nextSubscriptionId: number = 0;
    user: User | null = null;
    _isAuthenticated: boolean = false;

    // By default pop ups are disabled because they don't work properly on Edge.
    // If you want to enable pop up authentication simply set this flag to false.
    popUpDisabled: boolean = true;
    userManager: UserManager;

    constructor() {




        const settings: UserManagerSettings = {
            authority: 'https://localhost:44354',
            scope: 'Mateup role email phone openid',
            client_id: 'Mateup_Blazor',
            redirect_uri: 'https://localhost:44307/authentication/login-callback',
            post_logout_redirect_uri: 'https://localhost:44307/authentication/logout-callback',
            response_type: 'code',
            automaticSilentRenew: true,
            includeIdTokenInSilentRenew: true,
            userStore: new WebStorageStateStore({
                prefix: ApplicationName
            })

        };


        this.userManager = new UserManager(settings);

        this.userManager.events.addUserSignedOut(async () => {
            await this.userManager.removeUser();
            this.updateState(null);
        });
    }

    async isAuthenticated() {
        const user = await this.getUser();
        return !!user;
    }

    async getUser() {
        if (this.user && this.user.profile) {
            return this.user.profile;
        }


        const user = await this.userManager.getUser();
        return user && user.profile;
    }

    async getAccessToken() {

        const user = await this.userManager.getUser();
        return user && user.access_token;
    }

    // We try to authenticate the user in three different ways:
    // 1) We try to see if we can authenticate the user silently. This happens
    //    when the user is already logged in on the IdP and is done using a hidden iframe
    //    on the client.
    // 2) We try to authenticate the user using a PopUp Window. This might fail if there is a
    //    Pop-Up blocker or the user has disabled PopUps.
    // 3) If the two methods above fail, we redirect the browser to the IdP to perform a traditional
    //    redirect flow.
    async signIn(state: AuthorizeState): Promise<SignInResponse> {

        try {
            const silentUser = await this.userManager.signinSilent(this.createArguments());
            this.updateState(silentUser);
            return this.success(state);
        } catch (silentError) {
            // User might not be authenticated, fallback to popup authentication
            console.log("Silent authentication error: ", silentError);

            try {
                if (this.popUpDisabled) {
                    throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService.popUpDisabled\' to false to enable it.')
                }

                const popUpUser = await this.userManager.signinPopup(this.createArguments());
                this.updateState(popUpUser);
                return this.success(state);
            } catch (popUpError) {
                if (popUpError.message === "Popup window closed") {
                    // The user explicitly cancelled the login action by closing an opened popup.
                    return this.error("The user closed the window.");
                } if (!this.popUpDisabled) {
                    console.log("Popup authentication error: ", popUpError);
                }

                // PopUps might be blocked by the user, fallback to redirect
                try {
                    await this.userManager.signinRedirect(this.createArguments(state));
                    return this.redirect();
                } catch (redirectError) {
                    console.log("Redirect authentication error: ", redirectError);
                    return this.error(redirectError);
                }
            }
        }
    }

    async completeSignIn(url: string) {
        try {

            const user = await this.userManager.signinCallback(url);
            this.updateState(user);
            return this.success(user && user.state);
        } catch (error) {
            console.log('There was an error signing in: ', error);
            return this.error('There was an error signing in.');
        }
    }

    // We try to sign out the user in two different ways:
    // 1) We try to do a sign-out using a PopUp Window. This might fail if there is a
    //    Pop-Up blocker or the user has disabled PopUps.
    // 2) If the method above fails, we redirect the browser to the IdP to perform a traditional
    //    post logout redirect flow.
    async signOut(state: AuthorizeState): Promise<SignInResponse> {

        try {
            if (this.popUpDisabled) {
                throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService.popUpDisabled\' to false to enable it.')
            }

            await this.userManager.signoutPopup(this.createArguments());
            this.updateState(null);
            return this.success(state);
        } catch (popupSignOutError) {
            console.log("Popup signout error: ", popupSignOutError);
            try {
                await this.userManager.signoutRedirect(this.createArguments(state));
                return this.redirect();
            } catch (redirectSignOutError) {
                console.log("Redirect signout error: ", redirectSignOutError);
                return this.error(redirectSignOutError);
            }
        }
    }

    async completeSignOut(url: string) {

        try {
            const response = await this.userManager.signoutCallback(url);
            this.updateState(null);
            return this.success(response && response!.state);
        } catch (error) {
            console.log(`There was an error trying to log out '${error}'.`);
            return this.error(error);
        }
    }

    updateState(user: User | null) {
        this.user = user;
        this._isAuthenticated = !!this.user;
        console.log(user);
        setAuthority(user?.profile.role);
        this.notifySubscribers();
    }

    subscribe(callback: () => void) {
        this.callbacks.push({ callback, subscription: this.nextSubscriptionId += 1 });
        return this.nextSubscriptionId - 1;
    }

    unsubscribe(subscriptionId: number) {
        const subscriptionIndex = this.callbacks
            .map((element, index) => element.subscription === subscriptionId ? { found: true, index } : { found: false })
            .filter(element => element.found === true);
        if (subscriptionIndex.length !== 1) {
            throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
        }

        this.callbacks.splice(subscriptionIndex[0].index!, 1);
    }

    notifySubscribers() {
        for (let i = 0; i < this.callbacks.length; i += 1) {
            const { callback } = this.callbacks[i];
            callback();
        }
    }

    createArguments(state?: AuthorizeState) {
        return { useReplaceToNavigate: true, data: state };
    }

    error(message: string): SignInResponse {
        return { status: AuthenticationResultStatus.Fail, message };
    }

    success(state?: any): SignInResponse {
        return { status: AuthenticationResultStatus.Success, state };
    }

    redirect() {
        return { status: AuthenticationResultStatus.Redirect };
    }



    static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;

export const AuthenticationResultStatus = {
    Redirect: 'redirect',
    Success: 'success',
    Fail: 'fail'
};
