/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Button, message,  Popconfirm, } from 'antd';
import type { ApiResourceProperty} from '@/typings';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getApiResourceProperties, postApiResourceProperty, deleteApiResourceProperty,  } from '@/services/api-resources';
import { PlusOutlined } from '@ant-design/icons';
import CreateForm from './Components/CreateApiPropertyForm';
import type { RouteComponentProps } from 'react-router';

interface MatchParams {

    apiResourceId: string;
}



export type UserDetailProps = RouteComponentProps<MatchParams>


export interface UserDetailState {
    createModalVisible: boolean;
    updateModalVisible: boolean;
    updateFormValues: any;
    row?: ApiResourceProperty;
    selectedRowsState: ApiResourceProperty[];
}

class DetailApiResourceProperty extends React.Component<UserDetailProps, UserDetailState>{
    actionRef?: ActionType;

    columns: ProColumns<ApiResourceProperty>[];

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
                title: 'Key',
                dataIndex: 'key',
                valueType: 'text',
            },
            {
                title: 'Value',
                dataIndex: 'value',
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
    }

    setRow = (apiresourceproperty?: ApiResourceProperty) => {
        this.setState({
            row: apiresourceproperty
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

    setSelectedRows = (selectedRow: ApiResourceProperty[]) =>
        this.setState({ selectedRowsState: selectedRow });

    handleQueryList = async (params: any, sorter: Record<string, any>): Promise<{ data: any; success: boolean; total: string | null; }> => {

        let queryParams = { ...params, currentPage: params.current };
        if (Object.keys(sorter).length > 0) {
            const sortBy = Object.keys(sorter)[0];
            const orderBy = sorter[sortBy];
            queryParams = { ...queryParams, sortBy, orderBy };
        }
        const { data, response } = await getApiResourceProperties(this.props.match.params.apiResourceId, queryParams);

        return { data, success: response.ok, total: response.headers.get('x-pagination-count') };

    }

    handleAdd = async (fields: ApiResourceProperty) => {

        const hide = message.loading('Adding');
        try {
            await postApiResourceProperty(this.props.match.params.apiResourceId, { ...fields });
            hide();
            message.success('Added successfully');
            return true;
        } catch (error) {
            hide();
            message.error('Adding failed, please try again!');
            return false;
        }
    };


    handleRemove = async (selectedRow: ApiResourceProperty) => {

        const hide = message.loading('Deleting');
        if (!selectedRow) return true;
        try {
            await deleteApiResourceProperty(this.props.match.params.apiResourceId, selectedRow.key);
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
            <ProTable<ApiResourceProperty>
                headerTitle="Properties"
                actionRef={(actionRef: ActionType) => { this.actionRef = actionRef }}
                rowKey="key"
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
                <ProTable<ApiResourceProperty, ApiResourceProperty>
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
                    columns={this.columns}
                />
            </CreateForm>

        </>)
    }
}

export default DetailApiResourceProperty;

