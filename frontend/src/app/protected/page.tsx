import options from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import UserCard from "@/components/UserCard";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export default async function ServerPage() {
  const session = (await getServerSession(options)) as Session;

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/protected");
  }

  return (
    <section className="flex flex-col gap-6">
      <UserCard user={session?.user} pagetype={"Server"} />
    </section>
  );
}
