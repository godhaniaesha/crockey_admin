import React from 'react';
import { FaShieldAlt, FaUserSecret, FaLock, FaRegClock, FaEnvelope, FaExchangeAlt } from 'react-icons/fa';
import '../style/d_style.css';

const sections = [
  {
    icon: <FaShieldAlt className="d_PP-timeline-icon" style={{ color: '#254D70' }} />,
    title: 'Your Privacy Matters',
    content: (
      <>
        <p>We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our services.</p>
        <ul className="d_PP-list">
          <li>We never sell your data to third parties.</li>
          <li>We use industry-standard security measures to protect your data.</li>
        </ul>
      </>
    )
  },
  {
    icon: <FaUserSecret className="d_PP-timeline-icon" style={{ color: '#254D70' }} />,
    title: 'Information We Collect',
    content: (
      <>
        <ul className="d_PP-list">
          <li><b>Personal Information:</b> Name, email address, phone number, shipping and billing address.</li>
          <li><b>Order Details:</b> Products purchased, payment method (never your full card details), and transaction history.</li>
          <li><b>Usage Data:</b> Pages visited, time spent on site, and device/browser information.</li>
          <li><b>Cookies:</b> For site functionality and analytics. You can control cookies via your browser settings.</li>
        </ul>
      </>
    )
  },
  {
    icon: <FaLock className="d_PP-timeline-icon" style={{ color: '#254D70' }} />,
    title: 'How We Use Your Information',
    content: (
      <>
        <ul className="d_PP-list">
          <li>To process and deliver your orders.</li>
          <li>To communicate with you about your account or orders (e.g., order confirmations, shipping updates).</li>
          <li>To improve our website and services based on usage analytics.</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>
      </>
    )
  },
  {
    icon: <FaExchangeAlt className="d_PP-timeline-icon" style={{ color: '#254D70' }} />,
    title: 'Sharing Your Information',
    content: (
      <>
        <ul className="d_PP-list">
          <li>Trusted service providers (e.g., payment processors, shipping partners) as needed to fulfill your orders.</li>
          <li>Authorities if required by law or to protect our rights and users.</li>
        </ul>
      </>
    )
  },
  {
    icon: <FaRegClock className="d_PP-timeline-icon" style={{ color: '#254D70' }} />,
    title: 'Data Retention',
    content: (
      <>
        <ul className="d_PP-list">
          <li>We retain your information only as long as necessary to provide you with our services and fulfill your orders.</li>
          <li>We comply with legal, tax, or regulatory requirements.</li>
        </ul>
      </>
    )
  },
  {
    icon: <FaEnvelope className="d_PP-timeline-icon" style={{ color: '#254D70' }} />,
    title: 'Contact Us',
    content: (
      <>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@crockey.com" className="d_PP-link">support@crockey.com</a>.</p>
      </>
    )
  },
];

function PrivacyPolicy() {
  return (
    <div className="d_PP-bg min-h-screen w-full flex flex-col items-center justify-start py-6 px-6 ">
      <div className="d_PP-timeline-card w-full max-w-4xl mx-auto">
        <h1 className="d_PP-title text-center mb-6">Privacy Policy</h1>
        <div className="d_PP-timeline px-1 lg:px-6">
          {sections.map((section, idx) => (
            <div className="d_PP-timeline-step" key={idx}>
              <div className="d_PP-timeline-dot-wrap">
                <span className="d_PP-timeline-dot">{section.icon}</span>
                {idx !== sections.length - 1 && <span className="d_PP-timeline-line" />}
              </div>
              <div className="d_PP-timeline-content">
                <h2 className="d_PP-section-title">{section.title}</h2>
                <div className="d_PP-section-content">{section.content}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="d_PP-footer text-center mt-6 mb-2">&copy; {new Date().getFullYear()} Crockey Admin. All rights reserved.</div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
