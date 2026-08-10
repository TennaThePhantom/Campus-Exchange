// sell_item.jsx


import { useState } from "react";
import { Camera } from "lucide-react";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createListing } from "../firebase/listings";
import { LOCATIONS, CATEGORIES, CONDITIONS } from "@/lib/listingOptions";

function SellItem({setPage, currentUser}) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setWarning("");

        if (!title.trim()) {
            setError("Please give your listing a title.");
            return;
        }

        setSaving(true);
        try {
            // Upload the photo first. If Storage fails we still save the
            // listing rather than throwing away everything they typed.
            let imageUrl = "";
            if (imageFile) {
                try {
                    const path = `listings/${Date.now()}-${imageFile.name}`;
                    const snapshot = await uploadBytes(ref(storage, path), imageFile);
                    imageUrl = await getDownloadURL(snapshot.ref);
                } catch (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    setWarning("We couldn't upload your photo, so the listing was saved without it.");
                }
            }

            await createListing({
                title: title.trim(),
                price: price === "" ? null : Number(price),
                description: description.trim(),
                imageUrl,
                category,
                condition,
                location,
                sellerId: currentUser?.id || "",
            });

            setPage("browse");
        } catch (err) {
            console.error("Failed to create listing:", err);
            setError("We couldn't save your listing. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">

            <nav className="navbar bg-base-100 shadow-md px-8">
                <button
                type="button"
                className="btn-ghost text-xl"
                onClick={() => setPage("dashboard")}
                >
                    Home
                </button>
        </nav>
            <div className="max-w-4xl ml-8 pt-8">
                <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
            </div>


<form onSubmit={handleSubmit} className="flex items-start gap-100">
    <div className="flex flex-col gap-3">

        <div className ="grid grid-cols-2 gap-6">
            <div className="pt-8 pl-8 w-96 flex flex-col">
                <label className="label" >
                    <span className="label-text">Title </span>
                    </label>
                    <input
                    type="text"
                    placeholder="Example: TI-84 Calculator"
                    className="input input-bordered w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                    </div>

             <div className="pt-8 pl-8 w-96 flex flex-col">
                <label className="label">
                    <span className="label-text">Price</span>
                    </label>

            <div className="flex items-center border rounded-lg px-3">
                <span className="mr-2 text-gray-500">$</span>
                    <input
                     type="number"
                     placeholder="0"
                     min="0"
                     step="0.01"
                     className="input input-bordered w-full"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     />
                     </div>
                     </div>


            <div className="pt-8 pl-8 w-96">
                <label className="label" >
                    <span className="label-text">Location </span>
                </label>
                <select
                    className="select select-bordered w-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="" disabled>
                        Select a Location
                    </option>

                    {Object.entries(LOCATIONS).map(([code, label]) => (
                        <option key={code} value={code}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="pt-8 pl-8 w-96">
                <label className="label">
                    <span className="label-text">Category </span>
                </label>
                <select
                    className="select select-borderd w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="" disabled>
                        Select Category
                    </option>

                    {Object.entries(CATEGORIES).map(([code, label]) => (
                        <option key={code} value={code}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="pt-8 pl-8 w-96">
                <label className="label">
                    <span className="label-text">Condition </span>
                </label>
                <select
                    className="select select-borderd w-full"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                >
                    <option value="" disabled>
                       Select Condition
                    </option>

                    {Object.entries(CONDITIONS).map(([code, label]) => (
                        <option key={code} value={code}>{label}</option>
                    ))}
                </select>
            </div>

            </div>




            <label className=" flex flex-col h-115 w-175 cursor-pointer border-2 border-dashed rounded-lg ml-8  items-center justify-center">
            <Camera className="h-12 w-12 text-primary" />
            <p className="mt-3">{imageFile ? imageFile.name : "Upload Images"}</p>
            <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
            </label>
</div>
            <div className="flex flex-col">
                <label className="label" >
                    <span className="label-text">Description</span>
                </label>
                <textarea

                placeholder="Please enter a detailed description of your listed item."
                className="textarea textarea-bordered w-170 "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                {error && <p className="mt-3 text-error">{error}</p>}
                {warning && <p className="mt-3 text-warning">{warning}</p>}

                <div className="flex gap-4 mt-6 pl-15">
                 <button type="submit" className=" btn btn-primary w-70" disabled={saving}>
                        {saving ? "Listing..." : "List Item"}
                    </button>

                <button type="button" className=" btn btn-primary w-70">
                       Draft
                    </button>
                    </div>
                </div>
    </form>
    </div>

    );
}

export default SellItem;

