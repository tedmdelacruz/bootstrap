import '@/App.css'
import { config } from '@/lib/config'
import { Hero1 as Hero } from '@/components/Hero'

function App() {
  return (
    <Hero
      heading={config.appName}
      description="A modern full-stack starter template with Django, React, and TypeScript."
      image={{
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
        alt: `${config.appName} dashboard preview`,
      }}
      buttons={{
        primary: {
          text: "Get Started",
          url: "/signup"
        },
        secondary: {
          text: "Login",
          url: "/login"
        }
      }}
    />
  )
}

export default App
