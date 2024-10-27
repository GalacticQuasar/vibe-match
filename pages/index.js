import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Top left corner with names and GitHub links */}
      <div className="absolute top-4 left-4 space-y-2 text-gray-400 text-sm">
        <div>
          Avi Aggarwal - <a href="https://github.com/ObviAvi" target="_blank" className="underline hover:text-[#1DB954]">GitHub</a>
        </div>
        <div>
          Akash Ravandhu - <a href="https://github.com/GalacticQuasar" target="_blank" className="underline hover:text-[#1DB954]">GitHub</a>
        </div>
        <div>
          Devashish Das - <a href="https://github.com/devashishdas3" target="_blank" className="underline hover:text-[#1DB954]">GitHub</a>
        </div>
      </div>
      
      <div className="w-full max-w-md px-4 py-8 space-y-10"> {/* Adjusted space-y to bring items closer */}
        <div className="flex justify-center">
          <Image
            src="/images/vibe-match-logo.png"
            width={500}
            height={500}
            alt="Vibe Match Logo"
            className="rounded-full"
          />
        </div>
        <p className="text-center text-gray-200 text-xl font-semibold mt-5">Find your Musical Matches!</p> {/* Larger, bold text */}
        
        <Link href="/api/login" passHref>
        <button className="shadow w-full bg-black text-[#1DB954] font-semibold py-3 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 shadow-[0_0px_10px_rgba(29,185,84,0.5)] hover:shadow-[0_0px_20px_rgba(29,185,84,0.7)] mt-10"> {}
          Login with Spotify
        </button>
        </Link>
      </div>
    </div>
  );
}
