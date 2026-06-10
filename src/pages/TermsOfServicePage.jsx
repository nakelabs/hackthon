export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Terms of Service</h1>
        <div className="space-y-8 text-white/70 text-base leading-relaxed">
          <p className="text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Nigeria Celebrates, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. User Content</h2>
            <p>Any content you submit, including text, photos, and votes, must not violate any applicable laws or infringe upon the rights of others. We reserve the right to remove any content at our discretion.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Platform Rules</h2>
            <p>You agree not to engage in any activity that interferes with or disrupts the services. This includes cheating in quizzes, spamming votes, or exploiting the platform.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the new terms.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact Information</h2>
            <p>For any questions regarding these terms, please contact us at hello@nigeriacelebrates.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
