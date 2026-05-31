import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Built-in email-verification redirect page.
 *
 * Supabase's confirmation email (sent via the connected Resend key,
 * From: noreply@centerkross.com) points its link at this `/verified` route.
 *
 * On landing here we:
 *   1. Parse whatever token format the link carries (PKCE code, token_hash OTP,
 *      or implicit access/refresh tokens) and exchange it for a session.
 *   2. Refresh the auth session so a NEW JWT is minted that carries the updated
 *      `email_confirmed_at` — the user is now both LOGGED IN and MARKED VERIFIED.
 *   3. Redirect them straight into the app (their dashboard).
 *
 * All of this heavy lifting lives in AuthContext.verifyEmailFromUrl() so the same
 * logic is shared everywhere.
 */
export default function Verified() {
  const { verifyEmailFromUrl, refreshSession, recheckVerification } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your email…");

  // Send the (now logged-in & verified) user into the app, landing on dashboard.
  const goToApp = () => {
    try {
      sessionStorage.setItem("nicco_initial_view", "dashboard");
    } catch {}
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        // 1) Process the verification token in the URL & establish a session.
        //    (Handles PKCE ?code, ?token_hash OTP, and implicit #access_token.)
        const { verified } = await verifyEmailFromUrl();

        // 2) Force a fresh token so the frontend sees email_confirmed = true and
        //    the user is fully LOGGED IN. This is the key call requested:
        //    auth.refreshSession() mints a new JWT with the updated claim.
        await refreshSession();

        // 3) Decide success from the authoritative server result. We re-query the
        //    server (recheckVerification) rather than a stale React closure so the
        //    flag is always current. NEVER render raw JSON — only this UI.
        if (verified || (await recheckVerification())) {
          setStatus("success");
          setMessage("Your email is verified and you're now signed in.");
          setTimeout(goToApp, 1400);
          return;
        }

        // The server may need a beat to propagate email_confirmed_at — retry once.
        setTimeout(async () => {
          await refreshSession();
          if (await recheckVerification()) {
            setStatus("success");
            setMessage("Your email is verified and you're now signed in.");
            setTimeout(goToApp, 1200);
          } else {
            setStatus("error");
            setMessage(
              "We couldn't automatically confirm your email. If you just clicked the link, tap the button below to continue."
            );
          }
        }, 1200);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("Something went wrong while confirming your email. Please try again.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-center">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-8">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming your email…</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={goToApp}
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to app
            </button>
            <p className="mt-3 text-xs text-gray-400">Redirecting you automatically…</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Almost there</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={async () => {
                  setStatus("loading");
                  setMessage("Re-checking your verification…");
                  await refreshSession();
                  if (await recheckVerification()) {
                    setStatus("success");
                    setMessage("Your email is verified and you're now signed in.");
                    setTimeout(goToApp, 1000);
                  } else {
                    setStatus("error");
                    setMessage(
                      "We still don't see your email as verified. Open the link in the email once more, then try again."
                    );
                  }
                }}
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                I've verified my email
              </button>
              <button
                onClick={() => navigate("/", { replace: true })}
                className="block w-full text-sm text-gray-500 hover:text-gray-800 underline"
              >
                Back to home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
