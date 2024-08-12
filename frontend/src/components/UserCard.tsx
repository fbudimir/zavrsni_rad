"use client";

import axios from "axios";

import { useEffect, useState } from "react";

type Props = {
  user:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
      }
    | undefined;
  pagetype: string;
};

export default function Card({ user, pagetype }: Props) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an asynchronous function to fetch data
    const fetchData = async () => {
      // try {
      //   const response = await axios.post("http://localhost:3000/api/handler", {
      //     endpoint: "/users",
      //     method: "POST",
      //     data: { name: "Brat", email: "brat@gmail.com", password: "123" },
      //   });
      //   setData(response.data);
      //   console.log(response.data);
      // } catch (err: any) {
      //   setError(err.message);
      // }
    };

    fetchData();
  }, []);

  const greeting = user?.name ? (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg font-bold text-5xl text-black">
      Hello {user?.name}!
    </div>
  ) : null;

  //   const userImage = user?.image ? (
  //     <Image
  //       className="border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8"
  //       src={user?.image}
  //       width={200}
  //       height={200}
  //       alt={user?.name ?? "Profile Pic"}
  //       priority={true}
  //     />
  //   ) : null;

  return (
    <section className="flex flex-col gap-4">
      {greeting}
      {/* {emailDisplay} */}
      {/* {userImage} */}
      <p className="text-2xl text-center">{pagetype} Page!</p>
    </section>
  );
}
