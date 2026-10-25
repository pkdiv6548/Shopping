"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound, X, LogOut, LoaderCircle, ShieldCheck } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Language = "en" | "hi";
type Mode = "login" | "register";
type Notice = { kind: "error" | "success"; text: string } | null;

const labels = {
  en: {
    title: "Your account, your edit.",
    intro: "Sign in to keep your details and discover your saved style.",
    login: "LOG IN",
    register: "CREATE ACCOUNT",
    name: "Full name",
    email: "Email address",
    password: "Password",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "At least 8 characters",
    submitLogin: "SIGN IN",
    submitRegister: "CREATE ACCOUNT",
    haveAccount: "Already have an account?",
    noAccount: "New to Shopping Mart?",
    switchLogin: "Log in",
    switchRegister: "Create an account",
    welcome: "You're signed in. Welcome back.",
    created: "Your account is ready.",
    confirm: "Almost there — check your inbox and confirm your email before signing in.",
    signedIn: "YOU'RE SIGNED IN",
    accountDetails: "Account details",
    logout: "SIGN OUT",
    loggedOut: "You have been signed out.",
    invalid: "That email and password combination didn't work. Check your details and try again.",
    already: "An account may already exist for this email. Try signing in instead.",
    weak: "Choose a password with at least 8 characters.",
    generic: "We couldn't complete that request. Please try again.",
    close: "Close account panel",
    secured: "Secure authentication powered by Supabase",
    requiredName: "Please enter your name.",
    config: "Authentication isn't configured yet. Add the Supabase project URL and publishable key.",
  },
  hi: {
    title: "आपका अकाउंट, आपकी पसंद।",
    intro: "अपनी जानकारी सुरक्षित रखने और पसंदीदा स्टाइल देखने के लिए लॉगिन करें।",
    login: "लॉगिन",
    register: "अकाउंट बनाएँ",
    name: "पूरा नाम",
    email: "ईमेल पता",
    password: "पासवर्ड",
    namePlaceholder: "अपना नाम लिखें",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "कम-से-कम 8 अक्षर",
    submitLogin: "लॉगिन करें",
    submitRegister: "अकाउंट बनाएँ",
    haveAccount: "पहले से अकाउंट है?",
    noAccount: "Shopping Mart पर नए हैं?",
    switchLogin: "लॉगिन करें",
    switchRegister: "अकाउंट बनाएँ",
    welcome: "आप सफलतापूर्वक लॉगिन हो गए हैं।",
    created: "आपका अकाउंट तैयार है।",
    confirm: "लगभग हो गया — अपने ईमेल में जाकर अकाउंट की पुष्टि करें, फिर लॉगिन करें।",
    signedIn: "आप लॉगिन हैं",
    accountDetails: "अकाउंट की जानकारी",
    logout: "लॉगआउट",
    loggedOut: "आप लॉगआउट हो गए हैं।",
    invalid: "ईमेल या पासवर्ड सही नहीं है। जानकारी जाँचकर फिर प्रयास करें।",
    already: "इस ईमेल से अकाउंट पहले से हो सकता है। लॉगिन करके देखें।",
    weak: "कम-से-कम 8 अक्षरों का पासवर्ड रखें।",
    generic: "अभी अनुरोध पूरा नहीं हो सका। कृपया फिर प्रयास करें।",
    close: "अकाउंट पैनल बंद करें",
    secured: "Supabase द्वारा सुरक्षित प्रमाणीकरण",
    requiredName: "कृपया अपना नाम लिखें।",
    config: "अभी प्रमाणीकरण कॉन्फ़िगर नहीं है। Supabase प्रोजेक्ट URL और Publishable Key जोड़ें।",
  },
} satisfies Record<Language, Record<string, string>>;

function authErrorMessage(error: unknown, copy: (typeof labels)[Language]) {
  const message = error instanceof Error ? error.message : "";
  if (/invalid login credentials|invalid email or password/i.test(message)) return copy.invalid;
  if (/already registered|user already exists/i.test(message)) return copy.already;
  if (/password.*(8 characters|at least|too short|weak)/i.test(message)) return copy.weak;
  return message || copy.generic;
}

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  lang: Language;
};

export default function AuthModal({ open, onClose, lang }: AuthModalProps) {
  const supabase = getSupabaseBrowserClient();
  const copy = labels[lang];
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!open || !supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });
    void supabase.auth.getUser().then(({ data, error }) => {
      if (active && !error) setUser(data.user ?? null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [open, supabase]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setNotice({ kind: "error", text: copy.config });
      return;
    }
    if (mode === "register" && !fullName.trim()) {
      setNotice({ kind: "error", text: copy.requiredName });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        if (data.session && data.user) {
          setUser(data.user);
          setNotice({ kind: "success", text: copy.created });
        } else {
          setMode("login");
          setNotice({ kind: "success", text: copy.confirm });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setUser(data.user);
        setNotice({ kind: "success", text: copy.welcome });
        setPassword("");
      }
    } catch (error) {
      setNotice({ kind: "error", text: authErrorMessage(error, copy) });
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    setBusy(true);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setMode("login");
      setPassword("");
      setNotice({ kind: "success", text: copy.loggedOut });
    } catch (error) {
      setNotice({ kind: "error", text: authErrorMessage(error, copy) });
    } finally {
      setBusy(false);
    }
  }

  const displayName = typeof user?.user_metadata?.full_name === "string"
    ? user.user_metadata.full_name
    : user?.email ?? "";

  return (
    <div className="auth-overlay" onClick={onClose}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(event) => event.stopPropagation()}>
        <button className="auth-close" type="button" onClick={onClose} aria-label={copy.close}><X size={19} /></button>
        <a className="wordmark auth-wordmark" href="#top" onClick={onClose}>SHOPPING<span> MART</span><i>®</i></a>
        {user ? (
          <div className="auth-account">
            <div className="auth-avatar"><UserRound size={27} /></div>
            <p className="auth-eyebrow"><ShieldCheck size={14} /> {copy.signedIn}</p>
            <h2 id="auth-title">{displayName}</h2>
            <p className="auth-muted">{user.email}</p>
            <div className="auth-account-info"><span>{copy.accountDetails}</span><strong>{user.email}</strong></div>
            {notice && <p className={`auth-notice auth-notice-${notice.kind}`} role="status">{notice.text}</p>}
            <button className="auth-submit auth-signout" type="button" disabled={busy} onClick={handleSignOut}>
              {busy ? <LoaderCircle className="auth-spinner" size={17} /> : <LogOut size={17} />}
              {copy.logout}
            </button>
          </div>
        ) : (
          <>
            <p className="auth-eyebrow">SHOPPING MART / ACCOUNT</p>
            <h2 id="auth-title">{copy.title}</h2>
            <p className="auth-intro">{copy.intro}</p>
            <div className="auth-tabs" role="tablist" aria-label="Account action">
              <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "is-active" : ""} onClick={() => { setMode("login"); setNotice(null); }}>{copy.login}</button>
              <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "is-active" : ""} onClick={() => { setMode("register"); setNotice(null); }}>{copy.register}</button>
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <label className="auth-field">
                  <span>{copy.name}</span>
                  <div><UserRound size={17} /><input autoComplete="name" name="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder={copy.namePlaceholder} required maxLength={100} /></div>
                </label>
              )}
              <label className="auth-field">
                <span>{copy.email}</span>
                <div><Mail size={17} /><input type="email" autoComplete="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={copy.emailPlaceholder} required /></div>
              </label>
              <label className="auth-field">
                <span>{copy.password}</span>
                <div><LockKeyhole size={17} /><input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} name="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} minLength={8} required /></div>
              </label>
              {notice && <p className={`auth-notice auth-notice-${notice.kind}`} role="status">{notice.text}</p>}
              <button className="auth-submit" type="submit" disabled={busy}>
                {busy ? <LoaderCircle className="auth-spinner" size={17} /> : <>{mode === "login" ? copy.submitLogin : copy.submitRegister}<ArrowRight size={17} /></>}
              </button>
            </form>
            <p className="auth-switch">{mode === "login" ? copy.noAccount : copy.haveAccount}{" "}<button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setNotice(null); }}>{mode === "login" ? copy.switchRegister : copy.switchLogin}</button></p>
          </>
        )}
        <p className="auth-secure"><ShieldCheck size={13} /> {copy.secured}</p>
      </section>
    </div>
  );
}
