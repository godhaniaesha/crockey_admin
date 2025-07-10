import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    });

    const handleSubmit = (values) => {
        console.log(values);

    }

    return (
        <>
            <div className="bg-[#EEF9FF] h-screen flex flex-col justify-center items-center">
                <img src={require('../../src/Image/logo.png')} alt="" className="w-40 h-40 mx-auto" />
                <div className='flex items-center justify-center'>
                    <div className="bg-white p-8 rounded-lg shadow-md md:w-[500px] w-[300px]">
                        <h1 className='text-xl font-bold mb-4 text-center text-[#002D4C]'>Login to account</h1>
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

                                <div className='mb-4 '>
                                    <div className='relative'>
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter password"
                                            className="s_form_imput"
                                        />
                                        <span className="absolute top-[33%] right-[2%] cursor-pointer text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="s_input_error" />
                                </div>
                                <div className='text-right mb-4'>
                                    <Link to={'/forgotPassword'} className="text-sm text-red-500 font-medium">Forgot Password?</Link>
                                </div>
                                <button type='submit' className='bg-[#002D4C] text-white w-full py-2 rounded-md'>Login</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;