/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Button, message,  Popconfirm, } from 'antd';
import type { ApiResourceSecret} from '@/typings';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getApiResourceSecrets, postApiResourceSecret, deleteApiResourceSecret,  } from '@/services/api-resources';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './Components/CreateApiPropertyForm';
import type { RouteComponentProps } from 'react-router';
import { SaveApiSecretViewModel } from './typings';

interface MatchParams {

    apiResourceId: string;
}



export type UserDetailProps = RouteComponentProps<MatchParams>


export interface UserDetailState {
    createModalVisible: boolean;
    updateModalVisible: boolean;
    updateFormValues: any;
    row?: ApiResourceSecret;
    selectedRowsState: ApiResourceSecret[];
}

class DetailApiResourceSecret extends React.Component<UserDetailProps, UserDetailState>{
    actionRef?: ActionType;

    columns: ProColumns<ApiResourceSecret>[];
    createColumns: ProColumns<SaveApiSecretViewModel>[];

    constructor(props: UserDetailProps) {
        super(props);

        this.state = {
            createModalVisible: false,
            updateModalVisible: false,
            updateFormValues: {},
            row: undefined,
            selectedRowsState: [],
        };


        this.columns = [
            {
                title: 'Type',
                dataIndex: 'type',
                valueType: 'text',
                valueEnum: {
                    
                }
            },
            {
                title: 'Value',
                dataIndex: 'value',
                valueType: 'text',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                valueType: 'text',
            },
            {
                title: 'Expiration',
                dataIndex: 'expiration',
                valueType: 'text',
            },
            {
                title: 'Action',
                dataIndex: 'option',
                valueType: 'option',
                render: (_, record) => (


                    <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={async () => {
                            await this.handleRemove(record);
                            this.actionRef?.reloadAndRest?.();
                        }}

                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                        >
                            Delete
                        </Button>
                    </Popconfirm>


                ),
            },
        ];

        
        this.createColumns = [
            {
                title: 'Type',
                dataIndex: 'type',
                valueType: 'text',
                valueEnum: {
                    'sharedSecret': 'SharedSecret',
                    'x509Thumbprint': 'x509Thumbprint',
                    'x509Name': 'x509Name',
                    'x509CerfiticateBase64':'x509CerfiticateBase64'
                }
            },
            {
                title: 'Value',
                dataIndex: 'value',
                valueType: 'text',
            },
            
            {
                title: 'Hash',
                dataIndex: 'Hash',
                valueType: 'text',
                valueEnum: {
                    0: 'Sha256',
                    1: 'Sha512'
                }
            },
            {
                title: 'Expiration',
                dataIndex: 'expiration',
                valueType: 'date',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                valueType: 'text',
            }
        ];
    }

    setRow = (apiresourcesecret?: ApiResourceSecret) => {
        this.setState({
            row: apiresourcesecret
        });
    }

    handleUpdateModalVisible = (visible: boolean) => {
        this.setState({
            updateModalVisible: visible
        });
    }

    setUpdateFormValues = (values: any) => {
        this.setState({
            updateFormValues: values
        });
    }

    handleCreateModalVisible = (visible: boolean) => {
        this.setState({
            createModalVisible: visible
        });
    }

    setSelectedRows = (selectedRow: ApiResourceSecret[]) =>
        this.setState({ selectedRowsState: selectedRow });

    handleQueryList = async (params: any, sorter: Record<string, any>): Promise<{ data: any; success: boolean; total: string | null; }> => {

        let queryParams = { ...params, currentPage: params.current };
        if (Object.keys(sorter).length > 0) {
            const sortBy = Object.keys(sorter)[0];
            const orderBy = sorter[sortBy];
            queryParams = { ...queryParams, sortBy, orderBy };
        }
        const { data, response } = await getApiResourceSecrets(this.props.match.params.apiResourceId, queryParams);

        return { data, success: response.ok, total: response.headers.get('x-pagination-count') };

    }

    handleAdd = async (fields: SaveApiSecretViewModel) => {
        console.log(fields);
        const hide = message.loading('Adding');
        try {
            await postApiResourceSecret(this.props.match.params.apiResourceId, { ...fields });
            hide();
            message.success('Added successfully');
            return true;
        } catch (error) {
            hide();
            message.error('Adding failed, please try again!');
            return false;
        }
    };


    handleRemove = async (selectedRow: ApiResourceSecret) => {

        const hide = message.loading('Deleting');
        if (!selectedRow) return true;
        try {
            await deleteApiResourceSecret(this.props.match.params.apiResourceId, selectedRow.type, selectedRow.value);
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
        return (<>
            <ProTable<ApiResourceSecret>
                headerTitle="Scopes"
                actionRef={(actionRef: ActionType) => { this.actionRef = actionRef }}
                rowKey="scope"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button type="primary" key="new" onClick={() => this.handleCreateModalVisible(true)}>
                        <PlusOutlined /> New
                    </Button>,
                ]}
                // @ts-ignore
                request={this.handleQueryList}
                columns={this.columns}
            // rowSelection={{
            //     onChange: (_, selectedRows) => this.setSelectedRows(selectedRows),
            // }}
            />

            <CreateForm onCancel={() => this.handleCreateModalVisible(false)} modalVisible={this.state.createModalVisible}>
                <ProTable<SaveApiSecretViewModel, SaveApiSecretViewModel>
                    onSubmit={async (value) => {
                        const success = await this.handleAdd(value);
                        if (success) {
                            this.handleCreateModalVisible(false);
                            if (this.actionRef) {
                                this.actionRef.reload();
                            }
                        }
                    }}
                    rowKey="key"
                    type="form"
                    columns={this.createColumns}
                />
            </CreateForm>

        </>)
    }
}

export default DetailApiResourceSecret;

