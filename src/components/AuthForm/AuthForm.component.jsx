// @flow

import { useState } from 'react';
import { Button, DatePicker, Form, Input, Typography, Modal } from 'antd';

import { publicApi } from '../../api';
import { routes } from '../../constants';

import { style as authFormStyle, hiddenButton } from './AuthForm.component.style';

const { Text } = Typography;
const {
  backendRoutes: { login: loginEndpoint, register: registerEndpoint }
} = routes;

const _getLoginFormProps = () => ({
  title: 'Welcome Back!',
  showFullName: false,
  showDateOfBirth: false,
  showRememberMe: true,
  submitText: 'Login',
  linkText: '"Don\'t have an account? Register"'
});

const _getRegisterFormProps = () => ({
  title: 'Create Account',
  showFullName: true,
  showDateOfBirth: true,
  showRememberMe: false,
  submitText: 'Register',
  linkText: 'Already have an account? Login'
});

const _getRegistrationFormValues = ({ fullName, dateOfBirth, email, password }) => ({
  fullName,
  dateOfBirth: dateOfBirth ? dateOfBirth.format('YYYY-MM-DD') : null,
  email,
  password
});

const _getLoginFormValues = ({ email, password }) => ({
  email,
  password
});

const _handleOnSubmit =
  (isLoginFormType, setIsAuthenticated, hideModalFunc, setErrorMsg, form, login) => async (values) => {
    let formValues = _getLoginFormValues(values);
    let routesEndpoint = loginEndpoint;

    if (!isLoginFormType) {
      formValues = _getRegistrationFormValues(values);
      routesEndpoint = registerEndpoint;
    }

    try {
      const { data } = await publicApi.post(routesEndpoint, formValues);

      if (data?.token) {
        login(true, data);
        hideModalFunc();
        setErrorMsg('');
      }
    } catch (error) {
      console.error('Error during authentication:', error.response.data.message);
      setErrorMsg(error.response.data.message || 'An error occurred. Please try again.');
    }

    form.resetFields();
  };

/**
 *
 * @param props
 */
const AuthForm = (props) => {
  const { hideModalFunc, isLoginForm, setIsAuthenticated, login } = props;

  const [isLoginFormType, setIsLoginFormType] = useState(isLoginForm);
  const [errorMsg, setErrorMsg] = useState('');
  const [form] = Form.useForm();
  const formProps = isLoginFormType ? _getLoginFormProps() : _getRegisterFormProps();
  const { title, showFullName, showDateOfBirth, showRememberMe, submitText, linkText } = formProps;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const toggleFormType = () => {
    setIsLoginFormType(!isLoginFormType);
    setErrorMsg('');
  };

  return (
    <Modal
      title={title}
      open={true}
      onCancel={hideModalFunc}
      okButtonProps={hiddenButton}
      cancelButtonProps={hiddenButton}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={_handleOnSubmit(isLoginFormType, setIsAuthenticated, hideModalFunc, setErrorMsg, form, login)}
      >
        {showFullName && (
          <Form.Item label="Full Name" name="fullName">
            <Input size="large" placeholder="Enter your full name" />
          </Form.Item>
        )}

        {showDateOfBirth && (
          <Form.Item label="Date of Birth" name="dateOfBirth">
            <DatePicker style={authFormStyle.datePicker} size="large" placeholder="Select your date of birth" />
          </Form.Item>
        )}

        <Form.Item label="Email" name="email">
          <Input size="large" placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item label="Password" name="password" className="mb-2">
          <Input.Password size="large" placeholder="Enter your password" />
        </Form.Item>
        <span className="text-red-600 text-sm mb-5 inline-block">{errorMsg}</span>

        {/* {showRememberMe && (
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>
        )} */}

        <Form.Item>
          <Button type="primary" className="bg-[#FF385C] hover:!bg-[#E00B41] w-full" htmlType="submit" size="large">
            {submitText}
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-5">
        <Text type="secondary">
          <button type="button" className="text-gray-600 underline" onClick={toggleFormType}>
            {linkText}
          </button>
        </Text>
      </div>
    </Modal>
  );
};

// AuthForm.propTypes = AuthFormPropTypes;

export default AuthForm;
