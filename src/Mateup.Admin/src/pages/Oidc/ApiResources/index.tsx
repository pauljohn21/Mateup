/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Button, message, Space, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getApiResources, postApiResource, deleteApiResources } from '@/services/api-resources';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import CreateForm from './Components/CreateForm';
import type { ApiResources } from '@/typings';
import { FormValueType } from '@/pages/TableList/components/UpdateForm';



export interface IndexApiResourcesState {
    createModalVisible: boolean;

    row?: ApiResources;
    selectedRowsState: ApiResources[];
}

class IndexApiResources extends React.Component<{}, IndexApiResourcesState>{
    actionRef?: ActionType;

    columns: ProColumns<ApiResources>[];

    constructor(props: {}) {
        super(props);

        this.state = {
            createModalVisible: false,

            row: undefined,
            selectedRowsState: []
        };


        this.columns = [

            {
                title: 'Name',
                dataIndex: 'name',
                valueType: 'text',
            },

            {
                title: 'Action',
                dataIndex: 'option',
                valueType: 'option',
                render: (_, record) => (
                    <Space>

                        <Link to={`/configuration/api-resources/${record.id}`}>
                            <Button>
                                Edit
                            </Button>
                        </Link>
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

                    </Space>
                ),
            },
        ];
    }

    setRow = (lesson?: ApiResources) => {
        this.setState({
            row: lesson
        });
    }


    handleCreateModalVisible = (visible: boolean) => {
        this.setState({
            createModalVisible: visible
        });
    }

    setSelectedRows = (selectedRow: ApiResources[]) =>
        this.setState({ selectedRowsState: selectedRow });

    handleQueryList = async (params: any, sorter: Record<string, any>): Promise<{ data: any; success: boolean; total: string | null; }> => {

        let queryParams = { ...params, currentPage: params.current };
        if (Object.keys(sorter).length > 0) {
            const sortBy = Object.keys(sorter)[0];
            const orderBy = sorter[sortBy];
            queryParams = { ...queryParams, sortBy, orderBy };
        }
        const { data, response } = await getApiResources(queryParams);

        return { data, success: response.ok, total: response.headers.get('x-pagination-count') };

    }



    /**
     * 添加节点
     * @param fields
     */
    handleAdd = async (fields: FormValueType) => {

        const hide = message.loading('Adding');
        try {
            await postApiResource({ ...fields });
            hide();
            message.success('Added successfully');
            return true;
        } catch (error) {
            hide();
            message.error('Adding failed, please try again!');
            return false;
        }
    };



    handleRemove = async (selectedRow: ApiResources) => {

        const hide = message.loading('Deleting');
        if (!selectedRow) return true;
        try {
            await deleteApiResources(selectedRow.id);
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
            <ProTable<ApiResources>
                headerTitle="Lessons"
                actionRef={(actionRef: ActionType) => { this.actionRef = actionRef }}
                rowKey="id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button type="primary" key="new" onClick={() => this.handleCreateModalVisible(true)}>
                        <PlusOutlined /> New
                    </Button>,
                ]}
                // @ts-ignore`
                request={this.handleQueryList}
                columns={this.columns}
            // rowSelection={{
            //     onChange: (_, selectedRows) => this.setSelectedRows(selectedRows),
            // }}
            />

            <CreateForm onCancel={() => this.handleCreateModalVisible(false)} modalVisible={this.state.createModalVisible} onSubmit={async (value) => {
                const success = await this.handleAdd(value);
                if (success) {
                    this.handleCreateModalVisible(false);
                    if (this.actionRef) {
                        this.actionRef.reload();
                    }
                }
            }}>

            </CreateForm>



        </>)
    }
}

export default IndexApiResources;

