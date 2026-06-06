import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronUp, UserPlus, Star } from "lucide-react";
import { nominateIcon, toggleNomineeFeatured } from "../../services/adminService";
import { getNominees } from "../../services/compendiumService";

const QUIZ_CATEGORIES = ["History", "Culture", "Sports", "Music", "Geography", "Government", "Science & Tech"];

const BLANK_QUESTION = { question: "", options: ["", "", "", ""], answer: "", category: "History" };
const BLANK_NOMINEE  = { name: "", bio: "", photo_url: "" };

export default function AdminQuizPage() {
  // ── Quiz Builder state ─────────────────────────────────────────────────────
  const [questions, setQuestions]   = useState([]);
  const [form, setForm]             = useState(BLANK_QUESTION);
  const [formError, setFormError]   = useState("");
  const [saved, setSaved]           = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // ── Nominees state ─────────────────────────────────────────────────────────
  const [nomineeForm, setNomineeForm]   = useState(BLANK_NOMINEE);
  const [nominees, setNominees]         = useState([]);
  const [nomineesLoading, setNomineesLoading] = useState(true);
  const [nomineeError, setNomineeError] = useState("");
  const [nomineeSuccess, setNomineeSuccess] = useState(false);
  const [nominating, setNominating]     = useState(false);

  // ── Active tab ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("quiz");

  // Load nominees
  useEffect(() => {
    getNominees({ limit: 50 })
      .then(data => setNominees(data.nominees || []))
      .catch(() => {})
      .finally(() => setNomineesLoading(false));
  }, []);

  // ── Quiz form helpers ──────────────────────────────────────────────────────
  const updateOption = (idx, val) => {
    const opts = [...form.options]; opts[idx] = val;
    setForm({ ...form, options: opts });
  };

  const validateForm = () => {
    if (!form.question.trim()) return "Question text is required.";
    const filled = form.options.filter(o => o.trim());
    if (filled.length < 2) return "Please provide at least 2 answer options.";
    if (!form.answer.trim()) return "Please select the correct answer.";
    if (!form.options.includes(form.answer)) return "Correct answer must match one of the options.";
    return "";
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setFormError("");
    const newQ = { id: Date.now(), ...form, options: form.options.filter(o => o.trim()) };
    setQuestions([newQ, ...questions]);
    setForm(BLANK_QUESTION);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id) => setQuestions(questions.filter(q => q.id !== id));

  // ── Nominee form helpers ───────────────────────────────────────────────────
  const handleNominate = async (e) => {
    e.preventDefault();
    setNomineeError("");
    if (!nomineeForm.name.trim() || !nomineeForm.bio.trim() || !nomineeForm.photo_url.trim()) {
      setNomineeError("All fields are required."); return;
    }
    setNominating(true);
    try {
      const newNominee = await nominateIcon(nomineeForm);
      setNominees(prev => [newNominee, ...prev]);
      setNomineeForm(BLANK_NOMINEE);
      setNomineeSuccess(true);
      setTimeout(() => setNomineeSuccess(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to nominate. Please check your credentials and try again.";
      setNomineeError(Array.isArray(msg) ? msg.map(m => m.msg).join(", ") : msg);
    } finally {
      setNominating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage quiz questions and compendium nominees.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-gray-100">
        {[["quiz", "Quiz Builder"], ["nominees", "Compendium Nominees"]].map(([id, label]) => (
          <button
            key={id} onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === id ? "border-[#008751] text-[#008751]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Quiz Tab ─────────────────────────────────────────────────────────── */}
      {activeTab === "quiz" && (
        <>
          {/* Add Question Form */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-[#008751] rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Add New Question</h2>
            </div>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5" htmlFor="quiz-question">Question</label>
                <textarea id="quiz-question" rows={2} value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. In what year did Nigeria gain independence?"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008751] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Answer Options (min. 2)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input id={`quiz-option-${idx}`} type="text" value={opt}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5" htmlFor="quiz-correct">Correct Answer</label>
                  <select id="quiz-correct" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]">
                    <option value="">— Select correct option —</option>
                    {form.options.filter(o => o.trim()).map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5" htmlFor="quiz-category">Category</label>
                  <select id="quiz-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]">
                    {QUIZ_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {formError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</p>}
              <div className="flex items-center gap-3 pt-1">
                <button type="submit" id="quiz-add-submit" className="flex items-center gap-2 bg-[#008751] hover:bg-[#006b40] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors">
                  <Save className="w-4 h-4" /> Save Question
                </button>
                {saved && <span className="text-sm text-green-600 font-medium">✓ Question saved!</span>}
              </div>
            </form>
          </div>

          {/* Question Bank */}
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Question Bank ({questions.length})</h2>
          {questions.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No questions added yet.</p>}
          <div className="space-y-2">
            {questions.map(q => (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{q.question}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase mr-1">{q.category}</span>
                      Answer: <span className="text-[#008751] font-semibold">{q.answer}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      {expandedId === q.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(q.id)} id={`delete-question-${q.id}`}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {expandedId === q.id && (
                  <div className="border-t border-gray-50 px-4 py-3 grid grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => (
                      <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg text-sm ${opt === q.answer ? "bg-green-50 border border-green-200 text-green-800 font-semibold" : "bg-gray-50 text-gray-600"}`}>
                        <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                        {opt === q.answer && <span className="ml-auto text-green-600 text-xs">✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Nominees Tab ──────────────────────────────────────────────────────── */}
      {activeTab === "nominees" && (
        <>
          {/* Add Nominee Form */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-[#008751] rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Add Compendium Nominee</h2>
            </div>
            <form onSubmit={handleNominate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Name</label>
                <input type="text" value={nomineeForm.name} onChange={e => setNomineeForm({...nomineeForm, name: e.target.value})}
                  placeholder="e.g. Chinua Achebe"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Short Bio (10–500 chars)</label>
                <textarea value={nomineeForm.bio} onChange={e => setNomineeForm({...nomineeForm, bio: e.target.value})}
                  rows={3} placeholder="Brief description of their impact on Nigeria and the world…"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Photo URL</label>
                <input type="url" value={nomineeForm.photo_url} onChange={e => setNomineeForm({...nomineeForm, photo_url: e.target.value})}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#008751]" />
              </div>
              {nomineeError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{nomineeError}</p>}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={nominating}
                  className="flex items-center gap-2 bg-[#008751] hover:bg-[#006b40] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60">
                  <UserPlus className="w-4 h-4" />
                  {nominating ? "Adding…" : "Add to Compendium"}
                </button>
                {nomineeSuccess && <span className="text-sm text-green-600 font-medium">✓ Nominee added!</span>}
              </div>
            </form>
          </div>

          {/* Nominees list */}
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">
            Current Nominees ({nominees.length})
          </h2>
          {nomineesLoading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="space-y-2">
            {nominees.map(n => (
              <div key={n.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100">
                  {n.photo_url && <img src={n.photo_url} alt={n.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{n.name}</p>
                    {n.is_featured && <span className="text-[10px] font-bold bg-[#008751]/10 text-[#008751] px-1.5 py-0.5 rounded uppercase">Featured</span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{n.bio}</p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <p className="text-sm font-bold text-gray-700">{(n.vote_count || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">votes</p>
                  <button
                    onClick={async () => {
                      try {
                        const updated = await toggleNomineeFeatured(n.id);
                        setNominees(prev => prev.map(x => x.id === n.id ? updated : x));
                      } catch { alert("Failed to toggle featured."); }
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded mt-1 flex items-center gap-1 transition-colors ${
                      n.is_featured
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Star className="w-3 h-3" />
                    {n.is_featured ? "Unfeature" : "Feature"}
                  </button>
                </div>
              </div>
            ))}
            {!nomineesLoading && nominees.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No nominees yet. Add the first one above.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
