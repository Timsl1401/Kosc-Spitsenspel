import { Link } from 'react-router-dom'
import { Trophy, Users, Calendar, Target } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-kosc-green-600 to-kosc-green-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Speel mee met het</span>
                  <span className="block text-kosc-green-200">KOSC Spitsenspel</span>
                </h1>
                <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Stel je selectie van maximaal 11 KOSC spelers samen en verdien punten 
                  wanneer jouw spelers doelpunten maken!
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-kosc-green-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Start met spelen
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/rules"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-kosc-green-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                    >
                      Spelregels
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/kosc-field.svg"
            alt="KOSC voetbalveld"
          />
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-kosc-green-600 font-semibold tracking-wide uppercase">Hoe werkt het?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Een eenvoudig maar spannend spel
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Kies je spelers, volg de wedstrijden en verdien punten. Hoe meer doelpunten, hoe hoger je score!
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-kosc-green-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Kies je spelers</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Selecteer maximaal 11 spelers uit verschillende KOSC teams met je beschikbare budget.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-kosc-green-500 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Volg wedstrijden</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Bekijk alle KOSC wedstrijden en zie welke spelers doelpunten maken.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-kosc-green-500 text-white">
                  <Target className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Verdien punten</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Krijg punten voor elk doelpunt dat jouw spelers maken in competitiewedstrijden.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-kosc-green-500 text-white">
                  <Trophy className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Strijd om prijzen</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Vergelijk je score met andere spelers en win mooie prijzen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-kosc-green-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Klaar om te beginnen?</span>
            <span className="block">Registreer je nu!</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-kosc-green-200">
            Doe mee met het KOSC Spitsenspel en maak kans op mooie prijzen.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-kosc-green-700 bg-white hover:bg-gray-50 sm:w-auto"
          >
            Start vandaag nog
          </Link>
        </div>
      </div>
    </div>
  )
}
