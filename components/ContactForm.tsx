"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

const COUNCIL_EMAIL = "studentcouncil.bangalore@christuniversity.in";

const QUERY_TYPES = ["Query", "Suggestion", "Feedback", "Others"];

const EMPTY_FORM = {
  fullName: "",
  registerNumber: "",
  emailId: "",
  department: "",
  classSection: "",
  queryType: "",
  message: "",
};

type FormState = typeof EMPTY_FORM;
type FormField = keyof FormState;
type Status = { type: "success" | "error"; text: string } | null;

function isValidChristEmail(email: string) {
  return /@[a-zA-Z0-9-]+\.christuniversity\.in$/i.test(email.trim());
}

const fieldClass =
  "w-full py-2.75 px-3.5 border border-line rounded-md font-body text-[0.9rem] outline-none transition-colors bg-white focus:border-ink";
const labelClass = "block text-[0.8rem] font-medium text-text-secondary mb-1.75";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: FormField) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!isValidChristEmail(form.emailId)) {
      setStatus({
        type: "error",
        text: "Please use your CHRIST University email address (e.g. name@christuniversity.in, name@msam.christuniversity.in, or name@mca.christuniversity.in).",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${COUNCIL_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          email: form.emailId,
          _subject: `Student Council ${form.queryType || "Query"} — ${form.fullName}`,
          _template: "table",
          "Full Name": form.fullName,
          "Register Number": form.registerNumber,
          "CHRIST Email ID": form.emailId,
          Department: form.department,
          "Class & Section": form.classSection,
          "Type of Query": form.queryType,
          Message: form.message,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      setStatus({ type: "success", text: "Thank you! Your submission has been received successfully." });
      setForm(EMPTY_FORM);
    } catch {
      setStatus({
        type: "error",
        text: `There was an error submitting your form. Please try again or email directly to ${COUNCIL_EMAIL}.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-paper-2 rounded-card-lg p-10 max-[640px]:p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5 mb-5 max-[640px]:grid-cols-1">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Full Name <span className="text-crimson">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              className={fieldClass}
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={update("fullName")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="registerNumber">
              Register Number <span className="text-crimson">*</span>
            </label>
            <input
              id="registerNumber"
              type="text"
              required
              className={fieldClass}
              placeholder="e.g. 2548515"
              value={form.registerNumber}
              onChange={update("registerNumber")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5 max-[640px]:grid-cols-1">
          <div>
            <label className={labelClass} htmlFor="emailId">
              CHRIST Email ID <span className="text-crimson">*</span>
            </label>
            <input
              id="emailId"
              type="email"
              required
              className={fieldClass}
              placeholder="you@christuniversity.in"
              value={form.emailId}
              onChange={update("emailId")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="department">
              Department <span className="text-crimson">*</span>
            </label>
            <input
              id="department"
              type="text"
              required
              className={fieldClass}
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={update("department")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5 max-[640px]:grid-cols-1">
          <div>
            <label className={labelClass} htmlFor="classSection">
              Class &amp; Section <span className="text-crimson">*</span>
            </label>
            <input
              id="classSection"
              type="text"
              required
              className={fieldClass}
              placeholder="e.g. 5 BCA A"
              value={form.classSection}
              onChange={update("classSection")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="queryType">
              Type of Query <span className="text-crimson">*</span>
            </label>
            <select id="queryType" required className={fieldClass} value={form.queryType} onChange={update("queryType")}>
              <option value="">Select Query Type</option>
              {QUERY_TYPES.map((t) => (
                <option value={t} key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5 max-[640px]:grid-cols-1">
          <div className="col-span-full">
            <label className={labelClass} htmlFor="message">
              Your Query / Suggestion <span className="text-crimson">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              className={fieldClass}
              placeholder="Please provide details about your query or suggestion..."
              value={form.message}
              onChange={update("message")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-block bg-gold text-ink font-semibold text-[0.86rem] py-3 px-6 rounded-md transition-colors duration-250 hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>

        {status && (
          <div
            className={`mt-4 p-3.5 rounded-md text-[0.85rem] font-light ${
              status.type === "success" ? "bg-steel/10 text-steel" : "bg-crimson/10 text-crimson"
            }`}
          >
            {status.text}
          </div>
        )}
      </form>
    </div>
  );
}
