import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateRegisterForm } from "../../utils/validators";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { register, DEMO_MODE } from "../../services/authService";

function PasswordField({ id, name, label, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        label={label}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        error={error}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-[2.1rem] text-xs text-white/30 hover:text-white transition-colors"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default function RegisterPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode,
    agreed: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegisterForm(form);
    if (!form.agreed) errs.agreed = "You must agree to the Terms & Conditions.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const data = await register(form);
      loginUser(data);
      navigate("/my-arena");
    } catch (err) {
      setErrors({ email: err.response?.data?.detail || "Registration failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-14">
      <div className="w-full max-w-sm px-5 py-16">
        <h1 className="text-2xl font-bold text-white mb-2">Join Nigeria Celebrates</h1>
        <p className="text-sm text-white/40 mb-10">
          {DEMO_MODE ? "Demo mode — no real account is created." : "Create your free account."}
        </p>

        {referralCode && (
          <p className="text-xs text-white/30 mb-6">Referral: {referralCode}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input id="reg-name" name="fullName" label="Full Name" placeholder="Ngozi Achebe"
            value={form.fullName} onChange={update} error={errors.fullName} autoComplete="name" />

          <Input id="reg-email" name="email" type="email" label="Email" placeholder="you@example.com"
            value={form.email} onChange={update} error={errors.email} autoComplete="email" />

          <Input id="reg-phone" name="phone" type="tel" label="Phone (optional)" placeholder="08012345678"
            value={form.phone} onChange={update} error={errors.phone} autoComplete="tel" />

          <PasswordField id="reg-password" name="password" label="Password"
            value={form.password} onChange={update} error={errors.password} />

          <PasswordField id="reg-confirm" name="confirmPassword" label="Confirm Password"
            value={form.confirmPassword} onChange={update} error={errors.confirmPassword} />

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" name="agreed" checked={form.agreed} onChange={update}
              className="mt-0.5 accent-white" />
            <span className="text-xs text-white/40 leading-relaxed">
              I agree to the Terms & Conditions and Privacy Policy.
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-red-400 -mt-3">{errors.agreed}</p>}

          <button type="submit" disabled={submitting}
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {submitting && <Spinner size={16} />}
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-white/30 mt-8 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  );
}
