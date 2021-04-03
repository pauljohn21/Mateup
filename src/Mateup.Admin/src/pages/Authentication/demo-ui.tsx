import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import React from 'react';

import styles from './containers/index.less';

class DemoUI extends React.Component {
    render() {
        return <div className={styles.main}> <Result
            icon={<SmileOutlined />}
            title="Loggedout"
           
        />,</div>
    }
}

export default DemoUI;