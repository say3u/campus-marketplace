export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>Privacy Policy</h1>
      <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>Last updated: June 1, 2025</p>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'var(--text3)' }}>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>1. What We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account info:</strong> your .edu email address, username, and password (stored hashed — we never see it in plain text)</li>
            <li><strong>Profile info:</strong> school, profile picture (if uploaded), reputation score</li>
            <li><strong>Listing content:</strong> titles, descriptions, prices, photos you post</li>
            <li><strong>Messages:</strong> conversations between buyers and sellers on the Platform</li>
            <li><strong>Usage data:</strong> pages visited, actions taken (e.g. searches, favorites) — used only to improve the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>2. How We Use It</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate the marketplace and connect buyers with sellers at your school</li>
            <li>To verify your student status via email confirmation</li>
            <li>To personalize your experience (e.g. school-specific themes)</li>
            <li>To enforce our Terms of Service and handle disputes</li>
            <li>To send you transactional emails (verification, password reset) — no marketing spam</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>3. What We Don't Do</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not sell your data to third parties</li>
            <li>We do not use your data for advertising</li>
            <li>We do not share your private messages with anyone except as required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>4. Data Storage & Security</h2>
          <p>Your data is stored on secure servers. Passwords are hashed with bcrypt and never stored in plain text. We use HTTPS for all data in transit. Access to the database is restricted to authorized personnel only.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>5. Your Rights</h2>
          <p className="mb-2">You can at any time:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Update your profile information</li>
            <li>Delete your listings</li>
            <li>Request deletion of your account and all associated data by emailing <strong>support@doormly.com</strong></li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>6. Cookies</h2>
          <p>We use a single session token (stored in localStorage) to keep you logged in. We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>7. Minors</h2>
          <p>Doormly is intended for college students (18+). We do not knowingly collect data from anyone under 13.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>8. Changes</h2>
          <p>We may update this policy. We'll notify you by email for material changes. Continued use of the Platform means you accept the updated policy.</p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text)' }}>9. Contact</h2>
          <p>Privacy questions? Email <strong>support@doormly.com</strong>.</p>
        </section>

      </div>
    </div>
  );
}
