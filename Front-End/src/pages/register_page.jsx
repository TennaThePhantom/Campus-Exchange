// register_page.jsx
/* 
  Notes from Daniyal 7/26: 
  I made the UI for this page, but didn't implement any security
  stuff. I did link the "have an account? sign in here" button to the sign in page though
  Besides that, everything should be good, just needs the backend stuff for signing in
  and everything, including the backend for ID uploading and doing all that

  Notes from Daniyal 7/27:
  I implemented the button for uploading photos of IDs. The function only accepts images
  so that includes jpg, jpeg, png, and all the other types of images. I also changed the 
  color of the upload ID button so it matches up with everything else
*/

{/* stuff for uploading ID, camera icon, and more */}
import { useRef, useState } from "react";
import { Camera, ArrowUp, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
 
function RegisterPage({ onRegistered, onSignInClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [idFile, setIdFile] = useState(null);         {/* tracks the selected file */}
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
  setIdFile(e.target.files?.[0] || null);
  }
 
  function handleRegister(e) {
    e.preventDefault();
    onRegistered?.();
  }
 
  return (
    <div className="min-h-svh bg-sky-50 px-6 py-12 text-neutral-900">
      <h1 className="mb-2 text-5xl font-black">Create an Account</h1>
 
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Left side: ID upload */}
        <div>
          <h2 className="mb-2 text-2xl font-bold">Upload your UML ID</h2>
          <p className="mb-6 font-semibold text-neutral-600">
            Take a clear photo of your UML ID and upload it below. After
            verification, you will be allowed to register an account.
          </p>
          {/* builds the icon for image uploading */}
          <div className="flex max-w-sm flex-col items-center rounded-lg border border-sky-200 bg-white p-8 text-center">
            <div className="relative mb-6 flex items-center gap-3">
              <Camera className="size-16 text-neutral-900" strokeWidth={1.5} />
              <span className="absolute -bottom-2 left-9 flex size-7 items-center justify-center rounded-full bg-sky-500 text-white">
                <ArrowUp className="size-4" strokeWidth={2.5} />
              </span>
              <IdCard className="size-14 text-sky-600" strokeWidth={1.5} />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />      {/* file input, only accepts images (jpeg, png, jpg, etc */}

            <Button
            type="button"
            variant="secondary"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => fileInputRef.current?.click()}
            >     {/* lets you input a file on click */}
              Upload ID
            </Button>

            {idFile && (
              <p className="mt-2 text-xs text-neutral-500">Selected: {idFile.name}</p>
            )}

          </div>
        </div>
 
        {/* Right side: account stuff with ui only */}
        <div className="flex justify-center md:justify-end">
          <form
            onSubmit={handleRegister}
            className="h-fit w-full max-w-sm rounded-lg border border-sky-200 bg-white p-6"
          >
            {/* input username/password area */}
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
              placeholder="Create a Username"
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
              placeholder="Create a Password"
            />

            {/* buttons section */}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Register
            </Button>
 
            <Button
              type="button"
              variant="link"
              onClick={onSignInClick}
              className="mt-4 w-full text-red-600 hover:text-red-700"
            >
              Have an Account? Sign In Here!
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
 
export default RegisterPage;
 
