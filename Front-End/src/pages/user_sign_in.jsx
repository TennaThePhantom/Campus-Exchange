// user_sign_in.jsx
/* 
  Notes from Daniyal: 
  I made the UI for this page, but didn't implement any security
  stuff. I did link the "create an account" button to the register page though
  Besides that, everything should be good, just needs the backend stuff for signing in
  and everything
*/
 
import { useState } from "react";
import { Button } from "@/components/ui/button";
 
function UserSignIn({ onSignedIn, onCreateAccountClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 
  function handleSubmit(e) {
    e.preventDefault();
    onSignedIn?.();
  }
 
  return (
    <div className="grid min-h-svh grid-cols-1 bg-sky-50 md:grid-cols-2">
      <div className="hidden bg-sky-100 md:block" />
 
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">
            Please enter your username and password.
          </h1>
          
          {/* username and password input area*/}
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-sky-200 bg-white p-6"
          >
            <label className="mb-1 block text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Username"
            />
 
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Password"
            />

            {/* buttons sections */}
 
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Sign In
            </Button>
 
            <div className="mt-4 flex items-center justify-center">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={onCreateAccountClick}
                className="text-red-600"
              >                
                Create an Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
 
export default UserSignIn;
 