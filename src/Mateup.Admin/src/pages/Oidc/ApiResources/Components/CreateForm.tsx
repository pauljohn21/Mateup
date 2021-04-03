import React, { useState } from 'react';
import { Button, Form, Input,Modal, Select, Switch } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import type { ApiResources } from '@/typings';

interface CreateFormProps {
    onCancel: (flag?: boolean, formVals?: FormValueType) => void;
    onSubmit: (values: FormValueType) => void;
    modalVisible: boolean;
}

const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
};


export type FormValueType = Partial<ApiResources>



const CreateForm: React.FC<CreateFormProps> = (props) => {
    const { onSubmit, modalVisible, onCancel } = props;

    const [formVals, setFormVals] = useState<FormValueType>({
        name: '',
        displayName: '',
        description: '',
        enabled: true,
        userClaims: []
    });


    const basicClaims: string[] = ["zoneinfo", "website", "updated_at", "profile", "preferred_username", "picture", "nickname", "name", "middle_name", "locate", "given_name", "gender", "family_name", "birthdate", "address"];

    const options: any[] = [];
    basicClaims.forEach(claim => {
        options.push({ value: claim })
    });

    const [form] = Form.useForm();


    const handleNext = async () => {
        const fieldsValue = await form.validateFields();

        setFormVals({ ...formVals, ...fieldsValue });


        onSubmit({ ...formVals, ...fieldsValue });

    };

    const renderFooter = () => {

        return (
            <>
                <Button onClick={() => onCancel(false, undefined)}>Cancel</Button>
                <Button type="primary" onClick={() => handleNext()}>
                    Next
                </Button>
            </>
        );
    };

    return (
        <Modal
            destroyOnClose
            title="Api Resources"
            visible={modalVisible}
            onCancel={() => onCancel()}
            footer={renderFooter()}
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
        >
            <Form
                {...formLayout}
                layout='inline'
                form={form}
                initialValues={{
                    name: '',
                    displayName: '',
                    description: '',
                    enabled: true,
                    userClaims: []
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


                <FormItem name="enabled" label="Enabled">
                    <Switch />
                </FormItem >

                <FormItem name="userClaims" label="User Claims">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="User Claims" options={options} />


                </FormItem >

            </Form>
        </Modal>
    );
};

export default CreateForm;
