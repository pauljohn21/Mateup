import { Tracing } from "puppeteer-core";

declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
  routerBase: string;
}

declare let ga: () => void;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;


export interface PaginationParameter {
	currentPage: number;
	pageSize: number;
	sortBy?: string;
	orderBy?: string;
	q?: string;
}

export interface Secret {
  id: string;
  type: string;
  value: string;
  description: string;
  expiration?: Date;
}

export interface ApiResourceSecret extends Secret {
  apiResourcesId: string;
}

export interface UserClaim {
  type: string;
}

export interface ApiResourceScope {
  apiResourcesId: string;
  scope: string;
}

export interface ApiResourceClaim extends UserClaim {
  apiResourcesId: string;
}

export interface ApiResourceProperty {
  apiResourcesId: string;
  key: string;
  value: string;
}


export interface ApiResources {
  id: string;
  name: string;
  displayName: string;
  description: string;
  enabled: boolean;
  allowedAccessTokenSigningAlgorithms: string;
  showInDiscoveryDocument: boolean;
  secrets: ApiResourceSecret[];
  scopes: ApiResourceScope[];
  userClaims: ApiResourceClaim[];
  properties: ApiResourceProperty[];

}

export interface ApiScopeClaim extends UserClaim {
  apiScopeId: string;
}

export interface ApiScopeProperty {
  apiScopeId: string;
  key: string;
  value: string;
}

export interface ApiScope {
  enabled: boolean;
  name: string;
  displayName: string;
  description: string;
  required: boolean;
  emphasize: boolean;
  showInDiscoveryDocument: boolean;
  userClaims: ApiScopeClaim[];
  properties: ApiScopeProperty[];
}

export interface ClientScope {
  clientId: string;
  scope: string;
}

export interface ClientSecret extends Secret {
  clientId: string;
}

export interface ClientGrantType {
  clientId: string;
  grantType: string;
}

export interface ClientCorsOrigin {
  clientId: string;
  origin: string;
}

export interface ClientRedirectUri {
  clientId: string;
  redirectUri: string;
}

export interface ClientPostLogoutRedirectUri {
  clientId: string;
  postLogoutRedirectUri: string;
}

export interface ClientIdPRestriction {
  clientId: string;
  provider: string;
}

export interface ClientClaim {
  clientId: string;
  type: string;
  value: string;
}

export interface ClientProperty {
  clientId: string;
  key: string;
  value: string;
}


export interface Client {
  clientId: string;

  clientName: string;

  description: string;

  clientUri: string;

  logoUri: string;

  enabled: boolean;

  protocolType: boolean;

  requireClientSecret: boolean;

  requireConsent: boolean;

  allowRememberConsent: boolean;

  alwaysIncludeUserClaimsInIdToken: boolean;

  requirePkce: boolean;

  allowPlainTextPkce: boolean;

  requireRequestObject: boolean;

  allowAccessTokensViaBrowser: boolean;

  frontChannelLogoutUri: string;

  frontChannelLogoutSessionRequired: boolean;

  backChannelLogoutUri: string;

  backChannelLogoutSessionRequired: boolean;

  allowOfflineAccess: boolean;

  identityTokenLifetime: number;

  allowedIdentityTokenSigningAlgorithms: string;

  accessTokenLifetime: number;

  authorizationCodeLifetime: number;

  consentLifetime?: number;

  absoluteRefreshTokenLifetime: number;

  slidingRefreshTokenLifetime: number;

  refreshTokenUsage: number;

  updateAccessTokenClaimsOnRefresh: boolean;

  refreshTokenExpiration: number;

  accessTokenType: number;

  enableLocalLogin: boolean;

  includeJwtId: boolean;

  alwaysSendClientClaims: boolean;

  clientClaimsPrefix: string;

  pairWiseSubjectSalt: string;

  userSsoLifetime?: number;

  userCodeType: string;

  deviceCodeLifetime: number;

  allowedScopes: ClientScope[];

  clientSecrets: ClientSecret[];

  allowedGrantTypes: ClientGrantType[];

  allowedCorsOrigins: ClientCorsOrigin[];

  redirectUris: ClientRedirectUri[];

  postLogoutRedirectUris: ClientPostLogoutRedirectUri[]

  identityProviderRestrictions: ClientIdPRestriction[];

  claims: ClientClaim[]

  properties: ClientProperty[];
}

export interface IdentityResource {
  showInDiscoveryDocument: boolean;
  emphasize: boolean;
  required: boolean;
  enabled: boolean;
  id: string;
  description: string;
  displayName: Tracing;
  name: string;
  properties: IdentityResourceProperty[];
  userClaims: IdentityResourceClaim[];
}

export interface IdentityResourceProperty {
  identityResourceId: string;
  key: string;
  value: string;
}

export interface IdentityResourceClaim {

}