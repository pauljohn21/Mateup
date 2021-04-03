/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Button, message, Space, Popconfirm, Row, Form, Switch, Select, Input, Card, Col } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteApiResource, getApiResource } from '@/services/api-resources';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import CreateForm from './Components/CreateForm';
import type { RouteComponentProps } from 'react-router';
import type { ApiResources } from '@/typings';
import type { FormValueType } from '@/pages/TableList/components/UpdateForm';
import { GridContent, PageContainer } from '@ant-design/pro-layout';
import FormItem from 'antd/lib/form/FormItem';

interface MatchParams {

    apiResourceId: string;
}



export type IndexApiResourcesProps = RouteComponentProps<MatchParams>

export interface IndexApiResourcesState {
    createModalVisible: boolean;
    data?: ApiResources;
}
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
class IndexApiResources extends React.Component<IndexApiResourcesProps, IndexApiResourcesState>{
    actionRef?: ActionType;



    constructor(props: IndexApiResourcesProps) {
        super(props);

        this.state = {
            createModalVisible: false,
            data: undefined

        };



    }

    async componentDidMount() {
        const { data, response } = await getApiResource(this.props.match.params.apiResourceId);
        if (response.ok) {
            this.setState({
                data
            });
        }
    }







    handleRemove = async (selectedRow: ApiResources) => {

        const hide = message.loading('Deleting');
        if (!selectedRow) return true;
        try {
            await deleteApiResource(selectedRow.id);
            hide();
            message.success('Deleted successfully and will refresh soon');
            return true;
        } catch (error) {
            hide();
            message.error('Deletion failed, please try again');
            return false;
        }
    };



    render() {
        const { data } = this.state;

        const options: any[] = [];

        const basicClaims: string[] = ["zoneinfo", "website", "updated_at", "profile", "preferred_username", "picture", "nickname", "name", "middle_name", "locate", "given_name", "gender", "family_name", "birthdate", "address"];


        basicClaims.forEach(claim => {
            options.push({ value: claim })
        });

        return (<PageContainer>
            <Card title="Api Resource" loading={!data}>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    layout="vertical"
                 

                    initialValues={{
                        name: data?.name,
                        displayName: data?.displayName,
                        description: data?.description,
                        enabled: data?.enabled,
                        userClaims: data?.userClaims.map(x => x.type)
                    }}
                >


                    <FormItem name="name" label="Name">
                        <Input placeholder="Name" />
                    </FormItem >

                    <FormItem name="displayName" label="Display Name">
                        <Input style={{ width: '100%' }} placeholder="Display Name" />
                    </FormItem >

                    <FormItem name="description" label="Description">
                        <Input style={{ width: '100%' }} placeholder="Description" />
                    </FormItem >

                    <FormItem label="Scopes">
                        <Link to={`/configuration/api-resources/${data?.id}/scopes`}>
                            <Button type="primary" >Manage Api Scopes</Button>
                        </Link>
                    </FormItem >

                    <FormItem label="Secrets">
                        <Link to={`/configuration/api-resources/${data?.id}/secrets`}>
                            <Button type="primary" >Manage Api Secrets</Button>
                        </Link>
                    </FormItem >

                    <FormItem label="Properties ">
                        <Link to={`/configuration/api-resources/${data?.id}/properties`}>
                            <Button type="primary" >Manage Api Resource Properties</Button>
                        </Link>
                    </FormItem >

                    <FormItem name="enabled" label="Enabled" valuePropName="checked">
                        <Switch />
                    </FormItem >

                    <FormItem name="userClaims" label="User Claims">
                        <Select mode="tags" style={{ width: '100%' }} placeholder="User Claims" options={options} />


                    </FormItem >
                    <Form.Item {...tailLayout}>
                        <Row gutter={8}>
                            <Col>
                                <Button type="primary" htmlType="submit">
                                    Save Api Resource
                                </Button>
                            </Col>
                            <Col>
                                <Button danger htmlType="button" onClick={() => this.handleRemove(this.state.data!)}>
                                    Delete Api Resource
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Card>


        </PageContainer>)
    }
}

export default IndexApiResources;

