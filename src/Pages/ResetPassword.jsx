import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initialValues = {
        newPassword: '',
        confirmPassword: ''
    }

    const validationSchema = Yup.object({
        newPassword: Yup.string().required('New Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const handleSubmit = (value) => {
        console.log(value);
    }
    return (
        <>
            <div className="bg-[#EEF9FF] h-screen flex flex-col justify-center items-center">
                <img src={require('../../src/Image/logo.png')} alt="" className="w-40 h-40 mx-auto" />
                <div className='flex items-center justify-center'>
                    <div className="bg-white p-8 rounded-lg shadow-md  md:w-[500px] w-[300px]">
                        <h1 className='text-xl font-bold text-center text-[#002D4C] mb-1'>Reset Password</h1>
                        <p className='text-center mb-5 text-gray-400'>Reset your passowrd here!</p>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div className='mb-4 '>
                                    <div className='relative'>
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="s_form_imput"
                                        />
                                        <span className="absolute top-[33%] right-[2%] cursor-pointer text-gray-600" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>
                                    <ErrorMessage name="newPassword" component="div" className="s_input_error" />
                                </div>
                                <div className='mb-4 '>
                                    <div className='relative'>
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Enter confirm password"
                                            className="s_form_imput"
                                        />
                                        <span className="absolute top-[33%] right-[2%] cursor-pointer text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>
                                    <ErrorMessage name="confirmPassword" component="div" className="s_input_error" />
                                </div>
                                <button type='submit' className='bg-[#002D4C] text-white w-full py-2 rounded-md'>Reset Password</button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;