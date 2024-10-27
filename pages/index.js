import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md px-4 py-8 space-y-8">
        <div className="flex justify-center">
          <Image
            src="/images/vibe-match-logo.png"
            width={500}
            height={500}
            alt="Vibe Match Logo"
            className="rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold text-center">Vibe Match</h1>
        <p className="text-center text-gray-400">Find your Musical Matches</p>
        <br></br>
        <Link href="/api/login" passHref>
          <button className="shadow w-full bg-black text-[#1DB954] font-semibold py-3 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 shadow-[0_4px_10px_rgba(29,185,84,0.5)] hover:shadow-[0_8px_20px_rgba(29,185,84,0.7)]">
            Login with Spotify
          </button>
        </Link>
      </div>
    </div>
  )
}
