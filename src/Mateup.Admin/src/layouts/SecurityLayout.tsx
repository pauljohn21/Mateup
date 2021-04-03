import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import type { ConnectProps } from 'umi';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import type { ConnectState } from '@/models/connect';
import type { CurrentUser } from '@/models/user';
import { Profile } from 'oidc-client';
import authService from '@/services/authorize';

type SecurityLayoutProps = {
  loading?: boolean;
  currentUser?: Profile;
} & ConnectProps;

type SecurityLayoutState = {
  isReady: boolean;
  subscriptionId?: number;
};

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
    subscriptionId: undefined
  };

  componentDidMount() {

    const subscriptionId = authService.subscribe(this.onLogout);

    this.setState({
      isReady: true,
      subscriptionId
    });


    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  async onLogout() {
    const isLogout = await authService.isAuthenticated();
    const { dispatch } = this.props;
    if (!isLogout && dispatch) {
      dispatch({
        type: 'user/saveCurrentUser',
        payload: {}
      });
    }
  }

  componentWillUnmount() {
    if (this.state.subscriptionId) {

      authService.unsubscribe(this.state.subscriptionId);
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = currentUser && currentUser.sub;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/authentication/login') {
      return <Redirect to={`/authentication/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
