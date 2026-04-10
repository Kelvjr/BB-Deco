"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    date_of_birth: "",
    program_applied: "",
    education_level: "",
    guardian_name: "",
    guardian_phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      if (!res.ok) throw new Error("Failed");

      setMessage("Application submitted successfully!");
      setForm({
        full_name: "",
        phone: "",
        email: "",
        address: "",
        gender: "",
        date_of_birth: "",
        program_applied: "",
        education_level: "",
        guardian_name: "",
        guardian_phone: "",
        notes: "",
      });
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Apply to BB Deco</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <br />

        <input
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={handleChange}
        />
        <br />

        <input
          name="date_of_birth"
          type="date"
          value={form.date_of_birth}
          onChange={handleChange}
        />
        <br />

        <input
          name="program_applied"
          placeholder="Program"
          value={form.program_applied}
          onChange={handleChange}
        />
        <br />

        <input
          name="education_level"
          placeholder="Education Level"
          value={form.education_level}
          onChange={handleChange}
        />
        <br />

        <input
          name="guardian_name"
          placeholder="Guardian Name"
          value={form.guardian_name}
          onChange={handleChange}
        />
        <br />

        <input
          name="guardian_phone"
          placeholder="Guardian Phone"
          value={form.guardian_phone}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
