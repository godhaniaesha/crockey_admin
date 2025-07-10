import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];
    const navigate = useNavigate();

    const initialValues = {
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: ''
    };

    const validationSchema = Yup.object({
        otp1: Yup.string().required(),
        otp2: Yup.string().required(),
        otp3: Yup.string().required(),
        otp4: Yup.string().required()
    });

    const handleChange = (e, index, setFieldValue) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value)) {
            setFieldValue(`otp${index + 1}`, value);
            if (index < 3) inputRefs[index + 1].current.focus();
        } else if (value === '') {
            setFieldValue(`otp${index + 1}`, '');
        }
    };

    const handleSubmit = (values) => {
        const otp = values.otp1 + values.otp2 + values.otp3 + values.otp4;
        console.log("Submitted OTP:", otp);
    };

    const handleNavigate = () => {
        navigate('/resetPassword');
    }

    return (
        <div className="bg-[#EEF9FF] h-screen flex flex-col justify-center items-center">
            <img src={require('../../src/Image/logo.png')} alt="logo" className="w-40 h-40 mx-auto" />
            <div className='flex items-center justify-center'>
                <div className="bg-white p-8 rounded-lg shadow-md md:w-[420px] w-[300px]">
                    <h1 className='text-xl font-bold text-center text-[#002D4C] mb-1'>Email Verification</h1>
                    <p className='text-center mb-5 text-gray-400'>Code has been successfully sent to example@gmail.com</p>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ setFieldValue, errors }) => {
                            const otpError =
                                (errors.otp1) || (errors.otp2) || (errors.otp3) || ( errors.otp4);
                            return (
                                <Form>
                                  <div className='mb-5'>
                                      <div className='flex justify-between mb-1'>
                                        {[0, 1, 2, 3].map((i) => (
                                            <Field
                                                key={i}
                                                name={`otp${i + 1}`}
                                                innerRef={inputRefs[i]}
                                                maxLength="1"
                                                className="border border-gray-300 text-center text-xl rounded-md md:w-14 md:h-14 w-12 h-12 focus:outline-none focus:ring-2 focus:ring-[#002D4C]"
                                                onChange={(e) => handleChange(e, i, setFieldValue)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace') {
                                                        if (!e.target.value && i > 0) {
                                                            inputRefs[i - 1].current.focus();
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {otpError && (
                                        <div className="text-red-500 text-sm mb-2 text-center">
                                            Please enter all 4 digits
                                        </div>
                                    )}
                                  </div>

                                    <button
                                        type='submit'
                                        className='bg-[#002D4C] text-white w-full py-2 rounded-md mb-3'
                                        onClick={handleNavigate}
                                    >
                                        Verify
                                    </button>

                                    <div className='text-center text-sm text-gray-500'>
                                        Didn't receive code? <span className='text-[#002D4C] cursor-pointer'>Resend</span>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
