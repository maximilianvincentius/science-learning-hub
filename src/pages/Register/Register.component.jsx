import AuthForm from '../../components/AuthForm';

const Register = () => (
  <div className="flex min-h-screen items-center justify-center bg-purple-primary p-4">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
      <AuthForm
        title="Register Account"
        showFullName
        showDateOfBirth
        showRememberMe
        submitText="Register"
        linkText="Already have an account? Sign In"
        linkHref="/login"
      />
    </div>
  </div>
);

export default Register;
