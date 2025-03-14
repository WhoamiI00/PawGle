"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CirclesBackground from "@/components/background";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_PORT;

const User = () => {
  const [owner, setOwner] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/auth/profile/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setOwner(data.user);
        setPets(data.pets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const deletePet = async (petId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/pets/${petId}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pet");
      }

      setPets(pets.filter((pet) => pet.id !== petId));
    } catch (err) {
      setError(err.message);
    }
  };

  const editPet = (pet) => {
    localStorage.setItem("petEditData", JSON.stringify(pet));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <>
      <CirclesBackground height={window.innerHeight} />
      <div className="min-h-[100vh] flex flex-col bg-gradient-to-b from-black to-gray-900 text-white">
        <Navbar />
        <main className="flex flex-col md:flex-row p-6 space-x-0 md:space-x-6 z-10 min-h-[80vh]">
          <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg mb-6 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">Recent Data</h2>
            <ul className="space-y-4">
              {pets.map((pet, index) => (
                <li key={index} className="p-4 bg-gray-700 rounded-lg">
                  <strong>Recent Update:</strong> {pet.name || "N/A"}
                  <div>
                    Weight: {pet.additionalInfo?.weight || "N/A"} kg<br />
                    Height: {pet.additionalInfo?.height || "N/A"} inches<br />
                    Sub Notes: {pet.additionalInfo?.subNotes?.join(", ") || "N/A"}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-3/4 bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <div className="flex items-center mb-6">
              <img
                src="/animal.png"
                alt="Profile"
                className="rounded-full w-24 h-24 border-2 border-gray-700"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold">
                  {owner?.username || "Loading..."}
                </h1>
                <p className="text-gray-400">{owner?.email || ""}</p>
                <p className="mt-1">Some bio about the pet owner goes here.</p>
              </div>
            </div>
            <Link
              href="/user/update"
              className="absolute right-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200"
            >
              Add Pet
            </Link>
            <Link
              href="/user/search"
              className="absolute right-32 bg-lime-600 hover:bg-lime-800 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200"
            >
              Search Pet
            </Link>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Pets Registered</h2>

              {pets.length > 0 ? (
                <ul className="space-y-4">
                  {pets.map((pet) => (
                    <li
                      key={pet.id}
                      className="p-4 bg-gray-700 rounded-lg relative"
                    >
                      <div>Name: {pet.name}</div>
                      <div>Type: {pet.type}</div>
                      <div>Breed: {pet.breed}</div>
                      <div>Category: {pet.category}</div>
                      <div>Is Public: {pet.isPublic ? "Yes" : "No"}</div>

                      <div>
                        Weight: {pet.additionalInfo?.weight || "N/A"} kg<br />
                        Height: {pet.additionalInfo?.height || "N/A"} inches<br />
                        Sub Notes:{" "}
                        {pet.additionalInfo?.subNotes?.join(", ") || "N/A"}
                      </div>

                      {pet.images?.length > 0 && (
                        <div className="mt-2 absolute top-0 right-4">
                          <img
                            src={`${BACKEND_URL}/media/${pet.images[0]}`}
                            alt="Pet"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex w-fit absolute right-2 bottom-4 justify-end space-x-4">
                        <Link href="/user/edit">
                          <button
                            onClick={() => editPet(pet)}
                            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
                          >
                            <CiEdit className="mr-2" />
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => deletePet(pet.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <p className="text-gray-400">No Pets Registered</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
              <div className="p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-400">No recent activity found.</p>
                <div className="h-32 bg-gray-600 mt-2 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default User;
