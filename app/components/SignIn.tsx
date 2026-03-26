"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn() {
  const { data: session } = useSession();

  return (
    <div style={{ marginRight: '1rem' }}>
      {session ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '1rem' }}>Welcome, {session.user.name}</span>
          <button
            onClick={() => signOut()}
            className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      ) : (
<button
  onClick={() => signIn("google")}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    width: "100%",
    backgroundColor: "white",
    color: "#4b5563",
    fontWeight: "600",
    padding: "16px 24px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "14px"
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#f9fafb";
    e.target.style.borderColor = "#d1d5db";
    e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "white";
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  }}
>
  <img 
    src="https://www.google.com/favicon.ico" 
    alt="Google" 
    style={{ width: "20px", height: "20px" }}
  />
  Sign in with Google
</button>
      )}
    </div>
  );
}
