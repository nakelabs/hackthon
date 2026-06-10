export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Privacy Policy</h1>
        <div className="space-y-8 text-white/70 text-base leading-relaxed">
          <p className="text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as when you create an account, participate in the quiz, or submit a compendium nomination. This may include your name, email address, and interactions with the platform.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and personalize your experience during the celebration.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at hello@nigeriacelebrates.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
