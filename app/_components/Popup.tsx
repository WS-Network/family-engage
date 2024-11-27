import React, { useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Popup.css";

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false); // State to toggle between pages

  const handlePopupSubmit = () => {
    if (!birthDate || !acceptedTerms) {
      alert("Please complete all fields before proceeding.");
      return;
    }

    console.log("Birthdate:", birthDate);
    console.log("Accepted Terms:", acceptedTerms);

    // Close the popup
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        {showTerms ? (
          // Terms and Conditions View
          <div className="terms-content">
            <h2>Terms and Conditions</h2>
            <pre style={{ whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: "300px" }}>
              {`Effective Date: December 12, 2024
Family Engage is dedicated to protecting the privacy of all its users, particularly children under the age of 13 in the United States (in compliance with COPPA) and children under the age of 16 in the European Union (in compliance with GDPR-K). This Privacy Policy explains how we collect, use, and protect personal information while ensuring that parents, guardians, and families are informed about their rights regarding data usage.
This Privacy Policy applies to all services provided by Family Engage, including our website, and other digital services that link to this Privacy Policy (collectively, the "Platform"). By using our Platform, you agree to the terms outlined below.
For additional details, please review our Terms of Use, which govern your use of the Platform.
________________________________________
1. Information We Collect
1.1 Information from Children
To protect children’s privacy, Family Engage does not collect personal information directly from children without verifiable parental consent. Any information collected about children is managed through the family account created by a parent or guardian.
The information we may collect about children includes:
•	Child’s Username or Avatar: Used to personalize the gaming experience and identify players.
•	Gameplay Data: Such as scores, and achievements earned.
•	Device Information: Includes IP addresses, browser type, and operating system, collected for internal operations and analytics.
We do not collect sensitive information such as children’s real names, addresses, or contact details unless explicitly provided by parents or guardians.
1.2 Information from Parents or Guardians
When creating and managing a family account, parents or guardians may provide:
•	Name and email address.
•	Usernames for family members, including children.
This information is used to manage the account, provide services, and facilitate communication between Family Engage and the account holder.
1.3 Automatically Collected Information
The Platform may automatically collect non-personally identifiable information to improve user experience and Platform functionality. This includes:
•	Usage data (e.g., time spent on games, pages visited, and interactions).
•	Technical data (e.g., device type, browser version, and IP address).
•	Behavioral data (e.g., in-game actions and progression).
This data is collected using cookies and similar technologies, which users can manage through browser settings.
________________________________________
2. How We Use Information
2.1 For Children’s Information
The information collected about children is used solely to:
•	Provide access to games and Platform features.
•	Customize gameplay experiences.
•	Track progress and achievements.
•	Ensure safety and security on the Platform.
We do not use children’s information for marketing or advertising purposes.
2.2 For Parents’ Information
Parents’ and guardians’ data is used to:
•	Manage the family account.
•	Communicate updates, changes, or new features.
•	Improve the functionality and security of the Platform.
________________________________________
3. Data Protection and Retention
3.1 Data Security
We implement industry-standard measures to protect user data, including:
•	Encryption: All data is encrypted during transmission and storage.
•	Secure Authentication: Two-factor authentication (2FA) is available for enhanced account security.
•	Access Controls: Only authorized personnel can access personal data.
3.2 Data Retention
User data is retained only as long as necessary to provide services. Upon account deletion or parental request, all personal information associated with the account is securely deleted.
________________________________________
4. Disclosure of Information
We do not sell or rent personal information to third parties. Information may only be disclosed under the following circumstances:
•	To Service Providers: For hosting, data processing, or technical support. These providers are contractually bound to protect data.
•	To Comply with Legal Obligations: If required by law or to protect user safety.
•	To Ensure Platform Security: To address potential threats to the integrity of the Platform.
Children’s data is never shared publicly or used for advertising purposes.
________________________________________
5. Compliance with COPPA and GDPR-K
5.1 COPPA Compliance
•	Parental Consent: We require verifiable parental consent before collecting any personal information from children under 13.
•	Limited Data Collection: We collect only the information necessary for children to participate in activities on the Platform.
•	Review and Deletion: Parents can review or delete their child’s information at any time by contacting privacy@familyengage.com.
5.2 GDPR-K Compliance
•	Transparency: Parents or guardians are informed about how their child’s data is collected, used, and stored.
•	Parental Rights: Parents can access, correct, or delete their child’s data and withdraw consent for its use.
•	Data Minimization: We collect and retain only the data necessary for providing services.
________________________________________
6. Parents’ and Guardians’ Rights
Under COPPA and GDPR-K, parents and guardians have the right to:
•	Access: View the information collected about their child.
•	Delete: Request the deletion of their child’s personal information.
•	Withdraw Consent: Disable their child’s account and stop further data collection.
To exercise these rights, email privacy@familyengage.com with your name, child’s username, and the associated email address.
________________________________________
7. Advertising Policy
Family Engage does not display targeted advertisements to children. 
________________________________________
8. Updates to This Privacy Policy
This Privacy Policy is current as of the Effective Date above. We may update this Policy periodically to reflect changes in our practices or to comply with legal requirements. Any significant changes will be communicated to parents via email and posted on the Platform.
________________________________________
9. Contact Us
For questions or concerns about this Privacy Policy or our data practices, please contact us:
Family Engage
Beirut, Lebanon
Email: privacy@familyengage.com



Terms of Use
Effective Date: December 12, 2024
Welcome to Family Engage! These Terms of Use ("Terms") govern your access to and use of our web application, including all features and services provided through our platform (collectively, the "Platform"). By using the Platform, you agree to these Terms. If you do not agree, please discontinue use immediately.
For additional details on our data practices, please review our Privacy Policy, which is incorporated into these Terms by reference.
________________________________________
1. Eligibility
To create and manage a family account on Family Engage:
•	You must be at least 18 years old.
•	You must provide accurate and complete information during registration.
•	You confirm that you have the authority to agree to these Terms on behalf of all family members using the Platform.
Children under 13 (or under 16 in jurisdictions requiring GDPR-K compliance) may only use the Platform under the supervision of a parent or guardian with verified consent.
________________________________________
2. Account Responsibilities
When you create an account on Family Engage, you agree to:
•	Keep your login credentials confidential and secure.
•	Supervise all activity under your account, particularly usage by children.
•	Notify us immediately if you suspect unauthorized access or account misuse.
You are fully responsible for all actions taken under your account.
________________________________________
3. Permitted Use of the Platform
The Platform is intended solely for personal, non-commercial use. You agree not to:
•	Use the Platform for unlawful purposes.
•	Attempt to hack, disrupt, or otherwise compromise the security or functionality of the Platform.
•	Misrepresent your identity or create accounts for fraudulent purposes.
We reserve the right to suspend or terminate accounts that engage in prohibited activities.
________________________________________
4. User Content
Family Engage may allow users to create, upload, or share content (e.g., usernames, avatars, or game progress) ("User Content"). By submitting User Content, you grant Family Engage a non-exclusive, royalty-free license to use, modify, and display such content for Platform functionality.
You agree that your User Content will:
•	Not infringe upon the intellectual property rights of others.
•	Not include inappropriate, harmful, or offensive material.
We reserve the right to remove or disable access to User Content that violates these Terms.
________________________________________
5. Privacy and Data Protection
Your use of the Platform is subject to our Privacy Policy, which explains how we collect, use, and protect your information. By using Family Engage, you consent to the practices described in our Privacy Policy.
Parents and guardians are responsible for reviewing and managing their child’s account settings and data.
________________________________________
6. Intellectual Property
All content and features of the Platform, including games, designs, and source code, are the intellectual property of Family Engage or its licensors. You may not copy, modify, distribute, or create derivative works of any part of the Platform without prior written consent.
________________________________________
7. Third-Party Services
The Platform may link to or integrate with third-party services. Family Engage is not responsible for the availability, content, or practices of these services. Your use of third-party services is at your own risk and subject to their respective terms.
________________________________________
8. Disclaimers
The Platform is provided "as is" without warranties of any kind, whether express or implied. Family Engage does not guarantee that the Platform will:
•	Be error-free or uninterrupted.
•	Meet your specific needs or expectations.
________________________________________
9. Limitation of Liability
To the maximum extent permitted by law, Family Engage shall not be liable for:
•	Indirect, incidental, or consequential damages arising from the use of the Platform.
•	Loss of data or unauthorized access to your account.
In jurisdictions where such limitations are not allowed, liability will be limited to the minimum extent permitted by law.
________________________________________
10. Indemnification
You agree to indemnify and hold harmless Family Engage and its affiliates from any claims, damages, or expenses arising from:
•	Your violation of these Terms.
•	Your misuse of the Platform.
•	Your User Content infringing the rights of others.
________________________________________
11. Updates to These Terms
We may update these Terms periodically to reflect changes in our practices or the law. Updates will be effective upon posting. If significant changes are made, we will notify users via a notice on the Platform.
________________________________________
12. Termination
We reserve the right to suspend or terminate your account at any time if you violate these Terms or misuse the Platform. Upon termination, your access to the Platform will cease immediately.
________________________________________
13. Governing Law
These Terms are governed by and construed in accordance with the laws of [Insert Jurisdiction]. Any disputes arising from these Terms shall be resolved in the courts of [Insert Location].
________________________________________
14. Contact Us
For questions or concerns about these Terms, please contact us:
Family Engage
Beirut, Lebanon
Email: support@familyengage.com


`}
            </pre>
            <button className="btn back-btn" onClick={() => setShowTerms(false)}>
              Back
            </button>
          </div>
        ) : (
          // Main Popup Content
          <>
            <h2 className="popup-title">Complete your profile</h2>
            <div className="popup-field">
              <label className="popup-subtitle">Select your birthday</label>
              <Calendar
                value={birthDate}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    setBirthDate(value[0]);
                  } else {
                    setBirthDate(value);
                  }
                }}
              />
            </div>
            <div className="popup-field">
              <label className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
                Accept{" "}
                <span
                  className="terms-link"
                  onClick={() => setShowTerms(true)}
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                >
                  Terms and Conditions
                </span>
              </label>
            </div>
            <button className="btn submit-btn" onClick={handlePopupSubmit}>
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Popup;
