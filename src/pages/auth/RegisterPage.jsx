import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateRegisterForm } from "../../utils/validators";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { register } from "../../services/authService";

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
        className="absolute right-3 top-[2.2rem] text-white/50 hover:text-white transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        )}
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
    location: "",
    password: "",
    confirmPassword: "",
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
      navigate("/home");
    } catch (err) {
      setErrors({ email: err.response?.data?.detail || "Registration failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex">
      {/* Left side: Art */}
      <div className="hidden lg:flex w-1/2 bg-black relative border-r border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/20 to-black z-0"></div>
        <img 
          src="/register_art.png" 
          alt="Nigerian Art" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-lighten"
        />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-sm px-5 py-16">
          <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Claim Your Spot</h1>

          {referralCode && (
            <p className="text-xs text-white mb-6">Referral: {referralCode}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input id="reg-name" name="fullName" label="Full Name" placeholder="Ngozi Achebe"
              value={form.fullName} onChange={update} error={errors.fullName} autoComplete="name" />

            <Input id="reg-email" name="email" type="email" label="Email" placeholder="you@example.com"
              value={form.email} onChange={update} error={errors.email} autoComplete="email" />

            {/* Location / State — required by API (2-15 chars) */}
            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="reg-location">State / Location</label>
              <select
                id="reg-location"
                name="location"
                value={form.location}
                onChange={update}
                className={`input ${errors.location ? 'input-error' : ''}`}
              >
                <option value="">Select your state…</option>
                {["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","FCT Abuja"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.location && <p className="text-xs text-red-400 mt-0.5">{errors.location}</p>}
            </div>

            <PasswordField id="reg-password" name="password" label="Password"
              value={form.password} onChange={update} error={errors.password} />

            <PasswordField id="reg-confirm" name="confirmPassword" label="Confirm Password"
              value={form.confirmPassword} onChange={update} error={errors.confirmPassword} />

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="agreed" checked={form.agreed} onChange={update}
                className="mt-0.5 accent-white" />
              <span className="text-xs text-white leading-relaxed">
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

          <p className="text-sm text-white mt-8 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[color:#008751] hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
