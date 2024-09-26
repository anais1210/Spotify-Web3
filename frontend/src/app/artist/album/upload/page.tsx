"use client";
import { useState } from "react";
// No need for Pinata SDK, you're using HTTP API directly

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0] || null);
  };

  // Upload file to Pinata
  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Creating JSON payload for pinataContent and metadata
      const data = JSON.stringify({
        pinataContent: {
          name: form.name,
          description: form.description,
          image:
            "ipfs://bafkreih5aznjvttude6c3wbvqeebb6rlx5wkbzyppv7garjiubll2ceym4", // Static IPFS image, update if dynamic
          external_url: "https://pinata.cloud",
        },
        pinataMetadata: {
          name: "metadata.json",
        },
      });

      // Make the request to Pinata API
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1NDk2NjA0NC1hZDU1LTQ5MzItOGM1ZC03ZTc5NzU1ZmQ4NjciLCJlbWFpbCI6ImFuYWlzLnpoYW5nMTJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIwZGY1M2YxMzJmZDhhNmU0NDQzIiwic2NvcGVkS2V5U2VjcmV0IjoiNzRlMjU2NzVkZDM5OWQ0MzgzZWRmY2RjYmJmNTFjNGQ2MWJiOTk1OTIyNDdhY2YzNjQ0YTY4N2RjZWUwYzQyZSIsImV4cCI6MTc1NzgwNTY3OX0.3E1boZANpbnsJsJeKu6l4tpKDvS-OtNSADezIS7iPW4
NEXT_PUBLIC_GATEWAY_URL=moccasin-hungry-boa-776.mypinata.cloud`, // Use environment variable for JWT
          },
          body: data,
        }
      );

      // Handle the response
      const resData = await res.json();
      setUrl(resData.IpfsHash); // Set the returned IPFS hash URL
    } catch (error) {
      console.log(error);
      alert("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900 text-white p-6">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">Create An Album</h1>
        <form onSubmit={uploadFile}>
          <div className="space-y-6">
            <label htmlFor="name" className="block text-lg mb-2">
              Album's Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <label htmlFor="description" className="block text-lg mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 text-black rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={uploading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Upload
            </button>
          </div>
        </form>
        {url && (
          <p className="mt-4 text-center">
            File uploaded successfully:{" "}
            <a
              href={`https://gateway.pinata.cloud/ipfs/${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              View on IPFS
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
