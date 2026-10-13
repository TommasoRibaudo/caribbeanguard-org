import Link from "next/link";
export default function HomeRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/" />
      <p style={{ padding: "4rem", textAlign: "center" }}>
        Redirigiendo a <Link href="/">caribbeanguard.org</Link>…
      </p>
    </>
  );
}
