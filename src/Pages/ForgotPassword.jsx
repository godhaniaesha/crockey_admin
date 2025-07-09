import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const ForgotPassword = () => {

    const navigate = useNavigate();

    const initialValues = {
        email: ''
    }
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const handleSubmit = (values) => {
        console.log(values);
        navigate('/emailVerification');
    }
    return (
        <>
            <div className="bg-[#EEF9FF] h-screen flex flex-col justify-center items-center">
                <img src={require('../../src/Image/logo.png')} alt="" className="w-40 h-40 mx-auto" />
                <div className='flex items-center justify-center'>
                    <div className="bg-white p-8 rounded-lg shadow-md  md:w-[500px] w-[300px]">
                        <h1 className='text-xl font-bold text-center text-[#002D4C] mb-1'>Forgot Password</h1>
                        <p className='text-center mb-5 text-gray-400'>Enter your mail to change your passowrd</p>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div className='mb-4'>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="s_form_imput"
                                    />
                                    <ErrorMessage name="email" component="div" className='s_input_error' />
                                </div>
                                <button type='submit' className='bg-[#002D4C] text-white w-full py-2 rounded-md'>Send OTP</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;