import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Home Page</h1>
      <Link href="/settings">Settings</Link>
    </>
  )
}
